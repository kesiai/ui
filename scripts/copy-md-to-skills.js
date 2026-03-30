#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// 项目根目录
const projectRoot = new URL(import.meta.url).pathname.split('/scripts')[0];

// 源目录：src/registry/components/{id}/{id}.md
const sourceDir = path.join(projectRoot, 'src', 'registry', 'components');

// 目标目录：.claude/skills/airiot-ui/data/
const targetDir = path.join(projectRoot, '.claude', 'skills', 'kesi-ui', 'data');

/**
 * 前缀映射配置
 * key: 前缀类别
 * value: 需要加此前缀的组件 ID 列表（即源目录名）
 *
 * 不在映射中的组件保持原始名称（如 view-*、form-*、gis-* 等已有分类前缀的）
 */
const prefixMap = {
  base: [
    'bar',
    'button',
    'image',
    'status',
    'text',
    'svg',
  ],
  biz: [
    'connect-widget',
    'data-point',
    'data-view-chart',
    'events',
    'iframe',
    'player',
    'qrcode',
  ],
  form: [
    'schema-form',
    'table-data-select',
    'table-select',
    'textarea',
  ],
};

/**
 * 构建组件 ID → 目标文件名的映射
 * @param {string} componentId - 源组件目录名
 * @returns {string} 目标文件名（不含 .md）
 */
function getTargetFileName(componentId) {
  for (const [prefix, ids] of Object.entries(prefixMap)) {
    if (ids.includes(componentId)) {
      return `${prefix}-${componentId}`;
    }
  }
  return componentId;
}

/**
 * 复制所有组件文档到技能数据目录
 */
function copyComponentDocs() {
  console.log('开始复制组件文档...');

  // 确保目标目录存在
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`创建目录: ${targetDir}`);
  }

  // 查找所有组件目录
  const componentDirs = fs.readdirSync(sourceDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  console.log(`找到 ${componentDirs.length} 个组件目录`);

  let copiedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  componentDirs.forEach(componentId => {
    try {
      // 源文件路径：src/registry/components/{component}/{component}.md
      const sourceFile = path.join(sourceDir, componentId, `${componentId}.md`);

      // 检查源文件是否存在
      if (!fs.existsSync(sourceFile)) {
        console.log(`⚠️  文件不存在: ${sourceFile}`);
        skippedCount++;
        return;
      }

      // 计算目标文件名（加前缀）
      const targetName = getTargetFileName(componentId);
      const targetFile = path.join(targetDir, `${targetName}.md`);

      // 复制文件
      fs.copyFileSync(sourceFile, targetFile);

      // 显示变更信息
      const renamed = targetName !== componentId;
      const tag = renamed ? `${componentId} → ${targetName}` : componentId;
      console.log(`✅ ${tag}`);

      copiedCount++;
    } catch (error) {
      console.error(`❌ 失败 ${componentId}:`, error.message);
      errorCount++;
    }
  });

  console.log('\n复制完成！');
  console.log(`📁 总共处理: ${componentDirs.length} 个组件`);
  console.log(`✅ 成功复制: ${copiedCount} 个文件`);
  console.log(`⏭️  跳过: ${skippedCount} 个文件`);
  console.log(`❌ 失败: ${errorCount} 个文件`);
}

// 运行脚本
if (import.meta.main) {
  copyComponentDocs();
}

export { copyComponentDocs, getTargetFileName, prefixMap };
