"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSearchedStar } from "../lib/features/starSlice";

const Header = () => {
  console.log("Header component re-rendered"); // For debugging rerendering

  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const searchResults = useSelector((state) => state.starsData.queryStar);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.trim().length > 0);
    
    // Directly dispatch search action without debounce
    if (value.trim()) {
      dispatch(getSearchedStar(value));
    }
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full h-[50px] flex justify-center md:justify-end py-2">
      
      <div className="w-[250px] h-full bg-[#ffffff] rounded-full drop-shadow-md lg:mr-36">
        <input
          type="search"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search..."
          className="px-4 pr-7 w-full h-full bg-[#ffffff] rounded-full text-[#3a3a3a] text-[14px] font-medium"
          onClick={(e) => e.stopPropagation()}
        />
        
        {showSuggestions && searchResults?.data?.length > 0 && (
          <ul className="absolute top-[100%] left-0 w-[250px] bg-[#ffffff] rounded-md shadow-lg mt-1 max-h-[200px] overflow-y-auto z-[9999999] capitalize">
            {searchResults.data.map((star) => (
              <li
                key={star._id}
                onClick={() => {
                  setSearchQuery(star.starname);
                  setShowSuggestions(false);
                }}
                className="px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer flex items-center font-semibold"
              >
                <img src={star.starcover} alt={star.starname} className="aspect-square h-12 mr-2 rounded-full object-cover"/>
                {star.starname}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Header;
