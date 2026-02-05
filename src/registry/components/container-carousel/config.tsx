import { Carousel } from '@/registry/components/container-carousel/carousel'
import { ComponentConfig } from '@/app/config/types'

export const carouselPropsConfig = [
  {
    name: 'autoplay',
    label: '自动滚动',
    type: 'boolean' as const,
    default: false,
    description: '开启滚动，轮播容器内容会自动滚动'
  },
  {
    name: 'autoplaySpeed',
    label: '停留时间（秒）',
    type: 'number' as const,
    default: 3,
    min: 1,
    max: 10,
    step: 0.5,
    description: '轮播容器开启自动滚动后，每一个轮播页面的停留时长'
  },
  {
    name: 'speed',
    label: '切换速度（秒）',
    type: 'number' as const,
    default: 0.5,
    min: 0.1,
    max: 2,
    step: 0.1,
    description: '轮播容器内内容轮播切换的时长'
  },
  {
    name: 'hideDots',
    label: '隐藏导航点',
    type: 'boolean' as const,
    default: false,
    description: '隐藏轮播容器播放时的导航点'
  },
  {
    name: 'arrows',
    label: '隐藏箭头',
    type: 'boolean' as const,
    default: false,
    description: '隐藏轮播容器左右两侧的箭头'
  },
  {
    name: 'draggable',
    label: '允许拖拽翻页',
    type: 'boolean' as const,
    default: true,
    description: '允许通过鼠标在轮播容器上方拖拽的形式翻页'
  },
  {
    name: 'vertical',
    label: '轮播方向',
    type: 'select' as const,
    default: 'horizontal',
    options: [
      { label: '水平', value: 'horizontal' },
      { label: '垂直', value: 'vertical' }
    ],
    description: '轮播容器轮播页滚动的方向'
  },
  {
    name: 'rtl',
    label: '轮播顺序',
    type: 'select' as const,
    default: 'sequence',
    options: [
      { label: '正序', value: 'sequence' },
      { label: '倒序', value: 'flashback' }
    ],
    description: '轮播容器轮播页滚动的顺序'
  },
  {
    name: 'cssEase',
    label: '轮播过渡',
    type: 'select' as const,
    default: 'ease',
    options: [
      { label: '渐变', value: 'ease' },
      { label: '线性', value: 'linear' }
    ],
    description: '设置轮播容器内组件轮播的过渡方式'
  }
]

export const carouselDefaultProps = {
  autoplay: false,
  autoplaySpeed: 3,
  speed: 0.5,
  hideDots: false,
  arrows: false,
  draggable: true,
  vertical: 'horizontal',
  rtl: 'sequence',
  cssEase: 'ease'
}

const renderCarouselPreview = (props: Record<string, any>) => {
  return (
    <div className="h-full flex items-center justify-center p-4" style={{ minHeight: '400px' }}>
      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6">
        <Carousel
          autoplay={props.autoplay}
          autoplaySpeed={props.autoplaySpeed}
          speed={props.speed}
          hideDots={props.hideDots}
          arrows={props.arrows}
          draggable={props.draggable}
          vertical={props.vertical}
          rtl={props.rtl}
          cssEase={props.cssEase}
          className="h-full"
        >
          <div className="flex items-center justify-center h-full bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg">
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">1</p>
              <p className="text-lg">第一页</p>
            </div>
          </div>
          <div className="flex items-center justify-center h-full bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-lg">
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">2</p>
              <p className="text-lg">第二页</p>
            </div>
          </div>
          <div className="flex items-center justify-center h-full bg-gradient-to-r from-pink-400 to-pink-600 text-white rounded-lg">
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">3</p>
              <p className="text-lg">第三页</p>
            </div>
          </div>
        </Carousel>
      </div>
    </div>
  )
}

const renderCarouselCodePreview = (props: Record<string, any>) => {
  let code = `<Carousel`
  const propsToShow: string[] = []

  if (props.autoplay) {
    propsToShow.push(`\n  autoplay={true}`)
    if (props.autoplaySpeed !== 3) {
      propsToShow.push(`\n  autoplaySpeed={${props.autoplaySpeed}}`)
    }
  }

  if (props.speed !== 0.5) {
    propsToShow.push(`\n  speed={${props.speed}}`)
  }

  if (props.hideDots) {
    propsToShow.push(`\n  hideDots={true}`)
  }

  if (props.arrows) {
    propsToShow.push(`\n  arrows={true}`)
  }

  if (!props.draggable) {
    propsToShow.push(`\n  draggable={false}`)
  }

  if (props.vertical !== 'horizontal') {
    propsToShow.push(`\n  vertical="${props.vertical}"`)
  }

  if (props.rtl !== 'sequence') {
    propsToShow.push(`\n  rtl="${props.rtl}"`)
  }

  if (props.cssEase !== 'ease') {
    propsToShow.push(`\n  cssEase="${props.cssEase}"`)
  }

  if (propsToShow.length > 0) {
    code += propsToShow.join('')
  }

  code += `\n>`
  code += `\n  <div>第一页内容</div>`
  code += `\n  <div>第二页内容</div>`
  code += `\n  <div>第三页内容</div>`
  code += `\n</Carousel>`

  return code
}

export const carouselConfig: ComponentConfig = {
  id: 'container-carousel',
  name: 'Carousel 轮播容器',
  propsConfig: carouselPropsConfig,
  defaultProps: carouselDefaultProps,
  renderPreview: renderCarouselPreview,
  renderCodePreview: renderCarouselCodePreview
}
