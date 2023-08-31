const { Project, PropertySignature, InterfaceDeclaration, TypeAliasDeclaration } = require('ts-morph');

/**
 * 从字段的类型全称中截取其标准类型说明文本
 *
 * 例如：
 * 1. 输入import("rootDir/src/types/example").IList<any>[]
 * 获取: IList<any>[]
 *
 * 2. 输入React.MutableRefObject<{ [elementId: string]: import("rootDir/src/types/validate").ValidateRule<any>[]; }>
 * 获取: React.MutableRefObject<{ [elementId: string]: ValidateRule<any>[]; }>
 * @param {string} origin 字段的类型全称
 */
function getExactTypeText(origin) {
  if (!origin) {
    return;
  }
  return origin.replace(/import\(".*?"\)\./g, '');
}

/**
 * 获取interface内属性(字段)的描述对象
 * @param {PropertySignature} property
 * @return {import('.').AttDspObj}
 */
function getFormatProperty(property) {
  // 遵循API接口描述的取值规则，取末尾的JSDoc对象为源
  // 取@default的值作为默认值

  let propertyDescription = '';
  let defaultValue = '';
  if (property.getJsDocs().length > 0) {
    const propertyJsDoc = property.getJsDocs().at(-1);
    const propertyJsDocTags = propertyJsDoc.getTags();
    propertyDescription =
      propertyJsDoc.getCommentText() ||
      propertyJsDocTags.find(tag => tag.getTagName() === 'description')?.getCommentText() ||
      '';
    defaultValue = propertyJsDocTags.find(tag => tag.getTagName() === 'default')?.getCommentText() || '';
  }

  return {
    name: property.getName(),
    type: getExactTypeText(property.getType().getText()) || '',
    description: propertyDescription,
    required: !property.hasQuestionToken(),
    default: defaultValue
  };
}

/**
 * 获取interface的描述对象
 * @param {InterfaceDeclaration} item
 * @return {import('.').InterfaceDspObj}
 */
function getFormatInterface(item) {
  // API接口的描述，将以末尾的JSDoc对象为源，根据 @doc的值 -> 默认文本描述 -> @description 的优先级取值
  let apiDescription = '';
  if (item.getJsDocs().length > 0) {
    const jsDoc = item.getJsDocs().at(-1);
    const jsDocTags = jsDoc.getTags();

    apiDescription =
      jsDocTags.find(tag => tag.getTagName() === 'doc')?.getCommentText() ||
      jsDoc.getCommentText() ||
      jsDocTags.find(tag => tag.getTagName() === 'description')?.getCommentText() ||
      '';
  }
  return {
    name: item.getName(),
    description: apiDescription,
    propertyList: (item.getProperties() || []).map(getFormatProperty)
  };
}

/**
 * 获取Type的描述对象
 *
 * type表现出来的可能的形状较之interface更为复杂，如：
 *
 * 1. type TExample1 = '1' | 2 | false | TTest<T> | IExample // 基本类型、复杂类型、泛型等的联合类型
 * 2. type TExample2 = TExample1 & IExample // 复杂类型的交叉类型
 * 3. type TExample3 = () => void / TTest<T> // 定义类型
 * 4. type TExample4 = { attr1: string; attr2: number } // 形同interface形状的类型
 *
 * 考虑到情况2、4与interface职能相似，在此将不对其进行读取和处理，如有需要请转换为interface交由对应的interface转换器处理；
 *
 * 在此仅转换情况1、3
 *
 * @param {TypeAliasDeclaration} item
 * @return {import('.').TypeDspObj}
 */
function getFormatType(item) {
  // API类型的描述，将以末尾的JSDoc对象为源，根据 @doc的值 -> 默认文本描述 -> @description 的优先级取值
  let apiDescription = '';
  if (item.getJsDocs().length > 0) {
    const jsDoc = item.getJsDocs().at(-1);
    const jsDocTags = jsDoc.getTags();

    apiDescription =
      jsDocTags.find(tag => tag.getTagName() === 'doc')?.getCommentText() ||
      jsDoc.getCommentText() ||
      jsDocTags.find(tag => tag.getTagName() === 'description')?.getCommentText() ||
      '';
  }

  let typeDescription = '';

  const itemType = item.getType();

  let typeName = '';

  if (itemType.isUnion()) {
    typeName = item.getName();
    typeDescription = itemType
      .getUnionTypes()
      .map(unionType => unionType.getText())
      .join(' | ');
  } else {
    typeName = getExactTypeText(itemType.getText());
    typeDescription = getExactTypeText(item.getTypeNode().getText());
  }

  return {
    name: typeName,
    description: apiDescription,
    type: typeDescription
  };
}

/**
 * 根据输入路径，获取该目录下的所有dts文件或目标dts文件的interface集合
 * @param {string} fileGlob
 */
function getInterfaceList(fileGlob) {
  const internalProject = new Project();

  // 获取读取到的所有dts文件
  const sourceFileList = internalProject.addSourceFilesAtPaths(fileGlob);

  // 获取dts文件中的接口列表
  let result = sourceFileList.map(sourceFile => sourceFile.getInterfaces()).flat();

  return result.concat(
    sourceFileList
      .map(sourceFile =>
        sourceFile
          .getModules()
          .map(module => module.getInterfaces())
          .flat()
      )
      .flat()
  );
}

/**
 * 根据输入路径，获取该目录下的所有dts文件或目标dts文件的type集合
 * @param {string} fileGlob
 */
function getTypeList(fileGlob) {
  const internalProject = new Project();

  // 获取读取到的所有dts文件
  const sourceFileList = internalProject.addSourceFilesAtPaths(fileGlob);

  // 获取dts文件中的接口列表
  let result = sourceFileList.map(sourceFile => sourceFile.getTypeAliases()).flat();

  return result.concat(
    sourceFileList
      .map(sourceFile =>
        sourceFile
          .getModules()
          .map(module => module.getTypeAliases())
          .flat()
      )
      .flat()
  );
}

/**
 * 根据输入路径，获取该目录下的所有dts文件或目标dts文件的interface的描述对象集合
 * @param {string} fileGlob
 * @return {import('.').InterfaceDspObj[]}
 */
function getFormatApiList(fileGlob) {
  const interfaceList = getInterfaceList(fileGlob);

  // 根据jsDoc中的@doc标记来获取API文档需要展示的源接口
  const apiInterfaceList = interfaceList.filter(item => {
    for (const jsDocs of item.getJsDocs()) {
      if (jsDocs.getTags()?.find(tag => tag.getTagName() === 'doc')) {
        return true;
      }
    }
    return false;
  });

  // 根据生成的API源接口转换为展示用的数据数组
  return apiInterfaceList.map(getFormatInterface);
}

/**
 * 根据输入路径，获取该目录下的所有dts文件或目标dts文件的type的描述对象集合
 * @param {string} fileGlob
 * @return {import('.').TypeDspObj[]}
 */
function getFormatTypeList(fileGlob) {
  const typeList = getTypeList(fileGlob);

  // 根据jsDoc中的@doc标记来获取API文档需要展示的源类型
  const apiTypeList = typeList.filter(item => {
    for (const jsDocs of item.getJsDocs()) {
      if (jsDocs.getTags()?.find(tag => tag.getTagName() === 'doc')) {
        return true;
      }
    }
    return false;
  });

  return apiTypeList.map(getFormatType);
}

module.exports = {
  getInterfaceList,
  getTypeList,
  getFormatApiList,
  getFormatTypeList
};
