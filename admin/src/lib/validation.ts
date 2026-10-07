import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(8, '密码至少 8 位'),
});

export const postSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(120),
  slug: z.string().min(1, 'Slug 不能为空').regex(/^[a-z0-9-]+$/, 'Slug 只能包含小写字母、数字和短横线'),
  excerpt: z.string().max(280).default(''),
  content: z.string().min(1, '正文不能为空'),
  status: z.enum(['draft', 'published', 'scheduled']).default('draft'),
  category: z.string().min(1).max(40).default('未分类'),
  tags: z.string().max(200).default(''),
  featured: z.boolean().default(false),
  scheduledAt: z.string().optional().nullable(),
});

export const commentStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'spam', 'trash']),
});
