import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const REGISTRY_OUTPUT_DIR = path.join(rootDir, 'public', 'r');

async function cleanRegistry() {
  try {
    await fs.rm(REGISTRY_OUTPUT_DIR, { recursive: true, force: true });
    console.log('✅ 已删除 public/r 目录');
  } catch (error) {
    // 目录不存在也不报错
    if (error.code !== 'ENOENT') {
      console.error('❌ 清理失败:', error.message);
    }
  }
}

cleanRegistry();
