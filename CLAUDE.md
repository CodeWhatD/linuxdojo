# learn-linux

交互式 Linux 命令行学习工具，在终端中以 TUI 形式运行，用户通过挑战关卡学习 Linux 命令。

## 技术栈

- React 19 + Ink 7（终端 UI）
- TypeScript（严格模式）
- tsx 运行，`npm run dev` 启动

## 项目结构

```
src/
  index.tsx              # 入口，渲染 App
  types/
    index.ts             # FsNode、VirtualFS、CommandResult、ParsedCommand、PipeChain
    challenge.ts         # Challenge、ChallengeCategory、CATEGORY_META
  engine/
    filesystem.ts        # 虚拟文件系统（路径解析、增删改查、deepClone）
    parser.ts            # 命令解析（管道、重定向、引号）
    executor.ts          # 命令执行（管道链、重定向写文件）
    validator.ts         # 挑战验证（命令匹配、输出正则）
    commands/
      index.ts           # 命令注册表
      ls.ts cd.ts pwd.ts mkdir.ts rmdir.ts rm.ts touch.ts
      cat.ts echo.ts cp.ts mv.ts chmod.ts grep.ts find.ts
      wc.ts sort.ts uniq.ts head.ts tail.ts
  challenges/
    index.ts             # 汇总所有挑战、按分类查询
    file-basics.ts       # 文件基础操作
    file-viewing.ts      # 文件查看
    text-processing.ts   # 文本处理
    permissions.ts       # 权限管理
    search.ts            # 搜索查找
    pipes-redirection.ts # 管道与重定向
  components/
    App.tsx              # 根组件，按 screen 切换页面
    WelcomeScreen.tsx    # 欢迎页
    CategoryScreen.tsx   # 分类选择
    ChallengeScreen.tsx  # 挑战页（命令输入 + 执行 + 验证）
    ResultScreen.tsx     # 结果页（星级评分）
    CommandSuggestion.tsx # 内置命令补全组件
  utils/
    builtin-commands.ts  # 各场景内置命令定义
  state/
    GameContext.tsx       # 游戏状态（useReducer + Context）
```

## 关键设计

- 虚拟文件系统为纯内存树结构，每道挑战开始时重置为 `createRoot()`
- 命令解析使用 `shell-quote` 库，支持管道和重定向
- 挑战验证支持两种方式：`acceptedCommands`（命令匹配）和 `expectedOutputPattern`（输出正则）
- 星级评分：一次通过且未用提示 = 3 星，用 1 条提示 = 2 星，其余 = 1 星
- UI 界面为中文

## 开发约定

- 使用中文注释和界面文案
- 新增命令在 `engine/commands/` 下新建文件，并在 `index.ts` 注册
- 新增挑战在 `challenges/` 对应分类文件中添加
- 每个命令 handler 签名：`(fs: VirtualFS, cmd: ParsedCommand, stdin?: string) => CommandResult`

## 版本管理

采用语义化版本号 `主版本.次版本.修订号`（如 0.1.0）：

- **修订号 (patch)**：bug 修复、界面文案调整、小优化
- **次版本 (minor)**：新功能（新命令、新挑战、新组件、补全功能等）
- **主版本 (major)**：架构重构、不兼容变更

每次发版需在 `CHANGELOG.md` 中记录变更，版本号同步更新到 `package.json`。
