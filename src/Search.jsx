import React from 'react';
import './Search.css'; 

function SearchBar() {
  return (
    <div className="logo-search">
      <div className="search-bar">
        <input type="text" placeholder="Search..." />
        <button>Search</button>
      </div>
    </div>
  );
}

export default SearchBar;