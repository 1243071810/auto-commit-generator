#!/bin/bash
# 安装 Auto Commit Generator 快捷命令

SCRIPT_DIR="$HOME/.claude/scripts"
BASHRC="$HOME/.bashrc"

echo "🚀 安装 Auto Commit Generator..."

# 检查是否已添加别名
if grep -q "alias gac=" "$BASHRC" 2>/dev/null; then
    echo "✅ 快捷命令已存在"
else
    # 添加别名到 .bashrc
    echo "" >> "$BASHRC"
    echo "# Auto Commit Generator" >> "$BASHRC"
    echo "alias gac='node ~/.claude/scripts/auto-commit.mjs'" >> "$BASHRC"

    echo "✅ 快捷命令已添加到 ~/.bashrc"
    echo ""
    echo "请运行以下命令使配置生效:"
    echo "  source ~/.bashrc"
    echo ""
    echo "或者重新打开 Git Bash"
fi

echo ""
echo "📖 使用方法:"
echo "  1. git add <files>"
echo "  2. gac"
echo "  3. 在 VSCode 中粘贴 (Ctrl+V)"
echo ""
echo "🎉 安装完成！"
