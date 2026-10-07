import { db } from './db';

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`缺少环境变量 ${name}`);
  return value;
}

function frontmatter(post: { title: string; date: Date; category: string; tags: string; excerpt: string; content: string }) {
  const tags = post.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
  return `---\ntitle: ${JSON.stringify(post.title)}\ndate: ${post.date.toISOString()}\ncategories:\n  - ${post.category}\ntags:\n${tags.length ? tags.map((tag) => `  - ${tag}`).join('\n') : '  - 未分类'}\nexcerpt: ${JSON.stringify(post.excerpt)}\n---\n\n${post.content.trim()}\n`;
}

export async function publishPost(postId: string, actorName: string) {
  const token = required('GITHUB_TOKEN');
  const owner = required('GITHUB_OWNER');
  const repo = required('GITHUB_REPO');
  const branch = process.env.GITHUB_BRANCH || 'main';
  const post = await db.post.findUnique({ where: { id: postId } });
  if (!post) throw new Error('文章不存在');

  const path = `source/_posts/${post.slug}.md`;
  const api = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
  const existing = await fetch(`${api}?ref=${encodeURIComponent(branch)}`, { headers });
  const existingData = existing.ok ? await existing.json() as { sha?: string } : undefined;
  const content = Buffer.from(frontmatter({ ...post, date: post.publishedAt || new Date() }), 'utf8').toString('base64');
  const response = await fetch(api, { method: 'PUT', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ message: `content: publish ${post.title}`, content, branch, sha: existingData?.sha }) });
  if (!response.ok) throw new Error(`GitHub 发布失败（${response.status}）`);

  await db.post.update({ where: { id: post.id }, data: { status: 'published', publishedAt: new Date() } });
  await db.activity.create({ data: { action: '发布文章', detail: `《${post.title}》已提交到 GitHub`, actorName } });
  return { path, commit: await response.json() };
}
