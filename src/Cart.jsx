import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, decrementCart, incrementCart } from './store';
import { Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import emailjs from 'emailjs-com';
import './Cart.css';

function Cart() {
  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [manualDiscountPercent, setManualDiscountPercent] = useState(0);
  const [couponDiscountPercent, setCouponDiscountPercent] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [purchaseCompleted, setPurchaseCompleted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const couponCodeRef = useRef();

  // Derived values
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = total * (manualDiscountPercent + couponDiscountPercent) / 100;
  const discountedPrice = total - discountAmount;
  const tax = discountedPrice * 0.05;
  const finalPrice = discountedPrice + tax;

  // Handle coupon
  const handleCouponApply = () => {
    const code = couponCodeRef.current.value.trim().toUpperCase();
    const validCoupons = {
      LUCKY123: 10,
      LUCKY1: 5,
      SAVE12: 15
    };

    if (validCoupons[code]) {
      setCouponDiscountPercent(validCoupons[code]);
      setCouponError('');
      setAppliedCoupon(code);
    } else {
      setCouponDiscountPercent(0);
      setAppliedCoupon('');
      setCouponError('❌ Invalid coupon code');
    }
  };

  // Handle payment selection
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setPaymentConfirmed(false);
  };

  // Handle purchase confirmation
  const confirmPayment = () => {
    if (!email || !email.includes('@')) {
      alert('❗ Please enter a valid email address.');
      return;
    }

    const newOrderId = 'ORD-' + Date.now();
    setOrderId(newOrderId);

    const order = {
      orderId: newOrderId,
      items: cartItems,
      total,
      discountAmount,
      tax,
      finalPrice,
      discountPercent: manualDiscountPercent + couponDiscountPercent,
      appliedCoupon,
      email,
      date: new Date().toLocaleString()
    };

    // Save to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
    localStorage.setItem('orders', JSON.stringify([...existingOrders, order]));

    // EmailJS
    const templateParams = {
      order_id: order.orderId,
      final_amount: finalPrice.toFixed(2),
      purchase_datetime: order.date,
      tax: tax.toFixed(2),
      email: email,
    };

    emailjs.send(
      'service_xf9s9bd',
      'template_sjv4ihr',
      templateParams,
      'q8iNwBUfLn6IMx0Nu'
    ).then(
      () => alert(`✅ Confirmation sent to ${email}`),
      (error) => {
        console.error('❌ Email failed:', error);
        alert('❌ Failed to send email.');
      }
    );

    setPurchaseCompleted(true);
  };

  // Voice feedback after purchase
  useEffect(() => {
    if (purchaseCompleted) {
      const msg = new SpeechSynthesisUtterance(
        `Thank you for your purchase. Your order ID is ${orderId}. Your final bill is ₹${finalPrice.toFixed(2)}. We hope to see you again soon!`
      );
      msg.lang = 'en-IN';
      window.speechSynthesis.speak(msg);
    }
  }, [purchaseCompleted]);

  // After purchase success
  if (purchaseCompleted) {
    return (
      <div className="page">
        <div className="order-success-message">
          <h1>✅ Thank you for your purchase!</h1>
          <h2>🧾 Order ID: {orderId}</h2>
          <ul>
            {cartItems.map((item, i) => (
              <li key={i}>{item.name} x {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}</li>
            ))}
          </ul>
          <p>Total: ₹{total.toFixed(2)}</p>
          <p>Discount: ₹{discountAmount.toFixed(2)}</p>
          <p>Tax: ₹{tax.toFixed(2)}</p>
          <h4>Final Price: ₹{finalPrice.toFixed(2)}</h4>
          <Link to="/order"><button>📦 View All Orders</button></Link>
        </div>
      </div>
    );
  }

  // Main Cart View
  return (
    <div className="page">
      <h2>Your Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})</h2>

      {cartItems.length === 0 ? (
        <p>🛒 Your cart is empty.</p>
      ) : (
        <>
          {/* Cart Items */}
          <div className="product-grid">
            {cartItems.map((item) => (
              <div className="card" key={item.id || item.name}>
                <img src={item.image} alt={item.name} className="product-image" />
                <h3>{item.name}</h3>
                <p>Price: ₹{item.price}</p>
                <p>Qty: {item.quantity}</p>
                <p><strong>Total: ₹{(item.price * item.quantity).toFixed(2)}</strong></p>
                <div className="quantity-controls">
                  <button onClick={() => dispatch(decrementCart(item))}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => dispatch(incrementCart(item))}>+</button>
                </div>
                <button className="remove" onClick={() => dispatch(removeFromCart(item))}>Remove</button>
              </div>
            ))}
          </div>

          {/* Discounts */}
          <div className="discount-section">
            <h3>Apply Manual Discount:</h3>
            {[10, 20, 30].map(percent => (
              <button key={percent} onClick={() => setManualDiscountPercent(percent)}>{percent}%</button>
            ))}
          </div>

          {/* Coupons */}
          <div className="coupon-section">
            <input type="text" ref={couponCodeRef} placeholder="Coupon code" />
            <button onClick={handleCouponApply}>Apply</button>
            {couponError && <p className="error">{couponError}</p>}
            {appliedCoupon && <p style={{ color: 'green' }}>✔ Applied: {appliedCoupon}</p>}
          </div>

          {/* Email */}
          <div className="email-field">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Pricing */}
          <div className="price-details">
            <p>Total: ₹{total.toFixed(2)}</p>
            <p>Discount: ₹{discountAmount.toFixed(2)}</p>
            <p>Tax (5%): ₹{tax.toFixed(2)}</p>
            <h3>Final: ₹{finalPrice.toFixed(2)}</h3>
          </div>

          {/* Payment Options */}
          <div className="payment-methods">
            <h3>Choose Payment Method</h3>
            <button onClick={() => handlePaymentMethodChange('UPI')}>UPI</button>
            <button onClick={() => handlePaymentMethodChange('Card')}>Card</button>
            <button onClick={() => handlePaymentMethodChange('Wallet')}>Wallet</button>
          </div>

          {/* UPI QR */}
          {paymentMethod === 'UPI' && (
            <div className="qr-popup">
              <h3>Scan to Pay via UPI</h3>
              <QRCode value={`upi://pay?pa=607741@ibl&pn=GopiStore&am=${finalPrice.toFixed(2)}&cu=INR`} />
              <label>
                <input
                  type="checkbox"
                  checked={paymentConfirmed}
                  onChange={(e) => setPaymentConfirmed(e.target.checked)}
                /> I have completed the payment
              </label>
              <button onClick={confirmPayment} disabled={!paymentConfirmed}>Complete Order</button>
            </div>
          )}

          {/* Card Payment */}
          {paymentMethod === 'Card' && (
            <div className="card-payment">
              <h3>Enter Card Details</h3>
              <input type="text" placeholder="Card Number" maxLength="16" />
              <input type="text" placeholder="Cardholder Name" />
              <input type="text" placeholder="MM/YY" maxLength="5" />
              <input type="text" placeholder="CVV" maxLength="3" />
              <label>
                <input
                  type="checkbox"
                  checked={paymentConfirmed}
                  onChange={(e) => setPaymentConfirmed(e.target.checked)}
                /> I confirm payment was successful
              </label>
              <button onClick={confirmPayment} disabled={!paymentConfirmed}>
                Pay ₹{finalPrice.toFixed(2)}
              </button>
            </div>
          )}

          {/* Wallet */}
          {paymentMethod === 'Wallet' && (
            <div className="wallet-payment">
              <h3>Wallet Payment</h3>
              <select>
                <option value="">-- Select Wallet --</option>
                <option value="paytm">Paytm</option>
                <option value="phonepe">PhonePe</option>
              </select>
              <button onClick={confirmPayment}>
                Pay ₹{finalPrice.toFixed(2)}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Cart;
