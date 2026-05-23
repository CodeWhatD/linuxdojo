# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.2.0] - 2025-05-22

### Added

- 通关存档持久化：进度保存到 `.learn-linux-save.json`，重启后不丢失
- 欢迎页显示存档文件路径，提示用户不要手动修改
- 结果页新增 `:retry` 命令，可重玩当前关卡
- `src/utils/storage.ts` — 存档读写模块

## [0.1.0] - 2025-05-22

### Added

- 内置命令补全：输入 `:` 时显示当前场景可用的命令列表，输入字符自动过滤匹配项
- `src/utils/builtin-commands.ts` — 各场景内置命令定义
- `src/components/CommandSuggestion.tsx` — 补全列表组件

## [0.0.1] - 2025-05-22

### Added

- 交互式 Linux 命令学习工具，基于 React + Ink 构建 TUI
- 虚拟文件系统，模拟 Linux 目录结构（/home/user, /etc, /tmp）
- 命令解析器，支持管道 `|`、重定向 `>`/`>>`、引号
- 19 个 Linux 命令实现：ls, cd, pwd, mkdir, rmdir, rm, touch, cat, echo, cp, mv, chmod, grep, find, wc, sort, uniq, head, tail
- 6 个挑战分类：文件基础操作、文件查看、文本处理、权限管理、搜索查找、管道与重定向
- 星级评分系统（1-3 星）
- 内置命令：:hint, :reset, :back
- 游戏状态管理（useReducer + Context）
