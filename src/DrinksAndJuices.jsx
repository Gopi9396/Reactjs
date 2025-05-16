import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from './store';
import './drinksAndJuices.css'; // Reuse or customize as needed

function DrinksAndJuices() {
 const drinkItems = useSelector((state) => state.products.DrinksAndJuices);
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const itemsPerPage = 5;

  const handleClearFilters = () => {
    setMinPrice(0);
    setMaxPrice(1000);
    setCurrentPage(1);
  };

  if (!Array.isArray(drinkItems)) {
    return <div>Loading...</div>;
  }

  const filteredItems = drinkItems.filter(
    (item) => item.price >= minPrice && item.price <= maxPrice
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="drinks-page">
      <h2 className="section-title">🥤 Drinks & Juices</h2>

      {/* Price Range Filter */}
      <div className="price-filter">
        <label>
          Min Price: ₹{minPrice}
          <input
            type="range"
            min="0"
            max={maxPrice}
            value={minPrice}
            onChange={(e) => {
              setMinPrice(Number(e.target.value));
              setCurrentPage(1);
            }}
          />
        </label>
        <label>
          Max Price: ₹{maxPrice}
          <input
            type="range"
            min={minPrice}
            max="1000"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(Number(e.target.value));
              setCurrentPage(1);
            }}
          />
        </label>
        <button onClick={handleClearFilters} className="clear-button">
          Clear Filters
        </button>
      </div>

      {/* Drinks Cards */}
      <div className="drinks-grid">
        {currentItems.length > 0 ? (
          currentItems.map((item, index) => (
            <div key={index} className="drink-card">
              <img
                src={item.image}
                alt={item.name}
                className="drink-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                }}
              />
              <h3>{item.name}</h3>
              <p className="drink-price">₹{item.price} / glass</p>
              <button className="add-to-cart-btn" onClick={() => dispatch(addToCart(item))}>
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <div>No items in this price range.</div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}

          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default DrinksAndJuices;
