import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import GlobalContext from "../context/GlobalContext";

const Register = () => {
  const navigate = useNavigate();
  const url = useContext(GlobalContext).url;
  const isAuthorized = useContext(GlobalContext).isAuthorized;
  const setIsAuthorized = useContext(GlobalContext).setIsAuthorized;
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (isAuthorized) navigate("/");
  }, [isAuthorized, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const arr = {};
    form.forEach((value, key) => (arr[key] = value));
    fetch(`${url}/api/v1/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(arr),
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            if (data.isVerified) {
              localStorage.setItem('username', form.get('username'))
              setIsAuthorized(data.isVerified);
              navigate("/");
            } else if (data.errors) {
              setErrors(data.errors);
            }
          });
        }
      })
      .catch(console.log);
  };

  return (
    <div className="register-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <p>
            Username
            <span>
              {errors.some((error) => error.path === "username") && (
                <div>
                  {errors.filter((error) => error.path === "username")[0]?.msg}
                </div>
              )}
            </span>
          </p>
          <input type="text" name="username" placeholder="Username" required />
        </div>
        <div>
          <p>
            Email
            <span>
              {errors.some((error) => error.path === "email") && (
                <div>
                  {errors.filter((error) => error.path === "email")[0]?.msg}
                </div>
              )}
            </span>
          </p>
          <input type="email" name="email" placeholder="Email" required />
        </div>
        <div>
          <p>
            First Name
            <span>
              {errors.some((error) => error.path === "firstName") && (
                <div>
                  {errors.filter((error) => error.path === "firstName")[0]?.msg}
                </div>
              )}
            </span>
          </p>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            required
          />
        </div>
        <div>
          <p>
            Last Name
            <span>
              {errors.some((error) => error.path === "lastName") && (
                <div>
                  {errors.filter((error) => error.path === "lastName")[0]?.msg}
                </div>
              )}
            </span>
          </p>
          <input type="text" name="lastName" placeholder="Last Name" required />
        </div>
        <div>
          <p>
            Password
            <span>
              {errors.some((error) => error.path === "password") && (
                <div>
                  {errors.filter((error) => error.path === "password")[0]?.msg}
                </div>
              )}
            </span>
          </p>
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
          />
        </div>
        <div>
          <p>
            Confirm Password
            <span>
              {errors.some(
                (error) => error.path === "password_confirmation"
              ) && (
                <div>
                  {
                    errors.filter(
                      (error) => error.path === "password_confirmation"
                    )[0]?.msg
                  }
                </div>
              )}
            </span>
          </p>
          <input
            type="password"
            name="password_confirmation"
            placeholder="Confirm Password"
            required
          />
        </div>
        <div>
          <p>
            Gender{" "}
            <span>
              {errors.some((error) => error.path === "gender") && (
                <div>
                  {errors.filter((error) => error.path === "gender")[0]?.msg}
                </div>
              )}
            </span>
          </p>
          <select name="gender" required>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <p>
            Birthdate
            <span>
              {errors.some((error) => error.path === "birthdate") && (
                <div>
                  {errors.filter((error) => error.path === "birthdate")[0]?.msg}
                </div>
              )}
            </span>
          </p>
          <input type="date" name="birthdate" min={"1900-01-01"} required />
        </div>
        <input type="submit" value="Register" />
      </form>
      <p>
        Have an account already? <Link to={"/login"}>Sign in</Link>
      </p>
    </div>
  );
};

export default Register;
