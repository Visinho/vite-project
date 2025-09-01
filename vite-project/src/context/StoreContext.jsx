import { createContext, useEffect, useState } from "react";
import { food_list } from "../assets/assets";

// Create the context
export const StoreContext = createContext(null);

// Named export for the provider
export const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4000"
  const [token, setToken] = useState("");


  const addToCart = (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
  };

  const getTotalCartAmount = () => {
  let totalAmount = 0;
  for (const itemId in cartItems) {
    if (cartItems[itemId] > 0) {
      const itemInfo = food_list.find(
        (product) => String(product.food_id) === itemId
      );
      if (itemInfo) {
        totalAmount += itemInfo.food_price * cartItems[itemId];
      }
    }
  }
  return totalAmount;
};


  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
