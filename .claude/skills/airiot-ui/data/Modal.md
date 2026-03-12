# Modal 模态框

## 导入路径

```tsx
import { Modal } from '@/components/airiot/container-modal/container-modal'
```

## 基础用法

```tsx
import { Modal } from '@/components/airiot/container-modal/container-modal'

function ModalExample() {
  return (
    <Modal
      title="模态框标题"
      description="模态框描述"
      open={isOpen}
      onOpenChange={setIsOpen}
      modalWidth={600}
    >
      {/* 模态框内容 */}
    </Modal>
  )
}
```

## Props

- `title` - 弹窗标题
- `description` - 弹窗描述
- `open` - 是否打开
- `onOpenChange` - 打开状态变化回调
- `modalWidth` - 弹窗宽度
- `modalHeight` - 弹窗高度
- `hiddenMask` - 隐藏遮罩 (默认: false)
- `destroyOnClose` - 关闭时销毁数据 (默认: false)

## 示例

### 自定义尺寸

```tsx
<Modal
  title="确认删除"
  description="确定要删除这条数据吗？"
  open={isDeleteModalOpen}
  onOpenChange={setIsDeleteModalOpen}
  modalWidth={800}
  modalHeight={600}
>
  <div>删除内容...</div>
</Modal>
```

## 注意事项
- 模态框使用Dialog组件实现
- 支持自定义宽度和高度
- 可以隐藏遮罩层