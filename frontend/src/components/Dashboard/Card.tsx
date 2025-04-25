import React from "react";

interface CardProps {
  title: string;
  content: string | number;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  bgColor?: string;
  link?: string;
  icon: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  content,
  primaryColor,
  bgColor,
  icon,
}) => {
  return (
    <div
      style={{ boxShadow: "0 0 20px 3px #96beee26" }}
      className={`${bgColor} rounded-xl p-5 h-[160px] w-[270px] hover:scale-[1.1] transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white capitalize">
          {title === "DESIGNER"
            ? "Designer"
            : title === "DISPATCHER "
            ? "Dispatcher"
            : title}
        </h1>
        <div className="text-white text-3xl">{icon}</div>
      </div>

      <div className="text-black text-lg font-bold">
        <span
          style={{ backgroundColor: primaryColor }}
          className="inline-block text-black px-4 py-2 rounded-lg"
        >
          {content}
        </span>
      </div>
    </div>
  );
};

export default Card;
