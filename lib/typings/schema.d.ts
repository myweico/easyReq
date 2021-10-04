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

interface RequestSchema {
  description?: string
  tags: string[]
  summary: string
  operationId: string
  parameters: Parameter[]
  responses: {
    default: {
      $ref: string
    }
  }
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

interface Schema {
  swagger: string
  path: Record<string, PathSchema>
  definitions: Record<string, Definition>
  response: Record<
    string,
    {
      description: string
      schema: BodySchema
    }
  >
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
