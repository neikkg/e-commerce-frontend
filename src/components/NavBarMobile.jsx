import { NavLink, useNavigate } from "react-router-dom";
import { bestDealsImage, bestSellersImage, electronicsImage, fashionImage, homeImage, navHeading } from "../utils/data";
import { useState, useEffect } from "react";
import { useCart } from "./CartContext"; // Adjust path as needed

const NavBarMobile = ({ isMobileNavShow, setIsMobileNavBarShow, setBgImage }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state
    const { cartSize } = useCart(); // Get cart size from context
    const navigate = useNavigate();

    // Check authentication status on component mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setIsMobileNavBarShow(false); // Close the mobile navbar
        navigate("/Login"); // Redirect to login page after logout
    };

    const changeImg = (url) => {
        switch (url) {
            case "Home":
                setBgImage(homeImage);
                break;
            case "Electronics":
                setBgImage(electronicsImage);
                break;
            case "Fashion":
                setBgImage(fashionImage);
                break;
            case "Best Deals":
                setBgImage(bestDealsImage);
                break;
            case "Best Sellers":
                setBgImage(bestSellersImage);
                break;
            default:
                setBgImage(homeImage);
        }
    };

    return (
        <nav className="">
            <div
                className={`fixed top-0 bg-black/60 z-[1000] h-screen inset-0 w-[20%] lg:hidden transform transition-all ease-in inline-flex flex-col ${
                    isMobileNavShow ? "translate-x-[0]" : "translate-x-[-100%]"
                }`}
            >
                <i
                    className="fa-solid fa-xmark mr-[20px] ml-auto mt-[20px] cursor-pointer"
                    onClick={() => setIsMobileNavBarShow(false)}
                ></i>
                <ul
                    className="text-white cursor-pointer flex-col items-center justify-between gap-[30px] text-[1rem] font-semibold"
                    onClick={(e) => changeImg(e.target.id)}
                >
                    {navHeading.map((heading, index) => {
                        const updateURL = heading.split(" ").join("");
                        return (
                            <NavLink
                                key={heading + index}
                                to={`/${heading === "Home" ? "" : updateURL}`}
                                onClick={() => setIsMobileNavBarShow(false)} // Close navbar on link click
                            >
                                <li id={heading} className="ml-[20px] mr-auto">
                                    {heading}
                                    <hr className="text-gray-400 mb-[8px] mt-[12px]" />
                                </li>
                            </NavLink>
                        );
                    })}
                    {/* Add Cart Icon */}
                    {/* <li className="ml-[20px] mr-auto">
                        <NavLink
                            to="/Cart"
                            onClick={() => setIsMobileNavBarShow(false)} // Close navbar on cart click
                            className="text-white font-semibold hover:text-red-600 text-[1rem] flex items-center"
                        >
                            <i className="fa-solid fa-cart-shopping mr-[10px]"></i>
                            Cart
                            <span className="ml-[5px] p-[2px] bg-red-600 rounded-full text-[0.8rem] text-white">
                                {cartSize}
                            </span>
                        </NavLink>
                        <hr className="text-gray-400 mb-[8px] mt-[12px]" />
                    </li> */}
                    {/* Add Login/Logout Button */}
                    <li className="ml-[20px] mr-auto">
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="text-white font-semibold hover:text-red-600 text-[1rem]"
                            >
                                Logout
                            </button>
                        ) : (
                            <NavLink
                                to="/Login"
                                onClick={() => setIsMobileNavBarShow(false)} // Close navbar on login click
                                className="text-white font-semibold hover:text-red-600 text-[1rem]"
                            >
                                Login
                            </NavLink>
                        )}
                        <hr className="text-gray-400 mb-[8px] mt-[12px]" />
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default NavBarMobile;