import { AxiosRequestConfig } from "axios";
import "./styles.css";
import { useForm } from "react-hook-form";
import { requestBackend } from "util/requests";
import { useState } from "react";
import Loader from "components/Loader";

type FormData = {
  email: string;
};

const SendEmail = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (formData: FormData) => {
    setLoading(true);

    const params: AxiosRequestConfig = {
      url: "/users/recover",
      method: "POST",
      params: {
        email: formData.email,
      },
    };

    requestBackend(params)
      .then((res) => {
        setLoading(false);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="login-outter-container recover-send-email-variation">
      <span className="login-title">Password Recover</span>
      <div className="login-inner-container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="auth-input-container">
            <input
              type="email"
              id="recover-email"
              placeholder="Email"
              className={`auth-input ${errors.email ? "is-invalid" : ""}`}
              {...register("email", {
                required: "Obrigatório",
              })}
            />
            <div className="invalid-feedback d-block">
              {errors.email?.message}
            </div>
          </div>
          {loading ? (
            <div style={{marginBottom: "150px"}}>
              <Loader />
            </div>
          ) : (
            <button
              type="submit"
              name="login-button"
              id="login-button"
              className="auth-button recover-send-email-button"
            >
              Recover
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default SendEmail;
