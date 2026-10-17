import { z } from "zod";

const optionalTextField = (label: string, max = 120) =>
  z
    .string()
    .trim()
    .max(max, `${label} занадто довге`);

const strongPasswordField = z
  .string()
  .min(8, "Мінімум 8 символів")
  .regex(/[A-Z]/, "Додайте велику літеру")
  .regex(/[0-9]/, "Додайте цифру");

const optionalDateField = z
  .union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Некоректний формат дати")])
  .optional();

export const registerSchema = z.object({
  name: z.string().min(3, "Вкажіть ПІБ"),
  email: z.string().email("Невірний email"),
  password: strongPasswordField,
  position: z.string().min(2, "Вкажіть посаду"),
  department: z.string().min(2, "Вкажіть відділ"),
  store: z.string().min(2, "Вкажіть магазин")
});

export const loginSchema = z.object({
  email: z.string().email("Невірний email"),
  password: z.string().min(1, "Вкажіть пароль")
});

export const adminUserUpdateSchema = z.object({
  userId: z.string().min(3),
  role: z.enum(["ADMIN", "MANAGER", "SELLER"]).optional(),
  isActive: z.boolean().optional(),
  firstName: optionalTextField("Ім'я", 80).optional(),
  lastName: optionalTextField("Прізвище", 80).optional(),
  middleName: optionalTextField("По батькові", 80).optional(),
  email: z.string().trim().email("Невірний email").optional(),
  phone: z
    .string()
    .trim()
    .refine((value) => value.length === 0 || /^[0-9+\s()\-]{7,20}$/.test(value), "Некоректний номер телефону")
    .optional(),
  birthday: optionalDateField,
  city: optionalTextField("Місто", 80).optional(),
  position: z.string().trim().min(2, "Вкажіть посаду").max(120, "Посада занадто довга").optional(),
  department: z.string().trim().min(2, "Вкажіть відділ").max(120, "Відділ занадто довгий").optional(),
  store: optionalTextField("Магазин", 120).optional(),
  hireDate: optionalDateField,
  notes: z.string().trim().max(2000, "Нотатка занадто довга").optional()
});

export const adminUserCreateSchema = z.object({
  firstName: z.string().trim().min(1, "Вкажіть ім'я").max(80, "Ім'я занадто довге"),
  lastName: optionalTextField("Прізвище", 80).optional(),
  middleName: optionalTextField("По батькові", 80).optional(),
  email: z.string().trim().email("Невірний email"),
  password: strongPasswordField,
  phone: z
    .string()
    .trim()
    .refine((value) => value.length === 0 || /^[0-9+\s()\-]{7,20}$/.test(value), "Некоректний номер телефону")
    .optional(),
  birthday: optionalDateField,
  city: optionalTextField("Місто", 80).optional(),
  position: z.string().trim().min(2, "Вкажіть посаду").max(120, "Посада занадто довга"),
  department: z.string().trim().min(2, "Вкажіть відділ").max(120, "Відділ занадто довгий"),
  store: optionalTextField("Магазин", 120).optional(),
  hireDate: optionalDateField,
  notes: z.string().trim().max(2000, "Нотатка занадто довга").optional(),
  role: z.enum(["ADMIN", "MANAGER", "SELLER"]).optional(),
  isActive: z.boolean().optional()
});

export const adminUserAccessSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("set-password"),
    userId: z.string().min(3),
    password: strongPasswordField
  }),
  z.object({
    action: z.literal("create-reset-link"),
    userId: z.string().min(3)
  })
]);

export const forgotPasswordSchema = z.object({
  email: z.string().email("Невірний email")
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10, "Невірний токен"),
  password: strongPasswordField
});
