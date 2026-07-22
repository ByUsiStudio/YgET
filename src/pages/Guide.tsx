import CodeBlock from '@/components/CodeBlock';
import { CheckCircle, ArrowRight, Terminal, Code, Server } from 'lucide-react';

export default function Guide() {
  return (
    <div className="min-h-screen bg-light-50 lg:pl-64">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-6">
            <span className="text-sm text-gray-600">入门指南</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">快速开始</h1>
          <p className="text-gray-600 text-lg">
            只需几分钟，即可将 YgET 验证码集成到您的应用中。
          </p>
        </div>

        <div className="space-y-16">
          <section id="intro">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Terminal className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">简介</h2>
                <p className="text-gray-600">了解 YgET 的基本概念和工作原理</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-blue-200 p-6 mb-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                YgET 是一款现代化的验证码服务，采用先进的机器学习算法识别机器人攻击。
                它通过以下步骤工作：
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>用户访问您的网站，看到验证码 Widget</li>
                <li>用户完成验证（滑块、点选等）</li>
                <li>Widget 返回一个验证 Token</li>
                <li>您的后端调用 API 验证 Token 的有效性</li>
              </ol>
            </div>
          </section>

          <section id="install">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-light-100 flex items-center justify-center">
                <Code className="w-6 h-6 text-light-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">安装</h2>
                <p className="text-gray-600">安装 YgET Widget SDK</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-blue-200 p-6 mb-6">
              <p className="text-gray-700 mb-4">使用您喜欢的包管理器安装：</p>
              <CodeBlock
                code={`# npm
npm install @yget/widget

# yarn
yarn add @yget/widget

# pnpm
pnpm add @yget/widget`}
                language="bash"
                showLineNumbers={false}
              />
            </div>
            
            <div className="flex items-center gap-2 p-4 rounded-lg bg-green-50 border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-600 text-sm">SDK 已安装成功</span>
            </div>
          </section>

          <section id="integrate">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Code className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">集成 Widget</h2>
                <p className="text-gray-600">在您的应用中添加验证码组件</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-blue-200 p-6 mb-6">
              <p className="text-gray-700 mb-4">在 React 项目中使用：</p>
              <CodeBlock
                code={`import { YgETWidget } from '@yget/widget';
import '@yget/widget/dist/style.css';

function LoginPage() {
  const handleVerify = (result) => {
    if (result.success) {
      console.log('验证成功:', result.token);
    } else {
      console.log('验证失败');
    }
  };

  return (
    <form>
      <input type="email" placeholder="邮箱" />
      <input type="password" placeholder="密码" />
      
      <YgETWidget
        siteKey="your_site_key_here"
        onVerify={handleVerify}
      />
      
      <button type="submit">登录</button>
    </form>
  );
}`}
                language="javascript"
              />
            </div>
            
            <div className="bg-white rounded-xl border border-blue-200 p-6">
              <p className="text-gray-700 mb-4">在 HTML 中直接使用：</p>
              <CodeBlock
                code={`<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.yget.dev/widget.js"></script>
  <link rel="stylesheet" href="https://cdn.yget.dev/style.css">
</head>
<body>
  <form id="login-form">
    <input type="email" placeholder="邮箱">
    <input type="password" placeholder="密码">
    <div id="yget-widget"></div>
    <button type="submit">登录</button>
  </form>
  
  <script>
    YgETWidget.mount('#yget-widget', {
      siteKey: 'your_site_key_here',
      onVerify: function(result) {
        if (result.success) {
          console.log('验证成功:', result.token);
        }
      }
    });
  </script>
</body>
</html>`}
                language="html"
              />
            </div>
          </section>

          <section id="verify">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-light-100 flex items-center justify-center">
                <Server className="w-6 h-6 text-light-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">验证 Token</h2>
                <p className="text-gray-600">在后端验证用户的验证码 Token</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-blue-200 p-6 mb-6">
              <p className="text-gray-700 mb-4">使用 curl 验证：</p>
              <CodeBlock
                code={`curl -X POST http://localhost:3001/api/captcha/verify/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "token": "USER_VERIFICATION_TOKEN"
  }'`}
                language="bash"
              />
            </div>
            
            <div className="bg-white rounded-xl border border-blue-200 p-6 mb-6">
              <p className="text-gray-700 mb-4">使用 Node.js 验证：</p>
              <CodeBlock
                code={`const axios = require('axios');

async function verifyToken(token) {
  try {
    const response = await axios.post(
      'http://localhost:3001/api/captcha/verify/token',
      { token },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data.success) {
      console.log('Token 验证通过');
      return true;
    } else {
      console.log('Token 验证失败:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('验证请求失败:', error.message);
    return false;
  }
}`}
                language="javascript"
              />
            </div>
            
            <div className="bg-white rounded-xl border border-blue-200 p-6">
              <p className="text-gray-700 mb-4">响应示例：</p>
              <CodeBlock
                code={`// 成功响应
{
  "success": true,
  "message": "验证通过",
  "data": {
    "challengeId": "abc123",
    "verifiedAt": "2024-01-01T12:00:00Z"
  }
}

// 失败响应
{
  "success": false,
  "message": "无效的 Token"
}`}
                language="json"
              />
            </div>
          </section>
        </div>

        <div className="mt-16 flex items-center justify-between p-6 bg-white rounded-xl border border-blue-200">
          <div>
            <h3 className="text-gray-900 font-semibold mb-1">下一步</h3>
            <p className="text-gray-600 text-sm">查看完整文档了解更多配置选项</p>
          </div>
          <a
            href="/docs"
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-400 to-light-400 text-white font-medium hover:shadow-lg hover:shadow-blue-200 transition-all"
          >
            阅读文档
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
