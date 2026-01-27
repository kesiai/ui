import React from 'react';
import AntdIcon, * as iconsMap from '@ant-design/icons';
import _ from 'lodash';

const fillTester = /-fill$/;
const outlineTester = /-o$/;
const twoToneTester = /-twotone$/;

function removeTypeTheme(type) {
  return type.replace(fillTester, '').replace(outlineTester, '').replace(twoToneTester, '');
}
const themeMap = {
  filled: 'filled',
  outlined: 'outlined',
  twoTone: 'twoTone'
};
function withThemeSuffix(type, theme) {
  let result = _.upperFirst(_.camelCase(type));
  let realTheme = _.upperFirst(themeMap[theme]);

  return result + realTheme;
} // For alias or compatibility

function alias(type) {
  let newType = type;

  switch (type) {
    case 'cross':
      newType = 'close';
      break;
    // https://github.com/ant-design/ant-design/issues/13007

    case 'interation':
      newType = 'interaction';
      break;
    // https://github.com/ant-design/ant-design/issues/16810

    case 'canlendar':
      newType = 'calendar';
      break;
    // https://github.com/ant-design/ant-design/issues/17448

    case 'colum-height':
      newType = 'column-height';
      break;

    default:
  }
  return newType;
}

const defaultColors = {
  primaryColor: '#FFFFFF',
  secondaryColor: '#FFFFFF',
}

const IconContext = React.createContext({})

const LegacyTypeIcon = ({ type, theme, ...props }) => {
  var computedType = withThemeSuffix(removeTypeTheme(alias(type)), theme || 'outlined');
  var targetIconComponent = iconsMap[computedType];
  return targetIconComponent ? React.createElement(targetIconComponent, props) : null;
};

// 工具函数：处理SVG源（兼容字符串和Module）
const getSvgString = (svg) => {
  if (!svg) return '';
  // 如果是Module（判断是否有default属性且为字符串）
  if (typeof svg === 'object' && 'default' in svg && typeof svg.default === 'string') {
    return svg.default;
  }
  // 如果是字符串直接返回（过滤非字符串类型）
  return typeof svg === 'string' ? svg : '';
};

// 工具函数：安全替换颜色（处理正则特殊字符）
const replaceColor = (svgStr, oldColor, newColor) => {
  if (!svgStr || !oldColor || !newColor) return svgStr;
  // 转义正则特殊字符（比如#、.等）
  const escapedOldColor = oldColor.replace(/[#$.+*?{}()[\]\\]/g, '\\$&');
  return svgStr.replace(new RegExp(escapedOldColor, 'g'), newColor);
};

export default ({ type, name, svg, ...props }) => {
  const { place } = React.useContext(IconContext)
  // const { settings = {} } = use('settings')
  const theme = {}

  if (svg) {
    // 1. 处理SVG源（兼容字符串和Module）
    const svgStr = getSvgString(svg);
    if (!svgStr) {
      console.error('无效的SVG参数，必须是字符串或默认导出为字符串的Module');
      return <AntdIcon {...props} style={{ width: '1em', height: '1em' }} />;
    }

    // 2. 处理颜色配置
    let colors = theme.iconColors || defaultColors;
    if (place && colors[place]) {
      colors = colors[place];
    }
    // 确保colors有必要的颜色属性
    const finalColors = { ...defaultColors, ...colors };

    // 3. 安全替换颜色
    const processedSvg = replaceColor(
      replaceColor(svgStr, defaultColors.primaryColor, finalColors.primaryColor),
      defaultColors.secondaryColor,
      finalColors.secondaryColor
    );

    return (
      <AntdIcon
        {...props}
        style={{ width: '1em', height: '1em' }}
        component={(ps) => (
          <div
            className="custom-icon"
            {...ps}
            dangerouslySetInnerHTML={{ __html: processedSvg }}
          />
        )}
      />
    );
  } else if (type || name) {
    return <LegacyTypeIcon type={type || name} {...props} />
  }

  return <AntdIcon />
}

export {
  IconContext
}
