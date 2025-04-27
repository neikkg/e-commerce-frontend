// import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
// import axios from "axios";

// const CartContext = createContext();

// // Debounce utility outside component
// const debounce = (func, wait) => {
//   let timeout;
//   return (...args) => {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => func(...args), wait);
//   };
// };

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);
//   const [cartSize, setCartSize] = useState(0);
//   const [isFetching, setIsFetching] = useState(false);
//   const [fetchTrigger, setFetchTrigger] = useState(0); // Control fetching

//   const fetchCart = useCallback(
//     debounce(async () => {
//       if (isFetching) {
//         console.log("Fetch cart skipped: already fetching");
//         return;
//       }
//       const token = localStorage.getItem("token");
//       if (!token || !token.includes('.')) {
//         console.log("Invalid or missing token, skipping fetchCart");
//         setCart([]);
//         setCartSize(0);
//         return;
//       }
//       setIsFetching(true);
//       try {
//         console.log("Fetching cart with token:", token);
//         const response = await axios.get("https://e-commerce-api-i2ak.onrender.com/api/cart", {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         const cartData = response.data || [];
//         setCart(cartData);
//         setCartSize(cartData.reduce((total, item) => total + (item.amount || 1), 0));
//       } catch (err) {
//         console.error("Fetch cart error:", err.response?.data || err.message);
//         setCart([]);
//         setCartSize(0);
//       } finally {
//         setIsFetching(false);
//       }
//     }, 1000),
//     [] // Empty deps to ensure single instance
//   );

//   useEffect(() => {
//     console.log("CartContext useEffect triggered, fetchTrigger:", fetchTrigger);
//     fetchCart();
//   }, [fetchTrigger, fetchCart]);

//   const triggerFetch = useCallback(() => {
//     setFetchTrigger(prev => prev + 1);
//   }, []);

//   const addToCart = async (item, navigate, location) => {
//     const token = localStorage.getItem("token");
//     if (!token || !token.includes('.')) {
//       if (navigate && location) {
//         navigate("/Login", { state: { from: location.pathname } });
//       }
//       return;
//     }
//     try {
//       const existingItem = cart.find((product) => product.productId === item.id);
//       const amount = existingItem ? (existingItem.amount || 1) + 1 : 1;
//       const cartItem = {
//         productId: item.id,
//         productName: item.productName || item.title,
//         img: item.img,
//         price: Number(String(item.price || "").replace(/[^0-9.-]+/g, "")) || 0,
//         discountPrice: Number(String(item.discountPrice || "").replace(/[^0-9.-]+/g, "")) || undefined,
//         amount
//       };
//       const response = await axios.post(
//         "https://e-commerce-api-i2ak.onrender.com/api/cart",
//         cartItem,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setCart(response.data);
//       setCartSize(response.data.reduce((total, item) => total + (item.amount || 1), 0));
//       triggerFetch(); // Refresh cart after adding
//     } catch (err) {
//       console.error("Add to cart error:", err.response?.data || err.message);
//     }
//   };

//   const handleChange = async (item, delta) => {
//     const token = localStorage.getItem("token");
//     if (!token || !token.includes('.')) {
//       console.log("Invalid or missing token, skipping handleChange");
//       return;
//     }
//     try {
//       const newAmount = Math.max(1, (item.amount || 1) + delta);
//       const cartItem = {
//         productId: item.productId,
//         productName: item.productName,
//         img: item.img,
//         price: item.price,
//         discountPrice: item.discountPrice,
//         amount: newAmount
//       };
//       const response = await axios.post(
//         "https://e-commerce-api-i2ak.onrender.com/api/cart",
//         cartItem,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setCart(response.data);
//       setCartSize(response.data.reduce((total, item) => total + (item.amount || 1), 0));
//       triggerFetch(); // Refresh cart after updating
//     } catch (err) {
//       console.error("Update cart error:", err.response?.data || err.message);
//     }
//   };

//   const removeFromCart = async (productId) => {
//     const token = localStorage.getItem("token");
//     if (!token || !token.includes('.')) {
//       console.log("Invalid or missing token, skipping removeFromCart");
//       return;
//     }
//     try {
//       const response = await axios.post(
//         "https://e-commerce-api-i2ak.onrender.com/api/cart",
//         { productId, amount: 0 },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setCart(response.data);
//       setCartSize(response.data.reduce((total, item) => total + (item.amount || 1), 0));
//       triggerFetch(); // Refresh cart after removing
//     } catch (err) {
//       console.error("Remove from cart error:", err.response?.data || err.message);
//     }
//   };

//   const clearCart = async () => {
//     const token = localStorage.getItem("token");
//     if (!token || !token.includes('.')) {
//       console.log("Invalid or missing token, clearing cart locally");
//       setCart([]);
//       setCartSize(0);
//       return;
//     }
//     try {
//       await axios.delete("https://e-commerce-api-i2ak.onrender.com/api/cart", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setCart([]);
//       setCartSize(0);
//       triggerFetch(); // Refresh cart after clearing
//     } catch (err) {
//       console.error("Clear cart error:", err.response?.data || err.message);
//     }
//   };

//   // Memoize context value to prevent re-renders
//   const contextValue = useMemo(
//     () => ({
//       cart,
//       setCart,
//       addToCart,
//       handleChange,
//       removeFromCart,
//       cartSize,
//       clearCart,
//       fetchCart,
//       triggerFetch
//     }),
//     [cart, cartSize, addToCart, handleChange, removeFromCart, clearCart, fetchCart, triggerFetch]
//   );

//   return (
//     <CartContext.Provider value={contextValue}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error("useCart must be used within a CartProvider");
//   }
//   return context;
// };























import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";

const CartContext = createContext();

// Debounce utility outside component
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartSize, setCartSize] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0); // Control fetching

  const fetchCart = useCallback(
    debounce(async () => {
      if (isFetching) {
        console.log("Fetch cart skipped: already fetching");
        return;
      }
      const token = localStorage.getItem("token");
      if (!token || !token.includes('.')) {
        console.log("No valid token, setting cart to empty for display");
        setCart([]);
        setCartSize(0);
        return;
      }
      setIsFetching(true);
      try {
        console.log("Fetching cart with token:", token);
        const response = await axios.get("https://e-commerce-api-i2ak.onrender.com/api/cart", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const cartData = Array.isArray(response.data) ? response.data : [];
        setCart(cartData);
        setCartSize(cartData.reduce((total, item) => total + (item.amount || 1), 0));
      } catch (err) {
        console.error("Fetch cart error:", err.response?.data || err.message);
        setCart([]);
        setCartSize(0);
      } finally {
        setIsFetching(false);
      }
    }, 1000),
    []
  );

  // Fetch cart on mount and token change
  useEffect(() => {
    console.log("CartContext useEffect triggered, fetchTrigger:", fetchTrigger);
    fetchCart();
  }, [fetchTrigger, fetchCart]);

  // Monitor token changes to refetch cart
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        console.log("Token changed, triggering cart fetch");
        triggerFetch();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchTrigger]);

  const triggerFetch = useCallback(() => {
    setFetchTrigger(prev => prev + 1);
  }, []);

  const addToCart = async (item, navigate, location) => {
    const token = localStorage.getItem("token");
    if (!token || !token.includes('.')) {
      if (navigate && location) {
        navigate("/Login", { state: { from: location.pathname } });
      }
      return;
    }
    try {
      const existingItem = cart.find((product) => product.productId === item.id);
      const amount = existingItem ? (existingItem.amount || 1) + 1 : 1;
      const cartItem = {
        productId: item.id,
        productName: item.productName || item.title,
        img: item.img,
        price: Number(String(item.price || "").replace(/[^0-9.-]+/g, "")) || 0,
        discountPrice: Number(String(item.discountPrice || "").replace(/[^0-9.-]+/g, "")) || undefined,
        amount
      };
      const response = await axios.post(
        "https://e-commerce-api-i2ak.onrender.com/api/cart",
        cartItem,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedCart = Array.isArray(response.data) ? response.data : [];
      setCart(updatedCart);
      setCartSize(updatedCart.reduce((total, item) => total + (item.amount || 1), 0));
      triggerFetch();
    } catch (err) {
      console.error("Add to cart error:", err.response?.data || err.message);
    }
  };

  const handleChange = async (item, delta) => {
    const token = localStorage.getItem("token");
    if (!token || !token.includes('.')) {
      console.log("Invalid or missing token, skipping handleChange");
      return;
    }
    try {
      const newAmount = Math.max(1, (item.amount || 1) + delta);
      const cartItem = {
        productId: item.productId,
        productName: item.productName,
        img: item.img,
        price: item.price,
        discountPrice: item.discountPrice,
        amount: newAmount
      };
      const response = await axios.post(
        "https://e-commerce-api-i2ak.onrender.com/api/cart",
        cartItem,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedCart = Array.isArray(response.data) ? response.data : [];
      setCart(updatedCart);
      setCartSize(updatedCart.reduce((total, item) => total + (item.amount || 1), 0));
      triggerFetch();
    } catch (err) {
      console.error("Update cart error:", err.response?.data || err.message);
    }
  };

  const removeFromCart = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token || !token.includes('.')) {
      console.log("Invalid or missing token, skipping removeFromCart");
      return;
    }
    try {
      const response = await axios.post(
        "https://e-commerce-api-i2ak.onrender.com/api/cart",
        { productId, amount: 0 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedCart = Array.isArray(response.data) ? response.data : [];
      setCart(updatedCart);
      setCartSize(updatedCart.reduce((total, item) => total + (item.amount || 1), 0));
      triggerFetch();
    } catch (err) {
      console.error("Remove from cart error:", err.response?.data || err.message);
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem("token");
    if (!token || !token.includes('.')) {
      console.log("Invalid or missing token, skipping clearCart");
      setCart([]);
      setCartSize(0);
      return;
    }
    try {
      console.log("Clearing cart for user");
      await axios.delete("https://e-commerce-api-i2ak.onrender.com/api/cart", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart([]);
      setCartSize(0);
      triggerFetch();
    } catch (err) {
      console.error("Clear cart error:", err.response?.data || err.message);
    }
  };

  // Memoize context value to prevent re-renders
  const contextValue = useMemo(
    () => ({
      cart,
      setCart,
      addToCart,
      handleChange,
      removeFromCart,
      cartSize,
      clearCart,
      fetchCart,
      triggerFetch
    }),
    [cart, cartSize, addToCart, handleChange, removeFromCart, clearCart, fetchCart, triggerFetch]
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};