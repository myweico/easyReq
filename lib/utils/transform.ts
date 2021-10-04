export const toCamel = (name: string) => {
  return name.replace(/_+(.)/g, (matches, letter) => {
    return letter.toUpperCase()
  })
}

export const transformType = (type: string) => {
  const typeMap: Record<string, string> = {
    integer: 'number'
  }

  return typeMap[type] || type
}

export const getSchemaType = (schema: Property, config: EasyReqConfig) => {
  let type = transformType(schema.type)
  // 处理两种 type 的特殊情况 array & ref
  if (type === 'array') {
    // array 的特殊情况
    if (schema.items?.type) {
      type = `${transformType(schema.items?.type)}[]`
    } else if (schema.items?.$ref) {
      const refType = getRefType(schema.items?.$ref, config.namespace)
      type = `${refType}[]`
    }
  } else if (schema.$ref) {
    // $ref 的特殊情况
    type = getRefType(schema.$ref, config.namespace)
  } else if (type === 'integer') {
    // 把 go 的 integer 转为 number
    type = 'number'
  }
  return type
}

export const transformDefinitions = (
  definitions: Record<string, Definition>,
  config: EasyReqConfig
) => {
  return Object.entries(definitions).map(([interfaceName, interfaceData]) => {
    const keysRequired = interfaceData.required || []
    let params: InterfaceParamsSchema[] = [],
      type = ''
    if (interfaceData.properties) {
      params = Object.entries(interfaceData.properties).map(
        ([propertyName, propertyData]) => {
          const type = getSchemaType(propertyData, config)
          return {
            name: toCamel(propertyName),
            required: keysRequired.includes(propertyName),
            description: propertyData.description || '',
            type
          }
        }
      )
    } else if (interfaceData.type) {
      type = getSchemaType(interfaceData, config)
    }

    return {
      name: toCamel(interfaceName),
      description: interfaceData.description || '',
      type,
      params
    }
  })
}

export const schema2InterfaceData = ({
  config,
  schema
}: {
  config: EasyReqConfig
  schema: Schema
}): InterfacesSchema => {
  const { definitions } = schema
  // interface 由请求的数据、definition 以及 response 生成
  // 1. definition 的声明
  config.namespace = config.namespace || 'API'
  const definitionInterfaces = transformDefinitions(definitions, config)
  return {
    namespace: config.namespace,
    interfaces: [...definitionInterfaces]
  }
}

export const getRefType = (refPath: string, namespace?: string) => {
  // 获取最后的类型字符串
  const index = refPath.lastIndexOf('/')
  const ref = toCamel(refPath.slice(index + 1))
  if (namespace) {
    return `${namespace}.${ref}`
  }
  return ref
}
