import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

const SearchInput = ({ url, setUrl, handleSearchClick }) => {
  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder="Enter or Paste URL here"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button className="search-button" onClick={handleSearchClick}>
        <IoSearchOutline className="search-icon" />
      </button>
    </div>
  );
};

export default SearchInput;
