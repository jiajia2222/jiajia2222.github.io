import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import PostEditor from '@/components/PostEditor';

export const dynamic = 'force-dynamic';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await db.post.findUnique({ where: { id: params.id } });
  if (!post) notFound();
  return <PostEditor initial={{ id: post.id, title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content, status: post.status, category: post.category, tags: post.tags, featured: post.featured, scheduledAt: post.scheduledAt ? new Date(post.scheduledAt).toISOString().slice(0, 16) : '' }} />;
}
