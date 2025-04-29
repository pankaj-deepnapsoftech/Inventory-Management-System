import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Layout from "./pages/Layout";
import routes from "./routes/routes";
import { useSelector } from "react-redux";
import NotFound from "./pages/NotFound";

const App: React.FC = () => {

  const { allowedroutes, isSuper } = useSelector((state: any) => state.auth);

  return (
    <div className="relative">
      <img className="h-full w-full  top-0 left-0 " src="https://img.freepik.com/free-vector/abstract-big-data-digital-technology-background-design_1017-22920.jpg?t=st=1745917186~exp=1745920786~hmac=98b9b64f532c35706794ff5eeae7f4ac8362f4f2c7906b30c5479dea7ada7082&w=740" alt="" />
      <div className="backdrop-blur-2xl absolute top-0 left-0  h-full w-full "></div>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            {routes.map((route, ind) => {
              const isAllowed = isSuper || allowedroutes.includes(route.path.replaceAll('/', ''));
              if (route.isSublink) {
                return (
                  <Route key={ind} path={route.path} element={route.element}>
                    {route.sublink &&
                      route.sublink.map((sublink, index) => {
                        return (
                          <Route
                            key={index}
                            path={sublink.path}
                            element={sublink.element}
                          ></Route>
                        );
                      })}
                  </Route>
                );
              } else {
                return (
                  <Route
                    index={route.name === "Dashboard" ? true : false}
                    key={ind}
                    path={route.path}
                    element={route.element}
                  ></Route>
                );
              }
            })}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
