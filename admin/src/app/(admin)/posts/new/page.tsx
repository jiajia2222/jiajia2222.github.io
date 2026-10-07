import PostEditor from '@/components/PostEditor';

export default function NewPostPage() {
  return <PostEditor initial={{ title: '', slug: `new-post-${Date.now().toString().slice(-5)}`, excerpt: '', content: '', status: 'draft', category: '未分类', tags: '', featured: false, scheduledAt: '' }} />;
}
