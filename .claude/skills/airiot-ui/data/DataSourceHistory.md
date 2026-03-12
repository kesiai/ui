## DataSourceHistory - 历史数据源

### 导入路径
```tsx
import { DataSourceHistory } from '@/components/airiot/datasource-history/datasource-history'
```

### 基础用法
```tsx
import { DataSourceHistory } from '@/components/airiot/datasource-history/datasource-history'

function HistoryExample() {
  return (
    <DataSourceHistory
      historyId="user-history"
      maxItems={100}
      autoRefresh={true}
      refreshInterval={30000}
    >
      {/* 历史数据展示内容 */}
    </DataSourceHistory>
  )
}
```

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| historyId | string | - | 历史数据唯一标识 |
| maxItems | number | 100 | 最大存储条目数 |
| autoRefresh | boolean | true | 是否自动刷新 |
| refreshInterval | number | 30000 | 刷新间隔（毫秒） |
| timeRange | string | '1h' | 时间范围 |

### 示例
```tsx
import { DataSourceHistory, HistoryChart } from '@/components/airiot'

function UserHistory() {
  return (
    <DataSourceHistory
      historyId="user-activity"
      maxItems={500}
      timeRange="24h"
    >
      <HistoryChart
        type="line"
        showLegend={true}
        timeFormat="HH:mm"
      />
    </DataSourceHistory>
  )
}
```

### 注意事项
- 历史数据存储在本地存储中
- 超过 maxItems 的旧数据会被自动清理
- 支持多种时间范围：'1h', '24h', '7d', '30d'
- 首次加载时会从服务器获取历史数据