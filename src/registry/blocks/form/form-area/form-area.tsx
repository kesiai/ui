import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils'; // shadcn 核心工具函数（确保路径正确）
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandSeparator } from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, ChevronsUpDown, X, FolderPlus, Folder, ArrowLeft } from 'lucide-react';
import _ from 'lodash';
import { loadPCAData } from './pca';

// ====================== 核心类型定义 ======================
/** 省市区数据结构类型 */
interface PCAItem {
  label: string;
  value: string;
  children?: PCAItem[];
}

/** Form Input 结构类型（适配 xadmin/form 体系） */
interface InputProps {
  name?: string;
  value?: string | string[] | number | null | undefined;
  onChange: (value: string | string[] | null | undefined) => void;
}

/** Field 配置类型 */
interface FieldProps {
  schema: {
    defaultVal?: string | string[];
    areaType?: 'p' | 'pc' | 'pca'; // p=省 | pc=省市 | pca=省市区
    defaultValType?: string;
    multiple?: boolean;
    size?: 'sm' | 'md' | 'lg';
  };
  filter?: boolean;
}

/** Meta 元数据类型 */
interface MetaProps {
  data?: {
    disabled?: boolean;
  };
}

/** Area 组件 Props 类型 */
interface AreaProps {
  input: InputProps;
  field: FieldProps;
  antdForm?: any; // 保留原属性，无实际使用
  meta: MetaProps;
  cellKey?: string;
  areaType: 'p' | 'pc' | 'pca';
}

/** PcaSelect 子组件 Props 类型 */
interface PcaSelectProps {
  input: InputProps;
  areaType?: 'p' | 'pc' | 'pca';
  defaultValue?: string | string[];
  size?: 'sm' | 'md' | 'lg';
  multiple?: boolean;
  disabled?: boolean;
  cellKey?: string;
}

// ====================== 工具函数（带类型注解） ======================
/** 处理单选级联数据格式 */
const getData = (areaType: 'p' | 'pc' | 'pca', pcaData: PCAItem[]): { value: string; label: string; children?: any[] }[] => {
  if (areaType === 'p') {
    return pcaData.map(item => ({ value: item.label, label: item.label }));
  } else if (areaType === 'pc') {
    return pcaData.map(item => ({
      value: item.label,
      label: item.label,
      children: item.children?.map(child => ({ value: child.label, label: child.label })) || [],
    }));
  } else {
    return pcaData.map(item => ({
      value: item.label,
      label: item.label,
      children: item.children?.map(child => ({
        value: child.label,
        label: child.label,
        children: child.children?.map(grand => ({ value: grand.label, label: grand.label })) || [],
      })) || [],
    }));
  }
};

/** 转换为多选格式的数组 */
const convertToMultipleFormat = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value as string[];
  return [String(value)];
};

/** 生成层级选择数据（适配 Command 递归渲染） */
const getHierarchyData = (areaType: 'p' | 'pc' | 'pca', pcaData: PCAItem[]): any[] => {
  const buildItem = (item: PCAItem, parentPath = '') => {
    const currentPath = parentPath ? `${parentPath}/${item.label}` : item.label;
    const result = {
      value: currentPath,
      label: item.label,
      key: currentPath,
      parentPath,
      hasChildren: !!item.children?.length,
      children: [] as any[],
    };

    // 根据 areaType 控制层级
    const isProvinceLevel = !parentPath;
    const isCityLevel = parentPath && !parentPath.includes('/');
    const isDistrictLevel = parentPath && parentPath.includes('/');

    if (areaType === 'p' && isProvinceLevel) {
      // 仅省级
      return result;
    } else if (areaType === 'pc' && (isProvinceLevel || isCityLevel)) {
      // 省+市级
      result.children = item.children?.map(child => buildItem(child, currentPath)) || [];
      return result;
    } else if (areaType === 'pca') {
      // 省+市+区
      result.children = item.children?.map(child => buildItem(child, currentPath)) || [];
      return result;
    }
    return null;
  };

  return pcaData.map(item => buildItem(item)).filter(Boolean) as any[];
};

/** 处理旧数据格式（-分隔转/分隔） */
const dealOldData = (v: string | undefined, pcaData: PCAItem[]): string | undefined => {
  if (!v) return undefined;
  const list = v.split('-');
  if (list.length === 0) return v;

  const result: string[] = [];
  const province = pcaData.find(p => p.value === list[0]);
  if (province) {
    result.push(province.label);
    const city = province.children?.find(c => c.value === list[1]);
    if (city) {
      result.push(city.label);
      const district = city.children?.find(d => d.value === list[2]);
      if (district) {
        result.push(district.label);
      }
    }
  }
  return result.length > 0 ? result.join('/') : v;
};

// ====================== 核心组件 ======================
/** 根组件 */
const Area: React.FC<AreaProps> = (props) => {
  const { meta, cellKey, areaType } = props;
  const onChange = props.input?.onChange || (() => {});
  const schema = props.field?.schema || {}
  const disabled = meta?.data?.disabled || false;
  const { defaultVal, defaultValType, multiple = false } = schema;

  // 处理默认值逻辑
  useEffect(() => {
    setTimeout(() => {
      !props.input?.value && defaultVal && defaultValType !== 'logic' && onChange && onChange(defaultVal);
    });
  }, [props.input?.value, defaultVal, defaultValType, onChange]);

  return (
    <PcaSelect
      disabled={disabled}
      input={props.input}
      areaType={areaType}
      size={schema.size}
      cellKey={cellKey}
      multiple={multiple}
    />
  );
};

/** 省市区选择核心子组件 */
const PcaSelect: React.FC<PcaSelectProps> = (props) => {
  const {
    input,
    areaType: propAreaType,
    defaultValue,
    size = 'md',
    multiple = false,
    disabled = false,
  } = props;

  // 状态管理
  const [pcaData, setPcaData] = useState<PCAItem[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]); // 多选选中值
  const [open, setOpen] = useState(false); // 下拉面板开关
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]); // 展开的层级key
  
  // ========== 新增：单选级联核心状态 ==========
  const [currentLevel, setCurrentLevel] = useState(0); // 当前级联层级（0=省、1=市、2=区）
  const [selectedPath, setSelectedPath] = useState<string[]>([]); // 单选选中的路径（如 ['浙江省', '杭州市']）

  // 加载省市区数据
  useEffect(() => {
    loadPCAData().then((res: PCAItem[]) => {
      setPcaData(res);
      // 初始化多选选中值
      if (multiple) {
        setSelectedValues(convertToMultipleFormat(input?.value));
      }
      // ========== 新增：初始化单选选中路径 ==========
      if (!multiple) {
        const rawValue = input?.value as string;
        const displayValue = dealOldData(rawValue, res) || '';
        const path = displayValue.split('/').filter(Boolean);
        setSelectedPath(path);
        setCurrentLevel(path.length > 0 ? path.length - 1 : 0);
      }
    });
  }, [input?.value, multiple]);

  // 动态获取 areaType（从 form 状态中读取）
  const getAreaType = (): 'p' | 'pc' | 'pca' => {
    return propAreaType || 'pca';
  };

  // 切换层级展开/折叠
  const toggleExpand = (key: string) => {
    setExpandedKeys(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  // ========== 新增：获取当前层级的数据源 ==========
  const getCurrentLevelData = (): any[] => {
    if (currentLevel === 0) {
      return getData(getAreaType(), pcaData);
    }
    // 根据选中路径查找下一级数据
    let currentData = getData(getAreaType(), pcaData);
    for (let i = 0; i < currentLevel; i++) {
      const target = currentData.find(item => item.value === selectedPath[i]);
      if (!target || !target.children) {
        return [];
      }
      currentData = target.children;
    }
    return currentData;
  };

  // ========== 新增：返回上一级 ==========
  const handleBack = () => {
    if (currentLevel > 0) {
      setCurrentLevel(prev => prev - 1);
      setSelectedPath(prev => prev.slice(0, currentLevel - 1));
    }
  };

  // ====================== 单选级联逻辑（修复核心） ======================
  const renderSingleSelect = () => {
    const rawValue = input?.value as string;
    const displayValue = dealOldData(rawValue, pcaData) || '';
    // 当前层级的数据源
    const currentData = getCurrentLevelData();
    // 当前层级的选中值
    const currentValue = selectedPath[currentLevel];

    // ========== 修复：级联选择变更处理 ==========
    const handleSelect = (itemValue: string) => {
      // 新的选中路径
      const newSelectedPath = [...selectedPath.slice(0, currentLevel), itemValue];
      setSelectedPath(newSelectedPath);
      
      // 判断是否是最后一级
      const maxLevel = getAreaType() === 'p' ? 0 : getAreaType() === 'pc' ? 1 : 2;
      const isLastLevel = currentLevel >= maxLevel;

      if (isLastLevel) {
        // 最后一级：触发onChange并关闭下拉
        const finalValue = newSelectedPath.join('/');
        input?.onChange(finalValue);
        setOpen(false);
        // 重置层级（下次打开从第一级开始）
        setCurrentLevel(0);
      } else {
        // 非最后一级：切换到下一级
        setCurrentLevel(prev => prev + 1);
      }
    };

    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className="w-full justify-between"
          >
            {displayValue || "请选择"}
            <ChevronsUpDown className="h-4 w-4 ml-2 shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[280px] p-0">
          <Command className="h-[300px] overflow-auto">
            <CommandInput placeholder={"请选择区域"} disabled={disabled} />
            <CommandEmpty>未找到匹配项</CommandEmpty>
            
            {/* ========== 新增：返回上一级按钮 ========== */}
            {currentLevel > 0 && (
              <>
                <CommandItem
                  key="back"
                  onSelect={handleBack}
                  disabled={disabled}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>{"返回上一级"}</span>
                </CommandItem>
                <CommandSeparator />
              </>
            )}

            {/* ========== 修复：渲染当前层级的选项 ========== */}
            <CommandGroup>
              {currentData.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  disabled={disabled}
                  onSelect={() => handleSelect(item.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      item.value === currentValue ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // ====================== 多选层级逻辑（替代 AntD TreeSelect） ======================
  const renderMultipleSelect = () => {
    const hierarchyData = getHierarchyData(getAreaType(), pcaData);

    // 处理选中状态变更
    const handleCheck = (key: string) => {
      const newSelected = selectedValues.includes(key)
        ? selectedValues.filter(item => item !== key)
        : [...selectedValues, key];
      setSelectedValues(newSelected);
      input?.onChange(newSelected);
    };

    // 清空所有选中项
    const handleClearAll = () => {
      setSelectedValues([]);
      input?.onChange([]);
    };

    // 递归渲染层级选项（模拟树形结构）
    const renderHierarchyItems = (items: any[], depth = 0) => {
      return items.map(item => (
        <div key={item.key} className={cn(`pl-${depth * 16}px`, "py-1")}>
          <div className="flex items-center gap-1">
            {/* 展开/折叠按钮 */}
            {item.hasChildren && (
              <button
                type="button"
                onClick={() => toggleExpand(item.key)}
                disabled={disabled}
                className="h-4 w-4 flex items-center justify-center text-gray-500"
              >
                {expandedKeys.includes(item.key) ? (
                  <FolderPlus className="h-3 w-3" />
                ) : (
                  <Folder className="h-3 w-3" />
                )}
              </button>
            )}
            {/* 无子集时补位，保持对齐 */}
            {!item.hasChildren && <span className="h-4 w-4"></span>}
            
            {/* 复选框 + 标签 */}
            <Checkbox
              checked={selectedValues.includes(item.key)}
              onCheckedChange={() => handleCheck(item.key)}
              disabled={disabled}
              className="mr-2"
            />
            <span 
              className={cn(
                "text-sm cursor-pointer",
                disabled && "text-gray-400 cursor-not-allowed"
              )}
              onClick={() => !disabled && handleCheck(item.key)}
            >
              {item.label}
            </span>
          </div>
          
          {/* 渲染子级（展开状态下） */}
          {item.hasChildren && expandedKeys.includes(item.key) && (
            <div className="mt-1">
              {renderHierarchyItems(item.children, depth + 1)}
            </div>
          )}
        </div>
      ));
    };

    return (
      <div className={cn("border rounded-md p-2", {
        'opacity-50 cursor-not-allowed': disabled,
        'border-gray-200': !disabled,
      })}>
        {/* 选中项标签 */}
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedValues.map((value) => (
            <div key={value} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
              <span className="text-sm">{value.split('/').pop()}</span>
              <button
                type="button"
                onClick={() => handleCheck(value)}
                disabled={disabled}
                className="h-4 w-4 rounded-full hover:bg-gray-200 flex items-center justify-center"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {selectedValues.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              disabled={disabled}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              清空
            </button>
          )}
        </div>

        {/* 层级选择区域（模拟树形） */}
        <div className="max-h-[300px] overflow-auto pr-2">
          {renderHierarchyItems(hierarchyData)}
        </div>
      </div>
    );
  };

  // 根据多选/单选渲染不同组件
  return multiple ? renderMultipleSelect() : renderSingleSelect();
};

Area.displayName = "Area"

export default Area