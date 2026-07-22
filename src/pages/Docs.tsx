import CodeBlock from '@/components/CodeBlock';
import { Settings, BookOpen, Lightbulb, HelpCircle } from 'lucide-react';

export default function Docs() {
  return (
    <div className="min-h-screen bg-light-50 lg:pl-64">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-6">
            <span className="text-sm text-gray-600">完整文档</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">文档</h1>
          <p className="text-gray-600 text-lg">
            详细了解 YgET Widget 的配置选项和 API 使用方法。
          </p>
        </div>

        <div className="space-y-16">
          <section id="widget">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Settings className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Widget 配置</h2>
                <p className="text-gray-600">自定义验证码组件的外观和行为</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-blue-200 p-6 mb-6">
              <h3 className="text-gray-900 font-semibold mb-4">配置选项</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-blue-200">
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">选项</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">类型</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">默认值</th>
                      <th className="text-left py-3 px-4 text-gray-600 font-medium">描述</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-blue-100">
                      <td className="py-3 px-4 text-blue-500 font-mono">siteKey</td>
                      <td className="py-3 px-4 text-gray-600">string</td>
                      <td className="py-3 px-4 text-gray-500">-</td>
                      <td className="py-3 px-4 text-gray-700">您的站点密钥</td>
                    </tr>
                    <tr className="border-b border-blue-100">
                      <td className="py-3 px-4 text-blue-500 font-mono">type</td>
                      <td className="py-3 px-4 text-gray-600">string</td>
                      <td className="py-3 px-4 text-gray-500">slider</td>
                      <td className="py-3 px-4 text-gray-700">验证类型：slider / click / puzzle</td>
                    </tr>
                    <tr className="border-b border-blue-100">
                      <td className="py-3 px-4 text-blue-500 font-mono">theme</td>
                      <td className="py-3 px-4 text-gray-600">string</td>
                      <td className="py-3 px-4 text-gray-500">light</td>
                      <td className="py-3 px-4 text-gray-700">主题：dark / light</td>
                    </tr>
                    <tr className="border-b border-blue-100">
                      <td className="py-3 px-4 text-blue-500 font-mono">size</td>
                      <td className="py-3 px-4 text-gray-600">string</td>
                      <td className="py-3 px-4 text-gray-500">normal</td>
                      <td className="py-3 px-4 text-gray-700">尺寸：small / normal / large</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-blue-500 font-mono">onVerify</td>
                      <td className="py-3 px-4 text-gray-600">function</td>
                      <td className="py-3 px-4 text-gray-500">-</td>
                      <td className="py-3 px-4 text-gray-700">验证完成后的回调函数</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-blue-200 p-6">
              <h3 className="text-gray-900 font-semibold mb-4">完整配置示例</h3>
              <CodeBlock
                code={`import { YgETWidget } from '@yget/widget';

<YgETWidget
  siteKey="your_site_key"
  type="slider"
  theme="light"
  size="normal"
  onVerify={(result) => {
    if (result.success) {
      console.log('验证成功:', result.token);
    } else {
      console.log('验证失败:', result.message);
    }
  }}
  onError={(error) => {
    console.error('验证码加载失败:', error);
  }}
/>`}
                language="javascript"
              />
            </div>
          </section>

          <section id="api">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-light-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-light-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">API 参考</h2>
                <p className="text-gray-600">后端 API 的详细使用说明</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-blue-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-lg bg-green-100 text-green-600 text-sm font-medium">POST</span>
                  <span className="text-gray-900 font-semibold">/captcha/verify/token</span>
                </div>
                <p className="text-gray-600 mb-4">验证用户的验证码 Token</p>
                <CodeBlock
                  code={`// 请求体
{
  "token": "string"
}

// 响应
{
  "success": boolean,
  "message": string,
  "data": {
    "challengeId": string,
    "verifiedAt": string
  }
}`}
                  language="json"
                />
              </div>
              
              <div className="bg-white rounded-xl border border-blue-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-600 text-sm font-medium">POST</span>
                  <span className="text-gray-900 font-semibold">/captcha/generate</span>
                </div>
                <p className="text-gray-600 mb-4">生成验证码挑战（适用于自定义集成）</p>
                <CodeBlock
                  code={`// 请求体
{
  "type": "slider|click|puzzle",
  "siteKey": "string"
}

// 响应
{
  "success": boolean,
  "challengeId": string,
  "image": "base64_string",
  "options": {
    "targetX": number,
    "targetY": number
  }
}`}
                  language="json"
                />
              </div>
              
              <div className="bg-white rounded-xl border border-blue-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-600 text-sm font-medium">POST</span>
                  <span className="text-gray-900 font-semibold">/captcha/verify</span>
                </div>
                <p className="text-gray-600 mb-4">验证用户的验证码输入</p>
                <CodeBlock
                  code={`// 请求体
{
  "challengeId": "string",
  "userInput": {
    "x": number,
    "y": number
  }
}

// 响应
{
  "success": boolean,
  "token": "string"
}`}
                  language="json"
                />
              </div>
            </div>
          </section>

          <section id="best-practices">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">最佳实践</h2>
                <p className="text-gray-600">优化验证码使用体验的建议</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-blue-200 p-6">
                <h3 className="text-gray-900 font-semibold mb-3">1. 在关键操作前验证</h3>
                <p className="text-gray-600">
                  建议在登录、注册、提交表单等关键操作前显示验证码，避免在页面加载时就显示，
                  这样可以减少用户的挫败感。
                </p>
              </div>
              
              <div className="bg-white rounded-xl border border-blue-200 p-6">
                <h3 className="text-gray-900 font-semibold mb-3">2. 选择合适的验证类型</h3>
                <p className="text-gray-600">
                  根据您的安全需求选择验证类型：滑块验证适合大多数场景，点选验证安全性更高，
                  拼图验证最安全但体验稍复杂。
                </p>
              </div>
              
              <div className="bg-white rounded-xl border border-blue-200 p-6">
                <h3 className="text-gray-900 font-semibold mb-3">3. 使用 HTTPS</h3>
                <p className="text-gray-600">
                  确保您的网站使用 HTTPS，这样可以防止中间人攻击，保护验证码 Token 的安全传输。
                </p>
              </div>
              
              <div className="bg-white rounded-xl border border-blue-200 p-6">
                <h3 className="text-gray-900 font-semibold mb-3">4. 设置合理的 Token 有效期</h3>
                <p className="text-gray-600">
                  Token 默认有效期为 5 分钟，您可以根据实际需求调整。建议不要设置太长的有效期，
                  以提高安全性。
                </p>
              </div>
            </div>
          </section>

          <section id="faq">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-light-100 flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-light-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">常见问题</h2>
                <p className="text-gray-600">解答您可能遇到的问题</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-blue-200 overflow-hidden">
                <button className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-blue-50 transition-colors">
                  <span className="text-gray-900 font-medium">如何获取 siteKey 和 secretKey？</span>
                  <span className="text-gray-500">+</span>
                </button>
                <div className="px-6 py-4 bg-blue-50 border-t border-blue-200">
                  <p className="text-gray-600">
                    在 YgET 控制台注册账号后，创建一个新的站点即可获取 siteKey 和 secretKey。
                    siteKey 用于前端，secretKey 用于后端 API 调用，请妥善保管。
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-blue-200 overflow-hidden">
                <button className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-blue-50 transition-colors">
                  <span className="text-gray-900 font-medium">验证码不显示怎么办？</span>
                  <span className="text-gray-500">+</span>
                </button>
                <div className="px-6 py-4 bg-blue-50 border-t border-blue-200">
                  <p className="text-gray-600">
                    请检查以下几点：1) 确认 siteKey 正确且未过期；2) 确认网络连接正常；
                    3) 检查浏览器控制台是否有错误信息；4) 确认没有阻止 YgET CDN 的广告拦截器。
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-blue-200 overflow-hidden">
                <button className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-blue-50 transition-colors">
                  <span className="text-gray-900 font-medium">如何自定义验证码样式？</span>
                  <span className="text-gray-500">+</span>
                </button>
                <div className="px-6 py-4 bg-blue-50 border-t border-blue-200">
                  <p className="text-gray-600">
                    YgET 提供了 theme 和 size 配置选项，可以快速切换主题和尺寸。
                    如需更深度的自定义，可以使用 CSS 变量覆盖默认样式，或使用自定义集成方式。
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
