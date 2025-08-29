import React from 'react';
import { X, Heart, Eye, Share, ShoppingCart, Play, Sparkles } from 'lucide-react';
import type { Product } from '../types';
import { mockArtists } from '../data/mockData';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const artist = mockArtists.find(a => a.id === product.artistId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{product.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="relative">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full rounded-lg shadow-lg"
                />
                {product.aiGenerated && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Generated Content
                  </div>
                )}
                {product.videoReel && (
                  <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-40 transition-colors rounded-lg">
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                  </button>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {product.images.slice(1).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${product.title} ${index + 2}`}
                      className="w-full h-20 object-cover rounded-md cursor-pointer hover:opacity-75 transition-opacity"
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl font-bold text-gray-900">
                    ${product.price}
                  </div>
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center px-3 py-2 text-gray-600 hover:text-red-500 transition-colors">
                      <Heart className="h-5 w-5 mr-1" />
                      {product.likes}
                    </button>
                    <button className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-500 transition-colors">
                      <Share className="h-5 w-5 mr-1" />
                      Share
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {product.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {artist && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">About the Artist</h4>
                    <div className="flex items-center mb-3">
                      <img
                        src={artist.avatar}
                        alt={artist.name}
                        className="w-12 h-12 rounded-full object-cover mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{artist.name}</div>
                        <div className="text-sm text-gray-600">{artist.location}</div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{artist.bio}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {artist.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Purchase Now
                  </button>
                  <button className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                    Contact Artist
                  </button>
                </div>

                <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {product.views} views
                  </div>
                  <div>Category: {product.category}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}