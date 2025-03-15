import { server } from '../server'
import * as MCP from '@modelcontextprotocol/sdk/server/mcp.js'

/**
 * 固定URI资源接口 - 用于定义静态URI资源
 */
type MCPFixedResource = {
  name: string // 资源名称
  uri: string // 资源URI
  metadata?: MCP.ResourceMetadata // 可选的元数据
  cb: MCP.ReadResourceCallback // 读取资源的回调函数
}

/**
 * 模板资源接口 - 用于定义动态URI模板资源
 */
type MCPTemplateResource = {
  name: string // 资源名称
  uriTemplate: string // URI模板，支持RFC 6570格式，如：/api/users/{id}
  metadata?: MCP.ResourceMetadata // 可选的元数据
  listCallback?: MCP.ListResourcesCallback // 列出所有匹配模板的资源的回调
  completeCallbacks?: {
    // 自动完成URI模板变量的回调
    [variable: string]: MCP.CompleteResourceTemplateCallback
  }
  cb: MCP.ReadResourceTemplateCallback // 读取资源的回调函数
}

/**
 * 统一资源类型，可以是固定URI资源或模板资源
 */
type MCPResource = MCPFixedResource | MCPTemplateResource

/**
 * 注册资源函数，根据资源类型调用对应的server.resource方法
 */
function registerResource(resource: MCPResource): void {
  if ('uriTemplate' in resource) {
    // 模板资源 - 创建ResourceTemplate实例
    const template = new MCP.ResourceTemplate(resource.uriTemplate, {
      list: resource.listCallback,
      complete: resource.completeCallbacks,
    })

    if (resource.metadata) {
      server.resource(resource.name, template, resource.metadata, resource.cb)
    } else {
      server.resource(resource.name, template, resource.cb)
    }
  } else {
    // 固定URI资源
    if (resource.metadata) {
      server.resource(
        resource.name,
        resource.uri,
        resource.metadata,
        resource.cb,
      )
    } else {
      server.resource(resource.name, resource.uri, resource.cb)
    }
  }
}

/**
 * 注册所有资源到MCP Server
 */
export function registerResources(): void {}
