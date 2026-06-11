import {
  useState,
  useContext,
} from "react";

import { useNavigate } from "react-router-dom";

import API from "../api/axios";

import {
  AuthContext,
} from "../context/AuthContext";

const Login = () => {
  const navigate =
    useNavigate();

  const { login } =
    useContext(AuthContext);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin =
    async (e) => {
      e.preventDefault();

      try {
        const { data } =
          await API.post(
            "/auth/login",
            {
              email,
              password,
            }
          );

        login(data);

        navigate("/dashboard");
      } catch (error) {
        alert(
          error.response?.data
            ?.message
        );
      }
    };

  return (
    <div>
      <h1>Login</h1>

      <form
        onSubmit={handleLogin}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <button
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;