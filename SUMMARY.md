# Auto Commit Generator - 项目总结

## 项目概述

Auto Commit Generator 是一个自动化工具，用于根据 git staged changes 生成专业的 commit message，并自动填入 VSCode 的 commit 输入框。

## 核心功能

1. **自动读取 Git 变更**: 读取 staged changes 的文件列表和详细差异
2. **AI 生成 Commit Message**: 使用 Claude API 分析变更内容，生成专业的 commit message
3. **自动填入 VSCode**: 使用 PowerShell SendKeys 自动填入 VSCode 的 commit 输入框
4. **支持中文**: 使用中文生成 commit message
5. **Conventional Commits 格式**: 使用标准的 commit message 格式

## 技术实现

### 技术栈

- **运行时**: Node.js
- **Git 操作**: child_process
- **AI 模型**: Claude API (anthropic SDK)
- **键盘模拟**: PowerShell SendKeys
- **编码处理**: Base64 编码避免转义问题

### 文件结构

```
~/.claude/scripts/
├── auto-commit.mjs      # 主脚本
├── auto-commit.bat      # Windows 批处理文件
├── package.json         # 依赖配置
├── test.ps1            # 测试脚本
├── README.md           # 使用说明
└── SUMMARY.md          # 项目总结
```

## 使用方法

### 基本使用

```bash
# 1. 添加文件到 staged
git add <files>

# 2. 运行脚本
node ~/.claude/scripts/auto-commit.mjs

# 或使用批处理文件
~/.claude/scripts/auto-commit.bat
```

### 创建全局快捷命令

```bash
# 在 ~/.bashrc 中添加
alias gac='node ~/.claude/scripts/auto-commit.mjs'

# 然后直接使用
gac
```

## Commit Message 格式

脚本使用 Conventional Commits 格式:

```
<type>(<scope>): <description>
```

### Type 类型

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具相关
- `perf`: 性能优化
- `ci`: CI/CD 相关
- `build`: 构建系统

### 示例

- `feat(用户模块): 添加用户登录功能`
- `fix(api): 修复登录接口返回错误`
- `docs(README): 更新项目说明`
- `refactor(工具函数): 优化日期格式化函数`

## 配置说明

脚本会自动读取 `~/.claude/settings.json` 中的配置:

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "your-token",
    "ANTHROPIC_BASE_URL": "https://api.anthropic.com",
    "ANTHROPIC_MODEL": "claude-3-5-sonnet-20241022"
  }
}
```

## 故障排除

### 1. 未找到 VSCode 窗口

- 确保 VSCode 已打开并可见
- 检查窗口标题是否包含 "Visual Studio Code"

### 2. Commit message 未填入

- 运行测试脚本: `powershell -ExecutionPolicy Bypass -File ~/.claude/scripts/test.ps1`
- 检查 PowerShell 执行策略

### 3. API 调用失败

- 检查 `~/.claude/settings.json` 中的 API 配置
- 确保网络连接正常
- 检查 API 密钥是否有效

## 扩展性

### 支持多平台

- Windows: 使用 PowerShell SendKeys
- macOS: 可以使用 AppleScript
- Linux: 可以使用 xdotool

### 自定义 Commit 格式

可以修改 `auto-commit.mjs` 中的 prompt 来自定义 commit message 格式。

### 集成到 Git Hooks

可以配置 git pre-commit hook 自动运行脚本。

## 注意事项

1. **仅支持 Windows**: 当前实现使用 PowerShell SendKeys
2. **需要 VSCode 可见**: VSCode 窗口必须打开且可见
3. **网络依赖**: 需要调用 Claude API
4. **编码问题**: 使用 Base64 编码避免中文转义问题

## 未来改进

1. 支持 macOS 和 Linux
2. 支持多种 commit 风格
3. 支持自定义 prompt
4. 支持批量处理多个项目
5. 支持集成到 VSCode 扩展

## License

MIT
