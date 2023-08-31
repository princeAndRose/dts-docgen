const fs = require('fs');
const path = require('path');

/**
 * 校正处理输入路径
 *
 * 当存在以下情况时，会直接返回undefined：
 *
 * 1. 输入路径是绝对路径，且根路径与项目根路径不一致;
 * 2. 输入路径是目录，但文件系统内不存在此目录;
 * 3. 输入路径是文件时，但不是dts文件;
 * 4. 输入路径是null、undefined或空的.
 *
 * @param {string | string[] | null} input
 * @param {string} rootDir 项目根路径
 * @return {string[] | undefined}
 */
function adjustInput(input, rootDir) {
  if (!input || input.length === 0) {
    return;
  }

  /** 项目根路径 */
  const resolvedProjectRoot = path.resolve(rootDir);

  let result = [];

  // 判断输入路径类型
  if (!(input instanceof Array)) {
    result.push(input);
  } else {
    result = [...input];
  }

  return result
    .map(item => {
      let resolvedPath = '';

      if (path.isAbsolute(item)) {
        resolvedPath = path.resolve(item);
      } else {
        resolvedPath = path.resolve(resolvedProjectRoot, item);
      }

      // 判断输入路径根路径是否与项目根路径保持一致
      if (!resolvedPath.startsWith(resolvedProjectRoot)) {
        return;
      }

      if (!fs.existsSync(resolvedPath)) {
        return;
      } else {
        if (fs.statSync(resolvedPath).isDirectory()) {
          return path.join(resolvedPath, '*.d.ts');
        } else if (path.extname(resolvedPath) === '.ts') {
          return resolvedPath;
        } else {
          return;
        }
      }
    })
    .filter(item => item);
}

/**
 * 校正输出路径
 * @param {string} output 待校正输出路径
 * @param {string} rootDir 项目根路径
 */
function adjustOutput(output, rootDir) {
  let outputPath = '';

  // 判断是否指定了输出路径，没有则使用默认路径
  if (!output) {
    outputPath = path.join(rootDir, 'doc/api.md');
  } else {
    outputPath = output;
  }

  if (path.isAbsolute(outputPath)) {
    outputPath = path.resolve(outputPath);
  } else {
    outputPath = path.resolve(rootDir, outputPath);
  }

  // 判断输入路径是否为目录
  if (!outputPath.includes('.')) {
    outputPath = path.join(outputPath, 'api.md');
  }

  if (outputPath.endsWith('.')) {
    outputPath = outputPath.concat('md');
  }

  return outputPath;
}

module.exports = {
  adjustInput,
  adjustOutput
};
