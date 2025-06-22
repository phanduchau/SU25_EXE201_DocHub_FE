import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { newsMock } from '../data/newsMock';
import { Calendar, Tag } from 'lucide-react';

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const article = newsMock.find((n) => n.id === Number(id));

  if (!article) {
    return <div className="p-10 text-center text-red-500">Không tìm thấy bài viết.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 md:px-32">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-72 object-cover"
        />
        <div className="p-6 md:p-10">
          <div className="flex items-center text-gray-500 text-sm mb-3 gap-2">
            <Calendar className="w-4 h-4" />
            <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-snug">
            {article.title}
          </h1>
          <div className="flex flex-wrap gap-2 mb-6">
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
          <div className="prose prose-sm md:prose-base max-w-none text-gray-800 whitespace-pre-line">
            {article.content}
          </div>
          <div className="mt-10">
            <Link
              to="/news"
              className="text-teal-600 hover:underline text-sm flex items-center gap-1"
            >
              ← Quay lại danh sách tin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
