# AGENTS 指南

本文档用于帮助贡献者快速了解 admi.test（Next.js 16）项目的定位、目录、依赖及常用命令，确保多人协作时保持一致的开发体验。

## 项目概述

- **定位**：基于 Next.js App Router 的单页（Landing）演示站点，可扩展为多路由应用，支持 Tailwind CSS 4。
- **特性**：
  - App Router + React 19 服务器组件；
  - Tailwind 4 全局样式（`app/globals.css`）；
  - 通过 `layout.tsx` 统一注入字体、元信息与全局主题；
  - 预留 API Route（`app/api/*`）扩展后端能力。

## 目录结构（前后端）

```
.
├─ app/                # 前端 + API 入口
│  ├─ page.tsx         # 首页（默认路由 /）
│  ├─ layout.tsx       # App Router 布局
│  ├─ globals.css      # Tailwind 4 基础样式
│  └─ api/             # （可选）后端路由，按需新增
├─ public/             # 静态资源（favicon、图片等）
├─ eslint.config.mjs   # ESLint 规则
├─ next.config.ts
├─ postcss.config.mjs
├─ tsconfig.json
└─ README.md
```

- **前端**：位于 `app/`，遵循 App Router 约定；新增页面请建目录 `app/<route>/page.tsx`。
- **后端（API Routes）**：若需要服务端逻辑，在 `app/api/<name>/route.ts` 内实现 GET/POST；使用 Next 的 Edge/Node 运行时，无需单独服务器目录。

## 安装与环境变量

1. **安装依赖**
   ```bash
   npm install
   ```
2. **环境变量**
   - 在项目根目录创建 `.env.local`，Next.js 会自动加载。
   - 常用字段示例：
     ```
     NEXT_PUBLIC_API_BASE_URL=https://api.example.com
     API_TOKEN=your-server-only-token
     ```
   - 所有需要暴露给浏览器的变量必须以 `NEXT_PUBLIC_` 开头；其余仅服务器可读。

## 运行与构建命令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 本地开发，默认监听 `http://localhost:3000`，支持热更新。 |
| `npm run build` | 构建生产包并执行类型检查。 |
| `npm run start` | 以生产模式启动 `.next/` 输出（先执行 build）。 |
| `npm run lint` | ESLint + `eslint-config-next` 规则检查。 |

> 建议在提交前至少运行 `npm run lint && npm run build`。

## 页面路由

| 路径 | 文件 | 说明 |
| --- | --- | --- |
| `/` | `app/page.tsx` | 当前唯一页面，展示 Landing 内容。 |
| `/api/*` | `app/api/*/route.ts` | 暂未实现；可按需新增接口，如 `/api/form`。 |

新增路由时遵循：
- 目录命名采用 kebab-case，例如 `app/about/page.tsx → /about`；
- 布局可通过 `app/<route>/layout.tsx` 定义局部结构；
- 共享组件建议放入 `app/(components)/` 或 `app/lib/` 方便复用。

## API 接口（占位说明）

项目当前未实现实际接口，但可按照 Next API Route 规范定义：

```ts
// app/api/example/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "ok" });
}

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({ received: body }, { status: 201 });
}
```

- `GET /api/example`：返回静态 JSON。
- `POST /api/example`：示例请求体转回响应。  
未来若接入真实业务，请在 `README.md` 与本文件同步记录接口列表、参数、鉴权方式。

## 主要技术栈与依赖

- **框架**：Next.js 16（App Router）。
- **语言**：TypeScript 5，React 19。
- **样式**：Tailwind CSS 4 + PostCSS。
- **工具链**：ESLint 9、`eslint-config-next`、Next Image/Turbopack（开发时）。
- **脚本管理**：npm（可替换为 pnpm/yarn，但需更新文档）。

> 若引入额外依赖（如 Zustand、Framer Motion、SWR），请在此处列出用途，避免重复选择。

## 协作建议

- 新增页面或 API 需附测试计划（暂可为手动验证步骤）。
- 修改配置或环境变量时同步更新 `.env.local.example`（如创建）与本文档。
- UI 交付前提供 Desktop/移动端截图，便于 review。

如需更多背景或设计稿，请参考 `README.md`，保持与产品团队同步。
