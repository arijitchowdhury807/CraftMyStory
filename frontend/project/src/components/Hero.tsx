import React from 'react';
import { Sparkles, Play } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-800 overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Where Art Meets
            <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
              {' '}Innovation
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover extraordinary artwork from talented artists worldwide. When artists can't create posts, 
            our AI generates stunning reel videos to showcase their masterpieces.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 flex items-center">
              <Sparkles className="h-5 w-5 mr-2" />
              Explore Artwork
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-200 flex items-center">
              <Play className="h-5 w-5 mr-2" />
              Watch AI Reels
            </button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent"></div>
    </div>
  );
}