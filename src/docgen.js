/**
 * 根据interface的属性项描述对象生成对应的表格数据行
 * @param {import(".").AttDspObj} properties interface属性项描述对象
 * @return {string} 模板字符串
 */
function generatePropertyRows(properties) {
  return properties
    .map(property => {
      return `| ${property.name} | \`${property.type}\` | ${property.description} | ${
        property.required ? '是' : '否'
      } | ${property.default} |`;
    })
    .join('\n');
}

/**
 * 根据interface描述对象生成对应的API接口描述文档内容
 * @param {import(".").InterfaceDspObj[]} apiData 源interface描述对象集合
 * @return {string} 文档内容模板字符串
 */
function generateMarkdown(apiData) {
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
  ${generatePropertyRows(data.propertyList)}
  `;
    })
    .join('\n');

  return `${pageHeader}\n${apiTableList}`;
}

module.exports = {
  generatePropertyRows,
  generateMarkdown
};
