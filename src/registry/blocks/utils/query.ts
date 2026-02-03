/**
 * 获取查询过滤器（blocks 级别的通用方法）
 * TODO: 从 blocks 级别的 queryEditor.methods 获取实际的查询过滤器构建方法
 */
export const getQueryFilter = (initFilter: Record<string, any> = {}): Record<string, any> => {
  // 暂时直接返回 initFilter
  // 实际实现应该从 queryEditor.methods 获取
  return initFilter
}
