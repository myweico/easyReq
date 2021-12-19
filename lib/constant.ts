import { version } from '../package.json'

export const VERSION = version

export const apiSchema = {
	requestSnippet: "import request fom '@/utils/request",
	requestConfig: [
			{
					description: "请求方法1",
					name: "requestMethod1",
					interfaceRequest: "API.requestMethod1Req",
					interfaceResponse: "API.requestMethod1Rsp",
					url: "/api/v1/fetchList/${id}",
					method: "GET"
			},
			{
					description: "请求方法2",
					name: "requestMethod2",
					interfaceRequest: "API.requestMethod2Req",
					interfaceResponse: "API.requestMethod2Rsp",
					url: "api/v1/editData",
					method: "POST"
			}
	]
}