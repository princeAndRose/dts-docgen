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
 * @param {boolean} options.enableEscape 是否开启对md文档内容的字符转义处理, 默认为false
 */
function dtsGen({ input, output, enableEscape = false }) {
  // 加载dts文件，获取interface列表
  const apiDataArray = input.map(item => interfaceGen.getFormatApiList(item)).flat();

  const typeData = input.map(item => interfaceGen.getFormatTypeList(item)).flat();

  // 生成API接口描述文档

  if (apiDataArray.length === 0 && typeData.length === 0) {
    console.log('读取不到需要生成描述文档的接口或类型，将跳过生成文档...');
  }

  const markdownContent = generateDocs.generateMarkdown(apiDataArray, typeData, { enableEscape });

  const directoryPath = path.dirname(output);

  // 确保目录存在
  fs.mkdirSync(directoryPath, { recursive: true });

  // 写入文档保存
  fs.writeFileSync(output, markdownContent, {});
  console.log('API接口描述文档成功生成 !!!');
}

/**
 * 对插件配置进行预处理，避免错误配置造成的异常
 * @param {import('.').IConfig} config build-scripts为插件提供的API接口/能力配置
 * @param {import('.').IOptions} options 自定义参数
 */
module.exports = function ({ context = {} } = {}, options) {
  let { rootDir } = context;
  const { input, output, overwrite = true, enableEscape = false } = options;

  if (!rootDir) {
    rootDir = process.cwd();
    console.log('未指定项目根路径，将使用当前目录作为项目根路径: ', rootDir);
  } else {
    console.log('插件将根据项目根路径工作: ', rootDir);
  }

  console.log('-------------------------------------------');

  const inputPath = adjuster.adjustInput(input, rootDir);

  if (!inputPath || inputPath.length === 0) {
    console.log('指定输入路径不存在可识别的dts文件，插件将结束读取过程...');
    return;
  }

  let outputPath = adjuster.adjustOutput(output, rootDir);

  if (fs.existsSync(outputPath) && !overwrite) {
    console.log('指定输出路径已存在文件，插件将跳过覆写过程...');
    return;
  }

  console.log('dts文件读取路径: ', inputPath);
  console.log('md文档输出路径: ', outputPath);

  dtsGen({ input: inputPath, output: outputPath, enableEscape });
};
