import { useState } from 'react';
import { Menu, X, Search, Github, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { name: '首页', href: '/' },
  { name: '指南', href: '/guide' },
  { name: '文档', href: '/docs' },
  { name: 'Demo', href: '/demo' },
  { name: 'API', href: '/api' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-light-400 flex items-center justify-center">
              <span className="text-white font-bold text-sm">Y</span>
            </div>
            <span className="text-xl font-bold text-gray-900">YgET</span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.href
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-blue-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="relative ml-2">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-blue-50 transition-all duration-200"
              >
                更多
                <ChevronDown className="w-4 h-4" />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg border border-blue-200 shadow-xl py-2 z-50">
                  <Link
                    to="/guide"
                    className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-blue-50 transition-colors"
                  >
                    快速开始
                  </Link>
                  <Link
                    to="/docs"
                    className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-blue-50 transition-colors"
                  >
                    完整文档
                  </Link>
                  <div className="border-t border-blue-100 my-2" />
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-blue-50 transition-colors"
                  >
                    GitHub
                  </a>
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-gray-600 hover:text-gray-900 transition-colors">
              <Search className="w-4 h-4" />
              <span className="text-sm">搜索</span>
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-blue-50 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-blue-50 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-blue-200">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.href
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-blue-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
