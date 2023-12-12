import { AxiosRequestConfig } from "axios";
import "./styles.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Switch from "react-switch";
import { requestBackend } from "util/requests";
import { toast } from "react-toastify";
import Loader from "components/Loader";

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

  const onSubmit = (formData: FormData) => {
    setLoading(true);

    const params: AxiosRequestConfig = {
      url: "/users/register",
      method: "POST",
      data: {
        ...formData,
        roles: [{ id: 1 }],
        address: {
          addressLine: "SQS 411 Bloco F",
          number: "212",
          district: "Asa Sul",
          state: "Distrito Federal",
          city: "Brasilia",
          zipCode: "70277-060",
          country: "Brasil",
          additionalDetails: "none",
          addressType: 1,
        },
        birth: "1999-03-03",
        gender: 1,
      },
    };

    requestBackend(params)
      .then((res) => {
        setLoading(false);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="login-outter-container">
      <span className="login-title register-title">Register</span>
      <div className="login-inner-container register-variation">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="auth-input-container">
            <input
              type="text"
              id="register-name"
              placeholder="Name"
              className={`auth-input ${errors.name ? "is-invalid" : ""}`}
              {...register("name", {
                required: "Obrigatório",
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
                required: "Obrigatório",
              })}
            />
            <div className="invalid-feedback d-block">
              {errors.email?.message}
            </div>
          </div>
          <div className="auth-input-container">
            <input
              type="password"
              id="register-password"
              placeholder="Password"
              className={`auth-input ${errors.password ? "is-invalid" : ""}`}
              {...register("password", {
                required: "Obrigatório",
              })}
            />
            <div className="invalid-feedback d-block">
              {errors.password?.message}
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
            <div>
              <input
                type="text"
                id="register-password"
                placeholder={switchState ? "CPF" : "CNPJ"}
                className={`auth-input id-type-value ${
                  errors.password ? "is-invalid" : ""
                }`}
                {...register("idNumber", {
                  required: "Obrigatório",
                })}
              />
              <div className="invalid-feedback d-block">
                {errors.password?.message}
              </div>
            </div>
          </div>
          <div className="auth-input-container">
            <input
              type="text"
              id="register-phone-number"
              placeholder="Phone Number"
              className={`auth-input ${errors.phoneNumber ? "is-invalid" : ""}`}
              {...register("phoneNumber", {
                required: "Obrigatório",
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
