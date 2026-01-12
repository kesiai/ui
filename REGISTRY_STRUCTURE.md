# 组件库 Registry 目录结构说明

## 概述

本组件库遵循 shadcn/ui 的 registry 规范,将组件分为 `components` 和 `blocks` 两大类。

## 目录结构

```
src/registry/
├── components/              # 基础 UI 组件
│   └── ui/                 # 原子级 UI 组件(可独立使用的基本元素)
│       ├── button/         # 按钮
│       ├── input/          # 输入框
│       ├── text/           # 单行文本
│       ├── text-area/      # 多行文本
│       ├── card/           # 卡片
│       ├── modal/          # 弹窗
│       ├── popover/        # 气泡卡片
│       ├── panel/          # 折叠面板
│       ├── tabs/           # 标签页
│       ├── slider/         # 轮播
│       ├── image/          # 图片
│       ├── table/          # 表格
│       ├── iframe/         # Iframe窗口
│       ├── html/           # HTML组件
│       ├── switch/         # 开关
│       ├── checkbox/       # 多选框
│       ├── radio/          # 单选框
│       ├── select/         # 下拉框
│       └── date/           # 日期选择器
│
├── blocks/                 # 复杂业务组件(由多个组件组成的复合组件)
│   ├── page-elements/      # 页面元素相关(22个组件)
│   │   ├── reg-widget-component/       # 注册组件
│   │   ├── language-change-widget/     # 切换语言
│   │   ├── front-menu/                 # 菜单
│   │   ├── user-menu/                  # 用户组
│   │   ├── user-name/                  # 用户名称
│   │   ├── profile/                    # 个人设置
│   │   ├── change-password/            # 修改密码
│   │   ├── service-time/               # 系统时间
│   │   ├── log-out/                    # 退出登录
│   │   ├── log-table-widget/           # 操作日志记录表
│   │   ├── scale-button/               # 画面缩放按钮
│   │   ├── load-component/             # 登录组件
│   │   ├── logout-component/           # 退出页面组件
│   │   ├── nav-tabs/                   # 标签导航
│   │   ├── new-menu/                   # 整体菜单
│   │   ├── warning-button/             # 报警铃铛
│   │   ├── warning-audio/              # 报警声音
│   │   ├── warning-bar/                # 报警卡片
│   │   ├── warning-notification/       # 报警弹窗
│   │   ├── auth-info-cards/            # 授权信息
│   │   └── message/                    # 消息
│   │
│   ├── business/            # 业务组件(13个组件)
│   │   ├── network-graph/             # 网络拓扑图
│   │   ├── point-table/               # 数据点选择器
│   │   ├── table-select/              # 表选择器
│   │   ├── table-data-select/         # 表记录选择器
│   │   ├── node-tree-select/          # 表记录选择树
│   │   ├── data-point-input/          # 写入数据点
│   │   ├── data-point/                # 设备数据点
│   │   ├── liquid-level/              # 液位
│   │   ├── bar/                       # 进度条
│   │   ├── ruler-comp/                # 标尺
│   │   ├── compute-status/            # 状态组件
│   │   ├── compute-statuses/          # 状态组件组
│   │   └── data-point-panel/          # 表数据点集
│   │
│   ├── form/                # 表单相关(22个组件)
│   │   ├── form/                      # 表单容器
│   │   ├── schema-form/               # 代码表单
│   │   ├── table-schema-form/         # 数据表表单
│   │   ├── form-input/                # 输入框
│   │   ├── form-input-number/         # 数字输入框
│   │   ├── form-radio/                # 单选框
│   │   ├── form-checkbox/             # 多选框
│   │   ├── form-select/               # 下拉框
│   │   ├── form-date/                 # 日期选择器
│   │   ├── form-switch/               # 开关
│   │   ├── form-slider/               # 滑动输入条
│   │   ├── form-widget/               # 表字段映射
│   │   ├── form-date-range/           # 日期范围
│   │   ├── form-upload/               # 附件
│   │   ├── form-map/                  # 定位
│   │   ├── form-area/                 # 区域
│   │   ├── form-rate/                 # 星级评价
│   │   ├── time-widget/               # 日历组件
│   │   └── user-form-widget/          # 用户表单
│   │
│   ├── view/                # 视图相关(16个组件)
│   │   ├── view-model/                # 表视图容器
│   │   ├── view-log/                  # 日志视图容器
│   │   ├── view-warning/              # 报警视图容器
│   │   ├── view-user/                 # 用户视图容器
│   │   ├── view-report/               # 报表视图容器
│   │   ├── view-detail/               # 查看视图
│   │   ├── view-data-table/           # 表数据
│   │   ├── view-filter/               # 过滤器
│   │   ├── view-advanced-filter/      # 高级过滤器
│   │   ├── view-pagination/           # 分页器
│   │   ├── view-actions/              # 表按钮
│   │   ├── view-operation/            # 批量按钮
│   │   ├── view-batch-operation/      # 批量按钮组
│   │   ├── view-batch-command/        # 批量指令
│   │   └── view-data-aggregate/       # 数据聚合
│   │
│   ├── chart/               # 图表相关(14个组件)
│   │   ├── chart-map/                 # 地图
│   │   ├── chart-line/                # 折线图
│   │   ├── chart-bar/                 # 柱状图
│   │   ├── chart-pictorial-bar/       # 象形柱图
│   │   ├── chart-pie/                 # 饼图
│   │   ├── chart-gauge/               # 仪表盘
│   │   ├── chart-scatter/             # 散点图
│   │   ├── chart-liquid-fill/         # 水球图
│   │   ├── chart-radar/               # 雷达图
│   │   ├── chart-mix/                 # 混合图
│   │   ├── report-reportwidget/       # 报表组件
│   │   ├── data-view-chart/           # 数据视图展示图表
│   │   └── sankey-chart/              # 能流图
│   │
│   ├── mobile/              # 移动端组件(9个组件)
│   │   ├── mobile-tab-bar/            # 标签栏
│   │   ├── mobile-list/               # 列表
│   │   ├── mobile-popup/              # 弹出框
│   │   ├── mobile-calendar/           # 日历
│   │   ├── mobile-date-picker/        # 时间选择器
│   │   ├── mobile-location/           # 定位
│   │   ├── mobile-nav-bar/            # 标题栏
│   │   ├── mobile-scan-qr/            # 二维码扫描
│   │   └── mobile-picker/             # 选择器
│   │
│   ├── 3d/                  # 三维组件(13个组件)
│   │   ├── model-3d/                  # 三维空间容器
│   │   ├── model-3d-mesh/             # 三维模型
│   │   ├── model-3d-card/             # 三维数据卡片
│   │   ├── model-3d-geometry-box/     # 正方体
│   │   ├── model-3d-geometry-sphere/  # 球体
│   │   ├── model-3d-geometry-circle/  # 圆
│   │   ├── model-3d-geometry-cone/    # 圆锥体
│   │   ├── model-3d-geometry-cylinder/# 圆柱体
│   │   ├── model-3d-geometry-plane/   # 平面
│   │   ├── model-3d-geometry-tube/    # 管
│   │   ├── model-3d-points/           # 粒子
│   │   └── model-3d-layout-3d/        # 三维组件组
│   │
│   ├── gis/                 # GIS组件(9个组件)
│   │   ├── map-container/             # 地图容器
│   │   ├── table-views/               # 数据表层
│   │   ├── warn-views/                # 报警层
│   │   ├── polygon-views/             # 区域层
│   │   ├── custom-views/              # 自定义层
│   │   ├── tool-views/                # 工具箱
│   │   ├── code-editor-views/         # 代码层
│   │   ├── playback-view/             # 数据回放层
│   │   └── polygon-split/             # 区域划分
│   │
│   ├── video/               # 视频组件(6个组件)
│   │   ├── video-widget/              # 视频
│   │   ├── button-widget/             # 云台控制按钮
│   │   ├── time-axis/                 # 视频时间轴
│   │   ├── isc-video/                 # ISC视频组件
│   │   ├── video-periods-widget/      # 录制计划
│   │   └── review-view-components/    # 视频回放
│   │
│   ├── advanced/            # 高级通用组件(14个组件)
│   │   ├── text-editor/               # 富文本
│   │   ├── upload-attachment/         # 附件上传
│   │   ├── show-attachment/           # 附件展示
│   │   ├── player/                    # 音频播放器
│   │   ├── custom-pagination/         # 通用分页器
│   │   ├── flop-number/               # 翻牌器
│   │   ├── led-number/                # LED数字
│   │   ├── time/                      # 时间
│   │   ├── qrcode/                    # 二维码
│   │   ├── svg/                       # 设备管线
│   │   ├── widgets-media/             # 媒体库
│   │   ├── widget-pdf-preivew/        # PDF预览
│   │   └── svg-editor/                # 绘图软件
│   │
│   └── containers/          # 基础容器组件(11个组件)
│       ├── app-page/                  # 内容区域
│       ├── layout-container/          # 组件组
│       ├── link/                      # 引用
│       ├── iteration/                 # 迭代
│       ├── resource/                  # 自定义组件
│       ├── resource-container/        # 自定义组件容器
│       ├── slot/                      # 组件内容区域
│       ├── slot-container/            # 组件内容区域容器
│       ├── connect-widget/            # 连线
│       └── react-widget/              # React组件
│
└── lib/                     # 工具库
```

## Components vs Blocks 的区别

### Components (基础组件)
- **位置**: `src/registry/components/ui/`
- **特点**: 原子级 UI 组件,可独立使用
- **示例**: Button, Input, Card, Modal 等
- **用途**: 作为构建块,用于组装更复杂的组件

### Blocks (复杂组件)
- **位置**: `src/registry/blocks/`
- **特点**: 由多个组件组成的复合组件或复杂业务组件
- **示例**: FrontMenu, DataPointTable, ChartMap 等
- **用途**: 完整的功能模块,可直接使用

## 组件 Registry 配置

每个组件文件夹下都有 `registry-item.json` 配置文件:

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "component-name",
  "type": "registry:component",
  "title": "Component Title",
  "description": "Component description",
  "registryDependencies": ["dependency1", "dependency2"],
  "dependencies": [],
  "files": [
    {
      "path": "registry/.../component.tsx",
      "type": "registry:component"
    }
  ]
}
```

### 字段说明:
- **name**: 组件的唯一标识符(kebab-case)
- **type**: 组件类型 (registry:component, registry:ui, registry:hook 等)
- **title**: 组件的显示标题
- **description**: 组件的描述信息
- **registryDependencies**: 该组件依赖的其他组件(从本组件库中)
- **dependencies**: 该组件依赖的外部 npm 包
- **files**: 组件包含的文件列表

## 统计信息

- **基础 UI 组件**: 21 个
- **复杂业务组件**: 139 个
- **总计**: 160 个组件

## 下一步

1. 在每个组件文件夹中创建对应的 `.tsx` 实现文件
2. 根据需要创建 `hooks/` 子目录存放自定义 hooks
3. 根据需要创建 `components/` 子目录存放子组件
4. 更新组件实现后,可以使用 shadcn CLI 安装和测试组件

## 参考资料

- [shadcn/ui Registry 规范](https://ui.shadcn.com/docs/registry)
- [shadcn/ui Blocks 文档](https://ui.shadcn.com/docs/blocks)
- [shadcn/ui Namespaces](https://ui.shadcn.com/docs/registry/namespace)
