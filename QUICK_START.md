# Auto Commit Generator - 快速开始

## 一键使用

```bash
# 1. 添加文件到 staged
git add <files>

# 2. 一键生成 commit message
gac

# 3. 在 VSCode 中粘贴 (Ctrl+V)
```

## 命令说明

### gac
- 自动读取 git staged changes
- 使用 Claude API 生成专业的 commit message
- 复制到剪贴板
- 显示使用提示

### 完整路径
```bash
~/.claude/scripts/gac.bat
```

## 使用流程

1. **添加文件**
   ```bash
   git add src/feature.js
   # 或者
   git add .
   ```

2. **生成 commit message**
   ```bash
   gac
   ```

3. **在 VSCode 中**
   - 打开 Source Control 面板 (Ctrl+Shift+G)
   - 点击 commit message 输入框
   - 粘贴 (Ctrl+V)
   - 点击提交按钮 ✓

## Commit Message 格式

```
<type>(<scope>): <description>
```

### 示例
- `feat(用户模块): 添加用户登录功能`
- `fix(api): 修复登录接口返回错误`
- `docs(README): 更新项目说明`

## 故障排除

### 1. 命令未找到
```bash
# 使用完整路径
~/.claude/scripts/gac.bat
```

### 2. API 调用失败
检查 `~/.claude/settings.json` 中的 API 配置。

### 3. 剪贴板失败
手动复制输出的 commit message。

## 更多信息

- 详细文档: `~/.claude/scripts/README.md`
- 项目总结: `~/.claude/scripts/SUMMARY.md`
- 设计文档: `~/.claude/plans/auto-commit-generator.md`
