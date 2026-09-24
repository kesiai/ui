import type { FC } from 'react';

/**
 * 执行过程里的活动行共用视觉
 *
 * 思考行与工具调用行必须是同一套行样式（同一图标位、同一间距、同一截断），
 * 否则两类行混在一起会显得参差；所以样式常量放这里，两处都引它。
 */
export const ACTIVITY_ROW_BASE =
  'group/trigger text-muted-foreground hover:text-foreground flex items-center gap-2 py-1 text-sm transition-colors';

/** 思考行：沿用原来的 75% 上限（样式保持不变） */
export const ACTIVITY_ROW_CLASS = `${ACTIVITY_ROW_BASE} max-w-[75%]`;

/**
 * 运行中的文字 loading（纯 Tailwind className，不新增 CSS / 不注册主题 token）
 *
 * 做法：把文字逐字拆成 span，每个都挂内置的 `animate-pulse`（透明度 1 → 0.5 → 1），
 * 并按索引错开 `animation-delay` —— 于是在视觉上形成一条「透明度从左到右扫过」的波。
 * 延迟用任意值工具类 `[animation-delay:…]`；这些字符串必须以字面量写在这里，
 * Tailwind 扫描得到、才会生成对应规则（不要用 `${i*70}ms` 拼，那样扫不到）。
 *
 * 为什么不用进度条：对话流里细条既不显眼、又白占一行高度，文字本身就是最好的进度提示。
 */
const SHIMMER_DELAY_CLASSES = [
  '[animation-delay:0ms]',
  '[animation-delay:70ms]',
  '[animation-delay:140ms]',
  '[animation-delay:210ms]',
  '[animation-delay:280ms]',
  '[animation-delay:350ms]',
  '[animation-delay:420ms]',
  '[animation-delay:490ms]',
  '[animation-delay:560ms]',
  '[animation-delay:630ms]',
];

/** 超过这个长度就不逐字拆（几十个 span 没必要，退化成整体 pulse） */
const SHIMMER_MAX_CHARS = 24;

export const LoadingText: FC<{ text: string; className?: string }> = ({ text, className }) => {
  const chars = Array.from(text);
  if (chars.length > SHIMMER_MAX_CHARS) {
    return <span className={`animate-pulse ${className ?? ''}`}>{text}</span>;
  }
  return (
    <span className={className}>
      {chars.map((ch, i) => (
        <span key={i} className={`animate-pulse ${SHIMMER_DELAY_CLASSES[i % SHIMMER_DELAY_CLASSES.length]}`}>
          {ch}
        </span>
      ))}
    </span>
  );
};

export default LoadingText;
