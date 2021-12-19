type DataType = 'string' | 'number' | 'boolean' | 'object' | 'array'
type DataPlaces = 'header' | 'query' | 'body'

interface Property {
  description?: string
  type?: DataType
  $ref?: string
  items?: {
    $ref?: string
    type?: string
  }
  default?: string
  'x-go-name'?: string
}

interface BodySchema {
  type: 'object'
  required: string[]
  properties: Record<string, Property>
}

interface Parameter {
  type: DataType
  'x-go-name'?: string
  name: string
  in: DataPlaces
  required?: boolean
  default?: string
  description?: string
  schema?: BodySchema
}

interface ResponseRefConfig {
  $ref: string
}

interface ResponseMap {
  default: ResponseRefConfig
  [status: string]: ResponseRefConfig
}

interface RequestSchema {
  description?: string
  tags: string[]
  summary: string
  operationId: string
  parameters: Parameter[]
  responses: ResponseMap
}

interface PathSchema {
  [method: string]: RequestSchema
}

interface Definition {
  type: 'object'
  properties: Record<string, Property>
  description?: string
  required?: string[]
  'x-go-package'?: string
}

interface ResponseSchema {
  description: string
  schema: BodySchema
}

interface Schema {
  swagger: string
  paths: Record<string, PathSchema>
  definitions: Record<string, Definition>
  responses: Record<string, ResponseSchema>
}

interface InterfaceParamsSchema {
  name: string
  type: string
  required?: boolean
  default?: string
  description?: string
}

interface InterfaceSchema {
  name: string
  description: string
  type?: string
  params?: InterfaceParamsSchema[]
}

interface InterfacesSchema {
  namespace: string
  description?: string
  interfaces: InterfaceSchema[]
}

interface CommentSchema {
  desc?: string
  example?: string
  default?: string
  creator?: string
  createTime?: number
  updateTime?: number
  yapiUrl?: string
}

interface ApiSchema {
  comment: CommentSchema
  name: string
  method: string
  requestInterfaceName: string
  responseInterfaceName: string
  url: string
}

interface RequestMethodTemplateSchema {
  namespace: string
  requestSnippet: string
  requestMethodConfig: ApiSchema[]
}
