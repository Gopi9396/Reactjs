// src/MenDress.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from './Store';



function MenDress({ searchTerm = "" }) {
  const menItems = useSelector(state => state.products.menDress);
  const dispatch = useDispatch();

  const filteredItems = menItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page">
      <h2>Men's Dresses</h2>
      <div className="product-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <div className="card" key={index}>
              <img src={item.image} alt={item.name} className="product-image" />
              <h3>{item.name}</h3>
              <p className="price" style={{ textAlign: "center", fontWeight: "bold", margin: "10px 0" }}>
                ₹{item.price}
              </p>
              <button onClick={() => dispatch(addToCart(item))}>
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p className="no-results">No matching men's dresses found.</p>
        )}
      </div>
    </div>
  );
}

export default MenDress;
