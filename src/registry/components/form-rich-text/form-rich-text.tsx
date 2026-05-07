import * as React from 'react'
import type { BaseFormFieldProps } from '@/registry/lib/base-form-props'
import { useEditor, EditorContent, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import FontFamily from '@tiptap/extension-font-family'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TipTapImage from '@tiptap/extension-image'
import { cn } from '@/lib/utils'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Undo2,
  Redo2,
  Heading1,
  Heading2,
  Heading3,
  ImagePlus,
  Table2,
  Highlighter,
  Palette,
} from 'lucide-react'

export interface FormRichTextProps extends Omit<BaseFormFieldProps, 'value' | 'onChange'> {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  defaultVal?: string
  defaultValType?: 'fixed' | 'logic'
  inList?: boolean
  title?: string
  ediforms?: boolean
  toolbar?: any
  record?: any
  [key: string]: any
}

const QUICK_COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#cccccc', '#ffffff',
  '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6fa8dc',
  '#8e7cc3', '#c27ba0', '#a64d79', '#85200c', '#1c4587', '#073763',
]

async function uploadImage(file: File): Promise<string | null> {
  const formData = new FormData()
  formData.append('file', file)
  const token = localStorage.getItem('token')
  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  try {
    const res = await fetch(`${window.location.origin}/core/media/img`, {
      method: 'POST',
      headers,
      body: formData,
    })
    const data = await res.json()
    if (data.url) return `${window.location.origin}${data.url}`
  } catch (err) {
    console.error('图片上传失败:', err)
  }
  return null
}

const ToolbarButton: React.FC<{
  onClick?: () => void
  isActive?: boolean
  disabled?: boolean
  title: string
  children: React.ReactNode
}> = ({ onClick, isActive, disabled, title, children }) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      'inline-flex items-center justify-center w-8 h-8 rounded-sm',
      'hover:bg-accent hover:text-accent-foreground',
      'disabled:opacity-40 disabled:pointer-events-none',
      'transition-colors',
      isActive && 'bg-accent text-accent-foreground',
    )}
  >
    {children}
  </button>
)

const ToolbarDivider = () => <div className="w-px h-6 bg-border mx-0.5" />

const ColorPickerButton: React.FC<{
  title: string
  icon: React.ReactNode
  getColor: () => string | undefined
  onColorChange: (color: string) => void
  onUnsetColor: () => void
}> = ({ title, icon, getColor, onColorChange, onUnsetColor }) => {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <ToolbarButton onClick={() => setOpen(!open)} title={title}>
        <div className="relative">
          {icon}
          <div
            className="absolute bottom-0 left-1 right-1 h-0.5 rounded-full"
            style={{ backgroundColor: getColor() || '#000000' }}
          />
        </div>
      </ToolbarButton>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-popover border border-border rounded-md shadow-lg p-3 z-50 min-w-45">
          <div className="grid grid-cols-6 gap-1.5 mb-2">
            {QUICK_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className="w-6 h-6 rounded-sm border border-border hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => { onColorChange(color); setOpen(false) }}
              />
            ))}
          </div>
          <div className="flex items-center gap-1 border-t border-border pt-2">
            <input
              type="color"
              className="w-6 h-6 cursor-pointer border-0 p-0"
              onChange={(e) => { onColorChange(e.target.value); setOpen(false) }}
            />
            <span className="text-xs text-muted-foreground">自定义</span>
            <button
              type="button"
              className="ml-auto text-xs text-muted-foreground hover:text-foreground"
              onClick={() => { onUnsetColor(); setOpen(false) }}
            >
              重置
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const EditorToolbar: React.FC<{
  editor: ReturnType<typeof useEditor> | null
  onImageUpload: (file: File) => void
}> = ({ editor, onImageUpload }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const state = useEditorState({
    editor,
    selector: (ctx) => {
      const ed = ctx.editor
      return {
        canUndo: ed ? ed.can().undo() : false,
        canRedo: ed ? ed.can().redo() : false,
      }
    },
  }) ?? { canUndo: false, canRedo: false }

  if (!editor) return null

  const setLink = () => {
    const url = window.prompt('请输入链接地址:')
    if (url) editor.chain().focus().setLink({ href: url }).run()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImageUpload(file)
      e.target.value = ''
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-2 py-1">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!state.canUndo} title="撤销">
        <Undo2 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!state.canRedo} title="重做">
        <Redo2 className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="标题1">
        <Heading1 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="标题2">
        <Heading2 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="标题3">
        <Heading3 className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="加粗">
        <Bold className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="斜体">
        <Italic className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="下划线">
        <UnderlineIcon className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarDivider />

      <ColorPickerButton
        title="字体颜色"
        icon={<Palette className="w-4 h-4" />}
        getColor={() => editor.getAttributes('textStyle').color}
        onColorChange={(color) => editor.chain().focus().setColor(color).run()}
        onUnsetColor={() => editor.chain().focus().unsetColor().run()}
      />
      <ColorPickerButton
        title="背景颜色"
        icon={<Highlighter className="w-4 h-4" />}
        getColor={() => editor.getAttributes('highlight').color}
        onColorChange={(color) => editor.chain().focus().toggleHighlight({ color }).run()}
        onUnsetColor={() => editor.chain().focus().unsetHighlight().run()}
      />

      <ToolbarDivider />

      <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} title="插入链接">
        <LinkIcon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => fileInputRef.current?.click()} title="插入图片">
        <ImagePlus className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="无序列表">
        <List className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="有序列表">
        <ListOrdered className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="引用">
        <Quote className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="插入表格">
        <Table2 className="w-4 h-4" />
      </ToolbarButton>

    </div>
  )
}

const Preview: React.FC<{
  value?: string
  inList?: boolean
  title?: string
}> = ({ value, inList, title }) => {
  const [visible, setVisible] = React.useState(false)
  const content = (
    <div
      dangerouslySetInnerHTML={{
        __html: value?.replace(/<a/g, '<a target="_Blank"') || '',
      }}
      className="prose prose-sm max-w-none"
    />
  )

  if (!inList || !value) return content

  return (
    <>
      <span
        style={{ cursor: 'pointer' }}
        onClick={() => setVisible(true)}
        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
      >
        <span className="mr-1">📄</span>
        <a>查看内容</a>
      </span>
      {visible && (
        <div
          className={cn(
            'fixed inset-0 z-50 flex items-center justify-center bg-black/50',
            'animate-in fade-in-0',
          )}
          onClick={() => setVisible(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 max-w-2xl max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">{title || '富文本内容'}</h3>
            {content}
            <button
              onClick={() => setVisible(false)}
              className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </>
  )
}

const FormRichText = React.forwardRef<HTMLDivElement, FormRichTextProps>(
  (props, ref) => {
    const {
      value,
      onChange,
      placeholder = '编辑富文本',
      disabled = false,
      defaultVal,
      defaultValType = 'fixed',
    } = props

    const editor = useEditor({
      extensions: [
        StarterKit,
        Underline,
        Link.configure({ openOnClick: false }),
        Placeholder.configure({ placeholder }),
        TextStyle,
        Color,
        Highlight.configure({ multicolor: true }),
        FontFamily,
        Table.configure({ resizable: false }),
        TableRow,
        TableCell,
        TableHeader,
        TipTapImage,
      ],
      content: value || (defaultVal && defaultValType !== 'logic' ? defaultVal : ''),
      onUpdate: ({ editor }) => {
        onChange?.(editor.getHTML())
      },
      editorProps: {
        attributes: {
          class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] px-4 py-3',
        },
      },
    })

    const handleImageUpload = React.useCallback(
      async (file: File) => {
        const url = await uploadImage(file)
        if (url && editor) {
          editor.chain().focus().setImage({ src: url }).run()
        }
      },
      [editor],
    )

    if (disabled) {
      return <Preview value={value} inList={props.inList} title={props.title} />
    }

    return (
      <div ref={ref} className="custom-text-editor border border-border rounded-md overflow-hidden">
        <EditorToolbar editor={editor} onImageUpload={handleImageUpload} />
        <EditorContent editor={editor} />
        <style>{`
          .custom-text-editor .tiptap img { max-width: 100%; height: auto; }
          .custom-text-editor .tiptap table { border-collapse: collapse; width: 100%; }
          .custom-text-editor .tiptap table td,
          .custom-text-editor .tiptap table th { border: 1px solid var(--border); padding: 4px 8px; min-width: 60px; }
          .custom-text-editor .tiptap table th { background-color: var(--muted); font-weight: 600; }
          .custom-text-editor .tiptap p.is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left;
            color: var(--muted-foreground);
            pointer-events: none;
            height: 0;
          }
        `}</style>
      </div>
    )
  },
)

FormRichText.displayName = 'FormRichText'

export { FormRichText }
