import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

const BeritaPage = () => {
  const [news, setNews] = useState(null);
  const { id } = useParams();
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const fetchNews = useCallback(async () => {
    try {
      const response = await axios.get(`https://tarombo-sinaga-api.vercel.app/api/family-news/${id}`);
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

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
            <div className="w-full">
              <Worker workerUrl={pdfjsWorker}>
                <Viewer fileUrl={news.pdfFile} plugins={[defaultLayoutPluginInstance]} />
              </Worker>
            </div>
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
