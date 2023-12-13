import "./styles.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "AuthContext";
import { useForm } from "react-hook-form";
import { requestBackendLogin } from "util/requests";
import { saveAuthData } from "util/storage";
import { getTokenData } from "util/auth";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import PasswordInput from "components/PasswordInput";

type FormData = {
  username: string;
  password: string;
};

const Login = () => {
  const { setAuthContextData } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const navigate = useNavigate();

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
        navigate("/");
      })
      .catch((err) => {
        if (err.response.data.error_description === "Bad credentials") {
          toast.error(
            "Credenciais inválidas! Verifique o nome de usuário e/ou senha."
          );
        } else {
          toast.error(err.response.data.error_description);
        }
      })
      .finally(() => {
        setLoading(false);
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
                required: "Obrigatório",
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
