'use client'
import { useState, useEffect } from "react";
import { ShoppingBag, CheckCircle, ChevronDown, Search, Filter, X, Heart, Sliders } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Product data
const products = [
  { name: "Nexus Void Tee", category: "T-Shirts", image: "/images/s8.png", price: 1399 },
  { name: "Pixel Panther Tee", category: "T-Shirts", image: "/images/ps2.jpg", price: 1399 },
  { name: "Tokyo Neon Tee", category: "T-Shirts", image: "/images/s3.png", price: 1399 },
  { name: "Quantum Quirk Tee", category: "T-Shirts", image: "/images/s11.png", price: 1399 },
  { name: "Holo Hustle Tee", category: "T-Shirts", image: "/images/s13.png", price: 1399 },
  { name: "Nebula Notes Tee", category: "T-Shirts", image: "/images/s15.png", price: 1399 },
  { name: "Glitch Glory Tee", category: "T-Shirts", image: "/images/s17.png", price: 1399 },
  { name: "Synth Wave Tee", category: "T-Shirts", image: "/images/ps4.jpg", price: 1399 },
  { name: "Cyber Spook Tee", category: "T-Shirts", image: "/images/s5.png", price: 1399 },
  { name: "Binary Bloom Tee", category: "T-Shirts", image: "/images/slider5.png", price: 1399 },
  { name: "Pink Matrix Tee", category: "T-Shirts", image: "/images/s16.png", price: 1399 },
  { name: "Azure Echo Tee", category: "T-Shirts", image: "/images/s1.png", price: 1399 },
  { name: "Galaxy Grid Tee", category: "T-Shirts", image: "/images/ps1.jpg", price: 1399 },
  { name: "Deep Byte Tee", category: "T-Shirts", image: "/images/ps6.jpg", price: 1399 },
  { name: "Morpho Code Tee", category: "T-Shirts", image: "/images/s2.png", price: 1399 },
  { name: "Pure Script Tee", category: "T-Shirts", image: "/images/s18.png", price: 1399 },
  { name: "Crypto Cub Tee", category: "T-Shirts", image: "/images/s19.png", price: 1399 },
  { name: "Drama Core Tee", category: "T-Shirts", image: "/images/s20.png", price: 1399 },
  
  // Caps
  { name: "Nexus Snapback", category: "Caps", image: "/images/cap1.jpg", price: 700 },
  { name: "Tokyo Nights Cap", category: "Caps", image: "/images/cap2.jpg", price: 700 },
  { name: "Quantum Edge Cap", category: "Caps", image: "/images/cap3.jpg", price: 700 },
  { name: "Pixel Peak Cap", category: "Caps", image: "/images/cap4.jpg", price: 700 }
];

const sizes = ["S", "M", "L", "XL"];
const categories = ["All", "Caps", "T-Shirts"];
const priceRanges = [
  { label: "All", min: 0, max: Infinity },
  { label: "Under 1000", min: 0, max: 999 },
  { label: "1000 - 1500", min: 1000, max: 1500 },
  { label: "Above 1500", min: 1501, max: Infinity }
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("All");
  const [cart, setCart] = useState<any[]>([]);
  const [addedToCart, setAddedToCart] = useState<number | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: string }>({});
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState("Popular");

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));
    
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
    
    setPageLoaded(true);
    
    const handleClickOutside = (event: MouseEvent) => {
      const categoryDropdown = document.getElementById("category-dropdown");
      const priceDropdown = document.getElementById("price-dropdown");
      
      if (categoryDropdown && !categoryDropdown.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (priceDropdown && !priceDropdown.contains(event.target as Node)) {
        setIsPriceOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddToCart = (product: any, index: number) => {
    const size = selectedSizes[index] || "M";
    const productWithSize = { ...product, size, quantity: 1 };
    
    const existingProductIndex = cart.findIndex(
      item => item.name === product.name && item.size === size
    );
    
    let newCart;
    if (existingProductIndex >= 0) {
      newCart = [...cart];
      newCart[existingProductIndex].quantity += 1;
    } else {
      newCart = [...cart, productWithSize];
    }
    
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    setAddedToCart(index);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  const handleSizeChange = (index: number, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [index]: size }));
  };

  const toggleCategoryDropdown = () => {
    setIsCategoryOpen(!isCategoryOpen);
    setIsPriceOpen(false);
  };

  const togglePriceDropdown = () => {
    setIsPriceOpen(!isPriceOpen);
    setIsCategoryOpen(false);
  };

  const selectCategory = (category: string) => {
    setSelectedCategory(category);
    setIsCategoryOpen(false);
  };

  const selectPriceRange = (range: string) => {
    setSelectedPriceRange(range);
    setIsPriceOpen(false);
  };

  const toggleWishlist = (index: number) => {
    const newWishlist = wishlist.includes(index)
      ? wishlist.filter(item => item !== index)
      : [...wishlist, index];
    
    setWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
  };

  const filteredProducts = products
    .filter(product => selectedCategory === "All" || product.category === selectedCategory)
    .filter(product => {
      const range = priceRanges.find(r => r.label === selectedPriceRange) || priceRanges[0];
      return product.price >= range.min && product.price <= range.max;
    })
    .filter(product => 
      searchTerm === "" || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch(sortOption) {
        case "Price: Low to High": return a.price - b.price;
        case "Price: High to Low": return b.price - a.price;
        case "Latest": return 0; // Add your own logic for latest
        default: return 0; // Default is Popular (no sorting)
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 right-0 bg-blue-100/20 w-[30rem] h-[30rem] rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 bg-gray-200/30 w-[30rem] h-[30rem] rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/2"></div>
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {addedToCart !== null && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-blue-950/90 backdrop-blur-md text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center"
          >
            <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
            <span>Added to cart!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-block bg-blue-950/5 backdrop-blur-sm text-gray-700 text-sm px-4 py-1 rounded-full mb-2"
          >
            Premium Collection
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-950 to-gray-800">
              Shop the Best
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="max-w-2xl mx-auto text-gray-500 text-sm sm:text-base"
          >
            Discover our curated collection of premium merchandise designed for style and comfort.
          </motion.p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 items-center"
        >
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-full py-2.5 sm:py-3 pl-10 sm:pl-12 pr-4 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2" />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            )}
          </div>
          
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Category Dropdown */}
            <div id="category-dropdown" className="relative flex-1 sm:flex-none">
              <button
                onClick={toggleCategoryDropdown}
                className="w-full min-w-[120px] sm:min-w-[150px] bg-white border border-gray-200 shadow-sm rounded-full py-2.5 sm:py-3 px-4 flex items-center justify-between text-xs sm:text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="truncate">{selectedCategory}</span>
                <ChevronDown
                  className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-500 transition-transform ${isCategoryOpen ? "transform rotate-180" : ""}`}
                />
              </button>
              
              <AnimatePresence>
                {isCategoryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                  >
                    <ul className="py-1 max-h-60 overflow-y-auto">
                      {categories.map((category, index) => (
                        <li key={index}>
                          <button
                            onClick={() => selectCategory(category)}
                            className={`w-full text-left px-4 py-2 sm:py-2 text-xs sm:text-sm ${
                              selectedCategory === category
                                ? "bg-blue-50 text-blue-800 font-medium"
                                : "text-gray-700 hover:bg-gray-50"
                            } transition-colors duration-150`}
                          >
                            {category}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Price Dropdown */}
            <div id="price-dropdown" className="relative flex-1 sm:flex-none">
              <button
                onClick={togglePriceDropdown}
                className="w-full min-w-[120px] sm:min-w-[150px] bg-white border border-gray-200 shadow-sm rounded-full py-2.5 sm:py-3 px-4 flex items-center justify-between text-xs sm:text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="truncate">{selectedPriceRange}</span>
                <ChevronDown
                  className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-500 transition-transform ${isPriceOpen ? "transform rotate-180" : ""}`}
                />
              </button>
              
              <AnimatePresence>
                {isPriceOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                  >
                    <ul className="py-1 max-h-60 overflow-y-auto">
                      {priceRanges.map((range, index) => (
                        <li key={index}>
                          <button
                            onClick={() => selectPriceRange(range.label)}
                            className={`w-full text-left px-4 py-2 sm:py-2 text-xs sm:text-sm ${
                              selectedPriceRange === range.label
                                ? "bg-blue-50 text-blue-800 font-medium"
                                : "text-gray-700 hover:bg-gray-50"
                            } transition-colors duration-150`}
                          >
                            {range.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Filters button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center bg-blue-950 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 shadow-sm"
            >
              <Sliders className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium text-gray-900">Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-medium text-gray-700 mb-2">Category</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <label key={category} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            checked={selectedCategory === category}
                            onChange={() => setSelectedCategory(category)}
                            className="h-3 w-3 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-xs text-gray-700">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-medium text-gray-700 mb-2">Price Range</h4>
                    <div className="space-y-2">
                      {priceRanges.map((range) => (
                        <label key={range.label} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            checked={selectedPriceRange === range.label}
                            onChange={() => setSelectedPriceRange(range.label)}
                            className="h-3 w-3 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-xs text-gray-700">{range.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product count and sort options */}
        <div className="flex flex-wrap justify-between items-center mb-4 sm:mb-6">
          <p className="text-gray-600 text-xs sm:text-sm">
            Showing <span className="font-medium">{filteredProducts.length}</span> products
          </p>
          
          <div className="flex gap-2 text-xs sm:text-sm">
            {["Popular", "Latest", "Price: Low to High", "Price: High to Low"].map((sort) => (
              <button
                key={sort}
                onClick={() => setSortOption(sort)}
                className={`px-2 sm:px-3 py-1 rounded-full ${
                  sortOption === sort 
                    ? 'bg-blue-950 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } transition-colors`}
              >
                {sort}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {filteredProducts.map((product, index) => {
            const isDiscounted = product.price === 1399;
            const originalPrice = 1500;
            const discountPercentage = isDiscounted
              ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
              : 0;
            const isWishlisted = wishlist.includes(index);

            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index % 8), duration: 0.5 }}
                key={index}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 relative overflow-hidden group"
                whileHover={{ y: -3 }}
              >
                {/* Product image with overlay */}
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <img
                    src={product.image || "https://placehold.co/400x500/e2e8f0/a0aec0?text=No+Image"}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/400x500/e2e8f0/a0aec0?text=No+Image";
                    }}
                  />
                  
                  {/* Category badge */}
                  <div className="absolute top-2 left-2 z-10">
                    <span className="inline-block text-[8px] sm:text-[10px] font-medium text-gray-600 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full shadow-sm">
                      {product.category}
                    </span>
                  </div>
                  
                  {/* Discount badge */}
                  {isDiscounted && (
                    <div className="absolute top-2 right-2 z-10">
                      <span className="inline-block text-[8px] sm:text-[10px] font-bold text-white bg-red-500/90 px-1.5 py-0.5 rounded-full shadow-sm">
                        {discountPercentage}% OFF
                      </span>
                    </div>
                  )}
                  
                  {/* Wishlist button */}
                  <button
                    onClick={() => toggleWishlist(index)}
                    className={`absolute top-2 right-2 z-20 w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 ${
                      isWishlisted 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/80 backdrop-blur-sm text-gray-600 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <Heart className="w-3 h-3" fill={isWishlisted ? "currentColor" : "none"} />
                  </button>
                </div>

                {/* Product details */}
                <div className="p-2">
                  <h3 className="text-[11px] sm:text-xs font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-950 transition-colors">
                    {product.name}
                  </h3>
                  
                  {/* Price Section */}
                  <div className="flex items-center gap-1 mb-1.5">
                    {isDiscounted ? (
                      <>
                        <p className="text-red-500 text-[10px] font-medium line-through">
                          PKR {originalPrice.toLocaleString()}
                        </p>
                        <p className="text-gray-800 text-[11px] font-bold">
                          PKR {product.price.toLocaleString()}
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-800 text-[11px] font-bold">
                        PKR {product.price.toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* Size Selector */}
                  <div className="mb-2">
                    <div className="flex gap-1">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => handleSizeChange(index, size)}
                          className={`flex-1 py-0.5 text-[10px] font-medium rounded border transition-all ${
                            selectedSizes[index] === size || (!selectedSizes[index] && size === "M")
                              ? "bg-blue-950 text-white border-blue-950"
                              : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add to cart button */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleAddToCart(product, index)}
                    className="w-full py-1.5 bg-gradient-to-r from-blue-950 to-blue-900 text-white text-xs font-semibold rounded-md flex items-center justify-center shadow-sm hover:shadow transition-all"
                  >
                    <ShoppingBag className="inline-block w-3 h-3 mr-1" />
                    Add to Cart
                  </motion.button>

                  {/* Added to cart indicator */}
                  <AnimatePresence>
                    {addedToCart === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-[10px] px-2 py-1 rounded-md flex items-center shadow-lg"
                      >
                        <CheckCircle className="w-2.5 h-2.5 mr-1" />
                        Added
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty state when no products match filter */}
        {filteredProducts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 sm:py-16 mt-6 sm:mt-8 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-200"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-5 h-5 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-sm sm:text-lg font-medium text-gray-700 mb-1 sm:mb-2">No products found</h3>
            <p className="text-gray-500 text-xs sm:text-base mb-3 sm:mb-4">Try adjusting your search or filter to find what you're looking for.</p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedPriceRange("All");
                setSearchTerm("");
              }}
              className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-950 text-white rounded-md sm:rounded-lg text-xs sm:text-sm font-medium"
            >
              Reset Filters
            </button>
          </motion.div>
        )}

        {/* "Load More" button */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-8 sm:mt-12">
            <button className="px-4 py-2 sm:px-6 sm:py-3 border border-gray-300 rounded-full text-gray-700 text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors">
              Load More Products
            </button>
          </div>
        )}
      </div>

      {/* Cart Floating Button */}
      <AnimatePresence>
        {pageLoaded && cart.length > 0 && (
          <Link href="/cart" passHref>
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 bg-blue-950 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-full shadow-xl z-50 flex items-center gap-1 sm:gap-2 cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center rounded-full">
                  {cart.reduce((total, item) => total + (item.quantity || 1), 0)}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-medium hidden sm:block">
                View Cart
              </span>
            </motion.div>
          </Link>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
