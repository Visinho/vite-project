import { createContext, useEffect, useState } from "react";
// import { food_list } from "../assets/assets.js"; //Data from assets.js
import axios from "axios";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  const addToCart = async (itemId) => {
  let updatedCart;

  if (!cartItems[itemId]) {
    updatedCart = { ...cartItems, [itemId]: 1 };
  } else {
    updatedCart = { ...cartItems, [itemId]: cartItems[itemId] + 1 };
  }

  setCartItems(updatedCart);
  localStorage.setItem("cartItems", JSON.stringify(updatedCart)); 

  if (token) {
    await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
  }
};

const removeFromCart = async (itemId) => {
  let updatedCart = { ...cartItems };

  if (updatedCart[itemId] > 1) {
    updatedCart[itemId] -= 1;
  } else {
    delete updatedCart[itemId]; 
  }

  setCartItems(updatedCart);
  localStorage.setItem("cartItems", JSON.stringify(updatedCart)); 

  if (token) {
    await axios.delete(url + "/api/cart/remove", {
      headers: { token },
      data: { itemId },
    });
  }
};



  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const itemInfo = food_list.find(
          (product) => String(product._id) === itemId
        );
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[itemId];
        }
      }
    }
    return totalAmount;
  };

   // Fetch food list from API
  // const fetchFoodList = async () => {
  //   try {
  //     const response = await axios.get(`${url}/api/food/list`);
  //     setFoodList(response.data.data);
  //     // console.log(response.data);
  //   } catch (error) {
  //     console.error("Failed to fetch food list:", error);
  //   }
  // };

  const fetchFoodList = async () => {
  try {
    const response = await axios.get(`${url}/api/food/list`);
    const fetchedFoods = response.data.data;
    setFoodList(fetchedFoods);

    // Remove cart items that no longer exist
    const updatedCart = { ...cartItems };
   Object.keys(updatedCart).forEach(itemId => {
  if (!fetchedFoods.find(f => String(f._id) === itemId)) {
    delete updatedCart[itemId];
    toast.warning("Some items in your cart are no longer available.");
  }
});

    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));

  } catch (error) {
    console.error("Failed to fetch food list:", error);
  }
};


  const loadCartData = async (token) => {
    const response = await axios.post(url + "/api/cart/get", {}, {headers: {token}});
    setCartItems(response.data.cartData);
    localStorage.setItem("cartItems", JSON.stringify(response.data.cartData))
  }

  useEffect(() => {
  async function loadData() {
    await fetchFoodList();

    const savedToken = localStorage.getItem("token");
    const savedCart = localStorage.getItem("cartItems");

    if (savedToken) {
      setToken(savedToken);

      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }

      await loadCartData(savedToken);
    } else {
      setCartItems({});
      localStorage.removeItem("cartItems");
    }
  }
  loadData();
}, []);



  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
