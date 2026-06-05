# KESI 前端项目视觉设计规范

> KESI 前端项目默认采用**炫酷数据大屏**风格，非中台管理系统风格。除非用户明确要求管理系统布局。

---

## 默认风格判断

| 判断项 | 大屏可视化（默认） | 中台管理系统 |
|--------|-------------------|-------------|
| 导航 | 顶部标题栏或无侧边栏 | 左侧侧边栏菜单 |
| 背景 | 深色渐变/粒子/科技感背景 | 浅色纯色背景 |
| 布局 | 全屏网格/自由定位 | 侧边栏 + 内容区 |
| 主色调 | 青蓝/科技蓝/赛博朋克紫 | 中性灰/品牌色 |
| 组件风格 | 发光边框、渐变、半透明 | 标准 Card、白色面板 |
| 字体 | 数字用等宽/科技字体 | 标准字体 |
| 适用场景 | IoT 数据监控、实时状态、数据展示 | 后台管理、数据录入、系统配置 |

**默认使用大屏可视化。** 仅当用户明确说"管理系统"、"后台"、"CRUD 管理平台"时才使用中台风格。

---

## 配色方案

### 暗色主题（默认）

```css
/* 背景层级 */
--bg-primary: #0a0e1a        /* 主背景 - 深蓝黑 */
--bg-secondary: #111827       /* 卡片/面板背景 */
--bg-tertiary: #1a2035        /* 内容区域背景 */

/* 主色调 */
--accent-primary: #00d4ff     /* 主强调色 - 科技青 */
--accent-secondary: #7c3aed   /* 辅助色 - 赛博紫 */
--accent-success: #10b981     /* 成功/在线 - 翠绿 */
--accent-warning: #f59e0b     /* 警告 - 琥珀 */
--accent-danger: #ef4444      /* 危险/报警 - 红色 */

/* 文字 */
--text-primary: #f0f4f8       /* 主文字 */
--text-secondary: #94a3b8     /* 辅助文字 */
--text-muted: #64748b         /* 弱化文字 */

/* 边框与分隔 */
--border-glow: rgba(0, 212, 255, 0.3)   /* 发光边框 */
--border-subtle: rgba(148, 163, 184, 0.1) /* 细微边框 */
```

### 备选配色

| 风格 | 主色 | 辅助色 | 适用场景 |
|------|------|--------|---------|
| 科技蓝 | `#00d4ff` | `#3b82f6` | 通用 IoT、设备监控 |
| 赛博紫 | `#a855f7` | `#6366f1` | 数据分析、AI 展示 |
| 翠绿 | `#10b981` | `#34d399` | 环境监测、能源管理 |
| 暖橙 | `#f97316` | `#fb923c` | 工业、生产监控 |

---

## 装饰元素

### 面板边框

大屏中的每个数据面板需要装饰性边框，分为三个层级：

```tsx
/* 层级1：主面板 - 带发光角标 */
.panel-primary {
  background: linear-gradient(135deg, rgba(17, 24, 39, 0.9), rgba(26, 32, 53, 0.8));
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

/* 层级2：次面板 - 简洁边框 */
.panel-secondary {
  background: rgba(17, 24, 39, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 6px;
}

/* 层级3：数据卡片 - 最轻量 */
.panel-tertiary {
  background: rgba(26, 32, 53, 0.4);
  border: 1px solid rgba(148, 163, 184, 0.05);
  border-radius: 4px;
}
```

### 科技感装饰

```tsx
/* 角标装饰 - 用于主面板四角 */
.corner-decoration::before,
.corner-decoration::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  border-color: var(--accent-primary);
}
.corner-decoration::before {
  top: -1px; left: -1px;
  border-top: 2px solid;
  border-left: 2px solid;
}
.corner-decoration::after {
  bottom: -1px; right: -1px;
  border-bottom: 2px solid;
  border-right: 2px solid;
}

/* 标题下划线 - 带渐变 */
.title-underline {
  position: relative;
}
.title-underline::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--accent-primary), transparent);
}

/* 扫描线动画 - 用于重要面板 */
@keyframes scan-line {
  0% { top: 0; }
  100% { top: 100%; }
}
.scan-effect::before {
  content: '';
  position: absolute;
  left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent-primary), transparent);
  animation: scan-line 4s linear infinite;
  opacity: 0.3;
}
```

---

## 布局模式

### 全屏大屏布局（默认）

```
┌─────────────────────────────────────────────────┐
│  LOGO     项目标题              时间/日期/天气   │  ← 顶部标题栏（半透明）
├───────────┬─────────────────────┬───────────────┤
│           │                     │               │
│  左侧面板  │     中央主区域       │   右侧面板     │
│  (统计卡)  │   (地图/主图表)      │  (列表/图表)   │
│           │                     │               │
│           │                     │               │
├───────────┴─────────────────────┴───────────────┤
│  底部状态栏（可选）                               │
└─────────────────────────────────────────────────┘
```

### 栅格布局

```tsx
/* 使用 CSS Grid 实现灵活的大屏布局 */
.grid-layout {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;     /* 左1 右2 中间主区 */
  grid-template-rows: auto 1fr auto;        /* 顶部 自适应 底部 */
  gap: 12px;
  height: 100vh;
  padding: 12px;
  background: var(--bg-primary);
}
```

---

## 数据展示规范

### 数字展示

```tsx
/* 大数字 - 用于关键指标 */
.number-large {
  font-family: 'DIN Alternate', 'Roboto Mono', monospace;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--accent-primary);
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
  letter-spacing: 2px;
}

/* 中等数字 - 用于统计卡片 */
.number-medium {
  font-family: 'DIN Alternate', 'Roboto Mono', monospace;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* 小数字 - 用于表格/列表 */
.number-small {
  font-family: 'Roboto Mono', monospace;
  font-size: 0.875rem;
  color: var(--text-secondary);
}
```

### 状态指示

```tsx
/* 在线状态 - 绿色呼吸点 */
.status-online {
  width: 8px; height: 8px;
  background: var(--accent-success);
  border-radius: 50%;
  box-shadow: 0 0 6px var(--accent-success);
  animation: pulse 2s ease-in-out infinite;
}

/* 离线状态 - 灰色 */
.status-offline {
  width: 8px; height: 8px;
  background: var(--text-muted);
  border-radius: 50%;
}

/* 报警状态 - 红色闪烁 */
.status-alarm {
  width: 8px; height: 8px;
  background: var(--accent-danger);
  border-radius: 50%;
  box-shadow: 0 0 6px var(--accent-danger);
  animation: blink 1s ease-in-out infinite;
}
```

### 进度条/占比

```tsx
/* 渐变进度条 */
.progress-bar {
  height: 6px;
  border-radius: 3px;
  background: rgba(148, 163, 184, 0.1);
  overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
  border-radius: 3px;
  box-shadow: 0 0 8px rgba(0, 212, 255, 0.3);
}
```

---

## 图表样式

### ECharts 通用配置

```typescript
const chartTheme = {
  backgroundColor: 'transparent',
  textStyle: {
    color: '#94a3b8',       // 文字颜色
    fontFamily: 'Roboto Mono, sans-serif',
  },
  title: {
    textStyle: {
      color: '#f0f4f8',
      fontSize: 14,
      fontWeight: 500,
    },
    left: 'center',
  },
  legend: {
    textStyle: { color: '#94a3b8' },
    pageTextStyle: { color: '#94a3b8' },
  },
  grid: {
    top: 40, right: 20, bottom: 30, left: 50,
    containLabel: true,
  },
  xAxis: {
    axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.2)' } },
    axisLabel: { color: '#64748b', fontSize: 11 },
    splitLine: { show: false },
  },
  yAxis: {
    axisLine: { show: false },
    axisLabel: { color: '#64748b', fontSize: 11 },
    splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.08)' } },
  },
  tooltip: {
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    borderColor: 'rgba(0, 212, 255, 0.2)',
    textStyle: { color: '#f0f4f8', fontSize: 12 },
  },
}

// 数据系列颜色
const seriesColors = [
  '#00d4ff', '#7c3aed', '#10b981', '#f59e0b',
  '#ef4444', '#a855f7', '#3b82f6', '#ec4899',
]
```

---

## 页面模板

### 大屏首页模板

```tsx
function DashboardPage() {
  return (
    <div className="grid-layout">
      {/* 顶部标题 */}
      <header className="col-span-3 flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <Logo />
          <h1 className="text-lg font-medium text-white">数据监控中心</h1>
        </div>
        <TimeDisplay />
      </header>

      {/* 左侧 - 统计卡片 */}
      <aside className="flex flex-col gap-3">
        <StatCard title="设备总数" value={128} />
        <StatCard title="在线率" value="96.8%" trend="up" />
        <StatCard title="报警数" value={3} variant="danger" />
      </aside>

      {/* 中央 - 主图表/地图 */}
      <main>
        <ChartPanel title="实时数据趋势">
          <ECharts option={lineChartOption} />
        </ChartPanel>
      </main>

      {/* 右侧 - 列表/排行 */}
      <aside className="flex flex-col gap-3">
        <RankingPanel title="设备在线排行" data={rankingData} />
        <AlarmListPanel data={alarms} />
      </aside>
    </div>
  )
}
```

---

## 动画规范

| 动画 | 用途 | 时长 |
|------|------|------|
| 数字滚动 | 数值变化时平滑过渡 | 800ms ease-out |
| 淡入 | 面板加载时 | 300ms ease-in |
| 呼吸 | 在线状态指示灯 | 2s ease-in-out infinite |
| 闪烁 | 报警/异常状态 | 1s ease-in-out infinite |
| 扫描线 | 重点面板装饰 | 4s linear infinite |
| 进度填充 | 进度条加载 | 1s ease-out |

**原则：动画要克制，不干扰数据阅读。** 每个页面同时进行的动画不超过 3 个。
