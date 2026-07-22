import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  name: string;
  href?: string;
  children?: NavItem[];
}

const sidebarNav: NavItem[] = [
  {
    name: '快速开始',
    href: '/guide',
    children: [
      { name: '简介', href: '/guide#intro' },
      { name: '安装', href: '/guide#install' },
      { name: '集成', href: '/guide#integrate' },
      { name: '验证', href: '/guide#verify' },
    ],
  },
  {
    name: '文档',
    href: '/docs',
    children: [
      { name: 'Widget 配置', href: '/docs#widget' },
      { name: 'API 参考', href: '/docs#api' },
      { name: '最佳实践', href: '/docs#best-practices' },
      { name: '常见问题', href: '/docs#faq' },
    ],
  },
  {
    name: 'Demo',
    href: '/demo',
  },
  {
    name: 'API 文档',
    href: '/api',
    children: [
      { name: '验证接口', href: '/api#verify' },
      { name: '生成接口', href: '/api#generate' },
      { name: '响应格式', href: '/api#response' },
    ],
  },
];

export default function Sidebar() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['快速开始']));
  const location = useLocation();

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const renderNavItem = (item: NavItem, depth = 0) => {
    const isExpanded = expandedItems.has(item.name);
    const hasChildren = item.children && item.children.length > 0;
    const isActive = location.pathname === item.href;

    return (
      <div key={item.name}>
        {hasChildren ? (
          <div>
            <button
              onClick={() => toggleExpand(item.name)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'text-blue-600 bg-blue-100' : 'text-gray-600 hover:text-gray-900 hover:bg-blue-50'
              }`}
              style={{ paddingLeft: `${depth * 12 + 12}px` }}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-blue-500" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              {item.name}
            </button>
            {isExpanded && (
              <div className="mt-1 space-y-0.5">
                {item.children!.map((child) => renderNavItem(child, depth + 1))}
              </div>
            )}
          </div>
        ) : (
          <Link
            to={item.href!}
            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive ? 'text-blue-600 bg-blue-100' : 'text-gray-600 hover:text-gray-900 hover:bg-blue-50'
            }`}
            style={{ paddingLeft: `${depth * 12 + 12}px` }}
          >
            {item.name}
          </Link>
        )}
      </div>
    );
  };

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-blue-200 overflow-y-auto hidden lg:block">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          导航
        </div>
        {sidebarNav.map((item) => renderNavItem(item))}
      </div>
    </aside>
  );
}
