// import React, { useContext, useState } from "react";
// import logo from "./../assets/Images/logo.png";
// import { HiOutlineMagnifyingGlass, HiMoon, HiSun } from "react-icons/hi2";
// import { ThemeConstant } from "../Context/Themecontext";
// import { FiMenu } from "react-icons/fi";

// const Header = ({ onToggleGenre, onSearch }) => {
//   const { theme, setTheme } = useContext(ThemeConstant);
//   const [searchInput, setSearchInput] = useState("");

//   const handleSearch = () => {
//     if (searchInput.trim()) {
//       onSearch(searchInput.trim());
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       handleSearch();
//     }
//   };

//   return (
//     <div className="flex flex-row items-center p-3 z-50 bg-white dark:bg-[#121212] sticky top-0">
//       <img
//         src={logo}
//         alt="logo"
//         className="w-[60px] h-[60px] hidden md:block"
//       />

//       <div className="block md:hidden w-[60px] h-[60px] flex items-center justify-center">
//         <FiMenu
//           className="text-[30px] cursor-pointer dark:text-white text-black"
//           onClick={onToggleGenre}
//         />
//       </div>

//       <div className="flex flex-row bg-slate-200 dark:bg-slate-700 p-2 w-full items-center mx-5 rounded-full">
//         <HiOutlineMagnifyingGlass
//           className="cursor-pointer dark:text-gray-200"
//           onClick={handleSearch}
//         />
//         <input
//           type="text"
//           placeholder="Search Games"
//           value={searchInput}
//           onChange={(e) => {
//             setSearchInput(e.target.value);
//             if (e.target.value.trim() === "") {
//               onSearch(""); // reset the page layout
//             }
//           }}
//           onKeyDown={handleKeyDown}
//           className="bg-transparent outline-none px-2 w-full text-black dark:text-white"
//         />
//       </div>

//       <div className="flex items-center gap-4">
//         {theme === "light" ? (
//           <HiSun
//             className="bg-slate-200 text-[35px] text-black p-1 rounded-full cursor-pointer"
//             onClick={() => {
//               setTheme("dark");
//               localStorage.setItem("theme", "dark");
//             }}
//           />
//         ) : (
//           <HiMoon
//             className="bg-slate-200 text-[35px] text-black p-1 rounded-full cursor-pointer"
//             onClick={() => {
//               setTheme("light");
//               localStorage.setItem("theme", "light");
//             }}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Header;
