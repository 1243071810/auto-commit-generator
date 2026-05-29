# Auto Commit Generator - 设计文档

## 目标
创建一个通用脚本，自动根据 git staged changes 生成 commit message，并填入 VSCode 的 commit 输入框。

## 技术方案

### 架构
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Git Staged     │───▶│  Claude API     │───▶│  VSCode Input   │
│  Changes        │    │  生成 Commit    │    │  模拟键盘输入   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 技术栈
- **运行时**: Node.js (用户熟悉前端开发)
- **Git 操作**: child_process 执行 git 命令
- **AI 模型**: Claude API (anthropic SDK)
- **键盘模拟**: PowerShell SendKeys (Windows 兼容性好)

### 核心流程

1. **读取 Git Staged Changes**
   ```bash
   git diff --cached --stat      # 获取变更文件列表
   git diff --cached             # 获取详细差异
   git diff --cached --staged    # 获取 staged 内容
   ```

2. **调用 Claude API 生成 Commit Message**
   - 使用 anthropic SDK
   - 配置: ANTHROPIC_AUTH_TOKEN, ANTHROPIC_BASE_URL
   - 模型: mimo-v2.5-pro (用户当前配置)
   - Prompt: 分析 diff 内容，生成简洁的 commit message

3. **模拟键盘输入到 VSCode**
   - 使用 PowerShell 的 SendKeys
   - 先聚焦 VSCode 窗口
   - 定位到 commit 输入框
   - 输入生成的 commit message

### 文件结构
```
~/.claude/scripts/
├── auto-commit.mjs          # 主脚本
├── auto-commit.bat          # Windows 批处理文件
├── package.json             # 依赖配置
├── test.ps1                # 测试脚本
├── README.md               # 使用说明
└── SUMMARY.md              # 项目总结
```

### 配置文件
- 复用 Claude 的 settings.json 中的配置
- ANTHROPIC_AUTH_TOKEN
- ANTHROPIC_BASE_URL
- ANTHROPIC_MODEL

### 使用方式
```bash
# 在任意项目目录下执行
node ~/.claude/scripts/auto-commit.mjs

# 或使用批处理文件
~/.claude/scripts/auto-commit.bat
```

### 错误处理
1. 检查是否在 git 仓库中
2. 检查是否有 staged changes
3. 检查 Claude API 配置
4. 检查 VSCode 是否运行

### 扩展性
- 支持自定义 commit message 格式
- 支持多种 commit 风格 (conventional, emoji, etc.)
- 支持多平台 (Windows, macOS, Linux)

## 实现步骤

1. 创建项目目录和 package.json
2. 安装依赖: @anthropic-ai/sdk
3. 实现 git diff 读取功能
4. 实现 Claude API 调用
5. 实现 PowerShell SendKeys 集成
6. 添加错误处理和日志
7. 测试和优化

## 实现细节

### 关键问题解决

1. **API 响应格式问题**
   - mimo-v2.5-pro 模型使用 extended thinking
   - 响应中包含 thinking 和 text 两种类型
   - 需要查找 text 类型的内容
   - 增加 max_tokens 到 4096

2. **PowerShell 转义问题**
   - 中文字符和特殊符号导致转义失败
   - 使用 Base64 编码传递文本
   - 通过环境变量传递编码后的文本

3. **PowerShell 路径问题**
   - bash 环境中找不到 powershell 命令
   - 使用完整路径: C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe

### 技术要点

1. **ES Modules**: 使用 .mjs 扩展名和 import 语法
2. **异步处理**: async/await 处理 API 调用
3. **临时文件**: 使用临时文件执行 PowerShell 脚本
4. **环境变量**: 通过环境变量传递配置和数据
5. **错误处理**: 完善的错误处理和用户提示

## 注意事项

- Windows 路径处理 (反斜杠 vs 正斜杠)
- PowerShell 执行策略 (需要 bypass)
- VSCode 窗口焦点处理
- Claude API 调用限制和错误处理
- 中文字符编码处理 (Base64)
- 临时文件清理
