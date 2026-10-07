import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const posts = [
  { title: '游戏通用解压密码,右键文件夹点击下载更快哦', slug: 'game-password', category: '资源分享', tags: '游戏,工具', status: 'published', views: 1280, featured: true, excerpt: '整理常用游戏资源的解压提示与下载说明。', content: '解压密码：laoquzhang.com\n\n备用云盘地址已经整理在文章中。' },
  { title: '生化危机9 安魂曲｜完整资源整理', slug: 'resident-evil-requiem', category: '游戏资源', tags: '游戏,资源', status: 'published', views: 986, featured: false, excerpt: '记录版本信息、配置要求与下载注意事项。', content: '## 版本信息\n\n这是一个资源整理示例。' },
  { title: '极限竞速 地平线6 传奇版｜配置说明', slug: 'forza-horizon-6', category: '游戏资源', tags: '竞速,PC', status: 'published', views: 742, featured: false, excerpt: '把常见的配置和安装说明集中记录下来。', content: '## 最低配置\n\n需要 64 位处理器和操作系统。' },
  { title: '我的博客后台应该怎样设计', slug: 'blog-admin-design', category: '折腾记录', tags: 'Hexo,后台', status: 'draft', views: 116, featured: true, excerpt: '从静态站点走向可管理的内容工作流。', content: '## 目标\n\n让写作、审核、发布、统计都在一个地方完成。' },
  { title: '弥渡山歌 PHONK', slug: 'midu-folk-phonk', category: '音乐', tags: '音乐,分享', status: 'published', views: 438, featured: false, excerpt: '一篇轻量的音乐记录。', content: '今天听到的一首歌。' },
  { title: 'The king', slug: 'the-king', category: '生活', tags: '日常', status: 'published', views: 252, featured: false, excerpt: '一些短记录。', content: '记录此刻。' },
];

async function main() {
  const passwordHash = await bcrypt.hash('ChangeMe123!', 12);
  const user = await prisma.user.upsert({
    where: { email: 'admin@nadev.xyz' },
    update: {},
    create: { email: 'admin@nadev.xyz', name: 'jiamou', passwordHash, role: 'admin' },
  });

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: { ...post, authorId: user.id, publishedAt: post.status === 'published' ? new Date() : null },
      create: { ...post, authorId: user.id, publishedAt: post.status === 'published' ? new Date() : null },
    });
  }

  const firstPost = await prisma.post.findFirst({ orderBy: { createdAt: 'asc' } });
  if (firstPost) {
    await prisma.comment.deleteMany();
    await prisma.comment.createMany({ data: [
      { postId: firstPost.id, name: '小林', email: 'xiaolin@example.com', content: '这个整理很有用，感谢分享。', status: 'pending' },
      { postId: firstPost.id, name: 'Mika', email: 'mika@example.com', content: '已收藏，期待更多文章。', status: 'approved' },
      { postId: firstPost.id, name: '广告机器人', email: 'spam@example.com', content: '点击这里获取优惠。', status: 'spam' },
    ] });
  }

  await prisma.activity.deleteMany();
  await prisma.activity.createMany({ data: [
    { action: '发布文章', detail: '《游戏通用解压密码》已发布', actorName: 'jiamou' },
    { action: '审核评论', detail: '通过了 1 条评论', actorName: 'jiamou' },
    { action: '更新设置', detail: '修改了站点公告', actorName: 'jiamou' },
  ] });

  for (const setting of [
    { key: 'siteName', value: 'Mou Blog' },
    { key: 'siteDescription', value: '记录技术、网络服务与日常折腾的小博客' },
    { key: 'announcement', value: '欢迎来到 Mou Blog' },
    { key: 'commentReview', value: 'true' },
  ]) await prisma.setting.upsert({ where: { key: setting.key }, update: {}, create: setting });

  console.log('Seed complete. Login: admin@nadev.xyz / ChangeMe123!');
}

main().finally(() => prisma.$disconnect());
