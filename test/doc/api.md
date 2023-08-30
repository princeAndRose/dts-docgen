---
title: API
order: 2
---

  ## CellProps
  
  单元格元素渲染方法接收的参数
  
  | 属性名 | 类型 | 描述 | 是否必需 | 默认值 |
  | --- | --- | --- | --- | --- |
  | dataIndex | `string` | 元素索引，设置为columnId | 是 |  |
| data | `any` | 元素value | 是 |  |
  

  ## ComponentRef
  
  组件向外提供方法的Ref引用对象
  
  | 属性名 | 类型 | 描述 | 是否必需 | 默认值 |
  | --- | --- | --- | --- | --- |
  | expandedRowByPrimaryKey | `(key: string) => void` | 根据设置的主键策略和键值，展开目标行 | 是 |  |
| getErrors | `() => { [elementId: string]: ValidateRule<any>[]; }` | 获取当前表格内的校验错误集合 | 是 |  |
| getValues | `() => { [elementId: string]: string; }` | 获取当前表格内的单元格数值集合 | 是 |  |
| setValue | `(props: { tableId: string; rowId: string; columnId: string; value?: string; data?: string; }) => void` |  | 是 |  |
| setValues | `(arr?: { tableId: string; rowId: string; columnId: string; value?: string; data?: string; }[]) => void` | setValue的批量调用封装，使用方法与setValue类似 | 是 |  |
| updateCellElementList | `(cellProps: any) => void` | 根据标识和基本单位元素列表更新目标单元格渲染内容 | 是 |  |
| appendCellStatusIcon | `(cellProps: any) => void` | 根据标识和基本单位元素列表向目标单元格追加图标 | 是 |  |
| clearCellStatusIcon | `(cellProps: any) => void` | 根据标识清除目标单元格内的图标 | 是 |  |
  

  ## ComponentProps
  
  组件接收参数
  
  | 属性名 | 类型 | 描述 | 是否必需 | 默认值 |
  | --- | --- | --- | --- | --- |
  | tableId | `string` | 列表ID，默认为table0 | 否 | table0 |
| style | `React.CSSProperties` | 自定义内联样式 | 否 |  |
| columns | `Cell[]` | 列表的表头渲染元素集合 | 是 |  |
| dataSource | `Row[]` | 列表的主体行渲染元素集合 | 是 |  |
| renderer | `{ [type: string]: (props: CustomRenderFuncProps) => React.ReactNode; }` | 自定义渲染类型 | 否 |  |
| onChange | `(value: string, e: React.ChangeEvent<HTMLTextAreaElement>) => void` | 元素发生改变的时候触发的回调 | 否 |  |
| onBlur | `(value: string, e: React.ChangeEvent<HTMLTextAreaElement>) => void` | 元素失焦的时候触发的回调 | 否 |  |
| onElemClick | `(value: string, e: React.ChangeEvent<HTMLTextAreaElement>) => void` | 单元格元素被点击时触发的回调 | 否 |  |
| isPreview | `boolean` | 是否为预览模式，默认为false | 否 | false |
| property | `TablePropertyConfig` | 表格额外功能配置项 | 否 |  |
| emptyContent | `React.ReactNode` | 设置数据为空的时候的表格内容展现 | 否 |  |
| loading | `boolean` | 表格是否在加载中，默认为false | 否 | false |
| primaryKey | `string` | 表格行数据键值key，必须保证每行唯一，默认为：rowId | 否 | rowId |
| expandedRenderer | `(record: any, index: number) => React.ReactElement<any>` | 额外渲染行的渲染函数 | 否 |  |
| fixedHeader | `boolean` | 表头是否固定，该属性配合maxBodyHeight使用，当内容区域的高度超过maxBodyHeight的时候，在内容区域会出现滚动条 | 否 |  |
| maxBodyHeight | `string | number` | 最大内容区域的高度,在`fixedHeader`为`true`的时候,超过这个高度会出现滚动条，默认为300px | 否 | 300 |
  