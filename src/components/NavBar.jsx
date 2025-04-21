// import { Link, NavLink } from "react-router-dom";
// import { bestDealsImage, bestSellersImage, electronicsImage, fashionImage, homeImage, navHeading } from "../utils/data";
// import logo from "../images/nivzone_transparent.png";
// import { useState } from "react";
// import NavBarMobile from "./NavBarMobile";
// import { useCart } from "./CartContext"; // Adjust path as needed

// const NavBar = ({ setBgImage }) => {
//   const { cartSize } = useCart();
//   const [isMobileNavShow, setIsMobileNavBarShow] = useState(false);

//   const changeImg = (url) => {
//     switch (url) {
//       case "Home":
//         setBgImage(homeImage);
//         break;
//       case "Electronics":
//         setBgImage(electronicsImage);
//         break;
//       case "Fashion":
//         setBgImage(fashionImage);
//         break;
//       case "Best Deals":
//         setBgImage(bestDealsImage);
//         break;
//       case "Best Sellers":
//         setBgImage(bestSellersImage);
//         break;
//       default:
//         setBgImage(homeImage);
//     }
//   };

//   return (
//     <nav className="max-w-[1450px] mx-auto z-1 w-full fixed top-0">
//       <div className="py-[20px] bg-slate-300/60 text-blue-600">
//         <div className="flex items-center justify-between md:h-[90px] h-[60px] w-full">
//           <Link to="/">
//             <div className="flex items-center justify-between mb-[40px] w-[180px] mx-auto lg:ml-[90px]">
//               <img className="h-[70px] md:mt-[30px] mt-[60px] items-center" src={logo} alt="Nivzone logo" />
//             </div>
//           </Link>
//           <ul
//             className="cursor-pointer lg:flex hidden items-center justify-between gap-[34px] text-[1.3rem]"
//             onClick={(e) => changeImg(e.target.id)}
//           >
//             {navHeading.map((heading, index) => {
//               const updateURL = heading.split(" ").join("");
//               return (
//                 <NavLink key={heading + index} to={`/${heading === "Home" ? "" : updateURL}`} className="relative flex w-fit text-white group">
//                   <li id={heading} className="hover:text-red-600 text-blue-700 font-semibold">
//                     {heading}
//                     <span className="absolute left-0 bottom-0 h-[2px] bg-red-600 w-0 group-hover:w-full transition-all duration-300 ease-in-out"></span>
//                   </li>
//                 </NavLink>
//               );
//             })}
//             <Link to="/Cart">
//               <span>
//                 <i className="fa-solid fa-cart-shopping mr-[30px] font-semibold cursor-pointer text-[1.3rem]">
//                   <span className="p-[1px] bg-red-600 rounded-full text-[0.9rem] text-white relative top-[-15px] border-[5px] border-red-600">
//                     {cartSize}
//                   </span>
//                 </i>
//               </span>
//             </Link>
//           </ul>
//         </div>
//         <span className="md:hidden pl-[14px] text-[1.6rem]" onClick={() => setIsMobileNavBarShow(true)}>
//           <i className="fa-solid fa-bars text-slate-800"></i>
//         </span>
//         <NavBarMobile isMobileNavShow={isMobileNavShow} setIsMobileNavBarShow={setIsMobileNavBarShow} setBgImage={setBgImage} />
//       </div>
//     </nav>
//   );
// };

// export default NavBar;


















import { Link, NavLink, useNavigate } from "react-router-dom";
import { bestDealsImage, bestSellersImage, electronicsImage, fashionImage, homeImage, navHeading } from "../utils/data";
import logo from "../images/nivzone_transparent.png";
import { useState, useEffect } from "react";
import NavBarMobile from "./NavBarMobile";
import { useCart } from "./CartContext"; // Adjust path as needed

const NavBar = ({ setBgImage }) => {
  const { cartSize } = useCart();
  const [isMobileNavShow, setIsMobileNavBarShow] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state
  const navigate = useNavigate();

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
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
    <nav className="max-w-[1450px] mx-auto z-1 w-full fixed top-0">
      <div className="py-[20px] bg-slate-300/60 text-blue-600">
        <div className="flex items-center justify-between md:h-[90px] h-[60px] w-full">
          <Link to="/">
            <div className="flex items-center justify-between mb-[40px] w-[180px] mx-auto lg:ml-[90px]">
              <img className="h-[70px] md:mt-[30px] mt-[60px] items-center" src={logo} alt="Nivzone logo" />
            </div>
          </Link>
          <ul
            className="cursor-pointer lg:flex hidden items-center justify-between gap-[34px] text-[1.3rem]"
            onClick={(e) => changeImg(e.target.id)}
          >
            {navHeading.map((heading, index) => {
              const updateURL = heading.split(" ").join("");
              return (
                <NavLink key={heading + index} to={`/${heading === "Home" ? "" : updateURL}`} className="relative flex w-fit text-white group">
                  <li id={heading} className="hover:text-red-600 text-blue-700 font-semibold">
                    {heading}
                    <span className="absolute left-0 bottom-0 h-[2px] bg-red-600 w-0 group-hover:w-full transition-all duration-300 ease-in-out"></span>
                  </li>
                </NavLink>
              );
            })}
            <Link to="/Cart">
              <span>
                <i className="fa-solid fa-cart-shopping mr-[30px] font-semibold cursor-pointer text-[1.3rem]">
                  <span className="p-[1px] bg-red-600 rounded-full text-[0.9rem] text-white relative top-[-15px] border-[5px] border-red-600">
                    {cartSize}
                  </span>
                </i>
              </span>
            </Link>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-blue-700 font-semibold hover:text-red-600 text-[1.3rem] mr-[30px]"
              >
                Logout
              </button>
            ) : (
              <NavLink to="/Login" className="text-blue-700 font-semibold hover:text-red-600 text-[1.3rem] mr-[30px]">
                Login
              </NavLink>
            )}
          </ul>
        </div>
        <span className="md:hidden pl-[14px] text-[1.6rem]" onClick={() => setIsMobileNavBarShow(true)}>
          <i className="fa-solid fa-bars text-slate-800"></i>
        </span>
        <NavBarMobile isMobileNavShow={isMobileNavShow} setIsMobileNavBarShow={setIsMobileNavBarShow} setBgImage={setBgImage} />
      </div>
    </nav>
  );
};

export default NavBar;