import { FileDownloadCard } from "@/registry/components/render-file-download-card/render-file-download-card"
import { ComponentConfig } from "@/app/config/types"
import documentationMd from "./render-file-download-card.md?raw"

export const renderFileDownloadCardConfig: ComponentConfig = {
  id: 'render-file-download-card',
  name: 'Render 文件下载卡片',
  propsConfig: [
    {
      name: 'filePath',
      label: '文件路径',
      type: 'text' as const,
      default: 'users/admin/deliver/hello.txt',
      description: '工作区根目录相对路径'
    },
    {
      name: 'fileName',
      label: '文件名',
      type: 'text' as const,
      default: 'hello.txt',
      description: '下载时显示的文件名（可选）'
    },
    {
      name: 'fileSize',
      label: '文件大小',
      type: 'text' as const,
      default: '1 KB',
      description: '文件大小（可选）'
    },
  ],
  defaultProps: {
    filePath: 'users/admin/deliver/hello.txt',
    fileName: 'hello.txt',
    fileSize: '1 KB',
  },
  renderPreview: (props: Record<string, any>) => {
    return (
      <div className="p-4">
        <FileDownloadCard
          agentId="demo-agent"
          filePath={props.filePath}
          fileName={props.fileName}
          fileSize={props.fileSize}
        />
      </div>
    )
  },
  renderCodePreview: (props: Record<string, any>) => {
    return `<FileDownloadCard\n  agentId="demo-agent"\n  filePath="${props.filePath}"\n  fileName="${props.fileName}"\n  fileSize="${props.fileSize}"\n/>`
  },
  documentation: documentationMd,
}

export default renderFileDownloadCardConfig
