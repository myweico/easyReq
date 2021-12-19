export const toCamel = (name: string) => {
  return name.replace(/_+(.)/g, (matches, letter) => {
    return letter.toUpperCase()
  })
}

const defaultNameSpace = 'API'

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

export const properties2Params = ({
  properties,
  config,
  keysRequired
}: {
  properties: Record<string, Property>
  config: EasyReqConfig
  keysRequired: string[]
}) => {
  return Object.entries(properties).map(([propertyName, propertyData]) => {
    const type = getSchemaType(propertyData, config)
    return {
      name: toCamel(propertyName),
      required: keysRequired.includes(propertyName),
      description: propertyData.description || '',
      default: propertyData.default || '',
      type
    }
  })
}

export const parameters2Params = ({
  parameters,
  config
}: {
  parameters: Parameter[]
  config: EasyReqConfig
}): InterfaceParamsSchema[] => {
  const params: InterfaceParamsSchema[] = []
  parameters.forEach((parameter) => {
    if (['path', 'query'].includes(parameter.in)) {
      // path、query 的参数
      params.push({
        name: toCamel(parameter.name),
        type: 'string',
        required: parameter.required || false,
        default: parameter.default || '',
        description: parameter.description || ''
      })
    } else if (parameter.in === 'body' && parameter.schema) {
      if (parameter.schema.properties) {
        // requestBody 的情形
        params.push(
          ...properties2Params({
            properties: parameter.schema.properties,
            keysRequired: parameter.schema.required || [],
            config
          })
        )
        return
      }

      params.push({
        name: toCamel(parameter.name),
        description: parameter.description,
        required: parameter.required || false,
        default: parameter.default || '',
        type: getSchemaType(parameter.schema, config)
      })
    }
  })
  return params
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
      params = properties2Params({
        properties: interfaceData.properties,
        config,
        keysRequired
      })
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

const transformToReqName = (name: string) => {
  return toCamel(name) + 'Req'
}
const transformToRspName = (name: string) => {
  return toCamel(name) + 'Rsp'
}

const getRefValue = <T = Record<string, any>>(data: T, path: string) => {
  const rootIndex = path.indexOf('#/')
  const keys = path.slice(rootIndex).split('/')
  let value: any = data
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const _value = value[key]
    if (_value) {
      value = _value
    }
  }
  return value
}

const getResponseInterface = ({
  name,
  responseMap,
  schema,
  config
}: {
  name: string
  schema: Schema
  responseMap: ResponseMap
  config: EasyReqConfig
}): InterfaceSchema => {
  // 目前只是用 default 的 response
  const ref = responseMap.default.$ref
  const rspConfig = getRefValue(schema, ref)
  if (!rspConfig || !rspConfig.schema) {
    console.log('name', name)
    console.log('rsp config', rspConfig)
    return
  }

  const keysRequired = rspConfig.schema.required || []
  let params: InterfaceParamsSchema[] = [],
    type = ''
  if (rspConfig.schema.properties) {
    params = properties2Params({
      properties: rspConfig.schema.properties,
      config,
      keysRequired
    })
  } else if (rspConfig.schema.type) {
    type = getSchemaType(rspConfig.schema, config)
  }

  return {
    name: transformToRspName(name),
    description: rspConfig.description || '',
    type,
    params
  }
}

const transformRequests = ({
  schema,
  config
}: {
  schema: Schema
  config: EasyReqConfig
}): InterfaceSchema[] => {
  const requestInterfaces: InterfaceSchema[] = []
  const paths = schema.paths
  Object.entries(paths).forEach(([pathName, requestsConfigMap]) => {
    Object.entries(requestsConfigMap).forEach(
      ([requestMethod, requestConfig]) => {
        const name = requestConfig.operationId
        if (requestConfig.parameters) {
          // 请求的 interface
          requestInterfaces.push({
            name: transformToReqName(name),
            description: requestConfig.description || '',
            params: parameters2Params({
              parameters: requestConfig.parameters,
              config
            })
          })
        }

        // 响应的 interface, 请求和响应的放在一起，比较方便查看
        const responseInterface = getResponseInterface({
          name,
          schema,
          responseMap: requestConfig.responses,
          config
        })

        responseInterface && requestInterfaces.push(responseInterface)
      }
    )
  })
  return requestInterfaces
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
  config.namespace = config.namespace || defaultNameSpace
  const definitionInterfaces = transformDefinitions(definitions, config)
  const requestInterfaces = transformRequests({ schema, config })
  return {
    namespace: config.namespace,
    interfaces: [...definitionInterfaces, ...requestInterfaces]
  }
}

export const schema2RequestMethodTemplateData = ({
  config,
  schema
}: {
  config: EasyReqConfig
  schema: Schema
}): RequestMethodTemplateSchema => {
  // 每个 path 里面的每个 method 对应一个函数
  const requestMethodConfigs: ApiSchema[] = []
  Object.entries(schema.paths).forEach(([pathName, requestConfigMap]) => {
    Object.entries(requestConfigMap).forEach(([method, requestConfig]) => {
      // 取出 path 最后一个段
      const name = toCamel(requestConfig.operationId)

      requestMethodConfigs.push({
        name: toCamel(name),
        requestInterfaceName: transformToReqName(name),
        responseInterfaceName: transformToReqName(name),
        comment: {
          desc: requestConfig.description
        },
        url: pathName,
        method: method
      })
    })
  })

  return {
    namespace: config.namespace || defaultNameSpace,
    requestSnippet: config.requestSnippet,
    requestMethodConfig: requestMethodConfigs
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
