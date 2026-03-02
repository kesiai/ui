// 定义省市区数据的类型（和组件中 PCAItem 类型完全一致，确保类型统一）
export interface PCAItem {
  label: string;
  value: string;
  children?: PCAItem[];
}

/**
 * 加载省市区数据（异步加载 pca.json）
 * @returns Promise<PCAItem[]> 省市区层级数据数组
 */
const loadPCAData = async (): Promise<PCAItem[]> => {
  // 导入 pca.json 并指定类型为 PCAItem[]
  const { default: largeData } = await import('@/registry/components/form-area/pca.json') as {
    default: PCAItem[];
  };
  return largeData;
};

// 保持原有导出结构，兼容旧代码
export { loadPCAData };

// 默认导出空数组（保持和原 js 文件一致的导出行为）
export default [] as PCAItem[];