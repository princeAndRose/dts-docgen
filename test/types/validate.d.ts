/** 校验规则 */
export type ValidateRule<T> = [T, string];

/**
 * 校验规则配置项
 */
export interface ValidateRuleConfig {
  /** 元素是否必需 */
  required?: ValidateRule<boolean>;

  /** 进行元素内容校验的正则表达式 */
  pattern?: ValidateRule<RegExp | string>;

  /** 元素内容的最小长度 */
  minLength?: ValidateRule<number>;

  /** 元素内容的最大长度 */
  maxLength?: ValidateRule<number>;
}
