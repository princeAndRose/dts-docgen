// Type definitions for sc-gpx-react-fusion-component-dynamic-list-v2 1.0.1
// Project: http://192.168.8.48/productline-gcycloud-gpmscloud-web/gpx-components
// Definitions by: JunHao Yang <http://192.168.8.48/yangjunhao>
// Definitions: http://192.168.8.48/productline-gcycloud-gpmscloud-web/gpx-components
// TypeScript Version: 5.0

import * as React from 'react';
import type { ValidateRule } from './validate';
import type { DomEventSet, BaseElement, CellIndex, Cell, Row, TablePropertyConfig } from './base';

export interface ExtendElement extends Omit<BaseElement, 'type'>, DomEventSet {}

/**
 * 单元格元素渲染方法接收的参数
 */
export interface CellProps extends CellIndex {
  /** 元素索引，设置为columnId */
  dataIndex: string;

  /** 元素value */
  data: any;
}

/**
 * 自定义基本单位渲染元素函数的接收参数配置
 */
export interface CustomRenderFuncProps {
  /** 单位元素数据对象 */
  element: ExtendElement;

  /** 单元格接收参数 */
  cellProps: CellProps;

  /** 表格校验错误集合的引用对象 */
  tableErrorsRef: React.MutableRefObject<{ [elementId: string]: ValidateRule<any>[] }>;

  /** 表格单元格数值集合的引用对象 */
  tableValuesRef: React.MutableRefObject<{ [elementId: string]: any }>;

  /** 元素Dom事件集合 */
  domEventMerge: DomEventSet;

  /**
   * 当前列表的预览状态
   *
   * @default false
   */
  isPreview: boolean;

  /** 所在列表头的基本单位渲染元素集合 */
  headerElementList: BaseElement[];

  /** 当前单元格所有元素的个数 */
  elementListLen: number;

  /** 单元格元素被点击时触发的回调 */
  onElemClick?: (value: string, e: React.ChangeEvent<HTMLTextAreaElement>) => void;

  /** 单元格所在行的单元格集合  */
  rowData: Cell[];
}

declare module 'sc-gpx-react-fusion-component-dynamic-list-v2' {
  /**
   * 组件向外提供方法的Ref引用对象
   * @doc
   */
  export interface ComponentRef {
    /**
     * 根据设置的主键策略和键值，展开目标行
     * @param key 目标行的主键键值
     */
    expandedRowByPrimaryKey: (key: string) => void;

    /** 获取当前表格内的校验错误集合 */
    getErrors: () => { [elementId: string]: ValidateRule<any>[] };

    /** 获取当前表格内的单元格数值集合 */
    getValues: () => { [elementId: string]: string };

    /**
     * @function 根据标识和数值更新目标单元格内容
     * @param props 方法接收参数
     * @param {string} props.tableId 目标单元格所处表ID
     * @param {string} props.rowId 目标单元格所处行ID
     * @param {string} props.columnId 目标单元格所处列ID
     * @param {string} [props.value] 更新数值，value和data只用设置一个即可
     * @param {string} [props.data]更新数值, value和data只用设置一个即可
     */
    setValue: (props: {
      tableId: string;
      rowId: string;
      columnId: string;
      value?: string | undefined;
      data?: string | undefined;
    }) => void;

    /**
     * setValue的批量调用封装，使用方法与setValue类似
     */
    setValues: (
      arr?: {
        tableId: string;
        rowId: string;
        columnId: string;
        value?: string | undefined;
        data?: string | undefined;
      }[]
    ) => void;

    /** 根据标识和基本单位元素列表更新目标单元格渲染内容 */
    updateCellElementList: (cellProps: any) => void;

    /** 根据标识和基本单位元素列表向目标单元格追加图标 */
    appendCellStatusIcon: (cellProps: any) => void;

    /** 根据标识清除目标单元格内的图标 */
    clearCellStatusIcon: (cellProps: any) => void;
  }

  /**
   * 组件接收参数
   * @doc
   */
  export interface ComponentProps {
    /**
     * 列表ID，默认为table0
     * @description 一个视图中存在多个表格时，必须保证唯一
     */
    tableId?: string;

    /**
     * 自定义内联样式
     */
    style?: React.CSSProperties;

    /**
     * 列表的表头渲染元素集合
     */
    columns: Cell[];

    /**
     * 列表的主体行渲染元素集合
     */
    dataSource: Row[];

    /**
     * 自定义渲染类型
     * @description 在此以type:() => ReactNode的方式配置可实现自定义类型的元素渲染
     * @example
     *  const renderer = {
     *     test: ({
     *         element,
     *         cellProps,
     *         tableErrorsRef,
     *         tableValuesRef,
     *         domEventMerge,
     *         isPreview = false,
     *         headerElementList,
     *         elementListLen,
     *     }) => {
     *         const { tableId, rowId, columnId, dataIndex, data } = cellProps;
     *         const {
     *             value = '',
     *             rules,
     *             width = elementListLen > 1 ? 80 : '100%',
     *             editable = true,
     *             onChange = null,
     *             onBlur = null,
     *         } = element;
     *
     *         // 若需通过setValue方法设置自定义渲染类型元素的值
     *         // 需要在此处为标签添加属性id=`${tableId}_${rowId}_${columnId}`
     *         return <div>这个一个type=test的渲染</div>;
     *     },
     *     test2: () => {
     *         return <div>这个一个type=test2的渲染</div>;
     *     },
     * };
     */
    renderer?: { [type: string]: (props: CustomRenderFuncProps) => React.ReactNode };

    /**
     * 元素发生改变的时候触发的回调
     */
    onChange?: (value: string, e: React.ChangeEvent<HTMLTextAreaElement>) => void;

    /**
     * 元素失焦的时候触发的回调
     */
    onBlur?: (value: string, e: React.ChangeEvent<HTMLTextAreaElement>) => void;

    /** 单元格元素被点击时触发的回调 */
    onElemClick?: (value: string, e: React.ChangeEvent<HTMLTextAreaElement>) => void;

    /**
     * 是否为预览模式，默认为false
     *
     * @default false
     */
    isPreview?: boolean;

    /**
     * 表格额外功能配置项
     */
    property?: TablePropertyConfig;

    /**
     * 设置数据为空的时候的表格内容展现
     */
    emptyContent?: React.ReactNode;

    /**
     * 表格是否在加载中，默认为false
     *
     * @default false
     */
    loading?: boolean;

    /**
     * 表格行数据键值key，必须保证每行唯一，默认为：rowId
     *
     * @default rowId
     */
    primaryKey?: string;

    /**
     * 额外渲染行的渲染函数
     */
    expandedRenderer?: (record: any, index: number) => React.ReactElement<any>;

    /**
     * 表头是否固定，该属性配合maxBodyHeight使用，当内容区域的高度超过maxBodyHeight的时候，在内容区域会出现滚动条
     */
    fixedHeader?: boolean;

    /**
     * 最大内容区域的高度,在`fixedHeader`为`true`的时候,超过这个高度会出现滚动条，默认为300px
     *
     * @default 300
     */
    maxBodyHeight?: number | string;
  }

  /**
   * V2动态表格渲染组件
   *
   * @version 2.1.33
   * @see http://119.3.244.32:20024/sc-gpx-react-fusion-component-dynamic-list-v2@2.1.33/build/index.html
   */
  const ScGpxReactFusionComponentDynamicListV2: React.ForwardRefRenderFunction<
    React.RefAttributes<ComponentRef>,
    React.PropsWithoutRef<ComponentProps>
  >;

  export default ScGpxReactFusionComponentDynamicListV2;
}
