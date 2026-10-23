import { AssignmentTargetType, ProgressStatus } from "@prisma/client";
import {
  getPortalPageSettingKey,
  parsePortalPageContent,
  portalPageMeta,
  portalPageSlugs,
  type PortalPageSlug
} from "@/lib/portal-pages";
import { prisma } from "@/lib/prisma";
import { getActivityDay, shiftActivityDay } from "@/lib/activity-days";
import { getBestModuleScores, getQuizStatistics } from "@/lib/learning-statistics";
import { buildLearningOverview } from "@/lib/learning-overview";

export async function getPortalPageContent(slug: PortalPageSlug) {
  const setting = await prisma.appSetting.findUnique({
    where: {
      key: getPortalPageSettingKey(slug)
    }
  });

  return parsePortalPageContent(slug, setting?.value);
}

export async function getPortalModuleMapping(): Promise<Record<string, number>> {
  const setting = await prisma.appSetting.findUnique({
    where: { key: "portal_module_mapping" }
  });
  if (!setting?.value || typeof setting.value !== "object") return {};
  return setting.value as Record<string, number>;
}

export async function getAdminPortalPages() {
  const settings = await prisma.appSetting.findMany({
    where: {
      key: {
        in: portalPageSlugs.map((slug) => getPortalPageSettingKey(slug))
      }
    }
  });

  const settingsMap = new Map(settings.map((item) => [item.key, item.value]));

  return portalPageSlugs.map((slug) => {
    const content = parsePortalPageContent(slug, settingsMap.get(getPortalPageSettingKey(slug)));

    return {
      slug,
      path: portalPageMeta[slug].route,
      adminLabel: portalPageMeta[slug].adminLabel,
      description: portalPageMeta[slug].description,
      content
    };
  });
}

type AdminAuditFilters = {
  action?: string;
  targetType?: string;
  query?: string;
  take?: number;
};

const ASSIGNMENT_DUE_SOON_DAYS = 7;

type ResolvedUserAssignment = {
  id: number;
  moduleId: number;
  title: string;
  description: string;
  durationMin: number;
  dueAt: Date | null;
  required: boolean;
  note: string | null;
  targetType: AssignmentTargetType;
  assignedByName: string;
  brand: {
    name: string;
    slug: string;
  };
  category: {
    name: string;
    slug: string;
  };
  progress: {
    status: ProgressStatus;
    progressPct: number;
    completedAt: Date | null;
  };
  isCompleted: boolean;
  isOverdue: boolean;
  isDueSoon: boolean;
};

type AssignmentSummary = {
  total: number;
  required: number;
  completed: number;
  open: number;
  overdue: number;
  dueSoon: number;
};

function compareDatesAsc(a: Date | null, b: Date | null) {
  if (a && b) {
    return a.getTime() - b.getTime();
  }

  if (a) {
    return -1;
  }

  if (b) {
    return 1;
  }

  return 0;
}

function summarizeAssignments(assignments: ResolvedUserAssignment[]): AssignmentSummary {
  return assignments.reduce<AssignmentSummary>(
    (summary, assignment) => {
      summary.total += 1;
      if (assignment.required) summary.required += 1;
      if (assignment.isCompleted) {
        summary.completed += 1;
      } else {
        summary.open += 1;
      }
      if (assignment.isOverdue) summary.overdue += 1;
      if (assignment.isDueSoon) summary.dueSoon += 1;
      return summary;
    },
    {
      total: 0,
      required: 0,
      completed: 0,
      open: 0,
      overdue: 0,
      dueSoon: 0
    }
  );
}

async function getResolvedAssignmentsForUser(userId: string, department?: string) {
  const userDepartment =
    department ??
    (await prisma.user.findUnique({
      where: { id: userId },
      select: { department: true }
    }))?.department ??
    "";

  const assignments = await prisma.learningAssignment.findMany({
    where: {
      isActive: true,
      module: {
        isPublished: true
      },
      OR: [
        {
          targetType: AssignmentTargetType.USER,
          userId
        },
        ...(userDepartment
          ? [
              {
                targetType: AssignmentTargetType.DEPARTMENT,
                department: userDepartment
              }
            ]
          : [])
      ]
    },
    orderBy: [{ createdAt: "desc" }],
    include: {
      assignedBy: {
        select: {
          id: true,
          name: true,
          role: true
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

  if (assignments.length === 0) {
    return {
      assignments: [] as ResolvedUserAssignment[],
      summary: summarizeAssignments([])
    };
  }

  const prioritizedAssignments = [...assignments].sort((left, right) => {
    const targetPriority = (right.targetType === AssignmentTargetType.USER ? 1 : 0) - (left.targetType === AssignmentTargetType.USER ? 1 : 0);
    if (targetPriority !== 0) {
      return targetPriority;
    }

    const dueDiff = compareDatesAsc(left.dueAt, right.dueAt);
    if (dueDiff !== 0) {
      return dueDiff;
    }

    return right.createdAt.getTime() - left.createdAt.getTime();
  });

  const uniqueAssignments = new Map<number, (typeof assignments)[number]>();

  for (const assignment of prioritizedAssignments) {
    if (!uniqueAssignments.has(assignment.moduleId)) {
      uniqueAssignments.set(assignment.moduleId, assignment);
    }
  }

  const moduleIds = [...uniqueAssignments.keys()];

  const [progresses, certificates] = await Promise.all([
    prisma.userProgress.findMany({
      where: {
        userId,
        moduleId: {
          in: moduleIds
        }
      },
      select: {
        moduleId: true,
        status: true,
        progressPct: true,
        completedAt: true
      }
    }),
    prisma.certificate.findMany({
      where: {
        userId,
        moduleId: {
          in: moduleIds
        }
      },
      select: {
        moduleId: true,
        issuedAt: true
      }
    })
  ]);

  const progressMap = new Map(progresses.map((progress) => [progress.moduleId, progress]));
  const certificateMap = new Map(certificates.map((certificate) => [certificate.moduleId, certificate]));
  const now = new Date();
  const dueSoonLimit = new Date(now.getTime() + ASSIGNMENT_DUE_SOON_DAYS * 24 * 60 * 60 * 1000);

  const resolvedAssignments = [...uniqueAssignments.values()]
    .map<ResolvedUserAssignment>((assignment) => {
      const progress = progressMap.get(assignment.moduleId);
      const certificate = certificateMap.get(assignment.moduleId);
      const status = progress?.status ?? (certificate ? ProgressStatus.COMPLETED : ProgressStatus.NOT_STARTED);
      const progressPct = progress?.progressPct ?? (status === ProgressStatus.COMPLETED ? 100 : 0);
      const completedAt = progress?.completedAt ?? certificate?.issuedAt ?? null;
      const isCompleted = status === ProgressStatus.COMPLETED;
      const isOverdue = Boolean(assignment.dueAt && assignment.dueAt < now && !isCompleted);
      const isDueSoon = Boolean(
        assignment.dueAt &&
          assignment.dueAt >= now &&
          assignment.dueAt <= dueSoonLimit &&
          !isCompleted
      );

      return {
        id: assignment.id,
        moduleId: assignment.moduleId,
        title: assignment.module.title,
        description: assignment.module.description,
        durationMin: assignment.module.durationMin,
        dueAt: assignment.dueAt,
        required: assignment.required,
        note: assignment.note,
        targetType: assignment.targetType,
        assignedByName: assignment.assignedBy.name,
        brand: {
          name: assignment.module.category.brand.name,
          slug: assignment.module.category.brand.slug
        },
        category: {
          name: assignment.module.category.name,
          slug: assignment.module.category.slug
        },
        progress: {
          status,
          progressPct,
          completedAt
        },
        isCompleted,
        isOverdue,
        isDueSoon
      };
    })
    .sort((left, right) => {
      if (left.isOverdue !== right.isOverdue) {
        return left.isOverdue ? -1 : 1;
      }

      if (left.isDueSoon !== right.isDueSoon) {
        return left.isDueSoon ? -1 : 1;
      }

      const dueDiff = compareDatesAsc(left.dueAt, right.dueAt);
      if (dueDiff !== 0) {
        return dueDiff;
      }

      return right.id - left.id;
    });

  return {
    assignments: resolvedAssignments,
    summary: summarizeAssignments(resolvedAssignments)
  };
}

type AdminAssignmentsFilters = {
  query?: string;
  targetType?: AssignmentTargetType;
  department?: string;
};

export async function getAdminAssignmentsWorkspace(filters: AdminAssignmentsFilters = {}) {
  const where = {
    isActive: true,
    ...(filters.targetType ? { targetType: filters.targetType } : {}),
    ...(filters.department
      ? {
          OR: [
            { department: filters.department },
            {
              user: {
                department: filters.department
              }
            }
          ]
        }
      : {})
  };

  const [assignments, activeUsers] = await Promise.all([
    prisma.learningAssignment.findMany({
      where,
      orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
      include: {
        assignedBy: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            store: true,
            isActive: true
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
    }),
    prisma.user.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        store: true
      }
    })
  ]);

  const normalizedQuery = filters.query?.trim().toLowerCase();
  const userIdsByDepartment = activeUsers.reduce((map, user) => {
    const key = user.department.trim() || "Без відділу";
    const bucket = map.get(key) ?? [];
    bucket.push(user);
    map.set(key, bucket);
    return map;
  }, new Map<string, typeof activeUsers>());

  const allTargetUsers = new Map<string, (typeof activeUsers)[number]>();

  for (const assignment of assignments) {
    if (assignment.targetType === AssignmentTargetType.USER && assignment.user) {
      allTargetUsers.set(assignment.user.id, {
        id: assignment.user.id,
        name: assignment.user.name,
        email: assignment.user.email,
        department: assignment.user.department,
        store: assignment.user.store
      });
      continue;
    }

    const departmentUsers = userIdsByDepartment.get(assignment.department?.trim() || "Без відділу") ?? [];
    for (const user of departmentUsers) {
      allTargetUsers.set(user.id, user);
    }
  }

  const targetUserIds = [...allTargetUsers.keys()];
  const targetModuleIds = [...new Set(assignments.map((assignment) => assignment.moduleId))];

  const [progresses, certificates] = await Promise.all([
    targetUserIds.length > 0 && targetModuleIds.length > 0
      ? prisma.userProgress.findMany({
          where: {
            userId: {
              in: targetUserIds
            },
            moduleId: {
              in: targetModuleIds
            }
          },
          select: {
            userId: true,
            moduleId: true,
            status: true,
            progressPct: true
          }
        })
      : Promise.resolve([]),
    targetUserIds.length > 0 && targetModuleIds.length > 0
      ? prisma.certificate.findMany({
          where: {
            userId: {
              in: targetUserIds
            },
            moduleId: {
              in: targetModuleIds
            }
          },
          select: {
            userId: true,
            moduleId: true
          }
        })
      : Promise.resolve([])
  ]);

  const progressMap = new Map(
    progresses.map((progress) => [`${progress.userId}:${progress.moduleId}`, progress] as const)
  );
  const certificateSet = new Set(certificates.map((certificate) => `${certificate.userId}:${certificate.moduleId}`));
  const now = new Date();
  const dueSoonLimit = new Date(now.getTime() + ASSIGNMENT_DUE_SOON_DAYS * 24 * 60 * 60 * 1000);

  const rows = assignments
    .map((assignment) => {
      const targets =
        assignment.targetType === AssignmentTargetType.USER
          ? assignment.user
            ? [
                {
                  id: assignment.user.id,
                  name: assignment.user.name,
                  email: assignment.user.email,
                  department: assignment.user.department,
                  store: assignment.user.store
                }
              ]
            : []
          : userIdsByDepartment.get(assignment.department?.trim() || "Без відділу") ?? [];

      let completedUsers = 0;
      let inProgressUsers = 0;
      let notStartedUsers = 0;

      for (const target of targets) {
        const key = `${target.id}:${assignment.moduleId}` as const;
        const progress = progressMap.get(key);
        const isCompleted = progress?.status === ProgressStatus.COMPLETED || certificateSet.has(key);

        if (isCompleted) {
          completedUsers += 1;
          continue;
        }

        if (progress?.status === ProgressStatus.IN_PROGRESS) {
          inProgressUsers += 1;
        } else {
          notStartedUsers += 1;
        }
      }

      const affectedUsers = targets.length;
      const overdueUsers =
        assignment.dueAt && assignment.dueAt < now ? affectedUsers - completedUsers : 0;
      const dueSoonUsers =
        assignment.dueAt && assignment.dueAt >= now && assignment.dueAt <= dueSoonLimit
          ? affectedUsers - completedUsers
          : 0;
      const completionRate = affectedUsers > 0 ? Math.round((completedUsers / affectedUsers) * 100) : 0;

      return {
        id: assignment.id,
        moduleId: assignment.module.id,
        moduleTitle: assignment.module.title,
        moduleDescription: assignment.module.description,
        moduleDurationMin: assignment.module.durationMin,
        brandName: assignment.module.category.brand.name,
        categoryName: assignment.module.category.name,
        targetType: assignment.targetType,
        targetUserId: assignment.user?.id ?? null,
        targetLabel:
          assignment.targetType === AssignmentTargetType.USER
            ? assignment.user?.name ?? "Користувач недоступний"
            : assignment.department ?? "Без відділу",
        targetDepartment:
          assignment.targetType === AssignmentTargetType.USER
            ? assignment.user?.department ?? "—"
            : assignment.department ?? "Без відділу",
        targetEmail: assignment.user?.email ?? null,
        dueAt: assignment.dueAt,
        required: assignment.required,
        note: assignment.note,
        assignedByName: assignment.assignedBy.name,
        createdAt: assignment.createdAt,
        affectedUsers,
        completedUsers,
        inProgressUsers,
        notStartedUsers,
        overdueUsers: Math.max(overdueUsers, 0),
        dueSoonUsers: Math.max(dueSoonUsers, 0),
        completionRate
      };
    })
    .filter((row) => {
      if (!normalizedQuery) {
        return true;
      }

      return [
        row.moduleTitle,
        row.moduleDescription,
        row.brandName,
        row.categoryName,
        row.targetLabel,
        row.targetDepartment,
        row.targetEmail ?? "",
        row.assignedByName,
        row.note ?? ""
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });

  const summary = rows.reduce(
    (acc, row) => {
      acc.total += 1;
      if (row.required) acc.required += 1;
      if (row.targetType === AssignmentTargetType.USER) {
        acc.userAssignments += 1;
      } else {
        acc.departmentAssignments += 1;
      }
      acc.affectedUsers += row.affectedUsers;
      acc.completedUsers += row.completedUsers;
      acc.overdueUsers += row.overdueUsers;
      acc.dueSoonUsers += row.dueSoonUsers;
      return acc;
    },
    {
      total: 0,
      required: 0,
      userAssignments: 0,
      departmentAssignments: 0,
      affectedUsers: 0,
      completedUsers: 0,
      overdueUsers: 0,
      dueSoonUsers: 0
    }
  );

  const departments = [...new Set(activeUsers.map((user) => user.department.trim() || "Без відділу"))].sort((a, b) =>
    a.localeCompare(b, "uk")
  );

  return {
    rows,
    summary: {
      ...summary,
      completionRate: summary.affectedUsers > 0 ? Math.round((summary.completedUsers / summary.affectedUsers) * 100) : 0
    },
    departments
  };
}

export async function getAdminAuditTrail(filters: AdminAuditFilters = {}) {
  const normalizedQuery = filters.query?.trim();

  return prisma.adminAuditLog.findMany({
    where: {
      ...(filters.action ? { action: filters.action } : {}),
      ...(filters.targetType ? { targetType: filters.targetType } : {}),
      ...(normalizedQuery
        ? {
            OR: [
              { summary: { contains: normalizedQuery, mode: "insensitive" } },
              { targetLabel: { contains: normalizedQuery, mode: "insensitive" } },
              { targetId: { contains: normalizedQuery, mode: "insensitive" } },
              { actor: { name: { contains: normalizedQuery, mode: "insensitive" } } },
              { actor: { email: { contains: normalizedQuery, mode: "insensitive" } } }
            ]
          }
        : {})
    },
    orderBy: { createdAt: "desc" },
    take: filters.take ?? 60,
    include: {
      actor: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      }
    }
  });
}

export async function getAdminAuditSummary() {
  const dayAgo = new Date();
  dayAgo.setDate(dayAgo.getDate() - 1);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [total, last24h, last7d, userActions, contentActions, mediaActions] = await Promise.all([
    prisma.adminAuditLog.count(),
    prisma.adminAuditLog.count({
      where: {
        createdAt: {
          gte: dayAgo
        }
      }
    }),
    prisma.adminAuditLog.count({
      where: {
        createdAt: {
          gte: weekAgo
        }
      }
    }),
    prisma.adminAuditLog.count({
      where: {
        targetType: {
          in: ["user", "profile"]
        }
      }
    }),
    prisma.adminAuditLog.count({
      where: {
        targetType: {
          in: ["brand", "category", "module", "portal-page", "quiz", "assignment"]
        }
      }
    }),
    prisma.adminAuditLog.count({
      where: {
        targetType: "media"
      }
    })
  ]);

  return {
    total,
    last24h,
    last7d,
    userActions,
    contentActions,
    mediaActions
  };
}

export async function getDashboardData(userId: string) {
  const now = new Date();
  const today = getActivityDay(now);
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);


  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalModules,
    totalModulesDuration,
    completedModules,
    currentProgress,
    progressList,
    newMaterials,
    quizAttemptsAggregate,
    userBadges,
    certificatesCount,
    leaderboardRaw,
    leaderboardUsers,
    leaderboardAttempts,
    assignmentsData,
    activityDays,
    learningCatalog
  ] = await Promise.all([
    prisma.module.count({ where: { isPublished: true } }),
    prisma.module.aggregate({
      where: { isPublished: true },
      _sum: {
        durationMin: true
      }
    }),
    prisma.userProgress.count({
      where: {
        userId,
        status: ProgressStatus.COMPLETED,
        module: { isPublished: true }
      }
    }),
    prisma.userProgress.findFirst({
      where: {
        userId,
        status: ProgressStatus.IN_PROGRESS,
        module: { isPublished: true }
      },
      orderBy: [{ lastSeenAt: "desc" }, { progressPct: "desc" }],
      include: {
        module: {
          include: {
            _count: { select: { questions: true } },
            category: {
              include: {
                brand: true
              }
            }
          }
        }
      }
    }),
    prisma.userProgress.findMany({
      where: { userId, module: { isPublished: true } },
      select: {
        moduleId: true,
        status: true,
        progressPct: true,
        completedAt: true,
        lastSeenAt: true,
        module: {
          select: {
            id: true,
            title: true,
            durationMin: true,
            category: {
              select: {
                name: true,
                brand: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    }),
    prisma.module.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        category: {
          include: {
            brand: true
          }
        }
      }
    }),
    prisma.quizAttempt.findMany({
      where: { userId, module: { isPublished: true } },
      select: { moduleId: true, score: true, passed: true }
    }),
    prisma.userBadge.findMany({
      where: { userId },
      include: {
        badge: true
      },
      orderBy: { issuedAt: "desc" }
    }),
    prisma.certificate.count({ where: { userId } }),
    prisma.userProgress.groupBy({
      by: ["userId"],
      where: { status: ProgressStatus.COMPLETED, module: { isPublished: true } },
      _count: { _all: true }
    }),
    prisma.user.findMany({
      select: { id: true, name: true, department: true }
    }),
    prisma.quizAttempt.groupBy({
      by: ["userId", "moduleId"],
      where: { module: { isPublished: true } },
      _max: { score: true }
    }),
    getResolvedAssignmentsForUser(userId),
    prisma.learningActivity.groupBy({
      by: ["day"],
      where: { userId, day: { gte: shiftActivityDay(today, -13), lte: today } },
      _count: { _all: true }
    }),
    prisma.module.findMany({
      where: { isPublished: true },
      orderBy: [
        { category: { brand: { sortOrder: "asc" } } },
        { category: { sortOrder: "asc" } },
        { sortOrder: "asc" },
        { id: "asc" }
      ],
      select: {
        id: true,
        title: true,
        durationMin: true,
        isPublished: true,
        _count: { select: { questions: true } },
        category: {
          select: {
            name: true,
            brand: { select: { id: true, name: true, slug: true } }
          }
        }
      }
    })
  ]);

  const completedByUser = new Map(leaderboardRaw.map((item) => [item.userId, item._count._all]));
  const bestScoresByUser = new Map<string, Map<number, number>>();
  for (const attempt of leaderboardAttempts) {
    if (attempt._max.score === null) continue;
    if (!bestScoresByUser.has(attempt.userId)) {
      bestScoresByUser.set(attempt.userId, new Map());
    }
    const moduleMap = bestScoresByUser.get(attempt.userId)!;
    moduleMap.set(attempt.moduleId, attempt._max.score);
  }

  const leaderboard = leaderboardUsers
    .map((learner) => {
      const moduleScores = bestScoresByUser.get(learner.id);
      const scores = moduleScores ? [...moduleScores.values()] : [];
      const avgScore = scores.length > 0
        ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length)
        : null;

      return {
        userId: learner.id,
        name: learner.name,
        department: learner.department,
        completed: completedByUser.get(learner.id) ?? 0,
        avgScore
      };
    })
    .sort((left, right) => right.completed - left.completed
      || left.name.localeCompare(right.name, "uk")
      || left.userId.localeCompare(right.userId, "en"));

  const progressPct = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
  const inProgressModules = progressList.filter((item) => item.status === ProgressStatus.IN_PROGRESS).length;
  const totalDurationMin = totalModulesDuration._sum.durationMin ?? 0;
  const learnedMinutes = progressList.reduce((sum, item) => {
    if (item.status === ProgressStatus.COMPLETED) {
      return sum + item.module.durationMin;
    }

    return sum + Math.round(item.module.durationMin * (item.progressPct / 100));
  }, 0);
  const remainingMinutes = Math.max(totalDurationMin - learnedMinutes, 0);
  const completedLast7Days = progressList.filter(
    (item) => item.status === ProgressStatus.COMPLETED && item.completedAt && item.completedAt >= sevenDaysAgo
  ).length;
  const completedLast30DaysItems = progressList.filter(
    (item) => item.status === ProgressStatus.COMPLETED && item.completedAt && item.completedAt >= thirtyDaysAgo
  );
  const completedLast30Days = completedLast30DaysItems.length;
  const completedMinutesLast30Days = completedLast30DaysItems.reduce((sum, item) => sum + item.module.durationMin, 0);
  const activeDaysLast14 = activityDays.length;
  const activityByDay = new Map(activityDays.map((item) => [item.day, item._count._all]));
  const weeklyActivity = Array.from({ length: 7 }, (_, index) => {
    const day = shiftActivityDay(today, index - 6);
    return { day, modulesCount: activityByDay.get(day) ?? 0, isToday: day === today };
  });
  const continueModuleRemainingMin =
    currentProgress && currentProgress.progressPct < 100
      ? Math.max(Math.round(currentProgress.module.durationMin * ((100 - currentProgress.progressPct) / 100)), 1)
      : 0;
  // Best score per module — more accurate than raw attempt average
  const dashBestByModule = getBestModuleScores(quizAttemptsAggregate);
  const dashBestScores = [...dashBestByModule.values()];
  const averageQuizScore = dashBestScores.length > 0
    ? Math.round(dashBestScores.reduce((s, v) => s + v, 0) / dashBestScores.length)
    : null;
  const quizAttemptsCount = quizAttemptsAggregate.length;
  const modulesLeft = Math.max(totalModules - completedModules, 0);
  const projectedCompletionDays =
    modulesLeft === 0
      ? 0
      : completedLast30Days > 0
        ? Math.ceil(modulesLeft / (completedLast30Days / 30))
        : null;

  return {
    totalModules,
    completedModules,
    inProgressModules,
    progressPct,
    continueModule: currentProgress?.module ?? null,
    continueModuleProgress: currentProgress?.progressPct ?? 0,
    continueModuleRemainingMin,
    newMaterials,
    userBadges,
    certificatesCount,
    leaderboard,
    assignments: assignmentsData.assignments,
    assignmentSummary: assignmentsData.summary,
    totalDurationMin,
    learnedMinutes,
    remainingMinutes,
    averageQuizScore,
    quizAttemptsCount,
    completedLast7Days,
    completedLast30Days,
    completedMinutesLast30Days,
    activeDaysLast14,
    weeklyActivity,
    projectedCompletionDays,
    learningOverview: buildLearningOverview({ modules: learningCatalog, progress: progressList, attempts: quizAttemptsAggregate })
  };
}

// Slug-і брендів що є внутрішніми (не показуємо у каталозі)
const INTERNAL_BRAND_SLUGS = ["pineapple-academy"];

export async function getBrandsCatalog() {
  return prisma.brand.findMany({
    where: { slug: { notIn: INTERNAL_BRAND_SLUGS } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      categories: {
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        include: {
          _count: {
            select: { modules: true }
          }
        }
      }
    }
  });
}

export async function getBrandBySlug(brandSlug: string) {
  return prisma.brand.findUnique({
    where: { slug: brandSlug },
    include: {
      categories: {
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        include: {
          _count: {
            select: {
              modules: true
            }
          }
        }
      }
    }
  });
}

export async function getCategoryModules(brandSlug: string, categorySlug: string, userId: string) {
  return prisma.category.findFirst({
    where: {
      slug: categorySlug,
      brand: {
        slug: brandSlug
      }
    },
    include: {
      brand: true,
      modules: {
        where: {
          isPublished: true
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        include: {
          progresses: {
            where: { userId },
            take: 1
          }
        }
      }
    }
  });
}

export async function getModuleDetails(moduleId: number, userId: string) {
  return prisma.module.findFirst({
    where: { id: moduleId, isPublished: true },
    include: {
      category: {
        include: {
          brand: true
        }
      },
      questions: {
        orderBy: { sortOrder: "asc" }
      },
      progresses: {
        where: { userId },
        take: 1
      },
      attempts: {
        where: { userId },
        orderBy: { attemptedAt: "desc" },
        take: 5
      }
    }
  });
}

export async function getProfileData(userId: string) {
  const [user, progressList, attempts, certificates, badges, assignmentsData, publishedModules, activityDays] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        middleName: true,
        email: true,
        phone: true,
        birthday: true,
        avatarUrl: true,
        role: true,
        position: true,
        department: true,
        store: true,
        city: true,
        hireDate: true,
        notes: true,
        isActive: true,
        createdAt: true
      }
    }),
    prisma.userProgress.findMany({
      where: { userId },
      orderBy: [{ completedAt: "desc" }, { lastSeenAt: "desc" }],
      include: {
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
    }),
    prisma.quizAttempt.findMany({
      where: { userId },
      orderBy: { attemptedAt: "desc" },
      include: {
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
    }),
    prisma.certificate.findMany({
      where: { userId },
      orderBy: { issuedAt: "desc" },
      include: {
        module: true
      }
    }),
    prisma.userBadge.findMany({
      where: { userId },
      orderBy: { issuedAt: "desc" },
      include: { badge: true }
    }),
    getResolvedAssignmentsForUser(userId),
    prisma.module.findMany({
      where: { isPublished: true },
      select: { id: true, durationMin: true, category: { select: { brand: { select: { name: true, slug: true } } } } }
    }),
    prisma.learningActivity.groupBy({
      by: ["day"], where: { userId }, _count: { _all: true }, orderBy: { day: "asc" }
    })
  ]);

  const completedModules = progressList.filter((item) => item.status === ProgressStatus.COMPLETED).length;

  // Best score per module (not simple average of all attempts)
  const { avgScore, passRate, testedModules } = getQuizStatistics(attempts);

  const totalMinutes = progressList.reduce((sum, item) => {
    if (item.status === ProgressStatus.COMPLETED) {
      return sum + item.module.durationMin;
    }

    return sum + Math.round(item.module.durationMin * (item.progressPct / 100));
  }, 0);

  return {
    user,
    progressList,
    attempts,
    certificates,
    badges,
    publishedModules,
    activityDays: activityDays.map((item) => ({ day: item.day, count: item._count._all })),
    assignments: assignmentsData.assignments,
    assignmentSummary: assignmentsData.summary,
    stats: {
      completedModules,
      avgScore,
      passRate,
      testedModules,
      totalMinutes
    }
  };
}

export async function getAdminOverview() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    usersCount,
    activeUsersCount,
    adminsCount,
    managersCount,
    sellersCount,
    brandCount,
    categoryCount,
    modulesCount,
    certificatesCount,
    badgesCount,
    attemptsAggregate,
    completed,
    inProgress,
    notStarted,
    newUsersLast30Days,
    failedLoginAttemptsLast7Days,
    successfulLoginAttemptsLast7Days,
    recentUsers,
    recentActivity,
    recentModules,
    recentLoginAttempts,
    usersForDepartments,
    brandStructureRaw,
    unpublishedModulesCount,
    publishedModulesWithoutQuestionsCount,
    assignmentsWorkspace
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.user.count({ where: { role: "MANAGER" } }),
    prisma.user.count({ where: { role: "SELLER" } }),
    prisma.brand.count({ where: { slug: { notIn: INTERNAL_BRAND_SLUGS } } }),
    prisma.category.count(),
    prisma.module.count({ where: { isPublished: true } }),
    prisma.certificate.count(),
    prisma.badge.count(),
    prisma.quizAttempt.aggregate({
      _count: { _all: true },
      _avg: { score: true }
    }),
    prisma.userProgress.count({
      where: {
        status: ProgressStatus.COMPLETED
      }
    }),
    prisma.userProgress.count({
      where: {
        status: ProgressStatus.IN_PROGRESS
      }
    }),
    prisma.userProgress.count({
      where: {
        status: ProgressStatus.NOT_STARTED
      }
    }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    }),
    prisma.loginAttempt.count({
      where: {
        successful: false,
        attemptedAt: {
          gte: sevenDaysAgo
        }
      }
    }),
    prisma.loginAttempt.count({
      where: {
        successful: true,
        attemptedAt: {
          gte: sevenDaysAgo
        }
      }
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        name: true,
        role: true,
        department: true,
        store: true,
        isActive: true,
        createdAt: true
      }
    }),
    prisma.userProgress.findMany({
      orderBy: { lastSeenAt: "desc" },
      take: 7,
      select: {
        id: true,
        status: true,
        progressPct: true,
        lastSeenAt: true,
        completedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            department: true
          }
        },
        module: {
          select: {
            id: true,
            title: true,
            category: {
              select: {
                name: true,
                brand: {
                  select: {
                    name: true,
                    slug: true
                  }
                }
              }
            }
          }
        }
      }
    }),
    prisma.module.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        title: true,
        description: true,
        durationMin: true,
        isPublished: true,
        createdAt: true,
        category: {
          select: {
            name: true,
            slug: true,
            brand: {
              select: {
                name: true,
                slug: true
              }
            }
          }
        }
      }
    }),
    prisma.loginAttempt.findMany({
      orderBy: { attemptedAt: "desc" },
      take: 6,
      select: {
        id: true,
        email: true,
        ipAddress: true,
        successful: true,
        attemptedAt: true
      }
    }),
    prisma.user.findMany({
      select: {
        department: true
      }
    }),
    prisma.brand.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        description: true,
        sortOrder: true,
        categories: {
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            sortOrder: true,
            modules: {
              where: {
                isPublished: true
              },
              orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
              select: {
                id: true,
                title: true,
                description: true,
                durationMin: true,
                sortOrder: true,
                isPublished: true,
                createdAt: true
              }
            },
            _count: {
              select: {
                modules: true
              }
            }
          }
        }
      }
    }),
    prisma.module.count({
      where: {
        isPublished: false
      }
    }),
    prisma.module.count({
      where: {
        isPublished: true,
        questions: {
          none: {}
        }
      }
    }),
    getAdminAssignmentsWorkspace()
  ]);

  const departmentStats = [...usersForDepartments.reduce((acc, item) => {
    const key = item.department.trim() || "Без відділу";
    acc.set(key, (acc.get(key) ?? 0) + 1);
    return acc;
  }, new Map<string, number>()).entries()]
    .map(([department, usersCount]) => ({ department, usersCount }))
    .sort((a, b) => b.usersCount - a.usersCount)
    .slice(0, 6);

  const brandStructure = brandStructureRaw.map((brand) => {
    const categories = brand.categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      sortOrder: category.sortOrder,
      modulesCount: category._count.modules,
      modules: category.modules
    }));

    return {
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      logoUrl: brand.logoUrl,
      description: brand.description,
      sortOrder: brand.sortOrder,
      categoryCount: categories.length,
      moduleCount: categories.reduce((sum, category) => sum + category.modulesCount, 0),
      categories
    };
  });

  const overdueAssignmentsCount = assignmentsWorkspace.rows.filter((row) => row.overdueUsers > 0).length;
  const dueSoonAssignmentsCount = assignmentsWorkspace.rows.filter((row) => row.dueSoonUsers > 0).length;

  return {
    usersCount,
    activeUsersCount,
    inactiveUsersCount: Math.max(usersCount - activeUsersCount, 0),
    adminsCount,
    managersCount,
    sellersCount,
    brandCount,
    categoryCount,
    modulesCount,
    certificatesCount,
    badgesCount,
    attemptsCount: attemptsAggregate._count._all,
    averageScore: Math.round(attemptsAggregate._avg.score ?? 0),
    completed,
    inProgress,
    notStarted,
    totalProgressRecords: completed + inProgress + notStarted,
    newUsersLast30Days,
    failedLoginAttemptsLast7Days,
    successfulLoginAttemptsLast7Days,
    recentUsers,
    recentActivity,
    recentModules,
    recentLoginAttempts,
    departmentStats,
    brandStructure,
    actionCenter: {
      overdueAssignmentsCount,
      overdueLearnersCount: assignmentsWorkspace.summary.overdueUsers,
      dueSoonAssignmentsCount,
      dueSoonLearnersCount: assignmentsWorkspace.summary.dueSoonUsers,
      draftModulesCount: unpublishedModulesCount,
      modulesWithoutQuestionsCount: publishedModulesWithoutQuestionsCount,
      inactiveUsersCount: Math.max(usersCount - activeUsersCount, 0),
      failedLoginAttemptsLast7Days
    }
  };
}
