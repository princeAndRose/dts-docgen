# dts-docgen

基于 ts-morph 开发，实现读取 dts 文件，通过其中的 jsdoc 以及类型声明生成对应的接口 API 说明文档的插件。

## 目录

- [安装导入](#install)
- [快速上手](#快速上手)
- [配置说明](#配置说明)
  - [input](#input)
  - [output](#output)
  - [overwrite](#overwrite)
  - [enableEscape](#enableEscape)
- [结合 JSDoc 使用](#jsdoc-配置)

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

**请注意，插件以当前工作目录作为根路径，当被`build-scripts`引入使用时，以项目根路径作为根路径**

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

### enableEscape

某些情况下，你可能需要对文档内容的字符串进行转义处理以使其正常显示，这个时候你可以将`enableEscape`配置项设置为 true 来达到目的:

```json
{
  "plugins": [
    {
      "name": "dts-docgen",
      "option": {
        "input": "./src/types",
        "output": "./src/doc/api.md",
        "enableEscape": false
      }
    }
  ]
}
```

这样，md 文档中的特殊字符会经过转义处理:

```md
"left" | "right" | "none" | "inline-start" | "inline-end"

"left" \| "right" \| "none" \| "inline-start" \| "inline-end"
```

## jsdoc 配置

**请注意，若想要生成满足预期的说明文档，dts 文件中使用的注释必须符合 JSDoc 规范**

大多数场景下，我们往往只需要为项目中部分的 interface 生成说明文档以供开发者调阅，插件会根据 jsdoc 中的`@doc`标记记录并生成此 interface 的说明文档。

举个例子，如果你有一个 interface--`IExample`需要为其生成接口描述，需要在 jsdoc 上添加`@doc`:

```ts
/**
 * 接口IExample的描述介绍
 * @doc 在@doc标记后的描述展示优先级 > 上方的直接描述 > @description后的描述
 */
interface IExample {
  attr1: string;
  // ...其他属性
}
```

下面给出一个完整的`interface`示例以帮助你规范你的 dts 文件:

```ts
/**
 * 接口IExample的描述介绍
 * @doc 在@doc标记后的描述展示优先级 > 上方的直接描述 > @description后的描述
 */
interface IExample {
  /**
   * 样例属性一
   *
   * @description 你也可以使用@description来描述你的属性
   * @default 在这里描述属性的默认值
   */
  attr1: string;

  /**
   * 样例属性二
   * ?标记将表明此属性字段非必需，请为其添加@default说明其默认值
   * 否则此属性的类型将会被识别为number | undefined
   */
  attr2?: number;

  /**
   * 样例方法一
   * 若你想在描述文档中介绍此方法，请直接在上方描述或使用@description标记
   * @function 插件将不会记录@function标记的值
   */
  func1: () => void;

  // ...其他属性
  //
}
```

**在 TypeScript 中，type 和 interface 都能用于描述数据的结构和组成，但为了尽量避免判断处理复杂类型导致插件表现的异常，本插件设计之初仅考虑用 interface 描述数据的形状，用 type 定义数据的类型.**

也就是说，插件只能转换以下类型:

```ts
interface IExample {
  attr1: string;
  // ...其他属性
}

type TExample1 = string | 123 | false;

type TExample2<T> = Array<T>;

type TFunc = (param: string) => void;
```

对于复杂类型，插件目前无法支持对其的转换，但会考虑在后续更新中支持:

```ts
type TExample3 = IExample & IExample2;

type TExample4 = {
  attr1: string;
  // ...其他属性
};

// ...更多可能的复杂类型
```

## License

[MIT](LICENSE)
