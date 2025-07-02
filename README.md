# Collaborative Editor

基于 Turborepo 的协作编辑器项目，采用 Monorepo 架构实现前后端分离设计。

## 项目架构

### 📁 目录结构

```
collaborative-editor/
├── apps/                           # 应用程序
│   ├── frontend/                   # React + Vite 前端应用
│   │   ├── src/
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── backend/                    # NestJS 后端应用
│       ├── src/
│       ├── test/
│       ├── package.json
│       └── nest-cli.json
├── libs/                           # 共享库
│   ├── shared-types/               # 共享类型定义
│   │   ├── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── shared-utils/               # 共享工具函数
│       ├── index.ts
│       ├── package.json
│       └── tsconfig.json
├── package.json                    # 根项目配置
├── pnpm-workspace.yaml            # pnpm 工作空间配置
├── turbo.json                     # Turborepo 配置
├── eslint.config.mjs              # 统一 ESLint 配置
├── .prettierrc.json               # Prettier 配置
└── tsconfig.json                  # TypeScript 配置
```

### 🏗️ 技术栈

**前端 (Frontend)**

- React 19.1.0
- TypeScript 5.8.x
- Vite 7.0.0
- ESLint + Prettier

**后端 (Backend)**

- NestJS 11.0.1
- TypeScript 5.7.x
- Jest (测试框架)
- Express

**共享库 (Shared Libraries)**

- `@collaborative-editor/shared-types` - 公共类型定义
- `@collaborative-editor/shared-utils` - 公共工具函数

**开发工具**

- **包管理器**: pnpm 9.0.0+
- **构建系统**: Turborepo 2.5.4
- **代码规范**: ESLint 9.x + Prettier 3.x
- **类型检查**: TypeScript 5.8.x

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8

### 安装依赖

```bash
# 安装所有依赖
pnpm install

# 构建共享库 (首次运行必须)
pnpm build:libs
```

### 启动开发环境

```bash
# 同时启动前后端 (推荐)
pnpm dev

# 或者分别启动
pnpm dev:frontend    # 启动前端 (通常运行在 http://localhost:5173)
pnpm dev:backend     # 启动后端 (通常运行在 http://localhost:3000)
```

## 📜 可用命令

### 开发命令

```bash
# 开发环境
pnpm dev              # 并行启动所有开发服务器
pnpm dev:all          # 同上
pnpm dev:frontend     # 仅启动前端开发服务器
pnpm dev:backend      # 仅启动后端开发服务器

# 构建
pnpm build            # 构建所有应用和库
pnpm build:libs       # 仅构建共享库
```

### 代码质量

```bash
# 代码检查和格式化
pnpm lint:check       # 检查代码规范 (不修复)
pnpm lint             # 检查并自动修复代码规范
pnpm format:check     # 检查代码格式 (不修复)
pnpm format           # 格式化代码
pnpm check-types      # TypeScript 类型检查
```

### 测试

```bash
pnpm test             # 运行所有测试
pnpm test:watch       # 监视模式运行测试
```

### 工具命令

```bash
pnpm clean            # 清理构建产物
pnpm install:all      # 重新安装所有依赖
```

### Turbo 命令 (带缓存优化)

```bash
# 通过 Turbo 运行任务 (推荐，支持缓存)
pnpm turbo run build
pnpm turbo run lint
pnpm turbo run test
pnpm turbo run dev
```

## 🔧 开发规范

### 包管理注意事项

1. **使用 pnpm**: 项目使用 pnpm 作为包管理器，请勿使用 npm 或 yarn
2. **工作空间依赖**: 共享库使用 `workspace:*` 引用
3. **依赖安装**:
   - 根目录依赖: `pnpm add -w <package>`
   - 子项目依赖: `pnpm add <package> --filter <workspace>`

### 代码规范

1. **统一配置**: 所有 lint 配置都在根目录，子项目无需单独配置
2. **自动格式化**: 提交前会自动运行 Prettier 格式化
3. **类型安全**: 所有 TypeScript 文件必须通过类型检查
4. **共享代码**: 前后端共享的类型和工具放在 `libs/` 目录

### Git 工作流

```bash
# 提交前检查
pnpm lint:check && pnpm check-types && pnpm test

# 或使用快捷命令
pnpm turbo run lint && pnpm turbo run test
```

## 🗂️ 项目特性

### Monorepo 优势

- **代码复用**: 前后端共享类型定义和工具函数
- **统一工具链**: 一套 lint、format、test 配置
- **增量构建**: Turbo 提供智能缓存和增量构建
- **并行开发**: 支持同时开发多个应用

### 开发体验

- **热重载**: 前后端都支持代码热重载
- **类型安全**: 前后端共享 TypeScript 类型
- **统一规范**: 统一的代码格式和 lint 规则
- **快速构建**: Turbo 缓存加速构建过程

## 🔍 验证项目运行

### 验证后端

```bash
# 检查后端是否启动
curl http://localhost:3000

# 应该返回: Hello World!
```

### 验证前端

访问 http://localhost:5173，应该能看到 React 应用界面。

### 验证共享库

共享库会在构建时自动验证，确保前后端都能正确引用：

```bash
# 构建验证
pnpm build:libs

# 类型检查验证
pnpm check-types
```

## 📚 相关链接

- [Turborepo 文档](https://turborepo.com/docs)
- [NestJS 文档](https://docs.nestjs.com/)
- [React 文档](https://react.dev/)
- [pnpm 文档](https://pnpm.io/)

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'Add amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 创建 Pull Request

请确保提交前运行 `pnpm lint` 和 `pnpm test`。
