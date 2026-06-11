import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import API from "../api/axios";

const Register = () => {
  const navigate =
    useNavigate();

  const [form,
    setForm] =
    useState({
      name: "",
      email: "",
      password: "",
    });

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        await API.post(
          "/auth/register",
          form
        );

        navigate("/");
      } catch (error) {
        alert(
          error.response?.data
            ?.message
        );
      }
    };

  return (
    <div>
      <h1>Register</h1>

      <form
        onSubmit={
          handleSubmit
        }
      >
        <input
          placeholder="Name"
          onChange={(e) =>
            setForm({
              ...form,
              name:
                e.target.value,
            })
          }
        />

        <input
          placeholder="Email"
          onChange={(e) =>
            setForm({
              ...form,
              email:
                e.target.value,
            })
          }
        />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) =>
            setForm({
              ...form,
              password:
                e.target.value,
            })
          }
        />

        <button>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;