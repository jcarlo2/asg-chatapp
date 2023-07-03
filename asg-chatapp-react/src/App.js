import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./css/app.css";
import GlobalContext, { GlobalVariable } from "./context/GlobalContext";
import Response404 from "./pages/Response404";
import Login from "./pages/Login";
import Main from "./pages/Main";
import Register from "./pages/Register";
import Modal from "./component/Modal";

function App() {
  const navigate = useNavigate();
  const global = GlobalVariable();

  useEffect(() => {
    fetch(`${global.url}/api/v1/auth/init`, {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          res.json().then(({ isVerified }) => {
            if (isVerified) {
              global.setIsAuthorized(true);
              navigate("/");
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
        global.setIsAuthorized(false);
      });
  }, []);

  return (
    <>
      <GlobalContext.Provider value={global}>
        <Modal text={global.text} ref={global.modalRef}/>
        <Routes>
          <Route index element={global.isAuthorized ? <Main /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Response404 />} />
        </Routes>
      </GlobalContext.Provider>
    </>
  );
}

export default App;
