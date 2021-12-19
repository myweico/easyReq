import template from 'art-template'
import path from 'path'
import { writeFileSync } from '@/utils/file'
import {
  schema2InterfaceData,
  schema2RequestMethodTemplateData
} from '@/utils/transform'
import prettier from 'prettier'
import { getRequestMethodTemplate } from '@/templates/requestMethodTemplate'

export const generateApisFile = ({
  schema,
  config
}: {
  schema: any
  config: any
}) => {
  const requestMethodTemplateData = schema2RequestMethodTemplateData({
    schema,
    config
  })
  const str = prettier.format(
    getRequestMethodTemplate({
      requestMethodTemplateData,
      config
    }),
    {
      semi: false,
      parser: 'typescript'
    }
  )

  try {
    // 生成文件
    const { functionPath } = config
    writeFileSync(path.resolve(functionPath, 'index.ts'), str)
  } catch (err) {
    console.error(err)
  }
}

export const generateInterfacesFile = ({
  schema,
  config
}: {
  schema: any
  config: any
}) => {
  // 将 schema 转化为渲染的数据
  const interfaceData = schema2InterfaceData({ config, schema })
  const str = prettier.format(
    template(
      path.resolve(__dirname, '../../templates/interfaces.art'),
      interfaceData
    ),
    {
      semi: false,
      parser: 'typescript'
    }
  )

  try {
    // 生成文件
    const { interfacePath } = config
    writeFileSync(path.resolve(interfacePath, 'index.d.ts'), str)
  } catch (err) {
    console.error(err)
  }
}

export default (schema: any, config: any) => {
  // 生成 api 函数
  generateApisFile({
    schema,
    config
  })

  // 生成 types 文件
  generateInterfacesFile({
    schema,
    config
  })
}
