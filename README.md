# Auto Commit Generator

自动根据 git staged changes 生成 commit message 并填入 VSCode。

## 功能

- ✅ 自动读取 git staged changes
- ✅ 使用 Claude API 生成专业的 commit message
- ✅ 自动填入 VSCode 的 commit 输入框
- ✅ 支持中文 commit message
- ✅ 使用 Conventional Commits 格式

## 安装

```bash
cd ~/.claude/scripts
npm install
```

## 使用方法

### 一键执行 (推荐)

1. 在 VSCode 中打开你的项目
2. 使用 `git add` 添加要提交的文件
3. 在项目目录下运行:

```bash
# 使用快捷命令
gac

# 或者完整路径
~/.claude/scripts/gac.bat
```

### 创建全局快捷命令

#### 方法 1: 添加到 PATH (推荐)

将 `~/.claude/scripts` 添加到系统 PATH 环境变量，然后直接运行 `gac`。

#### 方法 2: Git Bash 别名

在 `~/.bashrc` 中添加:

```bash
alias gac='node ~/.claude/scripts/auto-commit.mjs'
```

然后重新加载配置:

```bash
source ~/.bashrc
```

### 使用流程

```bash
# 1. 添加文件到 staged
git add src/feature.js

# 2. 一键生成 commit message
gac

# 3. 在 VSCode 中:
#    - 打开 Source Control (Ctrl+Shift+G)
#    - 点击 commit message 输入框
#    - 粘贴 (Ctrl+V)
#    - 点击提交按钮 ✓
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
- `style`: 代码格式 (不影响功能)
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

## 配置

脚本会自动读取 `~/.claude/settings.json` 中的配置:

- `ANTHROPIC_AUTH_TOKEN`: Claude API 密钥
- `ANTHROPIC_BASE_URL`: API 基础 URL
- `ANTHROPIC_MODEL`: 使用的模型

## 故障排除

### 1. 未找到 VSCode 窗口

确保 VSCode 已打开，并且至少有一个窗口可见。

### 2. Commit message 未填入

如果自动填入失败，脚本会输出 commit message，你可以手动复制。

### 3. API 调用失败

检查 `~/.claude/settings.json` 中的 API 配置是否正确。

## 注意事项

- 仅支持 Windows (使用 PowerShell SendKeys)
- 需要 VSCode 已打开并可见
- 建议先小范围测试，确认无误后再大规模使用

## License

MIT
