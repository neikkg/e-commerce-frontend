import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookNowNavbar from "../BookNowNavBar.jsx";
import NivzoneFooter from "../NivzoneFooter.jsx";
import { useCart } from "../CartContext"; // Adjust path as needed
import {
  bestDealsPage,
  electronicsPage,
  fashionPage,
  bestOfElectronicsHome,
  topStylesHome,
  bestDealsHome,
  bestSellersHome,
  bestSellersPage,
} from "../../utils/data.js";

const BuyNowPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const allProducts = [
      ...bestDealsPage,
      ...electronicsPage,
      ...fashionPage,
      ...bestOfElectronicsHome,
      ...topStylesHome,
      ...bestDealsHome,
      ...bestSellersHome,
      ...bestSellersPage,
    ];

    const selectedProduct = allProducts.find((product) => product.id === id);
    setProduct(selectedProduct);
  }, [id]);

  if (!product) return <div className="text-center mt-[120px]">Loading...</div>;

  return (
    <>
      <BookNowNavbar />
      <div className="md:flex justify-between mt-[120px] max-w-[1400px] mx-auto">
        <div className="flex flex-col mb-[100px] group overflow-hidden">
          <div className="md:h-[540px] md:w-[640px] mt-[40px] h-[400px]">
            <img
              className="h-full w-full object-contain object-center md:ml-[40px] pb-[20px] transition-transform duration-300 ease-in-out active:scale-[1.2] md:group-hover:scale-[1.1]"
              src={product.img}
              alt={product.productName}
            />
          </div>
          <div>
            <button
              onClick={() => addToCart(product)}
              className="text-[1.3rem] font-semibold text-white md:ml-[80px] ml-[56px] border-solid border-[2px] border-[#f19c0a] bg-[#f19c0a] rounded-[6px] md:px-[44px] px-[60px] py-[8px] hover:bg-blue-500 hover:text-white active:bg-blue-500 active:text-white mb-[26px]"
            >
              ADD TO CART
            </button>
            <button className="text-[1.3rem] font-semibold text-white ml-[56px] border-solid border-[2px] border-[#fb4913] bg-[#fb4913] rounded-[6px] md:px-[60px] px-[80px] py-[8px] hover:bg-blue-500 hover:text-white active:bg-blue-500 active:text-white">
              BUY NOW
            </button>
          </div>
        </div>
        <div className="md:w-[50%]">
          <div className="max-w-xl rounded-lg shadow p-[40px] space-y-2 md:ml-[26px] md:mt-[60px] mt-[20px]">
            <div className="font-semibold mb-[10px]">
              <h3 className="text-[1.8rem] font-semibold">{product.productName}</h3>
              <span className="text-[1.36rem] text-gray-500">{product.productFeature}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-green-600 text-white text-sm px-2 py-1 rounded">{product.ratings}</span>
              <span className="text-gray-600 text-sm">{product.reviews}</span>
              <span className="text-blue-700 font-semibold text-sm md:block hidden">✔️ Assured</span>
            </div>
            <div className="text-green-700 font-semibold text-lg">Special price</div>
            <div className="flex items-end space-x-2">
              <span className="text-2xl font-bold text-red-600">₹{product.discountPrice}</span>
              <span className="line-through text-gray-500">₹{product.price}</span>
              <span className="text-green-600 font-semibold">{product.specialDiscount}% off</span>
            </div>
            <p className="text-sm text-gray-700">Secure delivery in {product.delivery} days</p>
            <p className="text-red-600 text-sm font-medium">Hurry, Only a few left!</p>
            <div>
              <span className="font-semibold mb-1">Available offers</span>
              <ul className="space-y-1 text-sm text-gray-800">
                <li>
                  <span className="text-green-600 font-bold">🏷️ Bank Offer</span> 5% Unlimited Cashback on Flipkart Axis Bank Credit Card
                  <a href="#" className="text-blue-600 ml-1">
                    T&C
                  </a>
                </li>
                <li>
                  <span className="text-green-600 font-bold">🏷️ Bank Offer</span> 10% off up to ₹1,000 on all Axis Bank Credit Card (incl. migrated ones) EMI Txns of ₹7,490 and above
                  <a href="#" className="text-blue-600 ml-1">
                    T&C
                  </a>
                </li>
                <li>
                  <span className="text-green-600 font-bold">🏷️ Bank Offer</span> 10% off on BOBCARD EMI Transactions, up to ₹1,500 on orders of ₹5,000 and above
                  <a href="#" className="text-blue-600 ml-1">
                    T&C
                  </a>
                </li>
                <li>
                  <span className="text-green-600 font-bold">🏷️ Special Price</span> Get extra 9% off (price inclusive of cashback/coupon)
                  <a href="#" className="text-blue-600 ml-1">
                    T&C
                  </a>
                </li>
              </ul>
              <a href="#" className="text-blue-600 mt-1 inline-block text-sm">
                View 2 more offers
              </a>
            </div>
          </div>
        </div>
      </div>
      <NivzoneFooter />
    </>
  );
};

export default BuyNowPage;