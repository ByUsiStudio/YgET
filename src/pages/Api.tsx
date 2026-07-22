import CodeBlock from '@/components/CodeBlock';
import { Server, Lock, FileJson, ArrowRight } from 'lucide-react';

export default function Api() {
  return (
    <div className="min-h-screen bg-light-50 lg:pl-64">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-6">
            <Server className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600">API 文档</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">API 文档</h1>
          <p className="text-gray-600 text-lg">
            详细了解 YgET API 的使用方法和响应格式。
          </p>
        </div>

        <div className="bg-white rounded-xl border border-blue-200 p-6 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-5 h-5 text-blue-500" />
            <span className="text-gray-900 font-semibold">认证方式</span>
          </div>
          <p className="text-gray-600 mb-4">
            所有 API 请求都需要在请求头中包含 <code>Authorization</code> 字段，
            使用您的 secretKey 进行认证：
          </p>
          <CodeBlock
            code={`Authorization: Bearer YOUR_SECRET_KEY`}
            language="bash"
            showLineNumbers={false}
          />
          <p className="text-gray-600 text-sm mt-4">
            您可以在 YgET 控制台获取 secretKey，请妥善保管，不要在前端代码中暴露。
          </p>
        </div>

        <div className="space-y-8">
          <section id="verify">
            <div className="bg-white rounded-xl border border-blue-200 overflow-hidden">
              <div className="flex items-center gap-4 px-6 py-4 bg-blue-50 border-b border-blue-200">
                <span className="px-3 py-1 rounded-lg bg-green-100 text-green-600 text-sm font-medium">POST</span>
                <span className="text-gray-900 font-semibold text-lg">/captcha/verify/token</span>
                <span className="px-2 py-1 rounded bg-blue-100 text-blue-600 text-xs">核心接口</span>
              </div>
              <div className="p-6">
                <div className="flex items-start gap-2 mb-4">
                  <ArrowRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-gray-900 font-semibold">验证 Token</h3>
                    <p className="text-gray-600 text-sm">验证用户完成验证码验证后获得的 Token</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-gray-700 font-medium mb-3">请求参数</h4>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <CodeBlock
                        code={`{
  "token": "string",
  "siteKey": "string (可选)"
}`}
                        language="json"
                      />
                      <div className="mt-4 space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="text-blue-500 font-mono">token</span>
                          <span className="text-gray-600">必填，用户验证后获得的 Token</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-500 font-mono">siteKey</span>
                          <span className="text-gray-600">可选，用于验证 Token 是否属于指定站点</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-gray-700 font-medium mb-3">成功响应</h4>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <CodeBlock
                        code={`{
  "success": true,
  "message": "验证通过",
  "data": {
    "challengeId": "6a1b2c3d-4e5f-6789-abcd-ef1234567890",
    "siteKey": "your_site_key",
    "verifiedAt": "2024-01-01T12:00:00.000Z",
    "expiresAt": "2024-01-01T12:05:00.000Z"
  }
}`}
                        language="json"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-gray-700 font-medium mb-3">失败响应</h4>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <CodeBlock
                      code={`{
  "success": false,
  "message": "无效的 Token",
  "code": "INVALID_TOKEN"
}`}
                      language="json"
                    />
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded bg-red-100 text-red-600 text-xs font-mono">INVALID_TOKEN</span>
                        <span className="text-gray-600">Token 不存在或已过期</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded bg-red-100 text-red-600 text-xs font-mono">TOKEN_USED</span>
                        <span className="text-gray-600">Token 已被使用过</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded bg-red-100 text-red-600 text-xs font-mono">INVALID_SITE_KEY</span>
                        <span className="text-gray-600">Token 不属于指定站点</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded bg-red-100 text-red-600 text-xs font-mono">AUTH_ERROR</span>
                        <span className="text-gray-600">认证失败</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="generate">
            <div className="bg-white rounded-xl border border-blue-200 overflow-hidden">
              <div className="flex items-center gap-4 px-6 py-4 bg-blue-50 border-b border-blue-200">
                <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-600 text-sm font-medium">POST</span>
                <span className="text-gray-900 font-semibold text-lg">/captcha/generate</span>
                <span className="px-2 py-1 rounded bg-blue-100 text-blue-600 text-xs">高级接口</span>
              </div>
              <div className="p-6">
                <div className="flex items-start gap-2 mb-4">
                  <ArrowRight className="w-5 h-5 text-light-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-gray-900 font-semibold">生成验证码挑战</h3>
                    <p className="text-gray-600 text-sm">用于自定义验证码集成，生成验证码图片和挑战信息</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-gray-700 font-medium mb-3">请求参数</h4>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <CodeBlock
                        code={`{
  "type": "slider|click|puzzle",
  "siteKey": "string",
  "options": {
    "difficulty": "easy|normal|hard",
    "imageSize": {
      "width": 300,
      "height": 150
    }
  }
}`}
                        language="json"
                      />
                      <div className="mt-4 space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="text-blue-500 font-mono">type</span>
                          <span className="text-gray-600">必填，验证码类型</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-500 font-mono">siteKey</span>
                          <span className="text-gray-600">必填，站点密钥</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-500 font-mono">options</span>
                          <span className="text-gray-600">可选，额外配置</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-gray-700 font-medium mb-3">成功响应</h4>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <CodeBlock
                        code={`{
  "success": true,
  "challengeId": "6a1b2c3d-4e5f-6789-abcd-ef1234567890",
  "image": "data:image/png;base64,iVBORw0KGgo...",
  "options": {
    "targetX": 120,
    "targetY": 50,
    "tolerance": 15
  },
  "expiresAt": "2024-01-01T12:05:00.000Z"
}`}
                        language="json"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="captcha-verify">
            <div className="bg-white rounded-xl border border-blue-200 overflow-hidden">
              <div className="flex items-center gap-4 px-6 py-4 bg-blue-50 border-b border-blue-200">
                <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-600 text-sm font-medium">POST</span>
                <span className="text-gray-900 font-semibold text-lg">/captcha/verify</span>
                <span className="px-2 py-1 rounded bg-blue-100 text-blue-600 text-xs">高级接口</span>
              </div>
              <div className="p-6">
                <div className="flex items-start gap-2 mb-4">
                  <ArrowRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-gray-900 font-semibold">验证验证码输入</h3>
                    <p className="text-gray-600 text-sm">验证用户的验证码输入，返回验证结果和 Token</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-gray-700 font-medium mb-3">请求参数</h4>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <CodeBlock
                        code={`{
  "challengeId": "string",
  "userInput": {
    "x": 120,
    "y": 50
  }
}`}
                        language="json"
                      />
                      <div className="mt-4 space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="text-blue-500 font-mono">challengeId</span>
                          <span className="text-gray-600">必填，挑战 ID</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-500 font-mono">userInput</span>
                          <span className="text-gray-600">必填，用户输入的坐标</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-gray-700 font-medium mb-3">成功响应</h4>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <CodeBlock
                        code={`{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "challengeId": "6a1b2c3d-4e5f-6789-abcd-ef1234567890",
  "expiresAt": "2024-01-01T12:05:00.000Z"
}`}
                        language="json"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="response">
            <div className="bg-white rounded-xl border border-blue-200 p-6">
              <div className="flex items-center gap-4 mb-6">
                <FileJson className="w-6 h-6 text-light-500" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">响应格式</h2>
                  <p className="text-gray-600 text-sm">所有 API 响应都遵循统一的格式</p>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <CodeBlock
                  code={`{
  "success": boolean,
  "message": string,
  "code": string (仅失败时),
  "data": object (仅成功时),
  "timestamp": "2024-01-01T12:00:00.000Z"
}`}
                  language="json"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-blue-500 font-mono">success</span>
                  <span className="text-gray-600">布尔值，表示请求是否成功</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-500 font-mono">message</span>
                  <span className="text-gray-600">消息描述，成功时为"验证通过"，失败时为错误原因</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-500 font-mono">code</span>
                  <span className="text-gray-600">错误代码，仅在失败时返回</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-500 font-mono">data</span>
                  <span className="text-gray-600">数据对象，仅在成功时返回，包含具体的业务数据</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
