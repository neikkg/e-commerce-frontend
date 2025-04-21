import { NavLink } from "react-router-dom";
import { bestDealsImage, bestSellersImage, electronicsImage, fashionImage, homeImage, navHeading } from "../utils/data";


const NavBarMobile = ({isMobileNavShow, setIsMobileNavBarShow, setBgImage}) => {
     const changeImg = (url) => {
            
                switch(url)  {
                    case 'Home': setBgImage(homeImage); break;
                    case 'Electronics' : setBgImage(electronicsImage); break;
                    case 'Fashion' : setBgImage(fashionImage); break;
                    case 'Best Deals' : setBgImage(bestDealsImage ); break;
                    case 'Best Sellers' : setBgImage(bestSellersImage); break;
                    default : setBgImage(homeImage)
                    
                } 
            }

    return <nav className="">
            <div className={`fixed top-0 bg-black/60 z-[1000] h-screen inset-0 w-[65%] lg:hidden transform transition-all ease-in inline-flex flex-col  ${isMobileNavShow ? 'translate-x-[0]': 'translate-x-[-100%] '}`} >   
               <i className="fa-solid fa-xmark mr-[20px] ml-auto mt-[20px] cursor-pointer" onClick={ (e) => setIsMobileNavBarShow(false) }></i> 
               <ul className="cursor-pointer flex-col items-center justify-between gap-[30px] text-[1rem] font-semibold " onClick={(e) => changeImg(e.target.id)}>
                {navHeading.map((heading, index)=> {
                     const updateURL = heading.split(" ").join("")
                return <NavLink key={heading + index} to={`/${heading == 'Home'?'': updateURL}`}> <li id={heading} className=" ml-[20px] mr-auto">{heading} <hr className="text-gray-400 mb-[8px] mt-[12px]"/> </li> </NavLink> 
                })}
        </ul>  
                    
            </div>

           </nav>
}

export default NavBarMobile;