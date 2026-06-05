import { z } from "zod";

// ============================================================
// AUTH VALIDATION
// ============================================================

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, "Họ tên tối thiểu 2 ký tự")
    .max(255, "Họ tên tối đa 255 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z
    .string()
    .min(8, "Mật khẩu tối thiểu 8 ký tự")
    .max(128, "Mật khẩu tối đa 128 ký tự"),
  confirmPassword: z.string(),
  phone: z
    .string()
    .regex(/^[0-9+\-\s()]{7,20}$/, "Số điện thoại không hợp lệ")
    .optional(),
  agreeTerms: z.boolean().refine((val) => val === true, "Bạn phải đồng ý điều khoản"),
  referralCode: z.string().max(50).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
  rememberMe: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Mật khẩu tối thiểu 8 ký tự")
      .max(128, "Mật khẩu tối đa 128 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Họ tên tối thiểu 2 ký tự")
    .max(255, "Họ tên tối đa 255 ký tự")
    .optional(),
  phone: z
    .string()
    .regex(/^[0-9+\-\s()]{7,20}$/, "Số điện thoại không hợp lệ")
    .optional()
    .nullable(),
  avatarUrl: z.string().url("URL avatar không hợp lệ").optional().nullable(),
  emailNotify: z.boolean().optional(),
  isPublic: z.boolean().optional(),
});

// ============================================================
// PRODUCT / ORDER VALIDATION
// ============================================================

export const createOrderSchema = z.object({
  productId: z.string().uuid("ID sản phẩm không hợp lệ"),
  customName: z
    .string()
    .max(255, "Tên san hô tối đa 255 ký tự")
    .optional(),
  paymentMethod: z.enum(["vnpay", "momo", "bank_transfer"], {
    message: "Vui lòng chọn phương thức thanh toán",
  }),
  agreeTerms: z.boolean().refine((val) => val === true, "Bạn phải đồng ý điều khoản"),
});

// ============================================================
// CORAL UPDATE VALIDATION
// ============================================================

export const coralUpdateSchema = z.object({
  coralId: z.string().uuid("ID san hô không hợp lệ"),
  sizeCm: z
    .number()
    .min(0, "Kích thước phải lớn hơn 0")
    .max(999.99)
    .optional()
    .nullable(),
  health: z.enum(["good", "average", "needs_attention"], {
    message: "Trạng thái sức khỏe không hợp lệ",
  }),
  notes: z.string().max(2000, "Ghi chú tối đa 2000 ký tự").optional(),
  images: z
    .array(z.string().min(1, "URL ảnh không được để trống"))
    .min(1, "Cần ít nhất 1 ảnh")
    .max(5, "Tối đa 5 ảnh"),
  videoUrl: z.string().min(1).optional().nullable(),
});

// ============================================================
// BLOG VALIDATION
// ============================================================

export const blogPostSchema = z.object({
  title: z
    .string()
    .min(10, "Tiêu đề tối thiểu 10 ký tự")
    .max(500, "Tiêu đề tối đa 500 ký tự"),
  slug: z
    .string()
    .min(3, "Slug tối thiểu 3 ký tự")
    .max(500, "Slug tối đa 500 ký tự")
    .regex(/^[a-z0-9-]+$/, "Slug chỉ chứa chữ thường, số và dấu gạch ngang"),
  excerpt: z.string().max(500, "Tóm tắt tối đa 500 ký tự").optional(),
  content: z.string().min(100, "Nội dung tối thiểu 100 ký tự"),
  featuredImage: z.string().url("URL ảnh không hợp lệ").optional().nullable(),
  category: z.enum(["ecology", "conservation", "green_economy", "adopter_stories"]),
  tags: z.array(z.string()).max(10, "Tối đa 10 tags").optional(),
  readingTime: z.number().int().min(1).max(60).optional(),
  status: z.enum(["draft", "published"]).optional(),
});

/** Admin blog create — slug is optional (auto-generated from title) */
export const adminBlogCreateSchema = blogPostSchema.extend({
  slug: z.string().min(3).max(500).regex(/^[a-z0-9-]+$/).optional(),
});

/** Admin blog update — all fields optional for partial update */
export const adminBlogUpdateSchema = blogPostSchema.partial();

// ============================================================
// COMMUNITY SUBMISSION VALIDATION
// ============================================================

export const communitySubmissionSchema = z.object({
  content: z
    .string()
    .min(10, "Nội dung tối thiểu 10 ký tự")
    .max(5000, "Nội dung tối đa 5000 ký tự"),
  images: z
    .array(z.string().url("URL ảnh không hợp lệ"))
    .min(0, "URL ảnh không hợp lệ")
    .max(10, "Tối đa 10 ảnh"),
});

// ============================================================
// CONTACT VALIDATION
// ============================================================

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Tên tối thiểu 2 ký tự")
    .max(255, "Tên tối đa 255 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  message: z
    .string()
    .min(10, "Nội dung tối thiểu 10 ký tự")
    .max(5000, "Nội dung tối đa 5000 ký tự"),
});

// ============================================================
// PAGINATION VALIDATION
// ============================================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
});

// ============================================================
// ADMIN SCHEMAS (CRUD operations in admin panel)
// ============================================================

/** Admin: Create a new coral in the pool */
export const adminCoralCreateSchema = z.object({
  species: z.string().min(2, "Tên loài tối thiểu 2 ký tự").max(255),
  locationZone: z.string().max(500).optional(),
  locationGps: z.string().max(100).optional(),
  productTier: z.enum(["standard", "premium", "premium_plus"]).optional(),
  status: z.enum(["available", "assigned", "growing", "dead"]).optional(),
  code: z.string().max(50).optional(),
});

/** Admin: Update an existing coral */
export const adminCoralUpdateSchema = adminCoralCreateSchema.partial().extend({
  status: z.enum(["available", "assigned", "growing", "dead"]).optional(),
});

/** Admin: Create a new product */
export const adminProductCreateSchema = z.object({
  slug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/),
  name: z.string().min(2).max(255),
  tier: z.enum(["standard", "premium", "premium_plus"]),
  priceMin: z.number().int().min(0),
  priceMax: z.number().int().min(0),
  description: z.string().max(2000).optional(),
  benefits: z.array(z.string()).max(20).optional(),
  isActive: z.boolean().optional(),
});

/** Admin: Update user (role change, block/unblock) */
export const adminUserUpdateSchema = z.object({
  role: z.enum(["visitor", "adopter", "ambassador", "admin", "editor", "coral_staff"]).optional(),
  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional(),
});

/** Admin: Create coral center staff account */
export const adminStaffCreateSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  fullName: z.string().min(2, "Họ tên tối thiểu 2 ký tự").max(255),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  phone: z.string().max(20).optional(),
});

/** Admin: Update site settings */
export const adminSettingsSchema = z.object({
  siteName: z.string().max(255).optional(),
  contactEmail: z.string().email().optional(),
  facebookUrl: z.string().url().optional().nullable(),
  instagramUrl: z.string().url().optional().nullable(),
  maintenanceMode: z.boolean().optional(),
});

/** Admin: Send bulk email to users by role */
export const adminBulkEmailSchema = z.object({
  subject: z.string().min(5, "Tiêu đề tối thiểu 5 ký tự").max(500),
  content: z.string().min(10, "Nội dung tối thiểu 10 ký tự"),
  targetRole: z.enum(["all", "adopter", "ambassador", "visitor"]).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CoralUpdateInput = z.infer<typeof coralUpdateSchema>;
export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type CommunitySubmissionInput = z.infer<typeof communitySubmissionSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
