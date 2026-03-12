#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// 项目根目录
const projectRoot = new URL(import.meta.url).pathname.split('/scripts')[0];

// 源目录：src/registry/components/{id}/{id}.md
const sourceDir = path.join(projectRoot, 'src', 'registry', 'components');

// 目标目录：.claude/skills/airiot-ui/data/
const targetDir = path.join(projectRoot, '.claude', 'skills', 'airiot-ui', 'data');

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
  let errorCount = 0;

  componentDirs.forEach(componentDir => {
    try {
      // 源文件路径：src/registry/components/{component}/{component}.md
      const sourceFile = path.join(sourceDir, componentDir, `${componentDir}.md`);

      // 检查源文件是否存在
      if (!fs.existsSync(sourceFile)) {
        console.log(`⚠️  文件不存在: ${sourceFile}`);
        errorCount++;
        return;
      }

      // 目标文件路径：.claude/skills/airiot-ui/data/{component}.md
      const targetFile = path.join(targetDir, `${componentDir}.md`);

      // 复制文件
      fs.copyFileSync(sourceFile, targetFile);
      console.log(`✅ 已复制: ${componentDir}.md`);
      copiedCount++;
    } catch (error) {
      console.error(`❌ 复制失败 ${componentDir}:`, error.message);
      errorCount++;
    }
  });

  console.log('\n复制完成！');
  console.log(`📁 总共处理: ${componentDirs.length} 个组件`);
  console.log(`✅ 成功复制: ${copiedCount} 个文件`);
  console.log(`❌ 失败: ${errorCount} 个文件`);
}

// 运行脚本
if (import.meta.main) {
  copyComponentDocs();
}

export { copyComponentDocs };