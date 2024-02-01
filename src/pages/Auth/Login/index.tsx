import "./styles.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "AuthContext";
import { useForm } from "react-hook-form";
import { requestBackend, requestBackendLogin } from "util/requests";
import { getUserData, saveAuthData, saveUserData } from "util/storage";
import { getTokenData } from "util/auth";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import PasswordInput from "components/PasswordInput";
import { AxiosRequestConfig } from "axios";
import { UserContext } from "UserContext";
import { User } from "types/user";
import ExpenseTrack from "types/expensetrack";

type FormData = {
  username: string;
  password: string;
};

const Login = () => {
  const { setAuthContextData } = useContext(AuthContext);
  const { setUserContextData } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const navigate = useNavigate();

  const retrieveUserData = (email: string) => {
    const userParams: AxiosRequestConfig = {
      url: `/users/email/${email}`,
      withCredentials: true,
      method: "GET",
    };

    requestBackend(userParams)
      .then((res) => {
        saveUserData(res.data);
        setUserContextData({
          user: res.data as User,
        });
      })
      .catch((err) => {
        toast.error(
          "Something went wrong while trying to retrieve your information."
        );
      });
  };

  const retrieveUserExpenseTrack = () => {
    const params: AxiosRequestConfig = {
      url: "/expenseTracks",
      withCredentials: true,
      method: "GET",
    };

    requestBackend(params)
      .then((res) => {
        let user = getUserData();
        user.expenseTrack = res.data as ExpenseTrack;
        saveUserData(user);
        setUserContextData({
          user: user,
        });
      })
      .catch((err) => {
        toast.error(
          "Something went wrong while trying to retrieve your information."
        );
      });
  };

  const onSubmit = (formData: FormData) => {
    setLoading(true);

    requestBackendLogin(formData)
      .then((res) => {
        setLoading(false);
        saveAuthData(res.data);
        setAuthContextData({
          authenticated: true,
          tokenData: getTokenData(),
        });

        retrieveUserData(formData.username);
        retrieveUserExpenseTrack();

        navigate("/");
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.data.error_description === "Bad credentials") {
          toast.error("Invalid credentials. Check your e-mail and password.");
        } else {
          toast.error(err.response.data.error_description);
        }
      });
  };

  return (
    <div className="login-outter-container">
      <span className="login-title">Login</span>
      <div className="login-inner-container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="auth-input-container">
            <input
              type="email"
              id="login-email"
              placeholder="Email"
              className={`auth-input ${errors.username ? "is-invalid" : ""}`}
              {...register("username", {
                required: "Required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid e-mail",
                },
              })}
            />
            <div className="invalid-feedback d-block">
              {errors.username?.message}
            </div>
          </div>
          <PasswordInput errors={errors} register={register} />
          {loading ? (
            <div style={{ marginBottom: "70px" }}>
              <Loader />
            </div>
          ) : (
            <button
              type="submit"
              name="login-button"
              id="login-button"
              className="auth-button"
            >
              Login
            </button>
          )}
        </form>
        <div className="login-bottom-links">
          <Link to={"/auth/register"}>Not registered?</Link>
          <Link to={"/auth/recoverpassword"}>Forgot your password?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
