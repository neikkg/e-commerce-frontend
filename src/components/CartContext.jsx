import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const isPresent = prevCart.find((product) => product.id === item.id);
      if (isPresent) {
        return prevCart.map((product) =>
          product.id === item.id
            ? { ...product, amount: (product.amount || 1) + 1 }
            : product
        );
      }
      return [...prevCart, { ...item, amount: 1 }];
    });
  };

  const handleChange = (item, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((product) =>
          product.id === item.id
            ? { ...product, amount: Math.max(1, (product.amount || 1) + delta) }
            : product
        )
        .filter((product) => product.amount > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const cartSize = cart.reduce((total, item) => total + (item.amount || 1), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        handleChange,
        removeFromCart,
        cartSize,
      }}
    >
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