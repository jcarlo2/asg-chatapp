import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import GlobalContext from "../context/GlobalContext";

const Login = () => {
  const url = useContext(GlobalContext).url;
  const setIsAuthorized = useContext(GlobalContext).setIsAuthorized;
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const username = form.get("username");
    const password = form.get("password");
    fetch(`${url}/api/v1/auth/verify`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            console.log(data);
            if (data.isVerified) {
              localStorage.setItem("username", username);
              setIsAuthorized(true);
              navigate("/");
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
        console.log("error");
      });
  };

  return (
    <div className="login-container">
      <p>
        Does not have an account yet? <Link to={"/register"}>Sign Up</Link>
      </p>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="text" name="username" placeholder="Username" />
          <i className="bx bx-user bx-sm"></i>
        </div>
        <div>
          <input type="password" name="password" placeholder="Password" />
          <i className="bx bx-lock-alt bx-sm"></i>
        </div>
        <input type="submit" value={"Login"} />
        <div>
          <label>
            <input type="checkbox" />
            Remember me
          </label>
          <Link to={"forgot-password"}>Forgot Password?</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
