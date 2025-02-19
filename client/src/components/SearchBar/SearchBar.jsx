import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css"

const SearchBar = ({ placeholder = "Type to search..." }) => {
  const [searchText, setSearchText] = useState("");

  const handleChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearch = () => {
    console.log("Searching for:", searchText);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={searchText}
        onChange={handleChange}
        placeholder={placeholder}
        className="search-input"
      />
      <button className="search-button" onClick={handleSearch}>
        <FaSearch />
      </button>
    </div>
  );
};

export default SearchBar;
