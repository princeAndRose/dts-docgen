# dts-docgen

基于 ts-morph 开发，实现读取 dts 文件，通过其中的 jsdoc 以及类型声明生成对应的接口 API 说明文档的插件。

## 目录

- [安装导入](#install)
- [快速上手](#快速上手)
- [配置说明](#配置说明)
  - [input](#input)
  - [output](#output)
  - [overwrite](#overwrite)

## 安装导入

### install

你可以通过 npm 来安装插件:

```
  npm install -save-dev dts-docgen
```

也可以选择使用 yarn:

```
  yarn add dts-docgen --dev
```

### import

你可以通过以下方法在项目项目的任何地方导入插件

```js
// commonJS模块
const docGen = require('dts-docgen');

// ES模块
import docGen from 'dts-docgen';
```

## 快速上手

插件本身以函数的形式被导出，你可以参照以下例子快速上手插件的使用:

```js
const docGen = require('dts-docgen');

/** dts文件的所在目录/路径 */
const input = './src/types';

/** 最终输出文档的路径 */
const output = './doc/api.md';

docGen(_, {
  input,
  output
});
```

同时，插件也可以结合`build-scripts`进行配置使用，你可以参照以下列子，通过在`build.json`文件中进行配置使用:

```json
{
  "plugins": [
    [
      "dts-docgen",
      {
        "input": "./src/types",
        "output": "./doc/api.md"
      }
    ]
  ]
}
```

待函数运行完毕，你可以在指定的输出路径看到预期的 API 描述文档。

## 配置说明

通常来说，[**快速上手**](#快速上手) 中的范例可以应对大部分的使用场景，但考虑到复杂业务场景下的定制化开发需求，我们也提供了完整的配置项说明和示例来帮助你更好地使用本插件。

### input

dts 文件所在路径，支持配置一个或多个(相对/绝对)路径，相对路径以项目根路径作为起始路径，范例如下：

```json
{
  "plugins": [
    {
      "dts-docgen",
      {
        // 配置路径为目录时，默认读取该目录下所有的dts文件，等价于"${input}/*.d.ts"
        "input": "./src/types"
      }
    }
  ]
}
```

如果你的 dts 文件存在于多个目录下，或只需要读取某些 dts 文件以生成文档的话，也可以使用数组形式定义 input:

```json
{
  "plugins": [
    {
      "name": "dts-docgen",
      "option": {
        // 配置路径为目录时，默认读取该目录下所有的dts文件，等价于"${input}/*.d.ts"
        "input": ["./src/types/a.d.ts", "D://types/example"]
      }
    }
  ]
}
```

请注意，如果指定的 dts 文件路径指向的不是 dts 文件的话，插件将不会读取该文件，也不会对其进行任何操作。

### output

最终 md 文档的输出路径，默认为项目根路径下 doc 目录，文档名默认为 api.md，当然你也可以指定输出路径:

```json
{
  "plugins": [
    {
      "name": "dts-docgen",
      "option": {
        "input": "./src/types",
        "output": "./src/doc/api-description.md"
      }
    }
  ]
}
```

这样，你可以在 src/doc 目录下看到 api-description.md 文件。

### overwrite

默认情况下，描述稳定的生成是建立在覆写原有描述文档的基础上的，这意味着，插件在每次被调用时都会读取指定路径下的 dts 文件，在指定输出路径下生成新的描述文档，这是为了保证 dts 文件的内容与描述文档总是同步一致的，如果你避免此操作，可以通过`overwrite`这个配置项来关闭插件的默认覆写行为:

```json
{
  "plugins": [
    {
      "name": "dts-docgen",
      "option": {
        "input": "./src/types",
        "output": "./src/doc/api.md",
        "overwrite": false
      }
    }
  ]
}
```

## License

[MIT](LICENSE)
