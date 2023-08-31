/**
 * 用于对字符串中的特殊字符进行转义处理，使其正常显示
 * @param {string} str
 */
function escape(str) {
  return str.replace(/\|/g, '\\|');
}

/**
 * 根据interface的属性项描述对象生成对应的表格数据行
 * @param {import(".").AttDspObj[]} properties interface属性项描述对象集合
 * @param {boolean} enableEscape 是否开启对md文档内容的字符转义处理, 默认为false
 * @return {string} 模板字符串
 */
function generatePropertyRows(properties, enableEscape = false) {
  return properties
    .map(property => {
      return `| ${property.name} | \`${enableEscape ? escape(property.type) : property.type}\` | ${
        enableEscape ? escape(property.description) : property.description
      } | ${property.required ? '是' : '否'} | ${property.default} |`;
    })
    .join('\n');
}

/**
 * 根据type描述对象生成对应的表格数据行
 * @param {import(".").TypeDspObj[]} tdoList type描述对象集合
 * @param {boolean} enableEscape 是否开启对md文档内容的字符转义处理, 默认为false
 * @return {string} 模板字符串
 */
function generateTypeRows(tdoList, enableEscape = false) {
  return tdoList
    .map(tdo => {
      return `| ${tdo.name} | ${enableEscape ? escape(tdo.description) : tdo.description} | \`${
        enableEscape ? escape(tdo.type) : tdo
      }\` |`;
    })
    .join('\n');
}

/**
 * 根据interface描述对象生成对应的API接口描述文档内容
 * @param {import(".").InterfaceDspObj[]} apiData 源interface描述对象集合
 * @param {import(".").TypeDspObj[]} typeData 源type描述对象集合
 * @param {object} config 文档生成配置项
 * @param {boolean} config.enableEscape 是否开启对md文档内容的字符转义处理, 默认为false
 * @return {string} 文档内容模板字符串
 */
function generateMarkdown(apiData, typeData, config) {
  const pageHeader = `---
title: API
order: 2
---`;
  const apiTableList = apiData
    .map(data => {
      return `
  ## ${data.name}
  
  ${data.description}
  
  | 属性名 | 类型 | 描述 | 是否必需 | 默认值 |
  | --- | --- | --- | --- | --- |
  ${generatePropertyRows(data.propertyList, config.enableEscape)}
  `;
    })
    .join('\n');

  const typeTable =
    typeData.length > 0
      ? `
## type类型描述
| 名称 | 类型 | 描述 |
| --- | --- | --- |
${generateTypeRows(typeData, config.enableEscape)}`
      : '';

  return `${pageHeader}\n${apiTableList}\n${typeTable}`;
}

module.exports = {
  generatePropertyRows,
  generateMarkdown
};
