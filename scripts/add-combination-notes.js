#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// 项目根目录
const projectRoot = new URL(import.meta.url).pathname.split('/scripts')[0];

// data 目录路径
const dataDir = path.join(projectRoot, '.claude', 'skills', 'airiot-ui', 'data');

// 组合系统配置 - 只包含实际存在的组件
const combinationSystems = {
  'view': {
    parent: 'view-model',
    children: ['view-data-table', 'view-filter', 'view-pagination', 'view-actions', 'view-advanced-filter', 'view-batch', 'view-data-aggregate', 'view-detail', 'view-field', 'view-tools'],
    systemName: '视图系统',
    systemDoc: 'view-system.md'
  },
  'video': {
    parent: 'video-widget',
    children: ['video-button', 'video-periods-widget', 'video-playback-widget', 'video-time-axis'],
    systemName: '视频系统',
    systemDoc: 'video-system.md'
  },
  'gis': {
    parent: 'gis-map-core',
    children: ['gis-custom-layer', 'gis-polygon-draw', 'gis-table-layer', 'gis-warn-layer', 'gis-xyz-tile', 'gis-geojson-parse', 'gis-geoserver-wms', 'gis-kmz-loader'],
    systemName: 'GIS系统',
    systemDoc: 'gis-system.md'
  },
  '3d': {
    parent: 'model3d',
    children: [], // 3D组件文档不存在，暂时为空
    systemName: '3D系统',
    systemDoc: '3d-system.md'
  }
};

/**
 * 为子组件文档添加组合使用提示
 */
function addCombinationNotes() {
  console.log('开始为子组件文档添加组合使用提示...');

  // 遍历所有组合系统
  Object.entries(combinationSystems).forEach(([systemName, config]) => {
    console.log(`\n处理 ${config.systemName}...`);

    config.children.forEach(childComponent => {
      const filePath = path.join(dataDir, `${childComponent}.md`);

      if (fs.existsSync(filePath)) {
        // 读取文件内容
        let content = fs.readFileSync(filePath, 'utf8');

        // 检查是否已经添加过提示
        if (content.includes('### ⚠️ 组合使用说明')) {
          console.log(`  ${childComponent}.md - 已存在组合使用提示，跳过`);
          return;
        }

        // 在文件开头添加组合使用说明
        const combinationNote = `### ⚠️ 组合使用说明

> **重要**: ${childComponent} 是 ${config.systemName} 的子组件，不能单独使用。
>
> 必须配合父组件 ${config.parent} 使用。请查看 [${config.systemName} 完整指南](data/${config.systemDoc}) 了解正确的使用方法。

`;

        // 在第一个标题前插入提示
        const firstTitleMatch = content.match(/^#+ /m);
        if (firstTitleMatch) {
          const insertPosition = firstTitleMatch.index;
          content = content.slice(0, insertPosition) + combinationNote + content.slice(insertPosition);
        } else {
          // 如果没有标题，在文件开头添加
          content = combinationNote + content;
        }

        // 写回文件
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  ✅ ${childComponent}.md - 已添加组合使用提示`);
      } else {
        console.log(`  ⚠️ ${childComponent}.md - 文件不存在，跳过`);
      }
    });
  });

  console.log('\n✅ 组合使用提示添加完成！');
}

// 运行脚本
if (import.meta.main) {
  addCombinationNotes();
}

export { addCombinationNotes };