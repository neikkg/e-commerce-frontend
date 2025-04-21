import { navHeading } from "../utils/data";
import NavBarMobile from "./NavBarMobile";
import logo from "../images/nivzone_transparent.png";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useCart } from "./CartContext";

const BookNowNavbar = ({setBgImage}) => {
    const { cartSize } = useCart();
    const [show, setShow] = useState(true)

    const [isMobileNavShow, setIsMobileNavBarShow] = useState(false);
    return <nav className="max-w-[1450px] mx-auto z-1 w-full  fixed  top-0  ">
    <div className="py-[20px] bg-slate-300/60   text-blue-600  ">
         <div className="flex items-center justify-between md:h-[90px] h-[60px] w-full">
             <div className=" flex items-center justify-between mb-[40px] w-[180px] mx-auto  lg:ml-[90px] ">
                 <img className="h-[80px] md:mt-[30px] mt-[60px] items-center " src={logo} alt="Nivzone logo" /></div>      
                 <ul className="cursor-pointer lg:flex hidden items-center justify-between gap-[34px]  text-[1.3rem]" onClick={(e) => changeImg(e.target.id)}>
                             {
                             navHeading.map((heading, index)=> {
                                  const updateURL = heading.split(" ").join("")
                             return <NavLink key={heading + index} to={`/${heading == 'Home'?'': updateURL}`} className="relative flex w-fit text-white group"> 
                             <li  id={heading} className="hover:text-red-600 text-blue-700 font-semibold " >{heading} 
                                 <span className="absolute left-0 bottom-0 h-[2px] bg-red-600 w-0 group-hover:w-full transition-all duration-300 ease-in-out"></span>
                             </li> 
                             </NavLink>
                             
                             })}
                             <Link to="/Cart">
                                <span><i className="fa-solid fa-cart-shopping mr-[30px]  font-semibold cursor-pointer text-[1.3rem]"><span className="p-[1px] bg-red-600 rounded-full text-[0.9rem] text-white  relative top-[-15px] border-[5px] border-red-600 ">{cartSize}</span></i></span>
                             </Link>
                         </ul>
              </div>
              <span className="md:hidden pl-[14px] text-[1.6rem]" onClick={ () => setIsMobileNavBarShow(true)} >
             <i className="fa-solid fa-bars text-slate-800"></i>
             </span>
        <NavBarMobile isMobileNavShow = {isMobileNavShow} setIsMobileNavBarShow = {setIsMobileNavBarShow} setBgImage= {setBgImage}/>
     </div>
 </nav>
}


export default BookNowNavbar;