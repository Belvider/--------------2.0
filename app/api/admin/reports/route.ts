import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const user = await requireRole([Role.ADMIN, Role.MANAGER]);
  if (!user) {
    return NextResponse.json({ error: "Доступ заборонено" }, { status: 403 });
  }

  const url = new URL(request.url);
  const department = url.searchParams.get("department") || undefined;
  const brand = url.searchParams.get("brand") || undefined;

  const progressRows = await prisma.userProgress.findMany({
    where: {
      user: {
        department: department ?? undefined
      },
      module: {
        category: {
          brand: {
            slug: brand ?? undefined
          }
        }
      }
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          department: true,
          store: true
        }
      },
      module: {
        include: {
          category: {
            include: {
              brand: true
            }
          }
        }
      }
    }
  });
  const attemptRows = await prisma.quizAttempt.findMany({
    where: {
      user: {
        department: department ?? undefined
      },
      module: {
        category: {
          brand: {
            slug: brand ?? undefined
          }
        }
      }
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          department: true,
          store: true
        }
      },
      module: {
        include: {
          category: {
            include: {
              brand: true
            }
          }
        }
      }
    }
  });

  const reportUsers = await prisma.user.findMany({
    where: { department },
    select: { id: true, name: true, department: true, store: true }
  });
  const grouped = new Map<
    string,
    {
      userId: string;
      name: string;
      department: string;
      store: string | null;
      completed: number;
      inProgress: number;
      total: number;
    }
  >();

  for (const employee of reportUsers) {
    grouped.set(employee.id, {
      userId: employee.id, name: employee.name, department: employee.department,
      store: employee.store, completed: 0, inProgress: 0, total: 0
    });
  }

  for (const item of progressRows) {
    const key = item.userId;
    const current = grouped.get(key) ?? {
      userId: item.userId,
      name: item.user.name,
      department: item.user.department,
      store: item.user.store,
      completed: 0,
      inProgress: 0,
      total: 0
    };

    current.total += 1;
    if (item.status === "COMPLETED") current.completed += 1;
    if (item.status === "IN_PROGRESS") current.inProgress += 1;

    grouped.set(key, current);
  }

  const rows = [...grouped.values()].sort((a, b) => b.completed - a.completed);
  const moduleAttempts = new Map<
    number,
    {
      moduleId: number;
      title: string;
      brand: string;
      category: string;
      attempts: number;
      failedAttempts: number;
      totalScore: number;
    }
  >();
  const moduleProgress = new Map<
    number,
    {
      moduleId: number;
      title: string;
      brand: string;
      category: string;
      touchedUsers: number;
      completedCount: number;
      inProgressCount: number;
    }
  >();
  const userAttempts = new Map<
    string,
    {
      userId: string;
      name: string;
      department: string;
      store: string | null;
      attempts: number;
      failedAttempts: number;
      totalScore: number;
    }
  >();

  for (const attempt of attemptRows) {
    const moduleCurrent = moduleAttempts.get(attempt.moduleId) ?? {
      moduleId: attempt.moduleId,
      title: attempt.module.title,
      brand: attempt.module.category.brand.name,
      category: attempt.module.category.name,
      attempts: 0,
      failedAttempts: 0,
      totalScore: 0
    };

    moduleCurrent.attempts += 1;
    moduleCurrent.totalScore += attempt.score;
    if (!attempt.passed) {
      moduleCurrent.failedAttempts += 1;
    }
    moduleAttempts.set(attempt.moduleId, moduleCurrent);

    const userCurrent = userAttempts.get(attempt.userId) ?? {
      userId: attempt.userId,
      name: attempt.user.name,
      department: attempt.user.department,
      store: attempt.user.store,
      attempts: 0,
      failedAttempts: 0,
      totalScore: 0
    };

    userCurrent.attempts += 1;
    userCurrent.totalScore += attempt.score;
    if (!attempt.passed) {
      userCurrent.failedAttempts += 1;
    }
    userAttempts.set(attempt.userId, userCurrent);
  }

  for (const progress of progressRows) {
    const current = moduleProgress.get(progress.moduleId) ?? {
      moduleId: progress.moduleId,
      title: progress.module.title,
      brand: progress.module.category.brand.name,
      category: progress.module.category.name,
      touchedUsers: 0,
      completedCount: 0,
      inProgressCount: 0
    };

    current.touchedUsers += 1;
    if (progress.status === "COMPLETED") {
      current.completedCount += 1;
    }
    if (progress.status === "IN_PROGRESS") {
      current.inProgressCount += 1;
    }

    moduleProgress.set(progress.moduleId, current);
  }

  const hardestModules = [...moduleAttempts.values()]
    .map((item) => ({
      ...item,
      avgScore: Math.round(item.totalScore / item.attempts),
      passRate: Math.round(((item.attempts - item.failedAttempts) / item.attempts) * 100)
    }))
    .sort((a, b) => a.avgScore - b.avgScore || b.failedAttempts - a.failedAttempts || b.attempts - a.attempts)
    .slice(0, 5);

  const stuckModules = [...moduleProgress.values()]
    .filter((item) => item.touchedUsers > 0 && item.inProgressCount > 0)
    .map((item) => ({
      ...item,
      completionRate: Math.round((item.completedCount / item.touchedUsers) * 100)
    }))
    .sort((a, b) => b.inProgressCount - a.inProgressCount || a.completionRate - b.completionRate)
    .slice(0, 5);

  const reportRowsByUserId = new Map(rows.map((row) => [row.userId, row]));
  const weakestUsers = [...userAttempts.values()]
    .map((item) => {
      const progressSummary = reportRowsByUserId.get(item.userId);

      return {
        ...item,
        avgScore: Math.round(item.totalScore / item.attempts),
        completed: progressSummary?.completed ?? 0,
        inProgress: progressSummary?.inProgress ?? 0
      };
    })
    .sort((a, b) => a.avgScore - b.avgScore || b.failedAttempts - a.failedAttempts || b.attempts - a.attempts)
    .slice(0, 5);

  return NextResponse.json({
    summary: {
      users: rows.length,
      completedModules: progressRows.filter((item) => item.status === "COMPLETED").length,
      inProgressModules: progressRows.filter((item) => item.status === "IN_PROGRESS").length,
      notStartedUsers: rows.filter((item) => item.total === 0).length
    },
    rows,
    analytics: {
      hardestModules,
      stuckModules,
      weakestUsers
    }
  });
}
