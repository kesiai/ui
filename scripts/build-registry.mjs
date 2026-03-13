import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Registry URL
const REGISTRY_URL = 'http://localhost:3000/r';

// 路径配置
const REGISTRY_ROOT = path.join(rootDir, 'src', 'registry');
const OUTPUT_DIR = path.join(rootDir, 'public', 'r');
const REGISTRY_OUTPUT_FILE = path.join(OUTPUT_DIR, 'registry.json');
const REGISTRY_INDEX_OUTPUT = path.join(rootDir, '__registry__', 'index.tsx');

// 文件类型映射
const FOLDER_TYPE_MAP = {
  'blocks': 'registry:block',
  'components': 'registry:component',
  'lib': 'registry:lib',
  'ui': 'registry:ui',
};

// 需要跳过的依赖（这些通常是基础设施依赖，不需要声明）
const SKIP_DEPENDENCIES = [
  'react',
  'react-dom',
  'next',
  'lucide-react',
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
];


// 递归获取目录下所有文件
async function getFilesRecursive(dir, base = '') {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  let files = [];

  for (const dirent of dirents) {
    const res = path.join(dir, dirent.name);
    const rel = path.join(base, dirent.name);

    if (dirent.isDirectory()) {
      // 跳过 node_modules 和隐藏目录
      if (dirent.name === 'node_modules' || dirent.name.startsWith('.')) {
        continue;
      }
      files = files.concat(await getFilesRecursive(res, rel));
    } else if (dirent.isFile() && (dirent.name.endsWith('.ts') || dirent.name.endsWith('.tsx'))) {
      // 跳过 config.ts 和 config.tsx 文件
      if (dirent.name === 'config.ts' || dirent.name === 'config.tsx') {
        continue;
      }
      files.push(rel);
    }
  }

  return files;
}

// 读取 package.json 中的第三方依赖
async function getThirdPartyDependencies() {
  const pkgJsonPath = path.join(rootDir, 'package.json');
  const pkgJson = JSON.parse(await fs.readFile(pkgJsonPath, 'utf-8'));
  return pkgJson.dependencies ? Object.keys(pkgJson.dependencies) : [];
}

// 从文件内容中提取第三方依赖
function extractThirdPartyDepsFromContent(content, thirdPartyDeps) {
  const importRegex = /import\s+[^'";]+['"]([^'";]+)['"]/g;
  const deps = new Set();
  let match;

  while ((match = importRegex.exec(content))) {
    const dep = match[1];

    // 只处理顶层包，忽略相对路径和别名导入
    if (!dep.startsWith('.') && !dep.startsWith('@/')) {
      // 对于 scoped packages（如 @radix-ui/react-tabs），保留 scope/name
      const base = dep.startsWith('@')
        ? dep.split('/').slice(0, 2).join('/')
        : dep.split('/')[0];

      if (thirdPartyDeps.includes(base)) {
        deps.add(base);
      }
    }
  }

  return Array.from(deps);
}

// 从文件内容中提取注册表依赖
function extractRegistryDepsFromContent(content) {
  // registryDeps: 来自 @/registry/ 的依赖，需要添加 URL 前缀
  const registryDeps = new Set();
  // standardDeps: 来自 @/components/ 的依赖（包括 ui 和其他第三方库），不需要 URL 前缀
  const standardDeps = new Set();
  // lib 依赖单独记录，不作为 registryDependencies，而是内联到 files 中
  const libDeps = new Set();

  // 匹配 @/registry/components/xxx 或 @/registry/components/xxx/yyy
  const compImportRegex = /['"]@\/registry\/components\/([\w-\/]+)['"]/g;
  // 匹配 @/registry/ui/xxx
  const uiImportRegex = /['"]@\/registry\/ui\/([\w-]+)['"]/g;
  // 匹配 @/registry/lib/xxx
  const libImportRegex = /['"]@\/registry\/lib\/([\w-\/]+)['"]/g;
  // 通用匹配 @/components/{prefix}/{path}，支持 ui、reui、xxxui 等任何前缀
  const componentImportRegex = /['"]@\/components\/([\w-]+)\/([\w-\/]+)['"]/g;
  // 匹配 @/lib/utils（标准 shadcn/utils 路径）
  const standardLibImportRegex = /['"]@\/lib\/([\w-]+)['"]/g;

  // 处理组件依赖（来自 @/registry/components/）
  let match;
  while ((match = compImportRegex.exec(content))) {
    const depPath = match[1];
    // 将路径转换为组件名：例如 container-context-provider/context-provider -> container-context-provider
    const depName = depPath.split('/')[0];
    registryDeps.add(depName);
  }

  // 处理 UI 组件依赖（来自 @/registry/ui/）
  while ((match = uiImportRegex.exec(content))) {
    const uiName = match[1];
    registryDeps.add(uiName);
  }

  // 处理通用 components 依赖（来自 @/components/{prefix}/{path}）
  // 支持 ui、reui、xxxui 等任何前缀
  while ((match = componentImportRegex.exec(content))) {
    const prefix = match[1];
    const path = match[2];
    // 清理多余的斜杠
    const cleanPath = path.replace(/\/+/g, '/');

    if (prefix === 'ui') {
      // shadcn/ui 官方组件，直接使用组件名
      standardDeps.add(cleanPath.split('/')[0]);
    } else {
      // 第三方组件库（reui、xxxui 等），使用 @prefix/path 格式
      // 只取第一级目录名，例如 data-grid/data-grid-table -> data-grid
      const topLevelDir = cleanPath.split('/')[0];
      standardDeps.add('@' + prefix + '/' + topLevelDir);
    }
  }

  // 处理标准 shadcn/lib 依赖（来自 @/lib/xxx）
  // 跳过 utils，因为它是 shadcn/ui 的核心工具文件，每个项目都应该已经存在
  while ((match = standardLibImportRegex.exec(content))) {
    const libName = match[1];
    if (libName !== 'utils') {
      standardDeps.add('lib-' + libName);
    }
  }

  // 处理 lib 依赖（来自 @/registry/lib/xxx，内联到 files 中）
  while ((match = libImportRegex.exec(content))) {
    const libPath = match[1];
    // 直接使用 lib 路径，不添加 lib- 前缀
    libDeps.add(libPath);
  }

  // 返回包含三个数组（registry 依赖、标准依赖、lib 依赖）
  return { registryDeps: Array.from(registryDeps), standardDeps: Array.from(standardDeps), libDeps: Array.from(libDeps) };
}

// 新增：提取相对 CSS 导入（支持 .css 和 .module.css）
function extractRelativeCssImports(content, currentFileDir) {
  const cssImports = new Set(); // 使用 Set 去重
  // 匹配 import './xxx.css' 或 import styles from './xxx.module.css'
  const regex = /import[^'"]*['"](\.[^'"]*\.css)['"]/g;
  let match;
  while ((match = regex.exec(content))) {
    const relCssPath = match[1];
    const absCssPath = path.resolve(currentFileDir, relCssPath);
    cssImports.add(absCssPath);
  }
  return Array.from(cssImports);
}

// 提取相对路径的 TS/TSX 导入，返回基础路径（不带扩展名的）
function extractRelativeTsImports(content, currentFileDir) {
  const tsImports = new Set(); // 使用 Set 去重
  // 匹配 import xxx from './xxx' 或 import { xxx } from './xxx.tsx'
  const regex = /import[^'"]*['"](\.[^'"]*)['"]/g;
  let match;
  while ((match = regex.exec(content))) {
    const relPath = match[1];
    // 排除 .css, .json 等非 ts/tsx 文件
    if (relPath.endsWith('.css') || relPath.endsWith('.json') || relPath.endsWith('.scss')) {
      continue;
    }
    // 解析为绝对路径
    const absPath = path.resolve(currentFileDir, relPath);
    // 移除已有的扩展名，统一返回不带扩展名的路径
    const baseAbsPath = absPath.replace(/\.(ts|tsx|js|jsx)$/, '');
    tsImports.add(baseAbsPath);
  }
  return Array.from(tsImports);
}

// 检查文件是否存在（尝试不同扩展名）
async function findExistingFile(basePath) {
  const possibleExtensions = ['.tsx', '.ts', '.jsx', '.js'];
  const possiblePaths = [basePath, ...possibleExtensions.map(ext => basePath + ext)];
  for (const p of possiblePaths) {
    try {
      await fs.access(p);
      return p;
    } catch {
      continue;
    }
  }
  return null;
}

// 生成组件名称
function generateComponentName(folder, relativePath) {
  // 移除文件扩展名
  const nameWithoutExt = relativePath.replace(/\.(ts|tsx)$/, '');

  // 对于不同类型使用不同的命名策略
  if (folder === 'components') {
    // components/xxx/yyy.tsx -> xxx（只取第一级目录名）
    const parts = nameWithoutExt.split(path.sep);
    return parts[0];
  } else if (folder === 'ui') {
    // ui/button.tsx -> button
    return nameWithoutExt;
  } else if (folder === 'lib') {
    // lib/utils.ts -> utils（lib 文件不加前缀）
    return nameWithoutExt.replace(/\//g, '-');
  } else if (folder === 'blocks') {
    // blocks/form/form/form.tsx -> blocks-form（取最后一级目录名）
    const parts = nameWithoutExt.split(path.sep);
    return 'blocks-' + parts[parts.length - 1];
  }

  return nameWithoutExt.replace(/\//g, '-');
}

// 生成组件标题
function generateComponentTitle(name) {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// 构建主函数
async function buildRegistry() {
  console.log('🚀 开始构建 registry...\n');

  // 确保输出目录存在
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // 读取第三方依赖
  const thirdPartyDeps = await getThirdPartyDependencies();
  console.log(`📦 检测到 ${thirdPartyDeps.length} 个第三方依赖\n`);

  const items = [];

  // 遍历每个文件夹类型
  for (const [folder, type] of Object.entries(FOLDER_TYPE_MAP)) {
    const absFolder = path.join(REGISTRY_ROOT, folder);

    console.log(`📁 扫描 ${folder}/...`);

    try {
      const files = await getFilesRecursive(absFolder);

      for (const file of files) {
        // 生成组件名称
        const name = generateComponentName(folder, file);

        // 读取文件内容
        const absFilePath = path.join(absFolder, file);
        let fileContent = '';
        try {
          fileContent = await fs.readFile(absFilePath, 'utf-8');
        } catch (err) {
          console.error(`  ❌ 读取文件失败: ${absFilePath}`, err.message);
          continue;
        }

        // 提取依赖
        const allDeps = extractThirdPartyDepsFromContent(fileContent, thirdPartyDeps);
        const filteredDeps = allDeps.filter(dep => !SKIP_DEPENDENCIES.includes(dep));

        // 提取注册表依赖（分离 registry 依赖、标准依赖和 lib 依赖）
        const { registryDeps, standardDeps, libDeps } = extractRegistryDepsFromContent(fileContent);

        // 构建文件列表
        const fileList = [
          {
            path: folder === 'components'
              ? `registry/components/airiot/${file.replace(/\\/g, '/')}`
              : `registry/${folder}/${file.replace(/\\/g, '/')}`,
            type: type,
            content: fileContent,
          },
        ];

        // 添加 lib 依赖文件
        for (const libDep of libDeps) {
          // 尝试 .ts 和 .tsx 扩展名
          const libAbsPathTs = path.join(REGISTRY_ROOT, 'lib', libDep + '.ts');
          const libAbsPathTsx = path.join(REGISTRY_ROOT, 'lib', libDep + '.tsx');
          const libAbsPath = await findExistingFile(libAbsPathTs) || await findExistingFile(libAbsPathTsx);

          if (!libAbsPath) {
            console.warn(`  ⚠️  无法找到 lib 文件: ${libDep}`);
            continue;
          }

          // 确定输出路径和类型
          const ext = path.extname(libAbsPath);
          const libPath = `registry/lib/${libDep}${ext}`;

          try {
            const libContent = await fs.readFile(libAbsPath, 'utf-8');
            fileList.push({
              path: libPath,
              type: 'registry:lib',
              content: libContent,
            });
            console.log(`    📄 添加 lib 文件: ${libPath}`);
          } catch (err) {
            console.warn(`  ⚠️  无法读取 lib 文件: ${libAbsPath}`);
          }
        }

        // 新增：添加相对导入的 CSS 文件
        const currentFileDir = path.dirname(absFilePath);
        const cssAbsPaths = extractRelativeCssImports(fileContent, currentFileDir);

        for (const absCssPath of cssAbsPaths) {
          try {
            const cssContent = await fs.readFile(absCssPath, 'utf-8');

            // 计算在 registry 中的路径
            const relCssFromFolder = path.relative(absFolder, absCssPath);
            const registryCssPath = folder === 'components'
              ? `registry/components/airiot/${relCssFromFolder.replace(/\\/g, '/')}`
              : `registry/${folder}/${relCssFromFolder.replace(/\\/g, '/')}`;

            fileList.push({
              path: registryCssPath,
              type: 'registry:style',
              content: cssContent.trim(),
            });

            console.log(`    📄 添加样式文件: ${registryCssPath}`);
          } catch (err) {
            console.warn(`  ⚠️  无法读取 CSS 文件: ${absCssPath} (被 ${file} 导入)`);
          }
        }

        // 添加相对导入的 TS/TSX 文件
        const tsAbsPaths = extractRelativeTsImports(fileContent, currentFileDir);

        for (const absTsPath of tsAbsPaths) {
          const existingPath = await findExistingFile(absTsPath);
          if (!existingPath) continue;

          try {
            const tsContent = await fs.readFile(existingPath, 'utf-8');

            // 计算在 registry 中的路径
            const relTsFromFolder = path.relative(absFolder, existingPath);
            const registryTsPath = folder === 'components'
              ? `registry/components/airiot/${relTsFromFolder.replace(/\\/g, '/')}`
              : `registry/${folder}/${relTsFromFolder.replace(/\\/g, '/')}`;

            // 避免重复添加（已经在 fileList 中的文件不再添加）
            if (!fileList.some(f => f.path === registryTsPath)) {
              fileList.push({
                path: registryTsPath,
                type: existingPath.endsWith('.css') ? 'registry:style' : type,
                content: tsContent,
              });
              console.log(`    📄 添加依赖文件: ${registryTsPath}`);
            }
          } catch (err) {
            console.warn(`  ⚠️  无法读取 TS/TSX 文件: ${existingPath} (被 ${file} 导入)`);
          }
        }

        // 构建注册表项
        // registryDeps: 来自 @/registry/ 的依赖，添加 URL 前缀
        // standardDeps: 来自 @/components/ 的依赖（包括 ui、reui、xxxui 等），不添加 URL 前缀
        const processedRegistryDeps = [
          ...registryDeps.map(dep => dep.startsWith('http') ? dep : `${REGISTRY_URL}/${dep}.json`),
          ...standardDeps,
        ];

        const item = {
          name,
          type,
          title: generateComponentTitle(name),
          description: `${generateComponentTitle(name)} - ${type === 'registry:component' ? '组件' : type === 'registry:lib' ? '工具库' : '区块'}`,
          dependencies: filteredDeps,
          registryDependencies: processedRegistryDeps,
          files: fileList,
        };

        items.push(item);

        // 写入单个组件的 JSON 文件
        const componentJsonPath = path.join(OUTPUT_DIR, `${name}.json`);
        await fs.writeFile(componentJsonPath, JSON.stringify(item, null, 2));

        console.log(`  ✓ ${name} (${filteredDeps.length} deps, ${registryDeps.length} registry deps, ${standardDeps.length} component deps, ${libDeps.length} lib files, ${cssAbsPaths.length} css files, ${tsAbsPaths.length} ts files)`);
      }
    } catch (e) {
      console.error(`  ⚠️  跳过文件夹 ${folder}:`, e.message);
    }
  }

  // 构建最终的 registry.json
  const registry = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'Airiot UI Library',
    homepage: 'https://airiot.cn/ui',
    items: items,
  };

  await fs.writeFile(REGISTRY_OUTPUT_FILE, JSON.stringify(registry, null, 2));
  console.log(`\n✅ Registry 已生成: ${REGISTRY_OUTPUT_FILE}`);
  console.log(`\n📊 统计:`);
  console.log(`  - 总计 ${items.length} 个组件`);
  console.log(`  - components: ${items.filter(i => i.type === 'registry:component').length}`);
  console.log(`  - ui: ${items.filter(i => i.type === 'registry:ui').length}`);
  console.log(`  - lib: ${items.filter(i => i.type === 'registry:lib').length}`);
  console.log(`  - blocks: ${items.filter(i => i.type === 'registry:block').length}`);
  console.log('\n✨ 构建完成!\n');
}

// 执行构建
buildRegistry().catch(console.error);