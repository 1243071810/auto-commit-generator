#!/usr/bin/env node

/**
 * Auto Commit Generator
 * 自动根据 git staged changes 生成 commit message 并填入 VSCode
 */

import Anthropic from '@anthropic-ai/sdk';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

// 配置
const CONFIG = {
  // Claude API 配置 (从环境变量或配置文件读取)
  anthropicAuthToken: process.env.ANTHROPIC_AUTH_TOKEN || '',
  anthropicBaseUrl: process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com',
  anthropicModel: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',

  // Commit message 配置
  maxDiffLength: 5000,  // 最大 diff 长度，避免 token 过多
  language: 'zh',       // 中文
};

/**
 * 读取 Claude 配置文件
 */
function loadClaudeConfig() {
  try {
    const configPath = join(process.env.HOME || process.env.USERPROFILE, '.claude', 'settings.json');
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));

    if (config.env) {
      CONFIG.anthropicAuthToken = config.env.ANTHROPIC_AUTH_TOKEN || CONFIG.anthropicAuthToken;
      CONFIG.anthropicBaseUrl = config.env.ANTHROPIC_BASE_URL || CONFIG.anthropicBaseUrl;
      CONFIG.anthropicModel = config.env.ANTHROPIC_MODEL || CONFIG.anthropicModel;
    }
  } catch (error) {
    console.warn('⚠️  无法读取 Claude 配置文件，使用默认配置');
  }
}

/**
 * 检查是否在 git 仓库中
 */
function checkGitRepo() {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * 获取 git staged changes
 */
function getStagedChanges() {
  try {
    // 获取变更文件列表
    const files = execSync('git diff --cached --name-only', { encoding: 'utf-8' }).trim();

    if (!files) {
      return null;
    }

    // 获取详细差异
    const diff = execSync('git diff --cached', { encoding: 'utf-8' });

    // 获取 staged 内容 (用于新文件)
    const staged = execSync('git diff --cached --staged', { encoding: 'utf-8' });

    return {
      files: files.split('\n'),
      diff: diff.substring(0, CONFIG.maxDiffLength),
      staged: staged.substring(0, CONFIG.maxDiffLength),
    };
  } catch (error) {
    console.error('❌ 获取 git staged changes 失败:', error.message);
    return null;
  }
}

/**
 * 调用 Claude API 生成 commit message
 */
async function generateCommitMessage(changes) {
  if (!CONFIG.anthropicAuthToken) {
    throw new Error('未配置 ANTHROPIC_AUTH_TOKEN');
  }

  const client = new Anthropic({
    apiKey: CONFIG.anthropicAuthToken,
    baseURL: CONFIG.anthropicBaseUrl,
  });

  const prompt = `你是一个专业的 Git commit message 生成器。请根据以下 git diff 内容生成一个详细、清晰的 commit message。

## 要求

1. 使用中文
2. 使用 Conventional Commits 格式: <type>(<scope>): <description>
3. type 必须是以下之一: feat, fix, docs, style, refactor, test, chore, perf, ci, build
4. scope 必须填写，表示具体的功能模块或组件名称
5. description 必须详细说明具体改了什么，让读者一眼能看出功能变更
6. 如果有多个不相关的变更，只生成一个主要的 commit message
7. 不要添加任何额外的解释或标点符号

## 生成规则

1. 明确指出修改了哪个功能/模块/组件
2. 说明模块的作用是什么（比如：状态管理、用户认证、数据处理等）
3. 说明具体添加/修改/删除了什么功能
4. 如果是添加注释，说明是为哪个功能添加注释
5. 如果是修复 bug，说明修复了什么问题
6. 如果是重构，说明重构了什么，目的是什么
7. 如果修改了多个文件，找出它们的共同主题

## 分析步骤

1. 查看变更文件列表，识别涉及的功能模块
2. 分析 diff 内容，理解具体改了什么
3. 找出变更的核心目的
4. 用简洁的语言描述变更

## 详细描述要求

- 说明模块的作用（比如：状态管理、用户认证、数据处理等）
- 说明具体改了什么（比如：类型定义、接口、方法、组件等）
- 说明优化了什么（比如：代码结构、性能、可读性等）
- 如果是添加注释，说明注释的内容是什么

## 示例

好的示例:
- feat(用户登录): 为用户认证模块添加微信扫码登录功能，支持获取用户信息和 token
- fix(支付模块): 修复微信支付回调参数解析错误，处理签名验证失败的情况
- docs(商品详情): 为商品图片轮播组件添加使用说明，包括配置选项和事件处理
- refactor(工具函数): 将日期格式化函数拆分为独立模块，提高代码复用性
- style(按钮组件): 统一所有按钮的圆角和阴影样式，提升视觉一致性
- perf(列表渲染): 使用虚拟滚动优化长列表性能，减少 DOM 节点数量

不好的示例:
- feat: 添加功能 (太笼统)
- fix: 修复 bug (不知道修了什么)
- docs: 添加注释 (不知道为谁添加)
- refactor: 重构代码 (不知道重构了什么)

## 变更文件
${changes.files.join('\n')}

## Diff 内容
${changes.diff}

请直接输出 commit message，不要添加任何其他内容。`;

  try {
    const response = await client.messages.create({
      model: CONFIG.anthropicModel,
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // 处理响应：可能包含 thinking 和 text 两种类型
    if (!response.content || response.content.length === 0) {
      throw new Error('API 响应为空');
    }

    // 查找 text 类型的内容
    const textContent = response.content.find(c => c.type === 'text');
    if (textContent && textContent.text) {
      return textContent.text.trim();
    }

    // 如果没有 text，但有 thinking，说明 max_tokens 不够
    if (response.stop_reason === 'max_tokens') {
      throw new Error('生成的 commit message 被截断，请增加 max_tokens 配置');
    }

    throw new Error('API 响应中没有文本内容');
  } catch (error) {
    console.error('❌ 调用 Claude API 失败:', error.message);
    throw error;
  }
}

/**
 * 复制文本到剪贴板
 */
function copyToClipboard(text) {
  try {
    // 使用 Base64 编码避免转义问题
    const base64Text = Buffer.from(text, 'utf-8').toString('base64');

    // PowerShell 脚本 - 从环境变量读取文本并复制到剪贴板
    const psScript = `
$commitMessage = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($env:COMMIT_MESSAGE))
Set-Clipboard -Value $commitMessage
Write-Host "Copied to clipboard"
`;

    // 写入临时文件执行
    const tmpFile = join(process.env.TEMP || process.env.TMP || '.', 'auto-commit-clipboard.ps1');
    writeFileSync(tmpFile, psScript, 'utf-8');

    try {
      // 使用完整路径调用 PowerShell
      const powershellPath = 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe';
      execSync(`"${powershellPath}" -ExecutionPolicy Bypass -File "${tmpFile}"`, {
        stdio: 'inherit',
        env: {
          ...process.env,
          COMMIT_MESSAGE: base64Text,
        },
      });
    } finally {
      // 清理临时文件
      try { unlinkSync(tmpFile); } catch {}
    }

    return true;
  } catch (error) {
    console.error('❌ 复制到剪贴板失败:', error.message);
    return false;
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 Auto Commit Generator 启动...\n');

  // 1. 加载配置
  loadClaudeConfig();
  console.log('✅ 配置已加载');

  // 2. 检查 git 仓库
  if (!checkGitRepo()) {
    console.error('❌ 当前目录不是 git 仓库');
    process.exit(1);
  }
  console.log('✅ Git 仓库检查通过');

  // 3. 获取 staged changes
  const changes = getStagedChanges();
  if (!changes) {
    console.log('⚠️  没有 staged changes，请先使用 git add 添加文件');
    process.exit(0);
  }
  console.log(`✅ 发现 ${changes.files.length} 个文件有变更`);
  console.log(`   文件列表: ${changes.files.join(', ')}\n`);

  // 4. 生成 commit message
  console.log('🤖 正在调用 Claude API 生成 commit message...');
  const commitMessage = await generateCommitMessage(changes);
  console.log(`✅ Commit message 已生成:\n`);
  console.log(`   ${commitMessage}\n`);

  // 5. 复制到剪贴板
  console.log('📋 正在复制到剪贴板...');
  const success = copyToClipboard(commitMessage);

  if (success) {
    console.log('✅ Commit message 已复制到剪贴板');
    console.log('\n💡 使用方法:');
    console.log('   1. 在 VSCode 中打开 Source Control 面板 (Ctrl+Shift+G)');
    console.log('   2. 点击 commit message 输入框');
    console.log('   3. 粘贴 (Ctrl+V)');
    console.log('   4. 点击提交按钮 ✓');
  } else {
    console.log('⚠️  复制失败，请手动复制以下 commit message:');
    console.log(`\n${commitMessage}\n`);
  }
}

// 运行主函数
main().catch((error) => {
  console.error('❌ 程序执行失败:', error.message);
  process.exit(1);
});
