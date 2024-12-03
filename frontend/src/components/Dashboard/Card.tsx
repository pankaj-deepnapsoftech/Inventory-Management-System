import { MdKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";

interface CardProps {
  title: string;
  content: string | number;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  link?:string
}

const Card: React.FC<CardProps> = ({
  title,
  content,
  primaryColor,
  secondaryColor,
  textColor,
  link
}) => {
  return (
    <div className="border border-[#a9a9a9] w-[13rem] h-[8rem] rounded flex flex-col">
      <Link to={link || ''}>
        <p
          style={{
            backgroundColor: primaryColor || "#f95356ee",
            color: textColor || "white",
          }}
          className="text-xl font-light py-2 w-full text-center border-b border-b-[#ffffff] flex justify-center items-center cursor-pointer"
        >
          <span>{title}</span>
          <MdKeyboardArrowRight />
        </p>
      </Link>
      <p
        style={{
          backgroundColor: secondaryColor || "#F95355",
          color: textColor || "white",
        }}
        className="text-3xl font-bold py-1 px-2 flex-1 flex items-center justify-center"
      >
        {content}
      </p>
    </div>
  );
};

export default Card;
