interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div
      className="w-full m-0 px-4 py-4 rounded overflow-auto bg-gradient-to-br from-[#312d50] via-[#205370] to-[#da6578] " 
      style={{ boxShadow: "0 0 20px 3px rgba(221, 230, 240, 0.15)" }}
    >
      {children}
    </div>
  );
};

export default Container;
