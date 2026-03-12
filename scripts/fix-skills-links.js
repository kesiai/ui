#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// 项目根目录
const projectRoot = new URL(import.meta.url).pathname.split('/scripts')[0];

// SKILL.md 文件路径
const skillMdPath = path.join(projectRoot, '.claude', 'skills', 'airiot-ui', 'SKILL.md');

/**
 * 修复 SKILL.md 中的所有组件链接，添加 data/ 前缀
 */
function fixSkillsLinks() {
  console.log('开始修复 SKILL.md 中的链接...');

  // 读取 SKILL.md 文件
  const content = fs.readFileSync(skillMdPath, 'utf8');

  // 正则表达式匹配所有组件链接
  // 匹配模式：`[组件名](组件名.md) 或 [组件名](data/组件名.md)
  const regex = /\[([^\]]+)\]\(([^)]+)\.md\)/g;

  // 替换函数
  const replacedContent = content.replace(regex, (match, componentName, linkPath) => {
    // 如果链接已经是 data/ 开头，保持不变
    if (linkPath === 'data') {
      return match;
    }

    // 如果已经是 data/xxx 格式，去掉重复的前缀
    if (linkPath.startsWith('data/')) {
      return `[${componentName}](data/${path.basename(linkPath)}.md)`;
    }

    // 否则添加 data/ 前缀
    return `[${componentName}](data/${linkPath}.md)`;
  });

  // 检查是否有变化
  if (content === replacedContent) {
    console.log('没有需要修改的链接');
    return;
  }

  // 写回文件
  fs.writeFileSync(skillMdPath, replacedContent, 'utf8');

  console.log('✅ 链接修复完成！');

  // 统计修改的数量
  const linkCount = (replacedContent.match(/\[([^\]]+)\]\(data\/[^)]+\.md\)/g) || []).length;
  console.log(`📊 总共修复了 ${linkCount} 个链接`);
}

// 运行脚本
if (import.meta.main) {
  fixSkillsLinks();
}

export { fixSkillsLinks };