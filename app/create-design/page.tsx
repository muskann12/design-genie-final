'use client';
import { useState, useRef, useEffect } from "react";
import Card from "@/app/components/ui/card";
import { CardContent } from "../components/ui/cardconten";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, X, Sparkles, ShoppingCart, Check, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

interface CartItem {
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  designArea?: string;
}

const CreatorDesignPage = () => {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState("Shirt");
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState("Black");
  const [size, setSize] = useState("M");
  const [shirtDesignArea, setShirtDesignArea] = useState("Front");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = [
    { 
      name: "Shirt", 
      image: "/images/s1.png", 
      sizes: ["S", "M", "L", "XL"], 
      colors: ["Black", "White", "Red", "Blue"], 
      price: 25 
    },
    { 
      name: "Cap", 
      image: "/images/cap1.jpg", 
      sizes: ["M", "L"], 
      colors: ["Black", "White", "Blue"], 
      price: 15 
    },
  ];

  const designAreas = ["Front", "Back", "Logo", "Sleeves"];
  const suggestedPrompts = [
    "Minimalist geometric pattern",
    "Vintage retro typography design",
    "Abstract watercolor splash",
    "Neon cyberpunk illustration",
    "Nature-inspired botanical drawing",
    "Gradient mesh futuristic artwork",
    "Hand-drawn sketch style",
    "3D rendered metallic effect"
  ];

  const prefix = "Create a design for printing ";
  
  useEffect(() => {
    // Set cursor position to end of prefix when component mounts
    if (inputRef.current) {
      inputRef.current.selectionStart = prefix.length;
      inputRef.current.selectionEnd = prefix.length;
    }
  }, []);

  const selectedProduct = items.find((item) => item.name === selectedItem) ?? {
    name: "",
    image: "",
    sizes: [],
    colors: [],
    price: 0,
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image must be less than 10MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
        toast.success("Image uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePromptSelect = (prompt: string) => {
    setSelectedPrompt(prompt);
    setCustomPrompt(prompt);
    toast.success(`Selected prompt: ${prompt}`);
  };

  const generateImage = async () => {
    const prompt = prefix + (selectedPrompt || customPrompt);
    if (!prompt || prompt.trim() === prefix.trim()) {
      toast.error("Please enter your custom design description!");
      return;
    }

    setLoading(true);
    toast.info("Generating your unique design...");

    try {
      const response = await axios.post(
        "/api/generate",
        { prompt },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.imageUrl) {
        setUploadedImage(response.data.imageUrl);
        toast.success("Design created successfully!");
      } else {
        toast.error("Failed to generate design.");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Something went wrong while generating the design.");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    if (!uploadedImage) {
      toast.error("Please upload or generate a design first");
      return;
    }

    const cartItem: CartItem = {
      name: selectedProduct.name,
      image: uploadedImage,
      price: selectedProduct.price,
      size: size,
      color: color,
      quantity: quantity,
    };

    if (selectedItem === "Shirt") {
      cartItem.designArea = shirtDesignArea;
    }

    const existingCart = localStorage.getItem("cart");
    const cartItems = existingCart ? JSON.parse(existingCart) : [];
    cartItems.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cartItems));
    
    setIsAddedToCart(true);
    toast.success(`${selectedProduct.name} added to cart!`, {
      action: {
        label: "View Cart",
        onClick: () => window.location.href = "/cart"
      },
      duration: 3000
    });
    
    setTimeout(() => setIsAddedToCart(false), 3000);
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Prevent deletion of prefix
    if (!value.startsWith(prefix)) {
      // If user tries to delete prefix, reset to prefix + customPrompt
      e.target.value = prefix + customPrompt;
      // Set cursor position to end
      if (inputRef.current) {
        inputRef.current.selectionStart = prefix.length + customPrompt.length;
        inputRef.current.selectionEnd = prefix.length + customPrompt.length;
      }
      return;
    }
    
    // Update customPrompt with the new text after prefix
    setCustomPrompt(value.slice(prefix.length));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const cursorPos = input.selectionStart;
    
    // Prevent backspace/delete within the prefix
    if (cursorPos !== null && cursorPos <= prefix.length) {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
      }
    }
    
    // Prevent left arrow from going into prefix
    if (e.key === 'ArrowLeft' && cursorPos !== null && cursorPos <= prefix.length) {
      e.preventDefault();
      input.setSelectionRange(prefix.length, prefix.length);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const cursorPos = input.selectionStart;
    
    // Prevent cursor placement within prefix
    if (cursorPos !== null && cursorPos < prefix.length) {
      input.setSelectionRange(prefix.length, prefix.length);
    }
  };

  const navigateToPrompts = () => {
    router.push("/prompt");
  };

  return (
    <div className="p-4 md:p-8 bg-gray-200 min-h-screen">
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-3xl md:text-5xl font-extrabold text-black">Design Studio</h1>
        <h2 className="text-lg md:text-xl font-semibold">Create Your Custom {selectedItem}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Product Selection Panel */}
        <div className="space-y-6 bg-gray-100 p-4 md:p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Select Product</h3>
          <div className="flex flex-wrap gap-4">
            {items.map((item) => (
              <Card
                key={item.name}
                className={`p-2 cursor-pointer transition-all duration-300 rounded-lg shadow-md hover:shadow-lg ${
                  selectedItem === item.name ? "border-4 border-blue-950" : ""
                }`}
                onClick={() => {
                  setSelectedItem(item.name);
                  setSize(item.sizes[0] || "");
                  setColor(item.colors[0] || "Black");
                  setUploadedImage(null);
                  setIsAddedToCart(false);
                }}
              >
                <CardContent>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-16 md:w-20 mx-auto object-contain h-16 md:h-20" 
                  />
                  <p className="text-center mt-2 font-medium text-sm">{item.name}</p>
                  <p className="text-center font-semibold text-gray-700">PKR {item.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedItem === "Shirt" && (
            <div>
              <label className="block font-semibold">Design Area</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {designAreas.map((area) => (
                  <button
                    key={area}
                    className={`px-4 py-2 text-sm rounded-full border-2 font-semibold transition-all duration-300 ${
                      shirtDesignArea === area ? "bg-gray-400 text-white border-blue-950" : "bg-gray-200 border-gray-300"
                    }`}
                    onClick={() => setShirtDesignArea(area)}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold">Color</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedProduct?.colors?.map((col) => (
                <div
                  key={col}
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full border cursor-pointer transition-all duration-300 ${
                    color === col ? "border-4 border-blue-950 scale-110" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: col.toLowerCase() }}
                  onClick={() => setColor(col)}
                ></div>
              ))}
            </div>
          </div>

          {selectedProduct?.sizes?.length > 0 && (
            <div>
              <label className="block font-semibold">Size</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedProduct?.sizes?.map((sz) => (
                  <button
                    key={sz}
                    className={`w-10 h-10 flex justify-center items-center rounded-full border-2 font-semibold transition-all duration-300 ${
                      size === sz ? "bg-gray-400 text-white border-blue-950" : "bg-gray-200 border-gray-300"
                    }`}
                    onClick={() => setSize(sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold">Quantity</label>
            <div className="flex items-center space-x-4 mt-2">
              <button
                className="bg-gray-300 px-3 py-1 rounded-md font-bold hover:bg-gray-400"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                -
              </button>
              <span className="text-lg font-semibold">{quantity}</span>
              <button
                className="bg-blue-950 text-white px-3 py-1 rounded-md font-bold hover:bg-blue-900"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Design Panel */}
        <div className="flex flex-col gap-6 bg-white p-4 md:p-6 rounded-lg shadow-md">
          <div className="flex-1">
            {!uploadedImage ? (
              <div className="border-2 border-dashed border-gray-300 p-6 text-center rounded-lg cursor-pointer h-full flex flex-col items-center justify-center">
                <label className="flex flex-col items-center cursor-pointer">
                  <UploadCloud size={24} className="text-blue-500 mb-2 sm:size-32" />
                  <span className="text-gray-700 text-xs sm:text-sm font-medium">Upload your design or generate one</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload} 
                  />
                </label>
              </div>
            ) : (
              <div className="relative h-full">
                <img 
                  src={uploadedImage} 
                  alt="Generated" 
                  className="w-full h-auto max-h-96 object-contain rounded-lg shadow-lg" 
                />
                <button
                  onClick={() => {
                    setUploadedImage(null);
                    setIsAddedToCart(false);
                  }}
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-2">
              <Sparkles size={14} className="text-amber-500" /> Design Inspiration:
            </h3>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1 text-xs sm:text-sm rounded-full cursor-pointer border ${
                    selectedPrompt === prompt ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => handlePromptSelect(prompt)}
                >
                  {prompt}
                </motion.div>
              ))}
            </div>

            <div className="relative">
              <input
                type="text"
                ref={inputRef}
                value={prefix + customPrompt}
                onChange={handlePromptChange}
                onKeyDown={handleKeyDown}
                onClick={handleClick}
                className="w-full px-4 py-2 border rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 text-black"
              />
              {/* Placeholder that shows when customPrompt is empty */}
              {!customPrompt && (
                <div className="absolute left-4 top-2 pointer-events-none text-gray-500 text-xs sm:text-sm">
                  {prefix}Describe your design...
                </div>
              )}
            </div>
            
            <div 
              className="flex items-center justify-end gap-1 text-blue-600 hover:text-blue-800 cursor-pointer text-xs sm:text-sm"
              onClick={navigateToPrompts}
            >
              <span>Browse more design ideas</span>
              <ChevronRight size={14} />
            </div>

            <button 
              onClick={generateImage} 
              disabled={loading} 
              className={`w-full py-2 rounded-lg text-xs sm:text-sm ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-950 hover:bg-blue-900"
              } text-white flex items-center justify-center gap-2`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  GENERATE DESIGN
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <button
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                uploadedImage 
                  ? isAddedToCart
                    ? "bg-green-600 text-white"
                    : "bg-blue-950 hover:bg-blue-900 text-white"
                  : "bg-gray-400 cursor-not-allowed text-gray-700"
              }`}
              disabled={!uploadedImage || isAddedToCart}
              onClick={addToCart}
            >
              {isAddedToCart ? (
                <>
                  <Check size={18} className="animate-bounce" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  <span>Add to Cart - PKR {(selectedProduct.price * quantity).toFixed(2)}</span>
                </>
              )}
            </button>

            <AnimatePresence>
              {isAddedToCart && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-center mt-3"
                >
                  <a 
                    href="/cart" 
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    View Cart & Checkout <span className="ml-1">→</span>
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorDesignPage;
