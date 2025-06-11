import { useEffect, useState } from "react";
import { useFilter } from "./FilterContext";
import axios from "axios";
import { Tally3 } from "lucide-react";
import BookCard from "./BookCard";

const MainContent = () => {
  const { searchQuery, selectedCategory, minPrice, maxPrice, keyword } =
    useFilter();

  const [filter, setFilter] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]); // Store all products
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    let url = `https://dummyjson.com/products?limit=100`; // Get all products initially

    if (keyword) {
      url = `https://dummyjson.com/products/search?q=${keyword}`;
    }

    axios
      .get(url)
      .then((response) => {
        setAllProducts(response.data.products); // Store all products
        setTotalProducts(response.data.total);
        // Set paginated products
        const startIdx = (currentPage - 1) * itemsPerPage;
        const endIdx = startIdx + itemsPerPage;
        setProducts(response.data.products.slice(startIdx, endIdx));
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, [currentPage, keyword]);

  const getFilteredProducts = () => {
    let filteredProducts = [...allProducts]; // Work with all products for filtering

    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === selectedCategory
      );
    }
    if (minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= minPrice
      );
    }
    if (maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price <= maxPrice
      );
    }
    if (searchQuery) {
      filteredProducts = filteredProducts.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (filter) {
      case "expensive":
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case "cheap":
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "popular":
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    // Apply pagination after filtering
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    return filteredProducts.slice(startIdx, endIdx);
  };

  const filteredProducts = getFilteredProducts();
  const totalFilteredProducts = allProducts.filter((product) => {
    // Same filtering logic as getFilteredProducts but without pagination
    if (selectedCategory && product.category !== selectedCategory) return false;
    if (minPrice !== undefined && product.price < minPrice) return false;
    if (maxPrice !== undefined && product.price > maxPrice) return false;
    if (
      searchQuery &&
      !product.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  }).length;

  const totalPages = Math.ceil(totalFilteredProducts / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPaginationButtons = () => {
    const buttons: number[] = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage - 2 < 1) {
      endPage = Math.min(totalPages, endPage + (2 - (currentPage - 1)));
    }

    if (currentPage + 2 > totalPages) {
      startPage = Math.max(1, startPage - (2 - totalPages + currentPage));
    }

    for (let page = startPage; page <= endPage; page++) {
      buttons.push(page);
    }
    return buttons;
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <section className="lg:w-[55rem] md:w-[45rem] sm:w-[40rem] w-full p-5 bg-gray-50 rounded-lg shadow-lg">
      <div className="mb-5">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="relative mb-5 mt-5">
            <button
              className="border px-4 py-2 rounded-full flex items-center bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              onClick={toggleDropdown}
            >
              <Tally3 className="mr-2" />
              {filter === "all"
                ? "Filter"
                : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>

            {dropdownOpen && (
              <div className="absolute bg-white border border-gray-300 rounded mt-2 w-full sm:w-40 shadow-md">
                <button
                  onClick={() => setFilter("cheap")}
                  className="block px-4 py-2 w-full text-left hover:bg-gray-200 transition-colors"
                >
                  Cheap
                </button>
                <button
                  onClick={() => setFilter("expensive")}
                  className="block px-4 py-2 w-full text-left hover:bg-gray-200 transition-colors"
                >
                  Expensive
                </button>
                <button
                  onClick={() => setFilter("popular")}
                  className="block px-4 py-2 w-full text-left hover:bg-gray-200 transition-colors"
                >
                  Popular
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <BookCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              image={product.imageUrl || product.images[0] || ""}
            />
          ))}
        </div>

        {/* Pagination controls - only show if total filtered products > itemsPerPage */}
        {totalFilteredProducts > itemsPerPage && (
          <div className="flex flex-wrap justify-center mt-5">
            {currentPage > 1 && (
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="border px-4 py-2 mx-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Previous
              </button>
            )}

            {getPaginationButtons().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`border px-4 py-2 mx-1 rounded-full ${
                  page === currentPage
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                } hover:bg-blue-700 transition-colors`}
              >
                {page}
              </button>
            ))}

            {currentPage < totalPages && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="border px-4 py-2 mx-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default MainContent;
