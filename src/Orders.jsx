// src/Orders.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [detailsVisible, setDetailsVisible] = useState({});

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(storedOrders);

    if (storedOrders.length > 0) {
      setCelebrationMessage('🎉 Your order has been placed successfully!');
      setTimeout(() => setCelebrationMessage(''), 5000);
    }
  }, []);

  const removeOrder = (orderCode) => {
    const updatedOrders = orders.filter((order) => order.code !== orderCode);
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const toggleDetails = (orderCode) => {
    setDetailsVisible((prev) => ({
      ...prev,
      [orderCode]: !prev[orderCode],
    }));
  };

  const clearAllOrders = () => {
    localStorage.removeItem('orders');
    setOrders([]);
  };

  return (
    <div className="orders-page">
      <h2>Your Orders</h2>

      {celebrationMessage && (
        <div className="celebration-message">
          <strong>{celebrationMessage}</strong>
        </div>
      )}

      {orders.length > 0 && (
        <button onClick={clearAllOrders} className="clear-all-orders-btn">
          Clear All Orders
        </button>
      )}

      {orders.length === 0 ? (
        <h3>You have no orders yet.</h3>
      ) : (
        <div className="orders-list">
          {orders.map((order, index) => (
            <div key={index} className="order-card">
              <h3>Order #{order.code}</h3>
              <p>Date: {new Date(order.timestamp).toLocaleString()}</p>
              <p>Status: Placed</p>
              <p>Email: {order.email}</p>
              <p>Payment Method: {order.paymentMethod}</p>

              <button onClick={() => toggleDetails(order.code)} className="toggle-details-btn">
                {detailsVisible[order.code] ? 'Hide Items' : 'Show Items'}
              </button>

              {detailsVisible[order.code] && (
                <div className="order-details">
                  <h4>Items:</h4>
                  <ul>
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.name} - ₹{item.price} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => removeOrder(order.code)} className="remove-order-btn">
                    Remove Order
                  </button>
                  <button onClick={() => navigate('/trackorder')} className="track-order-btn">
                    Track Order
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}