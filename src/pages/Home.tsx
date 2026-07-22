import { Shield, Zap, Lock, Eye, Code2, Server } from 'lucide-react';
import { Link } from 'react-router-dom';
import FeatureCard from '@/components/FeatureCard';
import CodeBlock from '@/components/CodeBlock';

const features = [
  {
    icon: <Shield className="w-6 h-6 text-blue-500" />,
    title: '安全可靠',
    description: '采用先进的机器学习算法，有效识别机器人攻击，保护您的应用免受恶意访问。',
  },
  {
    icon: <Zap className="w-6 h-6 text-light-500" />,
    title: '快速响应',
    description: '毫秒级响应速度，用户体验流畅无卡顿，不会影响您的业务转化率。',
  },
  {
    icon: <Lock className="w-6 h-6 text-blue-500" />,
    title: '隐私保护',
    description: '严格遵守 GDPR 和 CCPA 隐私法规，不收集用户个人信息，保障数据安全。',
  },
  {
    icon: <Eye className="w-6 h-6 text-light-500" />,
    title: '多种验证方式',
    description: '支持滑块、点选、拼图等多种验证方式，适应不同场景需求。',
  },
  {
    icon: <Code2 className="w-6 h-6 text-blue-500" />,
    title: '简单集成',
    description: '提供清晰的 API 文档和 SDK，只需几行代码即可完成集成。',
  },
  {
    icon: <Server className="w-6 h-6 text-light-500" />,
    title: '高可用性',
    description: '全球多节点部署，99.99% 可用性保障，确保服务始终在线。',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-light-50">
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-light-50" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-light-100 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-200 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-gray-600">v1.0.0 全新发布</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              现代化的
              <span className="bg-gradient-to-r from-blue-500 to-light-500 bg-clip-text text-transparent">
                {' '}验证码服务
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed">
              YgET 提供安全、便捷的人机验证解决方案。
              <br className="hidden sm:block" />
              支持多种验证方式，为您的应用提供可靠的安全保障。
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                to="/guide"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-400 to-light-400 text-white font-semibold hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 hover:scale-105"
              >
                快速开始
              </Link>
              <Link
                to="/demo"
                className="px-8 py-4 rounded-xl bg-white border border-blue-200 text-gray-700 font-semibold hover:border-blue-400 transition-all duration-300"
              >
                查看 Demo
              </Link>
            </div>
            
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-light-100 rounded-2xl blur-xl opacity-50" />
              <div className="relative bg-white rounded-xl border border-blue-200 overflow-hidden shadow-lg">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-b border-blue-200">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-4 text-xs text-gray-500">terminal</span>
                </div>
                <div className="p-6">
                  <CodeBlock
                    code={`# 验证 Token
curl -X POST http://localhost:3001/api/captcha/verify/token \\
  -H "Content-Type: application/json" \\
  -d '{
    "token": "your_token"
  }'`}
                    language="bash"
                    showLineNumbers={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-light-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">核心特性</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              YgET 提供全方位的验证码解决方案，满足各种场景需求
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-light-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                只需 <span className="text-blue-500">3 步</span> 完成集成
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                YgET 设计初衷就是简单易用。无论您是前端开发者还是后端工程师，
                都能在几分钟内完成集成。
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-500 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold mb-1">安装 SDK</h3>
                    <p className="text-gray-600 text-sm">使用 npm 或 yarn 安装 YgET Widget</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-light-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-light-500 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold mb-1">接入 Widget</h3>
                    <p className="text-gray-600 text-sm">在页面中添加验证码组件</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-500 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold mb-1">验证 Token</h3>
                    <p className="text-gray-600 text-sm">后端调用 API 验证用户 Token</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-light-100 to-blue-100 rounded-2xl blur-xl opacity-50" />
              <div className="relative">
                <CodeBlock
                  code={`import { YgETWidget } from '@yget/widget';

function LoginForm() {
  const [token, setToken] = useState(null);

  const handleVerify = (result) => {
    if (result.success) {
      setToken(result.token);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" required />
      <input type="password" required />
      <YgETWidget 
        siteKey="your_site_key"
        onVerify={handleVerify}
      />
      <button type="submit">登录</button>
    </form>
  );
}`}
                  language="javascript"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            准备好开始了吗？
          </h2>
          <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
            加入数千名开发者的行列，使用 YgET 保护您的应用免受机器人攻击。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/guide"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-400 to-light-400 text-white font-semibold hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 hover:scale-105"
            >
              开始使用
            </Link>
            <Link
              to="/docs"
              className="px-8 py-4 rounded-xl bg-blue-50 border border-blue-200 text-gray-700 font-semibold hover:border-blue-400 transition-all duration-300"
            >
              阅读文档
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
