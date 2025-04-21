import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext"; // Adjust path as needed

import BookNowNavbar from "./BookNowNavBar";

const Cart = () => {
  const { cart, handleChange, removeFromCart } = useCart();
  const [price, setPrice] = useState(0);

  const handlePrice = () => {
    let total = 0;
    cart.forEach((item) => {
      // Log item for debugging
      console.log("Processing cart item:", item);
      // Safely parse price fields, removing any currency symbols
      const rawDiscountPrice = String(item.discountPrice || "").replace(/[^0-9.-]+/g, "");
      const rawPrice = String(item.price || "").replace(/[^0-9.-]+/g, "");
      const itemPrice = Number(rawDiscountPrice) || Number(rawPrice) || 0;
      const itemAmount = Number(item.amount) || 1;

      // Validate parsed values
      if (isNaN(itemPrice)) {
        console.warn("Invalid price detected for item:", item, "discountPrice:", item.discountPrice, "price:", item.price);
      }
      if (isNaN(itemAmount)) {
        console.warn("Invalid amount detected for item:", item, "amount:", item.amount);
      }

      // Only add to total if both price and amount are valid
      if (!isNaN(itemPrice) && !isNaN(itemAmount)) {
        total += itemAmount * itemPrice;
      } else {
        total += 0; // Avoid NaN propagation
      }
    });
    setPrice(total);
    console.log("Calculated total price:", total);
  };

  useEffect(() => {
    handlePrice();
  }, [cart]);

  if (!cart || cart.length === 0) {
    return (
      <section className="text-center mt-32 p-4">
        <h2 className="text-2xl font-semibold">Your Cart is Empty</h2>
        <p className="text-gray-600">Add some products to see them here!</p>
      </section>
    );
  }

  return (<> 
    <BookNowNavbar/>
    <section className="max-w-[1280px]  mx-auto mt-32 p-4">
      {cart.map((item) => (
        <div
          className="flex items-center justify-between border-b border-gray-200 py-4 mb-4 md:flex-row flex-col  text-center"
          key={item.id}
        >
          <div className="flex items-center gap-4 md:flex-row flex-col">
            <img
              src={item.img}
              alt={item.productName || "Product"}
              className="w-24 h-24 object-contain"
            />
            <p className="text-lg font-medium">
              {item.productName || item.title || "Unknown Product"}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleChange(item, +1)}
              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              +
            </button>
            <button className="px-2 py-1 bg-gray-100">{item.amount || 1}</button>
            <button
              onClick={() => handleChange(item, -1)}
              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              -
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold">
              ₹{((Number(String(item.discountPrice || "").replace(/[^0-9.-]+/g, "")) || Number(String(item.price || "").replace(/[^0-9.-]+/g, "")) || 0) * (Number(item.amount) || 1)).toLocaleString('en-IN')}
            </span>
            <button
              onClick={() => removeFromCart(item.id)}
              className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <div className="flex justify-between text-xl font-semibold p-4 bg-gray-100 rounded-lg mt-4">
        <span>Total Price of your Cart</span>
        <span>₹{(isNaN(price) ? 0 : price).toLocaleString('en-IN')}</span>
      </div>
    </section>
  </>
  );
};

export default Cart;