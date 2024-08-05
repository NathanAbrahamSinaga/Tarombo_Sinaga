import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminBeritaPage = () => {
  const [news, setNews] = useState([]);
  const [title, setTitle] = useState('');
  const [headerImage, setHeaderImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://tarombo-sinaga-api.vercel.app/api/family-news', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('headerImage', headerImage);
    formData.append('pdfFile', pdfFile);

    try {
      const token = localStorage.getItem('token');
      await axios.post('https://tarombo-sinaga-api.vercel.app/api/family-news', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });
      setTitle('');
      setHeaderImage(null);
      setPdfFile(null);
      fetchNews();
    } catch (error) {
      console.error('Error creating news:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://tarombo-sinaga-api.vercel.app/api/family-news/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  return (
    <div className="bg-[#d6d7e7] min-h-screen">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Edit Berita</h1>
        <form onSubmit={handleSubmit} className="mb-12 bg-white shadow-md rounded-lg p-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul"
            className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Header Image</label>
            <input
              type="file"
              onChange={(e) => setHeaderImage(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload PDF File</label>
            <input
              type="file"
              onChange={(e) => setPdfFile(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition duration-300">
            Tambah Berita
          </button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <div key={item._id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img src={item.headerImage} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2 text-gray-800">{item.title}</h2>
                <p className="text-sm text-gray-600 mb-3">{new Date(item.date).toLocaleDateString()}</p>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
        <Link to="/admin-tarombo" className="block mt-8 text-center text-blue-600 hover:text-blue-800">
          Kembali
        </Link>
      </div>
    </div>
  );
};

export default AdminBeritaPage;
