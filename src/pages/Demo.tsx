import { useState } from 'react';
import { Play, RefreshCw, Code, Eye, Settings } from 'lucide-react';
import CaptchaWidget from '@/components/CaptchaWidget';
import CodeBlock from '@/components/CodeBlock';

export default function Demo() {
  const [activeTab, setActiveTab] = useState<'click'>('click');
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    token?: string;
  } | null>(null);

  const tabs = [
    { id: 'click' as const, name: '点选验证', description: '点击图片中的目标位置' },
  ];

  return (
    <div className="min-h-screen bg-light-50 lg:pl-64">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-6">
            <Play className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600">实时演示</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Demo</h1>
          <p className="text-gray-600 text-lg">
            体验 YgET 验证码的交互效果，查看实际验证流程。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900 font-medium">选择验证类型</span>
              </div>
              <button
                onClick={() => {
                  setVerificationResult(null);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-gray-600 hover:text-gray-900 hover:bg-blue-100 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                重置
              </button>
            </div>
            
            <div className="flex gap-2 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setVerificationResult(null);
                  }}
                  className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-600 border border-blue-300'
                      : 'bg-white text-gray-600 border border-blue-200 hover:text-gray-900 hover:border-blue-300'
                  }`}
                >
                  <div className="font-semibold">{tab.name}</div>
                  <div className="text-xs opacity-70">{tab.description}</div>
                </button>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-blue-200 p-6 shadow-md">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900 font-medium">验证码预览</span>
              </div>
              
              <CaptchaWidget />
              
              {verificationResult && (
                <div className={`mt-6 p-4 rounded-lg ${
                  verificationResult.success
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      verificationResult.success
                        ? 'bg-green-100'
                        : 'bg-red-100'
                    }`}>
                      {verificationResult.success ? (
                        <span className="text-green-500 text-xl">✓</span>
                      ) : (
                        <span className="text-red-500 text-xl">✗</span>
                      )}
                    </div>
                    <div>
                      <div className={`font-semibold ${
                        verificationResult.success ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {verificationResult.success ? '验证成功' : '验证失败'}
                      </div>
                      {verificationResult.token && (
                        <div className="text-gray-600 text-sm mt-1">
                          Token: <code className="text-blue-500">{verificationResult.token}</code>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 p-6 bg-white rounded-xl border border-blue-200">
              <h3 className="text-gray-900 font-semibold mb-4">验证流程说明</h3>
              <ol className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center flex-shrink-0 text-sm">1</span>
                  <span>用户点击图片中的目标位置完成验证</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-light-100 text-light-500 flex items-center justify-center flex-shrink-0 text-sm">2</span>
                  <span>Widget 收集用户点击坐标，向服务器发送验证请求</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center flex-shrink-0 text-sm">3</span>
                  <span>服务器验证点击位置与目标位置的匹配度，返回 Token</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-light-100 text-light-500 flex items-center justify-center flex-shrink-0 text-sm">4</span>
                  <span>前端获取 Token，提交表单时携带</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center flex-shrink-0 text-sm">5</span>
                  <span>后端调用 API 验证 Token 有效性</span>
                </li>
              </ol>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-6">
              <Code className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900 font-medium">集成代码</span>
            </div>
            
            <div className="bg-white rounded-xl border border-blue-200 p-6 mb-6">
              <h3 className="text-gray-900 font-semibold mb-4">React 集成</h3>
              <CodeBlock
                code={`import { YgETWidget } from '@yget/widget';
import '@yget/widget/dist/style.css';

function App() {
  const handleVerify = (result) => {
    if (result.success) {
      console.log('验证成功:', result.token);
      setFormData(prev => ({
        ...prev,
        captchaToken: result.token
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" required />
      <input type="password" required />
      
      <YgETWidget
        siteKey="your_site_key"
        type="click"
        onVerify={handleVerify}
      />
      
      <button type="submit">提交</button>
    </form>
  );
}`}
                language="javascript"
              />
            </div>

            <div className="bg-white rounded-xl border border-blue-200 p-6">
              <h3 className="text-gray-900 font-semibold mb-4">HTML 集成</h3>
              <CodeBlock
                code={`<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.yget.dev/widget.js"></script>
  <link rel="stylesheet" href="https://cdn.yget.dev/style.css">
</head>
<body>
  <form id="my-form">
    <input type="email" required>
    <input type="password" required>
    <div id="captcha-container"></div>
    <button type="submit">提交</button>
  </form>
  
  <script>
    let captchaToken = null;
    
    YgETWidget.mount('#captcha-container', {
      siteKey: 'your_site_key',
      type: 'click',
      onVerify: function(result) {
        if (result.success) {
          captchaToken = result.token;
          console.log('验证成功');
        }
      }
    });
    
    document.getElementById('my-form').addEventListener('submit', function(e) {
      e.preventDefault();
      if (!captchaToken) {
        alert('请先完成验证码验证');
        return;
      }
    });
  </script>
</body>
</html>`}
                language="html"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 bg-white rounded-xl border border-blue-200">
          <h3 className="text-gray-900 font-semibold mb-4">后端验证示例</h3>
          <p className="text-gray-600 mb-4">用户完成验证后，您需要在后端验证 Token 的有效性：</p>
          <CodeBlock
            code={`// Node.js / Express
app.post('/api/login', async (req, res) => {
  const { email, password, captchaToken } = req.body;
  
  const verifyResponse = await fetch('http://localhost:3001/api/captcha/verify/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token: captchaToken })
  });
  
  const verifyData = await verifyResponse.json();
  
  if (!verifyData.success) {
    return res.status(400).json({ message: '验证码验证失败' });
  }
  
  // Token 验证通过，继续处理登录逻辑
});`}
            language="javascript"
          />
        </div>
      </div>
    </div>
  );
}
