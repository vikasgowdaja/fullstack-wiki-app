import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiBookOpen, FiChevronRight } from 'react-icons/fi';

const CATEGORIES = [
  { name: 'Infrastructure', value: 'infrastructure' },
  { name: 'Deployment', value: 'deployment' },
  { name: 'Security', value: 'security' },
  { name: 'Database', value: 'database' },
  { name: 'Monitoring', value: 'monitoring' },
  { name: 'Troubleshooting', value: 'troubleshooting' },
  { name: 'Application', value: 'application' }
];

export default function Sidebar({ isOpen, onToggle }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed left-0 top-20 z-30 p-2 text-gray-600 hover:text-gray-900"
      >
        <FiChevronRight className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 overflow-y-auto">
      <div className="px-6 py-8">
        {/* Navigation */}
        <nav className="space-y-6">
          {/* Main Links */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Navigation
            </h3>
            <div className="space-y-2">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition ${
                  isActive('/') && location.pathname === '/'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FiHome className="w-5 h-5" />
                <span>Home</span>
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Categories
            </h3>
            <div className="space-y-2">
              {CATEGORIES.map((category) => (
                <Link
                  key={category.value}
                  to={`/search?category=${category.value}`}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                >
                  <FiBookOpen className="w-5 h-5" />
                  <span className="text-sm">{category.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Resources
            </h3>
            <div className="space-y-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition text-sm"
              >
                <span>GitHub</span>
              </a>
              <a
                href="https://markdown-guide.readthedocs.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition text-sm"
              >
                <span>Markdown Guide</span>
              </a>
            </div>
          </div>
        </nav>

        {/* Collapse Button */}
        <button
          onClick={onToggle}
          className="mt-8 w-full py-2 text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center space-x-2"
        >
          <span>Hide Sidebar</span>
        </button>
      </div>
    </div>
  );
}
