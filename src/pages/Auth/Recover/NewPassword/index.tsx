import { ReactNode, useState } from "react";
import "./styles.css";
import { useForm } from "react-hook-form";
import Loader from "components/Loader";
import { AxiosRequestConfig } from "axios";
import { useParams } from "react-router-dom";
import { requestBackend } from "util/requests";
import { toast } from "react-toastify";

type FormData = {
  password: string;
  confirmPassword: string;
};

type UrlParams = {
  token: string;
};

const NewPassword = () => {
  const urlParams = useParams<UrlParams>();
  const [loading, setLoading] = useState(false);
  const [revealPassword, setRevealPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const handleRevealPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    let password = document.getElementById(
      "recover-password"
    ) as HTMLInputElement;

    let confirmPassword = document.getElementById(
      "recover-confirm-password"
    ) as HTMLInputElement;

    setRevealPassword(!revealPassword);

    if (password.type === "password" && password !== null) {
      password.type = "text";
      confirmPassword.type = "text";
    } else {
      password.type = "password";
      confirmPassword.type = "password";
    }
  };

  const onSubmit = (formData: FormData) => {
    setLoading(true);

    const params: AxiosRequestConfig = {
      url: "/users/saveChangeOfPassword",
      method: "POST",
      data: {
        password: formData.password,
        token: urlParams.token,
      },
    };

    requestBackend(params)
      .then((res) => {
        console.log(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
        setLoading(false);
      });
  };

  return (
    <div className="login-outter-container recover-send-email-variation">
      <span className="login-title">Password Recover</span>
      <div className="login-inner-container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="auth-input-container password-variation">
            <input
              type="password"
              id="recover-password"
              placeholder="Password"
              className={`auth-input ${errors.password ? "is-invalid" : ""}`}
              {...register("password", {
                required: "Required",
                minLength: {
                  value: 6,
                  message: "At least 6 characters required",
                },
                maxLength: {
                  value: 48,
                  message: "Maximum of 48 characters",
                },
              })}
            />
            <button
              type="button"
              className="password-reveal-button"
              onClick={handleRevealPassword}
            >
              {revealPassword ? (
                <i className="bi bi-eye-slash-fill" />
              ) : (
                <i className="bi bi-eye-fill" />
              )}
            </button>
            <div className="invalid-feedback d-block">
              {errors.password?.message as ReactNode}
            </div>
          </div>
          <div className="auth-input-container">
            <input
              type="password"
              id="recover-confirm-password"
              placeholder="Confirm Password"
              className={`auth-input ${errors.password ? "is-invalid" : ""}`}
              {...register("confirmPassword", {
                required: "Required",
                minLength: {
                  value: 6,
                  message: "At least 6 characters required",
                },
                maxLength: {
                  value: 48,
                  message: "Maximum of 48 characters",
                },
                validate: (value: string) =>
                  watch("password") !== value || "Passwords are not matching",
              })}
            />
            <div className="invalid-feedback d-block">
              {errors.password?.message}
            </div>
          </div>
          {loading ? (
            <div style={{ marginBottom: "80px" }}>
              <Loader />
            </div>
          ) : (
            <button
              type="submit"
              name="login-button"
              id="login-button"
              className="auth-button recover-new-password-button"
            >
              Recover
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default NewPassword;
