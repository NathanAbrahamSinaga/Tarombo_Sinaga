import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const BeritaPage = () => {
  const [news, setNews] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchNews();
  }, [id]);

  const fetchNews = async () => {
    try {
      const response = await axios.get(`https://tarombo-sinaga-api.vercel.app/api/family-news/${id}`);
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  if (!news) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="w-full h-64 md:h-96 overflow-hidden">
          <img src={news.headerImage} alt={news.title} className="w-full h-full object-cover object-center" />
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">{news.title}</h1>
          <p className="text-gray-600 mb-6">{new Date(news.date).toLocaleDateString()}</p>
          <div className="flex justify-center">
            <embed src={news.pdfFile} type="application/pdf" width="1000" height="1300" />
          </div>
        </div>
      </div>
      <Link to="/berita" className="block mt-8 text-blue-500 hover:text-blue-700">
        Kembali
      </Link>
    </div>
  );
};

export default BeritaPage;
