import React, { useState } from 'react';
import { Calendar, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { newsMock } from '../data/newsMock';

const News: React.FC = () => {
  const [filter, setFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const filteredArticles = filter
    ? newsMock.filter(
        (a) => a.tags.includes(filter) || a.category === filter
      )
    : newsMock;

  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const totalPages = Math.ceil(filteredArticles.length / perPage);

  const uniqueTags = Array.from(
    new Set(newsMock.flatMap((a) => [...a.tags, a.category]))
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-20">
      <h1 className="text-4xl font-bold text-center text-teal-700 mb-10">
        📰 Tin tức & Cập nhật
      </h1>

      {/* Bộ lọc */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <button
          onClick={() => {
            setFilter(null);
            setCurrentPage(1);
          }}
          className={`px-4 py-2 text-sm rounded-full border ${
            filter === null ? 'bg-teal-600 text-white' : 'hover:bg-teal-100'
          }`}
        >
          Tất cả
        </button>
        {uniqueTags.map((tag) => (
          <button
            key={tag}
            onClick={() => {
              setFilter(tag);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 text-sm rounded-full border ${
              filter === tag ? 'bg-teal-600 text-white' : 'hover:bg-teal-100'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Danh sách bài viết */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedArticles.map((article) => (
          <Link
            to={`/news/${article.id}`}
            key={article.id}
            className="bg-white rounded-2xl shadow hover:shadow-xl transition-all border border-gray-100 overflow-hidden flex flex-col"
          >
            <div className="overflow-hidden">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-5 flex flex-col justify-between h-full">
              <div className="flex items-center text-sm text-gray-500 gap-2 mb-3">
                <Calendar className="w-4 h-4" />
                <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 hover:text-teal-600 transition line-clamp-2 mb-2">
                {article.title}
              </h2>

              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                {article.summary}
              </p>

              <div className="flex flex-wrap gap-2 mt-auto">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full flex items-center gap-1"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 rounded-full border text-sm ${
                currentPage === i + 1
                  ? 'bg-teal-600 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;
