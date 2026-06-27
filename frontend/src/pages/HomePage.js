import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { FiPlus, FiClock, FiTag } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

export default function HomePage() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPages = async () => {
      try {
        setLoading(true);
        const response = await api.get('/wiki?limit=10&sort=-updatedAt');
        setPages(response.data.pages);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load pages');
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Welcome to Wiki Manager</h1>
        <p className="text-blue-100 text-lg">
          Collaborative documentation for your infrastructure and deployments
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="text-3xl font-bold text-blue-600">{pages.length}</div>
          <div className="text-gray-600 text-sm mt-2">Wiki Pages</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="text-3xl font-bold text-green-600">128</div>
          <div className="text-gray-600 text-sm mt-2">Total Edits</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="text-3xl font-bold text-purple-600">12</div>
          <div className="text-gray-600 text-sm mt-2">Collaborators</div>
        </div>
      </div>

      {/* Recent Pages */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">📖 Recent Pages</h2>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center text-gray-500">
            Loading pages...
          </div>
        ) : error ? (
          <div className="px-6 py-12 text-center text-red-600">
            {error}
          </div>
        ) : pages.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500 mb-4">No pages yet. Create your first page!</p>
            <Link
              to="/editor"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <FiPlus className="w-5 h-5" />
              <span>Create New Page</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {pages.map((page) => (
              <Link
                key={page._id}
                to={`/page/${page.slug}`}
                className="px-6 py-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 hover:text-blue-600">
                      {page.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {String(page.content || '').substring(0, 100) || 'No content available'}...
                    </p>
                    <div className="flex items-center space-x-4 mt-3">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <FiTag className="w-3 h-3" />
                        <span className="capitalize">{page.category}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <FiClock className="w-3 h-3" />
                        <span>{formatDistanceToNow(new Date(page.updatedAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-xs text-gray-500">
                      By {page.author?.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {page.viewCount} views
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📚 Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: 'Infrastructure', icon: '🏗️', color: 'blue' },
            { name: 'Deployment', icon: '🚀', color: 'green' },
            { name: 'Security', icon: '🔐', color: 'red' },
            { name: 'Database', icon: '💾', color: 'purple' },
            { name: 'Monitoring', icon: '📊', color: 'orange' },
            { name: 'Troubleshooting', icon: '🔧', color: 'yellow' }
          ].map((category) => (
            <Link
              key={category.name}
              to={`/search?category=${category.name.toLowerCase()}`}
              className={`p-4 rounded-lg border-2 border-${category.color}-200 hover:bg-${category.color}-50 transition`}
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <div className="font-medium text-gray-900">{category.name}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-2">💡 Getting Started</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>✓ Create documentation for your infrastructure</li>
          <li>✓ Collaborate with your team in real-time</li>
          <li>✓ Search and discover existing documentation</li>
          <li>✓ Track version history of all changes</li>
          <li>✓ Share and export documentation as needed</li>
        </ul>
      </div>
    </div>
  );
}
