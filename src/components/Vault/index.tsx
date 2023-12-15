import { useState } from "react";
import "./styles.css";
import { useForm } from "react-hook-form";

type FormData = {
  savings: number;
  allowedToSpend: number;
  onWallet: number;
};

const Vault = () => {
  const [showVault, setShowVault] = useState(true);
  const [savings, setFormSavings] = useState<number>();
  const [allowedToSpend, setFormAllowedToSpend] = useState<number>();
  const [onWallet, setFormOnWallet] = useState<number>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>();

  const handleToggleShowInfo = () => {
    setShowVault(!showVault);

    if (showVault) {
      let s = document.getElementById(
        "vault-input-savings"
      ) as HTMLInputElement;
      s.value = "";

      let a = document.getElementById(
        "vault-input-allowed-to-spend"
      ) as HTMLInputElement;
      a.value = "";

      let o = document.getElementById(
        "vault-input-on-wallet"
      ) as HTMLInputElement;
      o.value = "";
    } else {
      if (savings !== undefined) {
        setValue("savings", savings);
      }
      if (allowedToSpend !== undefined) {
        setValue("allowedToSpend", allowedToSpend);
      }
      if (onWallet !== undefined) {
        setValue("onWallet", onWallet);
      }
    }
  };

  const onSubmit = (formData: FormData) => {
    console.log(formData);
  };

  return (
    <div className="vault-outter-container">
      <div className="vault-header">
        <span className="vault-title">Vault</span>
        <button
          className="vault-show-vault-button"
          type="button"
          onClick={handleToggleShowInfo}
        >
          {showVault ? (
            <i className="bi bi-eye-slash-fill" />
          ) : (
            <i className="bi bi-eye-fill" />
          )}
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="vault-inner-container">
          <div className="floating-label">
            <input
              type="text"
              className="vault-input"
              id="vault-input-savings"
              placeholder=""
              {...register("savings", {
                pattern: {
                  value: /^[0-9]+(?:\.[0-9]{1,2})?$/,
                  message: "Only numbers and limited to two decimals",
                },
                onChange(event) {
                  setFormSavings(event.target.value);
                },
              })}
            />
            <label htmlFor="vault-input-savings">Savings</label>
            <div className="invalid-feedback d-block">
              {errors.savings?.message}
            </div>
          </div>
          <div className="floating-label">
            <input
              type="text"
              className="vault-input"
              id="vault-input-allowed-to-spend"
              placeholder=""
              {...register("allowedToSpend", {
                pattern: {
                  value: /^[0-9]+(?:\.[0-9]{1,2})?$/,
                  message: "Only numbers and limited to two decimals",
                },
                onChange(event) {
                  setFormAllowedToSpend(event.target.value);
                },
              })}
            />
            <label htmlFor="vault-input-allowed-to-spend">
              Allowed to Spend
            </label>
            <div className="invalid-feedback d-block">
              {errors.allowedToSpend?.message}
            </div>
          </div>
          <div className="floating-label">
            <input
              type="text"
              className="vault-input"
              id="vault-input-on-wallet"
              placeholder=""
              {...register("onWallet", {
                pattern: {
                  value: /^[0-9]+(?:\.[0-9]{1,2})?$/,
                  message: "Only numbers and limited to two decimals",
                },
                onChange(event) {
                  setFormOnWallet(event.target.value);
                },
              })}
            />
            <label htmlFor="vault-input-on-wallet">On Wallet</label>
            <div className="invalid-feedback d-block">
              {errors.onWallet?.message}
            </div>
          </div>
        </div>
        <div className="vault-button-container">
          <button type="button" className="vault-button vault-clear-button">
            Clear
          </button>
          <button type="submit" className="vault-button vault-save-button">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default Vault;
