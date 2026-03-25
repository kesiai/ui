import isNil from 'lodash/isNil'
import isString from 'lodash/isString'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const RichText = ({ value }: { value: any }) => {
  if (isNil(value)) return <span className="text-muted-foreground">空</span>
  // 简化版：显示纯文本内容
  const text = isString(value) ? value.replace(/<[^>]*>/g, '') : ''
  if (text.length > 100) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-help">{text.substring(0, 100)}...</span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-md break-word">{text}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
  return <span dangerouslySetInnerHTML={{ __html: value }} />
}

export { RichText }
