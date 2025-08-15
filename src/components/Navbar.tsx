// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { MoonIcon, SunIcon, Bars3Icon } from "@heroicons/react/24/outline";
// import { useAuth } from "../auth/userAuth";
// import { logout } from "../auth/auth";

// export default function Navbar() {
//   const [toggleMenu, setToggleMenu] = useState(false);
//   const [toggleDropdown, setToggleDropdown] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const { isAuthenticated, username, setAuthenticated } = useAuth();
//   const navigate = useNavigate();

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//     document.documentElement.classList.toggle("dark", !darkMode);
   
//   };

//   const handleSignOut = async () => {
//     await logout();
//     setAuthenticated(false, ""); // Clear username on logout
//     navigate("/login");
//     setToggleDropdown(false);
//     setToggleMenu(false);
//   };

//   const menuItems = [
//     { name: "Home", path: "/", current: true },
//     { name: "Contact Us", path: "/contact" },
//   ];

//   const dropdownItems = [{ name: "Sign out", onClick: handleSignOut }];

//   useEffect(() => {
//     console.log("Auth context changed:", { isAuthenticated, username });
//   }, [isAuthenticated, username]);

//   return (
//     <nav className="bg-white dark:bg-gray-900 dark:border dark:border-b-gray-800/[0.25] fixed top-0 left-0 right-0 z-50">
//       <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
//         <Link
//           to="/"
//           className="flex items-center space-x-3 rtl:space-x-reverse"
//         >
//           <svg
//             width="40px"
//             height="40px"
//             viewBox="0 0 1024 1024"
//             className="icon"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M510 508.4m-210.8 0a210.8 210.8 0 1 0 421.6 0 210.8 210.8 0 1 0-421.6 0Z"
//               fill="#E6E6E6"
//             />
//             <path
//               d="M510 363.4c-80 0-145 65.1-145 145s65.1 145 145 145 145-65.1 145-145-65-145-145-145z"
//               fill="#FFFFFF"
//             />
//             <path
//               d="M510 343.4c-91 0-165 74-165 165s74 165 165 165 165-74 165-165-74-165-165-165z m0 310.1c-80 0-145-65.1-145-145s65.1-145 145-145 145 65.1 145 145-65 145-145 145z"
//               fill="#06F3FF"
//             />
//             <path
//               d="M795.4 488.4H760c-4.7-59.5-30-114.7-72.7-157.4s-98.1-68.1-157.7-72.7v-36.6c0-11-9-20-20-20s-20 9-20 20v36.7c-59.3 4.7-114.5 30.1-157 72.6-42.6 42.6-68 97.9-72.7 157.4H226c-11 0-20 9-20 20s9 20 20 20h34c4.7 59.5 30 114.7 72.7 157.4 42.5 42.5 97.7 67.9 157 72.6v35.5c0 11 9 20 20 20s20-9 20-20v-35.4c59.6-4.6 115-30 157.7-72.7 42.6-42.6 68-97.9 72.7-157.4h35.4c11 0 20-9 20-20s-9-20-20.1-20zM529.7 718.3v-51.9c0-11-9-20-20-20s-20 9-20 20v51.8c-100.1-9.6-180-89.6-189.5-189.8h52.6c11 0 20-9 20-20s-9-20-20-20h-52.6c9.5-100.2 89.4-180.2 189.5-189.8v50.3c0 11 9 20 20 20s20-9 20-20v-50.3c100.5 9.3 180.7 89.5 190.2 189.9h-49.5c-11 0-20 9-20 20s9 20 20 20h49.5c-9.5 100.4-89.8 180.5-190.2 189.8z"
//               fill="#005BFF"
//             />
//             <path
//               d="M880.4 158c0-11-9-20-20-20H510c-50 0-98.5 9.8-144.2 29.1-44.1 18.7-83.7 45.4-117.7 79.4-34 34-60.7 73.6-79.4 117.7-19.3 45.7-29.1 94.2-29.1 144.2 0 11 9 20 20 20s20-9 20-20C179.6 326.2 327.8 178 510 178h281.3v54.5c0 8.9 10.7 13.3 17 7l67.1-67.1c1.6-1.6 2.5-3.4 2.8-5.3 1.4-2.7 2.2-5.8 2.2-9.1zM860.4 488.4c-11 0-20 9-20 20 0 182.2-148.2 330.4-330.4 330.4H230.3V783c0-8.9-10.7-13.3-17-7l-67.1 67.1c-1 1-1.8 2.2-2.3 3.4-2.7 3.4-4.3 7.7-4.3 12.4 0 11 9 20 20 20H510c50 0 98.5-9.8 144.2-29.1 44.1-18.7 83.7-45.4 117.7-79.4 34-34 60.7-73.6 79.4-117.7 19.3-45.7 29.1-94.2 29.1-144.2 0-11.1-8.9-20.1-20-20.1z"
//               fill="#005BFF"
//             />
//           </svg>
//           <span className="self-center text-3xl font-semibold whitespace-nowrap text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500">
//             U-Control
//           </span>
//         </Link>

//         <button
//           onClick={() => setToggleMenu(!toggleMenu)}
//           type="button"
//           className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
//           aria-controls="navbar-dropdown"
//           aria-expanded={toggleMenu}
//         >
//           <span className="sr-only">Open main menu</span>
//           <Bars3Icon className="w-5 h-5" />
//         </button>

//         <div className="hidden w-full md:block md:w-auto" id="navbar-dropdown">
//           <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900">
//             {menuItems.map((item) => (
//               <li key={item.name}>
//                 <Link
//                   to={item.path}
//                   className={`block py-2 px-3 rounded hover:text-blue-700 dark:hover:text-blue-500 ${
//                     item.current
//                       ? "md:text-blue-700 md:dark:text-blue-500 text-gray-900 dark:text-white"
//                       : "text-gray-900 dark:text-white"
//                   }`}
//                   aria-current={item.current ? "page" : undefined}
//                 >
//                   {item.name}
//                 </Link>
//               </li>
//             ))}

//             {isAuthenticated ? (
//               <li className="relative">
//                 <button
//                   onClick={() => setToggleDropdown(!toggleDropdown)}
//                   className="flex items-center justify-between w-full py-2 px-3 text-gray-900 rounded hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
//                 >
//                   Hello, {username}
//                   <svg
//                     className="w-2.5 h-2.5 ms-2.5"
//                     aria-hidden="true"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 10 6"
//                   >
//                     <path
//                       stroke="currentColor"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="m1 1 4 4 4-4"
//                     />
//                   </svg>
//                 </button>

//                 {toggleDropdown && (
//                   <div className="z-10 absolute right-0 mt-2 w-44 origin-top-right rounded-md bg-white shadow-lg focus:outline-none dark:bg-gray-700">
//                     <div className="py-1">
//                       {dropdownItems.map((item) => (
//                         <button
//                           key={item.name}
//                           onClick={item.onClick}
//                           className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
//                         >
//                           {item.name}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </li>
//             ) : (
//               <li>
//                 <Link
//                   to="/login"
//                   className="block py-2 px-3 text-gray-900 rounded hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
//                 >
//                   Login
//                 </Link>
//               </li>
//             )}

//             <li>
//               <button
//                 onClick={toggleDarkMode}
//                 className="p-2 text-gray-900 rounded hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
//                 aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
//               >
//                 {darkMode ? (
//                   <SunIcon className="h-5 w-5" />
//                 ) : (
//                   <MoonIcon className="h-5 w-5" />
//                 )}
//               </button>
//             </li>
//           </ul>
//         </div>

//         {/* Mobile menu */}
//         <div
//           className={`md:hidden w-full bg-gray-100 dark:bg-gray-800 rounded-2xl mt-3 ${
//             toggleMenu ? "block" : "hidden"
//           }`}
//         >
//           <ul className="flex flex-col font-medium px-4 py-2 mt-2 rounded-lg bg-gray-50 dark:bg-gray-800">
//             {isAuthenticated && (
//               <li className="py-2  text-xl bg-gradient-to-r from-blue-300 via-violet-600 to-sky-900 bg-clip-text text-transparent">
//                 Hello, {username}
//               </li>
//             )}
//             {menuItems.map((item) => (
//               <li key={item.name}>
//                 <Link
//                   to={item.path}
//                   className="block py-2 px-3 text-gray-900 rounded hover:text-blue-700/[0.50] dark:text-white dark:hover:text-blue-500"
//                   onClick={() => setToggleMenu(false)}
//                 >
//                   {item.name}
//                 </Link>
//               </li>
//             ))}

//             {isAuthenticated ? (
//               dropdownItems.map((item) => (
//                 <li key={item.name}>
//                   <button
//                     onClick={() => {
//                       item.onClick?.();
//                       setToggleMenu(false);
//                     }}
//                     className="block w-full text-left py-2 px-3 text-gray-900 rounded hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
//                   >
//                     {item.name}
//                   </button>
//                 </li>
//               ))
//             ) : (
//               <li>
//                 <Link
//                   to="/login"
//                   className="block py-2 px-3 text-gray-900 rounded hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
//                   onClick={() => setToggleMenu(false)}
//                 >
//                   Login
//                 </Link>
//               </li>
//             )}

//             <li>
//               <button
//                 onClick={toggleDarkMode}
//                 className="flex items-center w-full text-left py-2 px-3 text-gray-900 rounded hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
//               >
//                 {darkMode ? (
//                   <>
//                     Light Mode
//                     <SunIcon className="h-5 w-5 ml-2" />
//                   </>
//                 ) : (
//                   <>
//                     Dark Mode
//                     <MoonIcon className="h-5 w-5 ml-2" />
//                   </>
//                 )}
//               </button>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// }
