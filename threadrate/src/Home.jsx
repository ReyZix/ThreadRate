import React from 'react';
import { FaHome, FaStar, FaUser, FaBell, FaCog, FaUpload } from 'react-icons/fa';

const mockImages = [
  {
    id: 1,
    title: 'Cool Jacket',
    description: 'A dope jacket from last season.',
    url: 'https://via.placeholder.com/300x200?text=Jacket',
  },
  {
    id: 2,
    title: 'Retro Sneakers',
    description: 'Vintage vibes with modern comfort.',
    url: 'https://via.placeholder.com/300x200?text=Sneakers',
  },
  {
    id: 3,
    title: 'Streetwear Fit',
    description: 'Casual and stylish.',
    url: 'https://via.placeholder.com/300x200?text=Outfit',
  },
];

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-16 bg-white border-r shadow-md flex flex-col items-center py-6 space-y-6">
        <FaHome className="text-xl text-gray-600 hover:text-black cursor-pointer" />
        <FaStar className="text-xl text-gray-600 hover:text-black cursor-pointer" />
        <FaUser className="text-xl text-gray-600 hover:text-black cursor-pointer" />
        <FaBell className="text-xl text-gray-600 hover:text-black cursor-pointer" />
        <FaCog className="text-xl text-gray-600 hover:text-black cursor-pointer" />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">ThreadRate</h1>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
            <FaUpload />
            Upload
          </button>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockImages.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
            >
              <img src={item.url} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-1">{item.title}</h2>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
