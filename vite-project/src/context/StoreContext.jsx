import { createContext, useEffect, useState } from "react";
// import { food_list } from "../assets/assets.js"; //Data from assets.js
import axios from "axios";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  // const addToCart = async (itemId) => {
  //   if (!cartItems[itemId]) {
  //     setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
  //   } else {
  //     setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
  //   }
  //   if (token) {
  //     await axios.post(url + "/api/cart/add", {itemId}, {headers: {token}})
  //   }
  // };

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

//   const removeFromCart = async (itemId) => {
//   setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

//   if (token) {
//     await axios.delete(url + "/api/cart/remove", {
//       headers: { token },
//       data: { itemId }, 
//     });
//   }
// };

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
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.data);
      // console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch food list:", error);
    }
  };

  const loadCartData = async (token) => {
    const response = await axios.post(url + "/api/cart/get", {}, {headers: {token}});
    setCartItems(response.data.cartData);
    localStorage.setItem("cartItems", JSON.stringify(response.data.cartData))
  }

  // useEffect(() => {
  //   async function loadData() {
  //     await fetchFoodList();
  //     if (localStorage.getItem("token")) {
  //       setToken(localStorage.getItem("token"));
  //       await loadCartData(localStorage.getItem("token"));
  //     }
  //   }
  //   loadData();
  // }, []);

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
