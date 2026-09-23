// "use client";

// export function CanvasPreview() {
//   const tools = ["↖", "□", "◇", "○", "→", "T", "✎", "▧"];

//   const colors = [
//     "#171717",
//     "#ef4444",
//     "#22a35a",
//     "#315dcc",
//     "#625df5",
//     "#f08c36",
//   ];

//   const comments = [
//     ["A", "Love this direction."],
//     ["S", "Let's explore this idea."],
//     ["D", "Looks good to me."],
//   ];

//   return (
//     <div
//       id="product"
//       className="relative mx-auto mt-16 max-w-[1240px] px-4 sm:mt-20"
//     >
//       {/* Decorative pen */}
//       <div className="absolute left-1/2 top-[-105px] z-10 hidden -translate-x-1/2 md:block">
//         <svg
//           width="72"
//           height="150"
//           viewBox="0 0 72 150"
//           fill="none"
//           className="animate-[float_5s_ease-in-out_infinite]"
//         >
//           <path
//             d="M25 3L50 3L53 103L38 126L22 103L25 3Z"
//             fill="#F7F7FC"
//             stroke="#4B4B55"
//             strokeWidth="2.5"
//           />
//           <circle
//             cx="37.5"
//             cy="95"
//             r="7"
//             fill="white"
//             stroke="#4B4B55"
//             strokeWidth="2"
//           />
//           <path
//             d="M22 103L38 126L53 103"
//             fill="#ECECFA"
//             stroke="#4B4B55"
//             strokeWidth="2.5"
//           />
//         </svg>
//       </div>

//       {/* Application window */}
//       <div className="relative overflow-hidden rounded-[22px] border border-[#dedede] bg-white shadow-[0_20px_70px_rgba(30,30,60,0.12)]">

//         {/* Toolbar */}
//         <div className="flex h-14 items-center justify-between border-b border-[#eeeeee] px-4">

//           <div className="flex items-center gap-2">
//             <button
//               type="button"
//               aria-label="Open menu"
//               className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e5e5e5] text-sm transition hover:bg-[#f5f5f5]"
//             >
//               ☰
//             </button>

//             <span className="hidden text-xs font-medium text-[#777] sm:block">
//               Draivo scene
//             </span>
//           </div>

//           {/* Drawing tools */}
//           <div className="hidden items-center gap-1 rounded-xl border border-[#e6e6e6] bg-white px-2 py-1 shadow-sm sm:flex">
//             {tools.map((item, index) => (
//               <button
//                 key={item}
//                 type="button"
//                 aria-label={`Tool ${index + 1}`}
//                 className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition ${
//                   index === 0
//                     ? "bg-black text-white"
//                     : "text-[#555] hover:bg-[#f3f3f8]"
//                 }`}
//               >
//                 {item}
//               </button>
//             ))}
//           </div>

//           {/* Users */}
//           <div className="flex -space-x-2">
//             {["F", "A", "S", "D"].map((letter, index) => (
//               <div
//                 key={letter}
//                 className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[9px] font-bold text-white ${
//                   index === 0
//                     ? "bg-[#625df5]"
//                     : index === 1
//                       ? "bg-[#f09b62]"
//                       : index === 2
//                         ? "bg-[#63a37c]"
//                         : "bg-[#222]"
//                 }`}
//               >
//                 {letter}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Canvas */}
//         <div className="draivo-grid relative h-[480px] overflow-hidden bg-white sm:h-[560px]">

//           {/* Left property panel */}
//           <div className="absolute left-4 top-5 hidden w-[145px] rounded-xl border border-[#e5e5e5] bg-white p-3 shadow-sm md:block">
//             <p className="mb-3 text-[10px] font-semibold text-[#777]">
//               Stroke
//             </p>

//             <div className="flex flex-wrap gap-2">
//               {colors.map((color) => (
//                 <span
//                   key={color}
//                   className="h-5 w-5 rounded-md border border-black/10"
//                   style={{ backgroundColor: color }}
//                 />
//               ))}
//             </div>

//             <p className="mb-2 mt-5 text-[10px] font-semibold text-[#777]">
//               Stroke width
//             </p>

//             <div className="h-1 rounded-full bg-[#e6e6e6]">
//               <div className="h-1 w-2/3 rounded-full bg-[#625df5]" />
//             </div>

//             <p className="mb-2 mt-5 text-[10px] font-semibold text-[#777]">
//               Opacity
//             </p>

//             <div className="h-1 rounded-full bg-[#e6e6e6]">
//               <div className="h-1 w-4/5 rounded-full bg-[#625df5]" />
//             </div>
//           </div>

//           {/* Main drawing */}
//           <div className="absolute left-[28%] top-[18%] w-[44%] sm:left-[31%] sm:w-[38%]">
//             <div className="relative aspect-[1.35] rotate-[-1deg] border-[3px] border-[#f3a14c] bg-[#fffefa] shadow-sm">

//               <div
//                 className="absolute inset-0 opacity-50"
//                 style={{
//                   backgroundImage:
//                     "repeating-linear-gradient(135deg, transparent, transparent 5px, #eeeefa 5px, #eeeefa 7px)",
//                 }}
//               />

//               <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
//                 <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#888]">
//                   Draivo
//                 </p>

//                 <p className="mt-2 text-2xl font-semibold tracking-tight text-[#222] sm:text-3xl">
//                   Build together.
//                 </p>
//               </div>

//               {/* Selection handles */}
//               {[
//                 "left-[-7px] top-[-7px]",
//                 "right-[-7px] top-[-7px]",
//                 "left-[-7px] bottom-[-7px]",
//                 "right-[-7px] bottom-[-7px]",
//               ].map((position) => (
//                 <span
//                   key={position}
//                   className={`absolute h-3 w-3 rounded-full border-2 border-[#625df5] bg-white ${position}`}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Right comments panel */}
//           <div className="absolute right-4 top-5 hidden w-[220px] rounded-xl border border-[#e5e5e5] bg-white shadow-sm md:block">
//             <div className="border-b border-[#eeeeee] p-3">
//               <p className="text-xs font-semibold text-[#333]">
//                 Comments
//               </p>
//             </div>

//             {comments.map(([letter, text]) => (
//               <div
//                 key={text}
//                 className="border-b border-[#f1f1f1] p-3"
//               >
//                 <div className="flex items-center gap-2">
//                   <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#625df5] text-[9px] font-bold text-white">
//                     {letter}
//                   </span>

//                   <span className="text-[10px] font-semibold text-[#444]">
//                     Teammate
//                   </span>
//                 </div>

//                 <p className="mt-2 text-[10px] leading-4 text-[#777]">
//                   {text}
//                 </p>
//               </div>
//             ))}
//           </div>

//           {/* Farhan cursor */}
//           <div className="absolute left-[24%] top-[58%] animate-[cursorFloat_6s_ease-in-out_infinite]">
//             <svg width="25" height="30" viewBox="0 0 25 30" fill="none">
//               <path
//                 d="M2 2L22 15L13 17L10 27L2 2Z"
//                 fill="#625df5"
//                 stroke="white"
//                 strokeWidth="2"
//               />
//             </svg>

//             <span className="absolute left-5 top-5 whitespace-nowrap rounded-full bg-[#625df5] px-2 py-1 text-[9px] font-medium text-white">
//               Farhan
//             </span>
//           </div>

//           {/* Sarah cursor */}
//           <div className="absolute left-[66%] top-[35%] animate-[cursorFloat_7s_ease-in-out_infinite]">
//             <svg width="25" height="30" viewBox="0 0 25 30" fill="none">
//               <path
//                 d="M2 2L22 15L13 17L10 27L2 2Z"
//                 fill="#f08c36"
//                 stroke="white"
//                 strokeWidth="2"
//               />
//             </svg>

//             <span className="absolute left-5 top-5 whitespace-nowrap rounded-full bg-[#f08c36] px-2 py-1 text-[9px] font-medium text-white">
//               Sarah
//             </span>
//           </div>

//           {/* Bottom status */}
//           <div className="absolute bottom-5 left-5 rounded-lg border border-black/10 bg-white px-3 py-2 text-[10px] text-[#777] shadow-sm">
//             ✦ Everyone is drawing together
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }