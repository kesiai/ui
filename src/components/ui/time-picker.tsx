import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Clock, ChevronDownIcon, CheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  format,
  parse,
  setHours,
  startOfHour,
  endOfHour,
  setMinutes,
  startOfMinute,
  endOfMinute,
  setSeconds,
  startOfDay,
  endOfDay,
  addHours,
  subHours,
  setMilliseconds,
} from 'date-fns';

interface SimpleTimeOption {
  value: any;
  label: string;
  disabled?: boolean;
}

const AM_VALUE = 0;
const PM_VALUE = 1;

export function TimePicker({
  value,
  onChange,
  use12HourFormat,
  min,
  max,
  disabled,
  modal,
  inline = false,
  onOpenChange,
}: {
  use12HourFormat?: boolean;
  value?: Date;
  onChange?: (date: Date) => void;
  min?: Date;
  max?: Date;
  disabled?: boolean;
  className?: string;
  modal?: boolean;
  inline?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  // hours24h = HH
  // hours12h = hh
  const defaultDate = value ?? new Date();
  const formatStr = useMemo(
    () => (use12HourFormat ? 'yyyy-MM-dd hh:mm:ss.SSS a xxxx' : 'yyyy-MM-dd HH:mm:ss.SSS xxxx'),
    [use12HourFormat]
  );
  const [ampm, setAmpm] = useState(format(defaultDate, 'a') === 'AM' ? AM_VALUE : PM_VALUE);
  const [hour, setHour] = useState(use12HourFormat ? +format(defaultDate, 'hh') : defaultDate.getHours());
  const [minute, setMinute] = useState(defaultDate.getMinutes());
  const [second, setSecond] = useState(defaultDate.getSeconds());

  useEffect(() => {
    onChange?.(buildTime({ use12HourFormat, value: defaultDate, formatStr, hour, minute, second, ampm }));
  }, [JSON.stringify({ hour, minute, second, ampm, formatStr, use12HourFormat, defaultDate, onChange })]);

  const _hourIn24h = useMemo(() => {
    return use12HourFormat ? (hour % 12) + ampm * 12 : hour;
  }, [hour, use12HourFormat, ampm]);

  const hours: SimpleTimeOption[] = useMemo(
    () =>
      Array.from({ length: use12HourFormat ? 12 : 24 }, (_, i) => {
        let disabled = false;
        const hourValue = use12HourFormat ? (i === 0 ? 12 : i) : i;
        const hDate = setHours(defaultDate, use12HourFormat ? i + ampm * 12 : i);
        const hStart = startOfHour(hDate);
        const hEnd = endOfHour(hDate);
        if (min && hEnd < min) disabled = true;
        if (max && hStart > max) disabled = true;
        return {
          value: hourValue,
          label: hourValue.toString().padStart(2, '0'),
          disabled,
        };
      }),
    [defaultDate, min, max, use12HourFormat, ampm]
  );
  const minutes: SimpleTimeOption[] = useMemo(() => {
    const anchorDate = setHours(defaultDate, _hourIn24h);
    return Array.from({ length: 60 }, (_, i) => {
      let disabled = false;
      const mDate = setMinutes(anchorDate, i);
      const mStart = startOfMinute(mDate);
      const mEnd = endOfMinute(mDate);
      if (min && mEnd < min) disabled = true;
      if (max && mStart > max) disabled = true;
      return {
        value: i,
        label: i.toString().padStart(2, '0'),
        disabled,
      };
    });
  }, [defaultDate, min, max, _hourIn24h]);
  const seconds: SimpleTimeOption[] = useMemo(() => {
    const anchorDate = setMilliseconds(setMinutes(setHours(defaultDate, _hourIn24h), minute), 0);
    const _min = min ? setMilliseconds(min, 0) : undefined;
    const _max = max ? setMilliseconds(max, 0) : undefined;
    return Array.from({ length: 60 }, (_, i) => {
      let disabled = false;
      const sDate = setSeconds(anchorDate, i);
      if (_min && sDate < _min) disabled = true;
      if (_max && sDate > _max) disabled = true;
      return {
        value: i,
        label: i.toString().padStart(2, '0'),
        disabled,
      };
    });
  }, [defaultDate, minute, min, max, _hourIn24h]);
  const ampmOptions = useMemo(() => {
    const startD = startOfDay(defaultDate);
    const endD = endOfDay(defaultDate);
    return [
      { value: AM_VALUE, label: 'AM' },
      { value: PM_VALUE, label: 'PM' },
    ].map((v) => {
      let disabled = false;
      const start = addHours(startD, v.value * 12);
      const end = subHours(endD, (1 - v.value) * 12);
      if (min && end < min) disabled = true;
      if (max && start > max) disabled = true;
      return { ...v, disabled };
    });
  }, [defaultDate, min, max]);

  const [open, setOpen] = useState(false);

  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (open) {
        hourRef.current?.scrollIntoView({ behavior: 'auto' });
        minuteRef.current?.scrollIntoView({ behavior: 'auto' });
        secondRef.current?.scrollIntoView({ behavior: 'auto' });
      }
    }, 1);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  const onHourChange = useCallback(
    (v: SimpleTimeOption) => {
      if (min) {
        let newTime = buildTime({ use12HourFormat, value: defaultDate, formatStr, hour: v.value, minute, second, ampm });
        if (newTime < min) {
          setMinute(min.getMinutes());
          setSecond(min.getSeconds());
        }
      }
      if (max) {
        let newTime = buildTime({ use12HourFormat, value: defaultDate, formatStr, hour: v.value, minute, second, ampm });
        if (newTime > max) {
          setMinute(max.getMinutes());
          setSecond(max.getSeconds());
        }
      }
      setHour(v.value);
    },
    [setHour, use12HourFormat, defaultDate, formatStr, minute, second, ampm, min, max]
  );

  const onMinuteChange = useCallback(
    (v: SimpleTimeOption) => {
      if (min) {
        let newTime = buildTime({ use12HourFormat, value: defaultDate, formatStr, hour: v.value, minute, second, ampm });
        if (newTime < min) {
          setSecond(min.getSeconds());
        }
      }
      if (max) {
        let newTime = buildTime({ use12HourFormat, value: defaultDate, formatStr, hour: v.value, minute, second, ampm });
        if (newTime > max) {
          setSecond(newTime.getSeconds());
        }
      }
      setMinute(v.value);
    },
    [setMinute, use12HourFormat, defaultDate, formatStr, hour, second, ampm, min, max]
  );

  const onAmpmChange = useCallback(
    (v: SimpleTimeOption) => {
      if (min) {
        let newTime = buildTime({ use12HourFormat, value: defaultDate, formatStr, hour, minute, second, ampm: v.value });
        if (newTime < min) {
          const minH = min.getHours() % 12;
          setHour(minH === 0 ? 12 : minH);
          setMinute(min.getMinutes());
          setSecond(min.getSeconds());
        }
      }
      if (max) {
        let newTime = buildTime({ use12HourFormat, value: defaultDate, formatStr, hour, minute, second, ampm: v.value });
        if (newTime > max) {
          const maxH = max.getHours() % 12;
          setHour(maxH === 0 ? 12 : maxH);
          setMinute(max.getMinutes());
          setSecond(max.getSeconds());
        }
      }
      setAmpm(v.value);
    },
    [setAmpm, use12HourFormat, defaultDate, formatStr, hour, minute, second, min, max]
  );

  const display = useMemo(() => {
    return format(defaultDate, use12HourFormat ? 'hh:mm:ss a' : 'HH:mm:ss');
  }, [defaultDate, use12HourFormat]);

  // 时间选择内容组件
  const timeContent = (
    <div className="flex-col gap-2 p-2">
      <div className="flex items-center justify-center gap-2 pb-2 border-b">
        <Clock className="size-4" />
        <span className="text-sm font-medium">{display}</span>
      </div>
      <div className="flex h-56 grow">
        <ScrollArea className="h-full flex-grow">
          <div className="flex grow flex-col items-stretch overflow-y-auto pe-2 pb-48">
            {hours.map((v) => (
              <div ref={v.value === hour ? hourRef : undefined} key={v.value}>
                <TimeItem
                  option={v}
                  selected={v.value === hour}
                  onSelect={onHourChange}
                  disabled={v.disabled}
                  className="h-8"
                />
              </div>
            ))}
          </div>
        </ScrollArea>
        <ScrollArea className="h-full flex-grow">
          <div className="flex grow flex-col items-stretch overflow-y-auto pe-2 pb-48">
            {minutes.map((v) => (
              <div ref={v.value === minute ? minuteRef : undefined} key={v.value}>
                <TimeItem
                  option={v}
                  selected={v.value === minute}
                  onSelect={onMinuteChange}
                  disabled={v.disabled}
                  className="h-8"
                />
              </div>
            ))}
          </div>
        </ScrollArea>
        <ScrollArea className="h-full flex-grow">
          <div className="flex grow flex-col items-stretch overflow-y-auto pe-2 pb-48">
            {seconds.map((v) => (
              <div ref={v.value === second ? secondRef : undefined} key={v.value}>
                <TimeItem
                  option={v}
                  selected={v.value === second}
                  onSelect={(v) => setSecond(v.value)}
                  className="h-8"
                  disabled={v.disabled}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
        {use12HourFormat && (
          <ScrollArea className="h-full flex-grow">
            <div className="flex grow flex-col items-stretch overflow-y-auto pe-2">
              {ampmOptions.map((v) => (
                <TimeItem
                  key={v.value}
                  option={v}
                  selected={v.value === ampm}
                  onSelect={onAmpmChange}
                  className="h-8"
                  disabled={v.disabled}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );

  // inline 模式：直接显示时间选择内容
  if (inline) {
    return timeContent;
  }

  // 默认模式：带 Popover
  return (
    <Popover open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      onOpenChange?.(newOpen);
    }} modal={modal}>
      <PopoverTrigger>
        <div
          role="combobox"
          aria-expanded={open}
          className={cn(
            'flex h-9 px-3 items-center justify-between cursor-pointer font-normal border border-input rounded-md text-sm shadow-sm',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          tabIndex={0}
        >
          <Clock className="mr-2 size-4" />
          {display}
          <ChevronDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0" side="top">
        {timeContent}
      </PopoverContent>
    </Popover>
  );
}

const TimeItem = ({
  option,
  selected,
  onSelect,
  className,
  disabled,
}: {
  option: SimpleTimeOption;
  selected: boolean;
  onSelect: (option: SimpleTimeOption) => void;
  className?: string;
  disabled?: boolean;
}) => {
  return (
    <Button
      variant="ghost"
      className={cn('flex justify-center px-1 pe-2 ps-1', className)}
      onClick={() => onSelect(option)}
      disabled={disabled}
    >
      <div className="w-4">{selected && <CheckIcon className="my-auto size-4" />}</div>
      <span className="ms-2">{option.label}</span>
    </Button>
  );
};

interface BuildTimeOptions {
  use12HourFormat?: boolean;
  value: Date;
  formatStr: string;
  hour: number;
  minute: number;
  second: number;
  ampm: number;
}

function buildTime(options: BuildTimeOptions) {
  const { use12HourFormat, value, formatStr, hour, minute, second, ampm } = options;
  let date: Date;
  if (use12HourFormat) {
    const dateStrRaw = format(value, formatStr);
    // yyyy-MM-dd hh:mm:ss.SSS a zzzz
    // 2024-10-14 01:20:07.524 AM GMT+00:00
    let dateStr = dateStrRaw.slice(0, 11) + hour.toString().padStart(2, '0') + dateStrRaw.slice(13);
    dateStr = dateStr.slice(0, 14) + minute.toString().padStart(2, '0') + dateStr.slice(16);
    dateStr = dateStr.slice(0, 17) + second.toString().padStart(2, '0') + dateStr.slice(19);
    dateStr = dateStr.slice(0, 24) + (ampm == AM_VALUE ? 'AM' : 'PM') + dateStr.slice(26);
    date = parse(dateStr, formatStr, value);
  } else {
    date = setHours(setMinutes(setSeconds(setMilliseconds(value, 0), second), minute), hour);
  }
  return date;
}