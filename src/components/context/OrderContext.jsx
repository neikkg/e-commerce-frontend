import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";

const OrderContext = createContext();

// Debounce utility outside component
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0); // Control fetching

  const fetchOrders = useCallback(
    debounce(async () => {
      if (isFetching) {
        console.log("Fetch orders skipped: already fetching");
        return;
      }
      const token = localStorage.getItem("token");
      if (!token || !token.includes('.')) {
        console.log("Invalid or missing token, skipping fetchOrders");
        setOrders([]);
        return;
      }
      setIsFetching(true);
      try {
        console.log("Fetching orders with token:", token);
        const response = await axios.get("https://e-commerce-api-i2ak.onrender.com/api/orders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data || []);
      } catch (err) {
        console.error("Fetch orders error:", err.response?.data || err.message);
        setOrders([]);
      } finally {
        setIsFetching(false);
      }
    }, 1000),
    [] // Empty deps to ensure single instance
  );

  useEffect(() => {
    console.log("OrderContext useEffect triggered, fetchTrigger:", fetchTrigger);
    fetchOrders();
  }, [fetchTrigger, fetchOrders]);

  const triggerFetch = useCallback(() => {
    setFetchTrigger(prev => prev + 1);
  }, []);

  const addOrder = async (items, total) => {
    const token = localStorage.getItem("token");
    if (!token || !token.includes('.')) {
      console.log("Invalid or missing token, skipping addOrder");
      return;
    }
    try {
      const orderItems = items.map(item => ({
        productId: item.productId || item.id,
        productName: item.productName || item.title,
        img: item.img,
        price: Number(item.price) || 0,
        discountPrice: Number(item.discountPrice) || undefined,
        amount: item.amount || 1
      }));
      const numericTotal = typeof total === 'string' ? Number(total.replace(/[^0-9.-]+/g, '')) : Number(total);
      if (isNaN(numericTotal)) {
        throw new Error("Invalid total value");
      }
      const response = await axios.post(
        "https://e-commerce-api-i2ak.onrender.com/api/orders",
        { items: orderItems, total: numericTotal },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(prev => [...prev, response.data]);
      triggerFetch(); // Refresh orders after adding
    } catch (err) {
      console.error("Add order error:", err.response?.data || err.message);
      throw err;
    }
  };

  // Memoize context value to prevent re-renders
  const contextValue = useMemo(
    () => ({
      orders,
      addOrder,
      fetchOrders,
      triggerFetch
    }),
    [orders, addOrder, fetchOrders, triggerFetch]
  );

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};