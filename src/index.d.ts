/**
 * Attribution Description Object————interface属性项(字段)描述对象
 */
export interface AttDspObj {
  /** 属性项(字段)名称 */
  name: string;
  /** 属性项(字段)类型 */
  type: string;
  /** 属性项(字段)的jsdoc描述 */
  description: string;
  /** 属性项(字段)是否必传 */
  required: boolean;
  /** 属性项(字段)的默认值 */
  default: string;
}

/**
 * Interface Description Object——interface描述对象
 */
export interface InterfaceDspObj {
  /** interface名称 */
  name: string;
  /** interface的jsdoc描述 */
  description: string;
  /** interface的属性项描述对象集合 */
  propertyList: AttDspObj[];
}

/**
 * 插件自定义参数
 */
export interface IOptions {
  /**
   * dts文件所在目录
   */
  input: string | string[];

  /**
   * 最终的md文档输出路径
   */
  output: string;

  /**
   * 若指定输出路径存在该文件，是否要覆盖重写
   *
   * @default true
   */
  overwrite: boolean;
}

declare module 'dts-docgen' {
  /**
   * 根据dts文件转换成对应的API解释文档
   */
  const docGen: (_: any, options: IOptions) => void;
  export default docGen;
}
