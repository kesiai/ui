/**
 * 从各组件的 config.tsx 批量生成 schema.json（编辑器属性面板数据源）
 *
 * 用法：npm run gen:schemas
 * - 仅处理「有 config.tsx 且尚无 schema.json」的组件目录（已有 schema.json 的视为手工维护，不覆盖）
 * - 提取方式：esbuild 把 config.tsx 转译为 JS（剥掉 TS 类型/JSX），stub 掉 import 后真实执行
 *   模块顶层——propsConfig 里引用的顶层 const（layoutPresets/exampleSvg）、工具函数（_r）、
 *   `as const` 断言等全部自然求值，无需逐个 regex
 * - displayName/category 取自 ComponentConfig（id/name），category 沿用编辑器 deriveCategory 前缀规则
 * - jsxName/importCode 从原始 config.tsx 顶部的组件本体 import 提取（路径重写同 build-registry 规则）
 * - props 只保留编辑器认识的字段；不可序列化的 default（函数/stub）自动丢弃
 * - 解析失败的组件跳过并汇总报告，不中断批次
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformSync } from 'esbuild';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const COMPONENTS_DIR = path.join(ROOT, 'src/registry/components');

const toPascalCase = (s) =>
  s
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');

/** 与编辑器 transform.ts deriveCategory 保持一致的前缀规则 */
function deriveCategory(id) {
  if (id.startsWith('container-')) return 'containers';
  if (id.startsWith('datasource-')) return 'data-source';
  if (id.startsWith('form-')) return 'form';
  if (id.startsWith('view-')) return 'view';
  if (id.startsWith('gis-')) return 'gis';
  if (id.startsWith('video-')) return 'video';
  if (id.startsWith('mobile-')) return 'mobile';
  if (id.startsWith('model-3d')) return '3d';
  if (id.startsWith('flow-')) return 'flow';
  if (id.startsWith('chart-')) return 'chart';
  const basic = ['button', 'text', 'image', 'status', 'statuses', 'bar', 'iframe', 'textarea', 'shadcn-button', 'connect-widget', 'svg'];
  if (basic.includes(id)) return 'basic';
  return 'business';
}

/** 深度安全的 stub：任意属性访问/调用都返回自身（顶替被剥掉的 import；JSON 序列化时按函数丢弃） */
const STUB = new Proxy(function stub() {}, {
  get(_t, key) {
    if (key === Symbol.toPrimitive) return () => '';
    if (key === 'toString') return () => '';
    return STUB;
  },
  apply: () => STUB,
});

/** 解析 import 语句绑定的本地名（default / { A, B as C } / namespace），用于生成 stub 声明 */
function collectImportedNames(tsxSource) {
  const names = new Set(['React']);
  const re = /import\s+([^'";]+?)\s*from\s*['"][^'"]*['"]|import\s+(\w+)\s*['"][^'"]*['"]/g;
  let m;
  while ((m = re.exec(tsxSource))) {
    const clause = (m[1] || m[2] || '').trim();
    if (m[2]) {
      names.add(m[2]); // 副作用 import 的具名（罕见）
      continue;
    }
    // default 名
    const parts = clause.split(',').map((s) => s.trim()).filter(Boolean);
    for (const part of parts) {
      if (part.startsWith('*')) {
        const ns = part.split(' as ')[1]?.trim();
        if (ns) names.add(ns);
      } else if (part.startsWith('{')) {
        for (const spec of part.slice(1, -1).split(',')) {
          const local = spec.split(' as ')[1]?.trim() || spec.trim();
          if (local && /^[A-Za-z_$][\w$]*$/.test(local)) names.add(local);
        }
      } else if (/^[A-Za-z_$][\w$]*$/.test(part)) {
        names.add(part);
      }
    }
  }
  return names;
}

/** 执行 config.tsx 模块顶层，返回 { props, cfg }（props = xxxPropsConfig 数组，cfg = ComponentConfig 对象） */
function evalConfigSource(tsxSource) {
  // 1. 从原始源码定位导出名（esbuild 输出后名字不变，但 import 行会被剥掉）
  const propsMatch = tsxSource.match(/(?:export\s+)?const\s+(\w+PropsConfig)\s*=/);
  const cfgMatch = tsxSource.match(/(?:export\s+)?const\s+(\w+)\s*:\s*ComponentConfig\s*=/);
  if (!cfgMatch) throw new Error('未找到 ComponentConfig 导出');

  // 2. 转译：剥 TS 类型/断言，JSX 转 createElement（renderPreview 仅定义不调用）
  let js = transformSync(tsxSource, { loader: 'tsx', format: 'esm', jsx: 'transform' }).code;

  // 3. 剥掉 import/export 语句（配合 stub 声明顶替被移除的绑定）
  js = js
    .replace(/import\s*['"][^'"]*['"];?/g, '')
    .replace(/import\s[\s\S]*?from\s*['"][^'"]*['"];?/g, '')
    .replace(/export\s+(?=(const|let|var|function|class)\b)/g, '')
    .replace(/export\s*\{[^}]*\}\s*;?/g, '')
    .replace(/export\s+default\s+/g, 'var __kesi_default = ');

  // 4. 生成 stub 声明 + 执行（文件内已真实声明的名字不 stub，避免重复声明）
  const stubDecls = [...collectImportedNames(tsxSource)]
    .filter((n) => !new RegExp(`\\b(?:const|let|var|function|class)\\s+${n}\\b`).test(js))
    .map((n) => `const ${n} = __STUB__;`)
    .join('\n');
  const tail = `
    return {
      props: typeof ${propsMatch?.[1] ?? 'undefined'} !== 'undefined' && ${propsMatch ? propsMatch[1] : 'false'} ? ${propsMatch?.[1] ?? 'null'} : null,
      cfg: typeof ${cfgMatch[1]} !== 'undefined' ? ${cfgMatch[1]} : null,
    };
  `;
  // eslint-disable-next-line no-new-func -- 输入为本仓库自有 config.tsx 的转译产物
  const run = new Function('__STUB__', `${stubDecls}\n${js}\n${tail}`);
  return run(STUB);
}

/** 值可否安全写入 JSON schema（函数/stub 丢弃） */
function serializable(v) {
  if (v === undefined || v === null) return true;
  const t = typeof v;
  return t === 'string' || t === 'number' || t === 'boolean' || Array.isArray(v);
}

/** 只保留编辑器认识的字段，并归一 options */
function normalizeProp(p) {
  if (!p || typeof p.name !== 'string') return null;
  const out = { name: p.name, label: typeof p.label === 'string' ? p.label : p.name };
  if (typeof p.type === 'string') out.type = p.type;
  if (serializable(p.default) && (typeof p.default !== 'object' || p.default === null)) out.default = p.default;
  else if (Array.isArray(p.default)) out.default = p.default;
  if (typeof p.description === 'string' && p.description) out.description = p.description;
  if (typeof p.placeholder === 'string' && p.placeholder) out.placeholder = p.placeholder;
  if (typeof p.min === 'number') out.min = p.min;
  if (typeof p.max === 'number') out.max = p.max;
  if (Array.isArray(p.options)) {
    const options = p.options
      .filter((o) => o && serializable(o.value))
      .map((o) => ({
        value: o.value,
        label: typeof o.label === 'string' ? o.label : String(o.value),
      }));
    if (options.length) out.options = options;
  }
  return out;
}

/** 从原始 config.tsx 顶部 import 提取 jsxName 与安装后的模块路径 */
function extractImportInfo(tsxSource, dir) {
  const re = /import\s+\{([^}]+)\}\s+from\s+'([^']+)'/g;
  let jsxName = null;
  let modulePath = null;
  let m;
  while ((m = re.exec(tsxSource))) {
    const names = m[1].split(',').map((s) => s.trim()).filter(Boolean);
    const source = m[2];
    const candidate = names.find((n) => /^[A-Z]/.test(n) && !['React', 'ComponentConfig', 'LucideIcon'].includes(n));
    if (!candidate) continue;
    if (source.startsWith('@/registry/components/')) {
      return { jsxName: candidate, modulePath: source.replace('@/registry/components/', '@/components/kesi/') };
    }
    if (!jsxName) {
      jsxName = candidate;
      modulePath = `@/components/kesi/${dir}/${dir}`;
    }
  }
  if (!jsxName) {
    jsxName = toPascalCase(dir);
    modulePath = `@/components/kesi/${dir}/${dir}`;
  }
  return { jsxName, modulePath };
}

const generated = [];
const skippedNoConfig = [];
const skippedExisting = [];
const failures = [];

for (const dir of fs.readdirSync(COMPONENTS_DIR).sort()) {
  const dirPath = path.join(COMPONENTS_DIR, dir);
  if (!fs.statSync(dirPath).isDirectory()) continue;
  const configPath = path.join(dirPath, 'config.tsx');
  const schemaPath = path.join(dirPath, 'schema.json');

  if (fs.existsSync(schemaPath)) {
    skippedExisting.push(dir);
    continue;
  }
  if (!fs.existsSync(configPath)) {
    skippedNoConfig.push(dir);
    continue;
  }
  // 无组件源码的目录（如 view-demo 只有 config.tsx + md，不产出 registry 条目）不生成
  const hasComponentSource = fs
    .readdirSync(dirPath)
    .some((f) => /\.(tsx|ts)$/.test(f) && f !== 'config.tsx');
  if (!hasComponentSource) {
    skippedNoConfig.push(`${dir}（无组件源码）`);
    continue;
  }

  try {
    const tsxSource = fs.readFileSync(configPath, 'utf8');
    const { props, cfg } = evalConfigSource(tsxSource);

    const displayName = typeof cfg?.name === 'string' && !cfg.name.includes('STUB') ? cfg.name : null;
    if (!displayName) throw new Error('未找到组件中文名（ComponentConfig.name）');
    const componentId = typeof cfg?.id === 'string' ? cfg.id : dir;

    const propList = (Array.isArray(props) ? props : [])
      .map(normalizeProp)
      .filter(Boolean);

    const { jsxName, modulePath } = extractImportInfo(tsxSource, dir);

    const schema = {
      displayName,
      category: deriveCategory(componentId),
      defaultCode: `<${jsxName} />`,
      importCode: `import { ${jsxName} } from '${modulePath}';`,
    };
    if (propList.length) schema.props = propList;

    fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2) + '\n');
    generated.push(`${dir} (${displayName}, ${propList.length} props)`);
  } catch (e) {
    failures.push(`${dir}: ${e.message}`);
  }
}

console.log(`✅ 生成 ${generated.length} 个 schema.json：`);
generated.forEach((g) => console.log(`  - ${g}`));
if (skippedExisting.length) console.log(`\n⏭️  已有 schema.json 跳过（手工维护）: ${skippedExisting.join(', ')}`);
if (skippedNoConfig.length) console.log(`\n⚠️  无 config.tsx（本次不生成，编辑器走源码推断）: ${skippedNoConfig.join(', ')}`);
if (failures.length) {
  console.log(`\n❌ 解析失败 ${failures.length} 个：`);
  failures.forEach((f) => console.log(`  - ${f}`));
  process.exitCode = 1;
}
