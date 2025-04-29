import { useSelector } from "react-redux";
// import logo from "../../assets/images/logo/logo.png";
import { Avatar } from "@chakra-ui/react";
import { IoIosNotifications } from "react-icons/io";
import { useState } from "react";
import ClickMenu from "../../ui/ClickMenu";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import UserDetailsMenu from "../../ui/UserDetailsMenu";
// import { MdOutlineDashboardCustomize } from "react-icons/md";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [cookie, _, removeCookie] = useCookies();
  const [showUserDetails, setShowUserDetails] = useState<boolean>(false);
  const { firstname, lastname, email } = useSelector(
    (state: any) => state.auth
  );

  const logoutHandler = () => {
    try {
      removeCookie("access_token");
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
<<<<<<< HEAD
    <div className="relative flex justify-end max-[800px]:justify-end items-center py-2 px-3 bg-[#fbfbfb]"
    style={{ boxShadow: "0 0 20px 3px #96beee26" }}> 
    
      <div className="flex gap-x-5 items-center   ">
        <IoIosNotifications size={40} color="black" />

        <Avatar
          cursor="pointer"
          size="md"
          name={firstname ? firstname + " " + lastname : ""}
          onClick={() => setShowUserDetails((prev) => !prev)}
        ></Avatar>
        {showUserDetails && (
          <ClickMenu
            top={70}
            right={30}
            closeContextMenuHandler={() => setShowUserDetails(false)}
          >
            <UserDetailsMenu
              email={email}
              firstname={firstname}
              lastname={lastname}
              logoutHandler={logoutHandler}
              closeUserDetailsMenu={() => setShowUserDetails(false)}
            />
          </ClickMenu>
        )}
=======
    
    <div className="relative flex justify-around  items-center py-2 px-3 bg-[#fbfbfb]"
    style={{ boxShadow: "0 0 20px 3px #96beee26" }}
  > 
   
   {/* <MdOutlineDashboardCustomize /> */}
    <h1 className="text-[30px] font-[900] text-gray-800">Dashboard</h1>
  
    <div className="flex gap-x-2 items-center relative left-60 ">
      <div className="p-2 rounded-md flex items-center justify-center w-12 h-10">
        <IoIosNotifications size={40} color="black" />
>>>>>>> c7ec568d201c2553f90d825e08688bf91eff9aae
      </div>
  
      <Avatar
        cursor="pointer"
        size="md"
        name={firstname ? firstname + " " + lastname : ""}
        onClick={() => setShowUserDetails((prev) => !prev)}
      />
  
      {showUserDetails && (
        <ClickMenu
          top={70}
          right={30}
          closeContextMenuHandler={() => setShowUserDetails(false)}
        >
          <UserDetailsMenu
            email={email}
            firstname={firstname}
            lastname={lastname}
            logoutHandler={logoutHandler}
            closeUserDetailsMenu={() => setShowUserDetails(false)}
          />
        </ClickMenu>
      )}
    </div>
  </div>
  
  );
};

export default Header;