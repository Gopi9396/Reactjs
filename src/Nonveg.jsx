import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from './store';
import './nonveg.css';

function Nonveg() {
  const nonvegItems = useSelector((state) => state.products.nonVeg);
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

  if (!Array.isArray(nonvegItems)) {
    return <div>Loading...</div>;
  }

  const filteredItems = nonvegItems.filter(
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
    <div className="nonveg-page">
      <h2 className="section-title">🍗 Non-Veg Delights</h2>

      {/* Min and Max Price Filter */}
      <div className="price-filter">
        <label>
          Min Price: ₹
          <input
            type="number"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(+e.target.value);
              setCurrentPage(1);
            }}
            min="0"
            max="1000"
            step="10"
          />
        </label>
        <label>
          Max Price: ₹
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(+e.target.value);
              setCurrentPage(1);
            }}
            min="0"
            max="1000"
            step="10"
          />
        </label>
        <button onClick={handleClearFilters} className="clear-button">
          Clear Filters
        </button>
      </div>

      <div className="nonveg-grid">
        {currentItems.length > 0 ? (
          currentItems.map((item, index) => (
            <div key={index} className="nonveg-card">
              <img src={item.image} alt={item.name} className="nonveg-image" />
              <h3>{item.name}</h3>
              <p className="nonveg-price">₹{item.price} / plate</p>
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

export default Nonveg;
