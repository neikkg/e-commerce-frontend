import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { useOrder } from "./OrderContext";
import { useNavigate } from "react-router-dom";
import BookNowNavbar from "./BookNowNavBar";
import Alert from "./Alert";
import { initiatePayment } from "./services/razorpayIntegration";

const Cart = () => {
  const { cart, handleChange, removeFromCart, setCart } = useCart();
  const { addOrder } = useOrder();
  const [price, setPrice] = useState(0);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/Login", { state: { from: "/Cart" } });
    }
  }, [navigate]);

  const handlePrice = () => {
    let total = 0;
    cart.forEach((item) => {
      console.log("Processing cart item:", item);
      const rawDiscountPrice = String(item.discountPrice || "").replace(/[^0-9.-]+/g, "");
      const rawPrice = String(item.price || "").replace(/[^0-9.-]+/g, "");
      const itemPrice = Number(rawDiscountPrice) || Number(rawPrice) || 0;
      const itemAmount = Number(item.amount) || 1;

      if (isNaN(itemPrice)) {
        console.warn("Invalid price detected for item:", item, "discountPrice:", item.discountPrice, "price:", item.price);
      }
      if (isNaN(itemAmount)) {
        console.warn("Invalid amount detected for item:", item, "amount:", item.amount);
      }

      if (!isNaN(itemPrice) && !isNaN(itemAmount)) {
        total += itemAmount * itemPrice;
      } else {
        total += 0;
      }
    });
    setPrice(total);
    console.log("Calculated total price:", total);
  };

  const handleBuyNow = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAlert({
        message: "Please log in to proceed with payment.",
        type: "error",
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      return;
    }

    try {
      const paymentResult = await initiatePayment(cart, price);
      if (paymentResult.success) {
        console.log("Adding order from Cart:", cart, price);
        addOrder(cart, price);
        setCart([]);
        localStorage.setItem("cart", JSON.stringify([]));
        navigate("/", {
          state: {
            alert: {
              message: "Payment successful!",
              type: "success",
            },
          },
        });
      } else {
        throw new Error("Payment not completed");
      }
    } catch (error) {
      console.error("Payment error in Cart:", error);
      setAlert({
        message: "Payment failed or was canceled. Please try again.",
        type: "error",
      });
    }
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

  return (
    <>
      <BookNowNavbar />
      <section className="max-w-[1280px] mx-auto mt-32 p-4">
        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}
        {cart.map((item) => (
          <div
            className="flex items-center justify-between border-b border-gray-200 py-4 mb-4 md:flex-row flex-col text-center"
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
        <div className="flex justify-end mt-4">
          <button
            onClick={handleBuyNow}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transform transition-all duration-300 hover:scale-105"
          >
            Buy Now
          </button>
        </div>
      </section>
    </>
  );
};

export default Cart;