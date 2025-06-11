import { useState, useEffect } from "react";
import { useFilter } from "./FilterContext";

interface Product {
  category: string;
}

interface FetchResponse {
  products: Product[];
}

const Sidebar = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    keyword,
    setKeyword,
  } = useFilter();

  const [categories, setCategories] = useState<string[]>([]);
  const [keywords] = useState<string[]>([
    "apple",
    "watch",
    "Fashion",
    "trend",
    "shoes",
    "shirt",
  ]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://dummyjson.com/products");
        const data: FetchResponse = await response.json();
        const uniqueCategories = Array.from(
          new Set(data.products.map((product) => product.category))
        );
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinPrice(value ? parseFloat(value) : undefined);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxPrice(value ? parseFloat(value) : undefined);
  };

  const handleRadioChangeCategories = (category: string) => {
    setSelectedCategory(category);
  };

  const handleKeywordClick = (keyword: string) => {
    setKeyword(keyword);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setKeyword("");
  };

  return (
    <div className="w-72 p-6 h-screen bg-white shadow-lg overflow-y-auto">
      <h1 className="text-2xl font-bold mb-8 text-gray-800 border-b pb-4">
        React Store
      </h1>

      {/* Search Section */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">
          Search
        </h2>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </section>

      {/* Price Range Section */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
          Price Range
        </h2>
        <div className="flex space-x-3">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Min</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="$0"
              value={minPrice ?? ""}
              onChange={handleMinPriceChange}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Max</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="$1000"
              value={maxPrice ?? ""}
              onChange={handleMaxPriceChange}
            />
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
          Categories
        </h2>
        <div className="space-y-2">
          {categories.map((category, index) => (
            <label
              key={index}
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
            >
              <input
                type="radio"
                name="category"
                value={category}
                onChange={() => handleRadioChangeCategories(category)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                checked={selectedCategory === category}
              />
              <span className="text-gray-700 capitalize">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Keywords Section */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
          Popular Keywords
        </h2>
        <div className="flex flex-wrap gap-2">
          {keywords.map((kw, index) => (
            <button
              key={index}
              onClick={() => handleKeywordClick(kw)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                keyword === kw
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {kw.charAt(0).toUpperCase() + kw.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Reset Filters Button */}
      <button
        onClick={handleResetFilters}
        className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg transition duration-200 shadow-md hover:shadow-lg"
      >
        Reset All Filters
      </button>
    </div>
  );
};

export default Sidebar;
