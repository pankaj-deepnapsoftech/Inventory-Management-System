interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div
      className="w-full m-0 px-4 py-4rounded overflow-auto bg-[#fbfbfb] "
      style={{ boxShadow: "0 0 20px 3px #96beee26" }}
    >
      {children}
    </div>
  );
};

export default Container;
