const fs = require('fs');
const path = require('path');
const generateDocs = require('./docgen');
const interfaceGen = require('./interface');
const adjuster = require('./adjuster');

const rootDir = process.cwd();

/**
 * 根据dts文件转换成对应的API解释文档
 * @param {object} options 插件配置参数
 * @param {string[]} options.input dts文件所在目录
 * @param {string} options.output 最终的md文档输出路径
 */
function dtsGen({ input, output }) {
  // 加载dts文件，获取interface列表
  const apiDataArray = input.map(item => interfaceGen.getFormatApiList(item)).flat();

  // 生成API接口描述文档
  const markdownContent = generateDocs.generateMarkdown(apiDataArray);

  const directoryPath = path.dirname(output);

  // 确保目录存在
  fs.mkdirSync(directoryPath, { recursive: true });

  // 写入文档保存
  fs.writeFileSync(output, markdownContent, {});
  console.log('API接口描述文档成功生成 !!!');
}

/**
 * 对插件配置进行预处理，避免错误配置造成的异常
 * @param {Object} _ build-scripts为插件提供的API接口/能力
 * @param {import('.').IOptions} options 自定义参数
 */
module.exports = function (_, options) {
  const { input, output, overwrite = true } = options;

  const inputPath = adjuster.adjustInput(input);

  if (!inputPath || inputPath.length === 0) {
    console.log('指定输入路径不存在可识别的dts文件，插件将结束读取过程...');
    return;
  }

  let outputPath = adjuster.adjustOutput(output);

  if (fs.existsSync(outputPath) && !overwrite) {
    console.log('指定输出路径已存在文件，插件将跳过覆写过程...');
    return;
  }

  dtsGen({ input: inputPath, output: outputPath });
};
