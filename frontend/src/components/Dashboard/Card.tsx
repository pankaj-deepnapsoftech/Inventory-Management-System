// import { MdKeyboardArrowRight } from "react-icons/md";
// import { Link } from "react-router-dom";

// interface CardProps {
//   title: string;
//   content: string | number;
//   primaryColor?: string;
//   secondaryColor?: string;
//   textColor?: string;
//   link?: string;
// }

// const Card: React.FC<CardProps> = ({
//   title,
//   content,
//   primaryColor,
//   secondaryColor,
//   textColor,
//   link,
// }) => {
//   return (
//     <Link to={link || ''}>
//       <div
//         style={{ boxShadow: "rgb(157 157 157 / 83%) 3px 3px 12px 3px" }}
//         className="bg-white rounded-md text-center py-7 border"
//       >
//         <h1 className="flex items-center justify-center gap-2 text-xl border-b pb-4 font-bold text-[#22075e]">
//           {title}
//           <MdKeyboardArrowRight size={25} />
//         </h1>
//         <div className="mt-4 font-bold font-bold text-[#595959]">
//           {/* This Month */}
//           <span className="bg-[#0095ff] text-[#ffffff] rounded px-2 ml-1 py-1">
//             {content}
//           </span>
//         </div>
//       </div>
//     </Link>
//     // <div className="border border-[#a9a9a9] w-[13rem] h-[8rem] rounded flex flex-col">
//     //   <Link to={link || ''}>
//     //     <p
//     //       style={{
//     //         backgroundColor: primaryColor || "#f95356ee",
//     //         color: textColor || "white",
//     //       }}
//     //       className="text-xl font-light py-2 w-full text-center border-b border-b-[#ffffff] flex justify-center items-center cursor-pointer"
//     //     >
//     //       <span>{title}</span>
//     //       <MdKeyboardArrowRight />
//     //     </p>
//     //   </Link>
//     //   <p
//     //     style={{
//     //       backgroundColor: secondaryColor || "#F95355",
//     //       color: textColor || "white",
//     //     }}
//     //     className="text-3xl font-bold py-1 px-2 flex-1 flex items-center justify-center"
//     //   >
//     //     {content}
//     //   </p>
//     // </div>
//   );
// };

// export default Card;

import React from "react";
import { IoMdCart } from "react-icons/io";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";

interface CardProps {
  title: string;
  content: string | number;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  link?: string;
  icon: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  content,
  primaryColor,
  secondaryColor,
  textColor,
  link,
  icon,
}) => {
  return (
    <div
      style={{ boxShadow: "0 0 20px 3px #96beee26" }}
      className="bg-white rounded-md text-center py-7"
    >
      <h1 className="text-xl border-b border-b-[#a9a9a9] pb-4 font-bold text-[#22075e]">
        {title}
      </h1>
      <div className="mt-4 font-bold text-[#595959]">
        {/* This Month */}
        {/* <span className="bg-[#0095ff] text-[#ffffff] rounded px-2 ml-1 py-1"> */}
        <span style={{backgroundColor: primaryColor}} className="text-[#ffffff] rounded px-2 ml-1 py-1">
          {content}
        </span>
      </div>
    </div>
  );
};

export default Card;
