const fs = require('fs');
const path = require('path');
const generateDocs = require('./docgen');
const interfaceGen = require('./interface');

const rootDir = process.cwd();

/**
 * 对输入路径进行转换处理
 *
 * 当存在以下情况时，会直接返回undefined：
 *
 * 1. 输入路径是绝对路径，且根路径与项目根路径不一致；
 * 2. 输入路径是目录，但文件系统内不存在此目录；
 * 3. 输入路径是文件时，但不是dts文件
 * 4. 输入路径是null、undefined或 ''
 * @param {string} inputPath
 */
function transformPath(inputPath) {
  if (!inputPath) return;

  const resolvedInputPath = path.resolve(inputPath);

  /** 项目根路径 */
  const resolvedProjectRoot = path.resolve(rootDir);

  // 判断输入路径根路径是否与项目根路径保持一致
  if (!resolvedInputPath.startsWith(resolvedProjectRoot)) {
    return;
  }

  // 判断输入路径是否为目录
  if (fs.existsSync(resolvedInputPath) && fs.statSync(resolvedInputPath).isDirectory()) {
    return path.join(resolvedInputPath, '/*.d.ts');
  }

  // 判断输入路径是否为文件
  if (fs.existsSync(resolvedInputPath) && fs.statSync(resolvedInputPath).isFile()) {
    const extension = path.extname(resolvedInputPath);
    if (extension === '.d.ts') {
      return resolvedInputPath;
    } else {
      return;
    }
  }

  // 路径不存在时返回undefined
  return;
}

/**
 * 根据dts文件转换成对应的API解释文档
 * @param {import('.').IOptions} options 插件配置参数
 */
function dtsGen({ input, output }) {
  /** @type {string[]} dts源文件路径列表 */
  let sourceFileList = [];

  // 判断输入路径类型
  if (!(input instanceof Array)) {
    sourceFileList.push(input);
  } else {
    sourceFileList = [...input];
  }

  // 判断dts所在路径的有效性
  sourceFileList = sourceFileList.map(transformPath).filter(item => item);

  // 加载dts文件，获取interface列表
  const apiDataArray = sourceFileList.map(item => interfaceGen.getFormatApiList(item)).flat();

  // 生成API接口描述文档
  const markdownContent = generateDocs.generateMarkdown(apiDataArray);

  // 写入文档保存
  fs.writeFileSync(output, markdownContent);
  console.log('API接口描述文档成功生成 !!!');
}

/**
 * 对插件配置进行预处理，避免错误配置造成的异常
 * @param {Object} _ build-scripts为插件提供的API接口/能力
 * @param {import('.').IOptions} options 自定义参数
 */
module.exports = function (_, options) {
  const { input, output, overwrite = true } = options;
  if (!input) {
    return;
  }

  let outputPath = '';

  // 判断是否指定了输出路径，没有则使用默认路径
  if (!output) {
    outputPath = path.join(rootDir, 'doc/api.md');
  }

  // 判断目标输出路径的有效性，无效则使用默认输出路径
  outputPath = path.resolve(output);

  // 判断输入路径是否为目录
  if (fs.statSync(outputPath).isDirectory()) {
    outputPath = path.join(outputPath, 'api.md');
  }

  if (fs.existsSync(outputPath) && !overwrite) {
    console.log('指定输出路径已存在文件，插件将跳过覆写过程...');
    return;
  }

  dtsGen({ input, output: outputPath });
};
