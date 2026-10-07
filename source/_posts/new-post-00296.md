---
title: "Moumusic"
date: 2026-10-07T10:27:48.746Z
categories:
  - 未分类
tags:
  - 未分类
excerpt: "好用且强大的音乐播放器"
---

Moumusic 是一款**跨平台开源音乐客户端**，基于 Kumone（iOS）与 LX‑Music‑Mobile（安卓）开发，支持 iOS、Android，仅用于学习用途，提醒用户支持正版音乐版权。

> 
> 仓库地址：`jiajia2222/Moumusic`，当前分支：`refactor/beans‑ui`，官网：[https://music.nadev.xyz](https://link.wtturl.cn/?target=https%3A%2F%2Fmusic.nadev.xyz&scene=im&aid=582478&lang=zh)

## ✨ 核心功能

1. **LX User API 音源管理**

- 支持 JSON、JS、在线 URL 导入音源
- 音源可用性检测、启用 / 切换 / 删除管理

2. **搜索能力**
聚合搜索酷我、酷狗、QQ 音乐、网易云、咪咕等平台
3. **播放相关**

- 音源解析播放，支持音质切换、歌词、封面图
- iOS：原生 SwiftUI 播放器、播放队列、同步歌词、锁屏与控制中心播放、桌面锁屏小组件（WidgetKit）
- Android：沿用 LX Music Mobile 整套能力：音源管理、搜索、歌词、下载、播放

4. **歌单与内容**
使用网易云公开曲库：推荐、发现歌单、评论、歌单导入
5. **语言**：简体中文 / 英文双语言界面

> 
> ⚠️ 重要说明：软件**不内置任何音源地址，也不提供网易云账号登录**，音源全部由用户自行导入，用户需要对导入的音源版权负责。

## 📂 仓库目录结构

```
├── .github/                # GitHub 配置、工作流
├── platforms/
│   ├── ios/                # iOS端（SwiftUI，Kumone基础）
│   │   ├── Sources/Kumone/
│   │   │   ├── Core/API/          网易云曲库桥接 + LX音源接口
│   │   │   ├── Core/Models/       歌曲模型、歌词解析器
│   │   │   ├── Core/Player/       AVPlayer播放、队列、系统播放状态
│   │   │   ├── Core/Storage/      设置、缓存
│   │   │   ├── DesignSystem/      SwiftUI UI组件
│   │   │   └── Features/          首页、搜索、库、设置、播放器页面
│   │   ├── ios/                   XcodeGen 项目配置
│   │   ├── ios/MoumusicWidget/    锁屏小组件
│   │   └── Scripts/               打包脚本
│   └── android/            # Android，基于 LX‑Music‑Mobile（React‑Native）
├── website/                # 官网网页源码
├── .gitignore
├── COPYING                 # GPL‑3.0协议
├── LICENSE                 # LGPL‑3.0协议
├── README.md / README_CN.md / README.en.md  # 多语言说明文档
└── THIRD_PARTY_NOTICES.md  # 第三方开源组件说明
```

## 🛠️ 编译构建命令

### iOS

需要 MacOS + Xcode，使用 XcodeGen 生成项目文件

```
cd platforms/ios/ios
xcodegen generate
xcodebuild -project KumoneIOS.xcodeproj -scheme KumoneIOS -configuration Release -sdk iphoneos build
```

## 📱 安装方式
 QQ群聊: **945130957** 获取安装包

- iOS：输出为无签名 IPA，需要使用 AltStore / SideStore / TrollStore 等工具侧载安装，需要自己提供证书

## 📜 开源协议

- iOS Kumone 部分：**LGPL‑3.0**
- Android LX‑Music‑Mobile 上游：**Apache‑2.0**
- 本仓库同时附带 GPL‑3.0，每个文件遵循自身头部声明的协议

## 🧩 上游项目

1. [Kumone](https://link.wtturl.cn/?target=https%3A%2F%2Fgithub.com%2Fmissuo%2Fkumone&scene=im&aid=582478&lang=zh)：iOS SwiftUI 音乐客户端基础
2. [lyswhut/lx‑music‑mobile](https://link.wtturl.cn/?target=https%3A%2F%2Fgithub.com%2Flyswhut%2Flx-music-mobile&scene=im&aid=582478&lang=zh)：LX 音源协议、安卓客户端本体

## 📝 使用简单流程

1. 安装 App
2. iOS：`资料库 → 设置 → LX Sources`；安卓打开 LX 音源管理页
3. 从本地文件 / 网络链接导入 LX 格式音源
4. 校验音源可用，启用音源，即可搜索、播放音乐

> 
> 声明：该项目仅供学习研究，**请尊重音乐版权，使用拥有合法授权的音源资源**。
