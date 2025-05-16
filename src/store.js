// src/store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';





// Slice to manage products and cart
const productsSlice = createSlice({
  name: 'products',
  initialState: {
    veg: [
      { name: 'Dal Rice', price: 150, image: '/images/dal.jpg' },
      { name: 'Veg Biryani', price: 250, image: '/images/veg biryani.jpeg' },
      { name: 'Veg Noodles', price: 100, image: '/images/veg noodles.jpeg' },
      { name: 'Veg Salad', price: 350, image: '/images/salad.jpeg' },
      { name: 'Veg Sandwich', price: 70, image: '/images/sandwich.jpeg' },
      { name: 'Paneer Butter Masala', price: 280, image: '/images/panner.jpeg' },
      { name: 'Chole Bhature', price: 180, image: '/images/chole.jpeg' },
      { name: 'Masala Dosa', price: 120, image: '/images/dosh.jpeg' },
      { name: 'Aloo Paratha', price: 90, image: '/images/paratha.jpeg' },
      { name: 'Mushroom Curry', price: 200, image: '/images/mushroom.jpeg' }
    ],
    nonVeg: [
      { name: 'Chicken Biryani', price: 300, image: '/images/chickenBiriyani.jpg' },
      { name: 'Butter Chicken', price: 320, image: '/images/butterchicken.jpg' },
      { name: 'Egg Curry', price: 180, image: '/images/EggCurry.webp' },
      { name: 'Mutton Rogan Josh', price: 400, image: '/images/mutton-curry.jpg' },
      { name: 'Fish Fry', price: 250, image: '/images/fish.jpeg' },
      { name: 'Prawn Curry', price: 350, image: '/images/prawns.jpeg' },
      { name: 'Chicken 65', price: 220, image: '/images/chicken65.jpeg' },
      { name: 'Tandoori Chicken', price: 300, image: '/images/tandoori.jpeg' },
      { name: 'Chicken Noodles', price: 180, image: '/images/noodles.jpeg' },
      { name: 'Egg Fried Rice', price: 160, image: '/images/egg-fried-rice.jpg' }
    ],
   starters: [
  { name: 'Tikka Chicken', price: 300, image: '/images/tikka.jpeg' },
  { name: 'Starter Mix', price: 250, image: '/images/starter.jpeg' },
  { name: 'Rooster Chicken', price: 300, image: '/images/rooster.jpeg' },
  { name: 'TA Chicken', price: 200, image: '/images/ta.jpeg' },
  { name: 'TC Chicken', price: 900, image: '/images/tc.jpeg' },
  { name: 'NV Chicken', price: 800, image: '/images/nv.jpeg' },
  { name: 'Malaka Chicken', price: 500, image: '/images/malaka.jpeg' },
  { name: 'Joint Chicken', price: 600, image: '/images/joint.jpeg' },
  { name: 'CT Chicken', price: 400, image: '/images/ct.jpeg' },
  { name: 'C Chicken', price: 500, image: '/images/c.jpg' },
   { name: 'chilli Chicken', price: 400, image: '/images/chilli chicken.jpeg' },
    { name: 'full tandoori', price: 490, image: '/images/full tandoori.jpeg' },
     { name: '65 Chicken', price: 599, image: '/images/65 chicken.jpeg' },
     { name: 'spicy Chicken', price: 599, image: '/images/spicy.jpeg' },
     { name: 'kababas Chicken', price: 599, image: '/images/kababas.jpeg' },
],
DrinksAndJuices:[
{ name: 'bootroot', price: 69, image: '/images/bootroot.jpeg' },
{ name: 'coke', price: 399, image: '/images/coke.jpeg' },
{ name: 'drink', price: 299, image: '/images/drink.jpeg' },
{ name: 'fanta', price: 29, image: '/images/fanta.jpeg' },
{ name: 'fizzy drinks', price: 109, image: '/images/fizzy drinks.jpeg' },
{ name: 'ice', price: 79, image: '/images/ice.jpeg' },
{ name: 'lemon', price: 39, image: '/images/lemon.jpeg' },
{ name: 'mocktail', price: 199, image: '/images/mocktail.jpeg' },
{ name: 'orange', price: 49, image: '/images/orange.jpeg' },
{ name: 'pineapple', price: 59, image: '/images/pineapple.jpeg' },
{ name: 'red', price: 99, image: '/images/red.jpeg' },
{ name: 'sapota', price: 59, image: '/images/sapota.jpeg' },
{ name: 'soda', price: 20, image: '/images/soda.jpeg' },
{ name: 'sprite', price: 50, image: '/images/sprite.jpeg' },
{ name: 'watermelon', price: 409, image: '/images/watermelon.jpeg' },



]
    
  }
});

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.find(i => i.name === item.name);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.push({ ...item, quantity: 1 });
      }
    },
    incrementCart: (state, action) => {
      const item = state.find(i => i.name === action.payload.name);
      if (item) {
        item.quantity += 1;
      }
    },
  decrementCart: (state, action) => {
      const item = state.find(i => i.name === action.payload.name);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else {
        return state.filter(i => i.name !== action.payload.name);
      }
    },
    removeFromCart: (state, action) => {
      return state.filter(i => i.name !== action.payload.name);
    },
    clearCart: () => {
      return [];
    }
  }
});

// Orders slice
const ordersSlice = createSlice({
  name: 'orders',
  initialState: [],
  reducers: {
    addOrder: (state, action) => {
      state.push(action.payload);
    }
  }
});

// Export all actions you need
export const { addToCart, incrementCart, decrementCart, removeFromCart, clearCart } = cartSlice.actions;
export const { addOrder } = ordersSlice.actions;

// Configure store
const store = configureStore({
  reducer: {
    products: productsSlice.reducer,
    cart: cartSlice.reducer,
    orders: ordersSlice.reducer
  }
});

export default store;
