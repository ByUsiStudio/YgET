import { Github, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-blue-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-light-400 flex items-center justify-center">
                <span className="text-white font-bold text-sm">Y</span>
              </div>
              <span className="text-xl font-bold text-gray-900">YgET</span>
            </div>
            <p className="text-gray-600 text-sm mb-4 max-w-md">
              YgET 是一款现代化的验证码服务，提供安全、便捷的人机验证解决方案。
              支持多种验证方式，为您的应用提供可靠的安全保障。
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-blue-50 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-blue-50 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@yget.dev"
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-blue-50 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4">产品</h3>
            <ul className="space-y-2">
              <li>
                <a href="/guide" className="text-gray-600 text-sm hover:text-gray-900 transition-colors">
                  快速开始
                </a>
              </li>
              <li>
                <a href="/docs" className="text-gray-600 text-sm hover:text-gray-900 transition-colors">
                  文档
                </a>
              </li>
              <li>
                <a href="/demo" className="text-gray-600 text-sm hover:text-gray-900 transition-colors">
                  Demo
                </a>
              </li>
              <li>
                <a href="/api" className="text-gray-600 text-sm hover:text-gray-900 transition-colors">
                  API 参考
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold mb-4">资源</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 text-sm hover:text-gray-900 transition-colors">
                  博客
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 text-sm hover:text-gray-900 transition-colors">
                  更新日志
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 text-sm hover:text-gray-900 transition-colors">
                  常见问题
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 text-sm hover:text-gray-900 transition-colors">
                  联系我们
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-100 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} YgET. 保留所有权利。
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-600 text-sm hover:text-gray-900 transition-colors">
              隐私政策
            </a>
            <a href="#" className="text-gray-600 text-sm hover:text-gray-900 transition-colors">
              服务条款
            </a>
            <a href="#" className="text-gray-600 text-sm hover:text-gray-900 transition-colors">
              Cookie 设置
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
