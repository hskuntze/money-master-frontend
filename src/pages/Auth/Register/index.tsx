import { AxiosRequestConfig } from "axios";
import "./styles.css";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import Switch from "react-switch";
import { requestBackend } from "util/requests";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import { useNavigate } from "react-router-dom";
import ReactInputMask from "react-input-mask";

type FormData = {
  name: string;
  email: string;
  password: string;
  idType: number;
  idNumber: string;
  phoneNumber: string;
};

const Register = () => {
  const [switchState, setSwitchState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [revealPassword, setRevealPassword] = useState(false);
  const navigation = useNavigate();

  const handleSwitch = (state: boolean) => {
    setSwitchState(state);

    let value = state ? 1 : 2;
    setValue("idType", value);
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const handleRevealPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    let password = document.getElementById(
      "register-password"
    ) as HTMLInputElement;

    setRevealPassword(!revealPassword);

    if (password.type === "password" && password !== null) {
      password.type = "text";
    } else {
      password.type = "password";
    }
  };

  const onSubmit = (formData: FormData) => {
    setLoading(true);

    const params: AxiosRequestConfig = {
      url: "/users/register",
      method: "POST",
      data: {
        ...formData,
        roles: [{ id: 2 }],
      },
    };

    requestBackend(params)
      .then((res) => {
        setLoading(false);
        navigation("/auth");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="login-outter-container register-variation">
      <span className="login-title register-title">Register</span>
      <div className="login-inner-container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="auth-input-container">
            <input
              type="text"
              id="register-name"
              placeholder="Name"
              className={`auth-input ${errors.name ? "is-invalid" : ""}`}
              {...register("name", {
                required: "Required",
              })}
            />
            <div className="invalid-feedback d-block">
              {errors.name?.message}
            </div>
          </div>
          <div className="auth-input-container">
            <input
              type="email"
              id="register-email"
              placeholder="Email"
              className={`auth-input ${errors.email ? "is-invalid" : ""}`}
              {...register("email", {
                required: "Required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid e-mail",
                },
              })}
            />
            <div className="invalid-feedback d-block">
              {errors.email?.message}
            </div>
          </div>
          <div className="auth-input-container password-variation">
            <input
              type="password"
              id="register-password"
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
          <div className="auth-input-container id-type-container">
            <Switch
              uncheckedIcon={false}
              checkedIcon={false}
              checked={switchState}
              onChange={handleSwitch}
              onColor="#B8D9CD"
              offColor="#6E817A"
              handleDiameter={30}
            />
            {switchState ? (
              <div>
                <ReactInputMask
                  type="text"
                  id="register-id-type"
                  mask={"999.999.999-99"}
                  alwaysShowMask={false}
                  placeholder="CPF"
                  className={`auth-input id-type-value ${
                    errors.idNumber ? "is-invalid" : ""
                  }`}
                  {...register("idNumber", {
                    required: "Required",
                    pattern: {
                      value: /([0-9]{2}[.]?[0-9]{3}[.]?[0-9]{3}[/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}[-]?[0-9]{2})/i,
                      message: "Only numbers",
                    },
                  })}
                />
                <div className="invalid-feedback d-block">
                  {errors.idNumber?.message}
                </div>
              </div>
            ) : (
              <div>
                <ReactInputMask
                  type="text"
                  id="register-id-type"
                  mask={"99.999.999/9999-99"}
                  alwaysShowMask={false}
                  placeholder="CNPJ"
                  className={`auth-input id-type-value ${
                    errors.idNumber ? "is-invalid" : ""
                  }`}
                  {...register("idNumber", {
                    required: "Required",
                    pattern: {
                      value: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
                      message: "Only numbers",
                    }
                  })}
                />
                <div className="invalid-feedback d-block">
                  {errors.idNumber?.message}
                </div>
              </div>
            )}
          </div>
          <div className="auth-input-container">
            <ReactInputMask
              type="tel"
              id="register-phone-number"
              mask={"(99) 9 9999-9999"}
              placeholder="Phone Number"
              className={`auth-input ${errors.phoneNumber ? "is-invalid" : ""}`}
              {...register("phoneNumber", {
                required: "Required",
              })}
            />
            <div className="invalid-feedback d-block">
              {errors.phoneNumber?.message}
            </div>
          </div>
          {loading ? (
            <Loader />
          ) : (
            <button
              type="submit"
              name="register-button"
              id="register-button"
              className="auth-button register-button"
            >
              Register
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
