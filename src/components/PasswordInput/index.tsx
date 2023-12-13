import { ReactNode, useState } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

type FormData = {
  username: string;
  password: string;
};

interface Props {
  errors: FieldErrors;
  register: UseFormRegister<FormData>;
}

const PasswordInput = ({ errors, register }: Props) => {
  const [revealPassword, setRevealPassword] = useState(false);

  const handleRevealPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    let password = document.getElementById(
      "login-password"
    ) as HTMLInputElement;

    setRevealPassword(!revealPassword);

    if (password.type === "password" && password !== null) {
      password.type = "text";
    } else {
      password.type = "password";
    }
  };

  return (
    <div className="auth-input-container password-variation">
      <input
        type="password"
        id="login-password"
        placeholder="Password"
        className={`auth-input ${errors.password ? "is-invalid" : ""}`}
        {...register("password", {
          required: "Obrigatório",
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
  );
};

export default PasswordInput;
