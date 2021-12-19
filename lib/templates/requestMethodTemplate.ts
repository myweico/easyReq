import { getCommentTemplate } from './commentTemplate'

export const getRequestMethodTemplate = ({
  requestMethodTemplateData,
  config
}: {
  requestMethodTemplateData: RequestMethodTemplateSchema
  config: EasyReqConfig
}) => {
  const { requestMethodConfig, namespace } = requestMethodTemplateData
  return `${config.requestSnippet}

	${requestMethodConfig
    .map((config) => {
      return `${getCommentTemplate(config.comment)}
		export function ${config.name}(options: ${namespace}.${
        config.requestInterfaceName
      }): Promise<${namespace}.${config.responseInterfaceName}> {
			return request({
				${config.url ? `url: \`${config.url}\`,` : ''}
				${config.method ? `method: '${config.method}',` : ''}
				data: options
				})
		}
		`
    })
    .join('\n')}
	`
}
