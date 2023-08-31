import * as React from 'react';
import type { ValidateRuleConfig } from './validate';

/** 支持渲染的图标类型 */
export type IconType = 'fileActive' | 'fileInActive' | 'deleteIcon' | 'success' | 'error';

/** Dom元素事件集合 */
export interface DomEventSet {
  /**
   * 元素发生改变的时候触发的回调
   */
  onChange?: (value: string, e: React.ChangeEvent<HTMLTextAreaElement>) => void;

  /**
   * 元素失焦的时候触发的回调
   */
  onBlur?: (value: string, e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

/** 单元格标识索引对象 */
export interface CellIndex {
  /** 单元格所处表ID */
  tableId: string;

  /** 单元格所处行ID */
  rowId: string;

  /** 单元格所处列ID */
  columnId: string;
}

/**
 * 单元格内基本渲染元素单位
 *
 * @doc
 */
export interface BaseElement {
  /**
   * 元素渲染类型
   * @description 默认支持'text' | 'input' | 'label' | 'click' | 'icon'，若需支持自定义渲染类型，需要结合renderer属性实现渲染方法
   */
  type: 'text' | 'input' | 'label' | 'click' | 'icon' | string;

  /**
   * 元素对应value
   *
   * @description **图标渲染目前支持以下类型**: `'fileActive' | 'fileInActive' | 'deleteIcon' | 'success' | 'error'`
   *
   * @default none
   */
  value?: IconType | string;

  /** 元素校验规则 */
  rule?: ValidateRuleConfig;

  /**
   * 元素宽度
   * @description 目前仅支持定义input类型，默认为100%，单元格内有多个元素时默认为80px
   */
  width?: number | string;

  /** 元素是否可编辑，默认为true */
  editable?: boolean;

  /**
   * 元素浮动位置
   *
   * @description **可选值**: `left | right | none | inline-start | inline-end`
   *
   * @default none
   */
  position?: 'left' | 'right' | 'none' | 'inline-start' | 'inline-end';

  /**
   * 配合click、icon类型元素使用，会作为单元格ID部分构成，同时也会作为onElemClick的部分参数传入
   *
   * @description **注意**: 若想配合onElemClick使用，则此项必传
   */
  clickAction?: string;
}

/**
 * 单元格渲染元素
 *
 * @doc
 */
export interface Cell {
  /**
   * 单元格所处列的ID
   */
  columnId: string;

  /** 单元格内渲染元素的集合 */
  elementList: BaseElement[];
}

/**
 * 列表行渲染元素
 */
export interface Row {
  /** 行ID，单张列表内需要保持唯一 */
  rowId: string;

  /**
   * 行内单元格元素集合
   * @description 列ID作为属性键名，单元格渲染元素作为属性键值
   */
  [columnId: string]: Cell;
}

/** 表格额外功能配置项 */
export interface TablePropertyConfig {
  /**　列宽配置项，列宽应设为数字 */
  columnWidthConfig?: { [columnId: string]: string | number };

  /**
   * 锁列配置项
   * @description lock='left'的列会被提升到第0列，lock='right'的列会被提升到最后一列
   */
  customProperties?: { [columnId: string]: 'left' | 'right' };

  /**
   * 固定列配置项
   * @description 效果与customProperties配置的lock='left'相同
   */
  fixedColumns?: string[];

  /** 需要自动进行相同数据合并的数据列ID集合 */
  rowSpanColumns?: string[];

  /**
   * 手动控制行合并
   * @description 通过rowIndex和columnIndex指定需要合并的目标行列，通过span来指定合并后的数据占几行
   * @example
   * // 合并第一行，第二列的数据，合并后的数据占两行
   * const rowMerge = [{ rowIndex: 0, span: 2, columnIndex: 1 }]
   */
  rowMerge?: { rowIndex: number; span: number; columnIndex: number }[];
}
