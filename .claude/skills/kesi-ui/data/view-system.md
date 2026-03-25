# 视图系统完整使用指南

## 简介

视图系统是一组协同工作的组件，用于展示和管理数据库数据。所有视图组件都必须在 `ViewModel` 容器内使用，形成一个完整的数据展示和管理系统。

## 系统架构

```
ViewModel (最外层容器)
├── ViewDataTable (核心表格)
├── ViewFilter (过滤器)
├── ViewPagination (分页器)
├── ViewActions (操作栏)
├── ViewAdvancedFilter (高级过滤器)
├── ViewBatch (批量操作)
├── ViewDataAggregate (数据聚合)
├── ViewDetail (详情视图)
├── ViewField (字段展示)
└── ViewTools (工具栏)
```

## 基础使用

### 最小可用组合

```tsx
import { ViewModel } from '@/components/kesi/view-model/view-model';
import { ViewDataTable } from '@/components/kesi/view-data-table/view-data-table';
import { ViewFilter } from '@/components/kesi/view-filter/view-filter';
import { ViewPagination } from '@/components/kesi/view-pagination/view-pagination';
import { ViewActions } from '@/components/kesi/view-actions/view-actions';

function BasicTableView() {
  return (
    <ViewModel
      model="user"  // 数据模型
      pagination={true}  // 启用分页
    >
      <ViewDataTable />

      <ViewFilter />

      <ViewActions>
        <ViewAction>新增</ViewAction>
        <ViewAction>编辑</ViewAction>
        <ViewAction>删除</ViewAction>
      </ViewActions>

      <ViewPagination />
    </ViewModel>
  );
}
```

### 完整功能组合

```tsx
import {
  ViewModel
} from '@/components/kesi/view-model/view-model';
import {
  ViewDataTable
} from '@/components/kesi/view-data-table/view-data-table';
import {
  ViewFilter
} from '@/components/kesi/view-filter/view-filter';
import {
  ViewPagination
} from '@/components/kesi/view-pagination/view-pagination';
import {
  ViewActions
} from '@/components/kesi/view-actions/view-actions';
import {
  ViewAdvancedFilter
} from '@/components/kesi/view-advanced-filter/view-advanced-filter';
import {
  ViewBatch
} from '@/components/kesi/view-batch/view-batch';
import {
  ViewDataAggregate
} from '@/components/kesi/view-data-aggregate/view-data-aggregate';
import {
  ViewDetail
} from '@/components/kesi/view-detail/view-detail';
import {
  ViewField
} from '@/components/kesi/view-field/view-field';
import {
  ViewTools
} from '@/components/kesi/view-tools/view-tools';

function CompleteViewSystem() {
  return (
    <ViewModel
      model="order"
      pagination={true}
      aggregation={true}
      rowSelection={true}
      onSelectionChange={handleSelectionChange}
    >
      {/* 表格区域 */}
      <ViewDataTable
        columns={columns}
        scroll={{ x: 1000, y: 500 }}
      />

      {/* 过滤器区域 */}
      <ViewFilter />
      <ViewAdvancedFilter />

      {/* 聚统计区域 */}
      <ViewDataAggregate />

      {/* 操作区域 */}
      <ViewActions>
        <ViewAction onClick={handleAdd}>新增订单</ViewAction>
        <ViewAction onClick={handleEdit}>编辑</ViewAction>
        <ViewAction onClick={handleDelete}>删除</ViewAction>
        <ViewAction onClick={handleExport}>导出</ViewAction>
      </ViewActions>

      {/* 批量操作 */}
      <ViewBatch>
        <BatchAction>批量删除</BatchAction>
        <BatchAction>批量审核</BatchAction>
      </ViewBatch>

      {/* 分页 */}
      <ViewPagination
        showSizeChanger={true}
        showQuickJumper={true}
        showTotal={true}
      />

      {/* 详情面板 */}
      <ViewDetail
        title="订单详情"
        width={800}
        destroyOnClose={true}
      />

      {/* 字段配置 */}
      <ViewField />

      {/* 工具栏 */}
      <ViewTools>
        <ToolButton>刷新</ToolButton>
        <ToolButton>设置</ToolButton>
      </ViewTools>
    </ViewModel>
  );
}
```

## 组件详解

### ViewModel (父组件)

**必须作为最外层容器**，提供以下功能：
- 数据模型管理
- 分页控制
- 选择状态管理
- 全局配置

**关键 Props**:
```tsx
interface ViewModelProps {
  model: string;           // 数据模型名称
  pagination?: boolean;     // 是否启用分页
  aggregation?: boolean;   // 是否启用聚合
  rowSelection?: boolean;   // 是否启用行选择
  onSelectionChange?: (selectedKeys: string[]) => void;
}
```

### ViewDataTable (核心表格)

**显示数据的主体组件**，必须配合 ViewModel 使用。

### ViewFilter (基础过滤器)

提供基础的过滤功能，支持简单查询条件。

### ViewPagination (分页器)

提供分页功能，支持页码跳转和页码大小调整。

### ViewActions (操作栏)

提供表格行的操作按钮。

## 常见模式

### 1. 数据列表展示

```tsx
<ViewModel model="product">
  <ViewDataTable
    columns={[
      { title: '产品名称', dataIndex: 'name' },
      { title: '价格', dataIndex: 'price' },
      { title: '状态', dataIndex: 'status' }
    ]}
  />
  <ViewFilter />
  <ViewPagination />
</ViewModel>
```

### 2. 带选择的数据列表

```tsx
<ViewModel
  model="user"
  rowSelection={true}
  onSelectionChange={handleSelection}
>
  <ViewDataTable rowKey="id" />
  <ViewBatch>
    <BatchAction>批量删除</BatchAction>
    <BatchAction>批量启用</BatchAction>
  </ViewBatch>
  <ViewPagination />
</ViewModel>
```

### 3. 带详情的数据列表

```tsx
function UserListView() {
  return (
    <ViewModel model="user">
      <ViewDataTable />
      <ViewFilter />
      <ViewActions>
        <ViewAction onClick={() => setDetailVisible(true)}>查看详情</ViewAction>
      </ViewActions>
      <ViewPagination />

      {/* 详情弹窗 */}
      <ViewDetail
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
      >
        <UserDetailForm />
      </ViewDetail>
    </ViewModel>
  );
}
```

## 注意事项

1. **必须使用 ViewModel**：所有视图组件都必须放在 ViewModel 内部
2. **组件顺序**：建议按功能区域分组，提高代码可读性
3. **数据流**：数据从 ViewModel 流向各个子组件
4. **事件处理**：操作事件通过回调函数处理

## 最佳实践

1. **配置化**：将列配置、过滤条件等抽离为配置文件
2. **复用性**：创建可复用的视图包装组件
3. **性能优化**：大数据量时使用虚拟滚动
4. **用户体验**：提供加载状态和错误处理