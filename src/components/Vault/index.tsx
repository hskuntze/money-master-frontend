import { useEffect, useState } from "react";
import "./styles.css";
import { Controller, useForm } from "react-hook-form";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "util/requests";
import { toast } from "react-toastify";
import VaultType from "types/vault";
import { CurrencyInput } from "react-currency-mask";

type FormData = {
  savings: number;
  allowedToSpend: number;
  onWallet: number;
};

const Vault = () => {
  const [showVault, setShowVault] = useState(true);
  const [vault, setVault] = useState<VaultType>();

  const { handleSubmit, setValue, control } = useForm<FormData>();

  const handleToggleShowInfo = () => {
    setShowVault(!showVault);
  };

  const handleClear = () => {
    let result = window.confirm(
      "Are you sure you want to clear it? You might lose these values if you save it!"
    );

    if (result) {
      setValue("allowedToSpend", 0);
      setValue("savings", 0);
      setValue("onWallet", 0);
    }
  };

  const onSubmit = (formData: FormData) => {
    const params: AxiosRequestConfig = {
      url: `/vaults/update/${vault?.id}`,
      method: "PUT",
      withCredentials: true,
      data: {
        savings: formData.savings,
        onWallet: formData.onWallet,
        allowedToSpend: formData.allowedToSpend,
      },
    };

    requestBackend(params)
      .then(() => {})
      .catch((err) => {
        toast.error(err);
      });
  };

  useEffect(() => {
    const params: AxiosRequestConfig = {
      url: "/vaults/authenticated",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(params)
      .then((res) => {
        setVault(res.data as VaultType);
        setValue("savings", res.data.savings);
        setValue("allowedToSpend", res.data.allowedToSpend);
        setValue("onWallet", res.data.onWallet);
      })
      .catch((err) => {
        toast.error(
          "Error while trying to retrieve your information. Please login again."
        );
      });
  }, [setValue]);

  return (
    <div className="vault-outter-container box-shadow side-element">
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
            <Controller
              name="savings"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  value={showVault ? field.value : ""}
                  onChangeValue={(_, value) => {
                    field.onChange(value);
                  }}
                  InputElement={
                    <input
                      type="text"
                      className="vault-input"
                      id="vault-input-savings"
                      placeholder=""
                    />
                  }
                />
              )}
            />
            <label htmlFor="vault-input-savings">Savings</label>
          </div>
          <div className="floating-label">
            <Controller
              name="allowedToSpend"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  value={showVault ? field.value : ""}
                  onChangeValue={(_, value) => {
                    field.onChange(value);
                  }}
                  InputElement={
                    <input
                      type="text"
                      className="vault-input"
                      id="vault-input-allowed-to-spend"
                      placeholder=""
                    />
                  }
                />
              )}
            />
            <label htmlFor="vault-input-allowed-to-spend">
              Allowed to Spend
            </label>
          </div>
          <div className="floating-label">
            <Controller
              name="onWallet"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  value={showVault ? field.value : ""}
                  onChangeValue={(_, value) => {
                    field.onChange(value);
                  }}
                  InputElement={
                    <input
                      type="text"
                      className="vault-input"
                      id="vault-input-on-wallet"
                      placeholder=""
                    />
                  }
                />
              )}
            />
            <label htmlFor="vault-input-on-wallet">On Wallet</label>
          </div>
        </div>
        <div className="vault-button-container">
          <button
            type="button"
            className="vault-button vault-clear-button"
            onClick={handleClear}
          >
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
