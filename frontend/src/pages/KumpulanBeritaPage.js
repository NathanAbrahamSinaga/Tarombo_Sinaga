import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const KumpulanBeritaPage = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get('https://tarombo-sinaga-api.vercel.app/api/family-news');
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-[#f4eeee] min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Berita</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <Link to={`/berita/${item._id}`} key={item._id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <img src={item.headerImage} alt={item.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h2>
              <p className="text-gray-600 text-sm mb-4">{new Date(item.date).toLocaleDateString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default KumpulanBeritaPage;
