import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Penting: Set worker untuk PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const BeritaPage = () => {
  const [news, setNews] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
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

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
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
          <div className="flex flex-col items-center">
            <Document
              file={news.pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
              className="max-w-full"
            >
              <Page pageNumber={pageNumber} width={Math.min(600, window.innerWidth - 32)} />
            </Document>
            <p className="mt-4">
              Page {pageNumber} of {numPages}
            </p>
            <div className="mt-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={() => setPageNumber(pageNumber - 1)}
                disabled={pageNumber <= 1}
              >
                Previous
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setPageNumber(pageNumber + 1)}
                disabled={pageNumber >= numPages}
              >
                Next
              </button>
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