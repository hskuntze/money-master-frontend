import { useContext, useEffect, useState } from "react";
import "./styles.css";
import { Controller, useForm } from "react-hook-form";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "util/requests";
import { toast } from "react-toastify";
import VaultType from "types/vault";
import { CurrencyInput } from "react-currency-mask";
import { UserContext } from "UserContext";
import { getUserData, saveUserData } from "util/storage";

type FormData = {
  savings: number;
  allowedToSpend: number;
  onWallet: number;
};

const Vault = () => {
  const [edit, setEdit] = useState(false);
  const [showVault, setShowVault] = useState(true);
  const [vault, setVault] = useState<VaultType>();
  const { userContextData, setUserContextData } = useContext(UserContext);

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

  const handleEdit = () => {
    setEdit(!edit);
  };

  const calculateAllowedToSpend = (): number | string => {
    if (
      userContextData.user?.expenseTrack !== undefined &&
      vault !== undefined
    ) {
      let sum: number = 0;
      const tebms = userContextData.user.expenseTrack.totalExpenseByMonths;
      tebms.sort((a, b) => a.id - b.id);
      
      const lastTebm = tebms[tebms.length - 1];
      
      lastTebm.variableExpenses.forEach((ve) => {
        sum += ve.price;
      });
      
      return vault.allowedToSpend - sum;
    }

    return "";
  };

  const onSubmit = (formData: FormData) => {
    if (formData.allowedToSpend >= 0) {
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
        .then((res) => {
          let user = getUserData();
          user.vault = res.data as VaultType;
          saveUserData(user);
          setUserContextData({
            user: user,
          });
          setEdit(false);
          toast.success("Saved");
        })
        .catch((err) => {
          toast.error(err);
        });
    } else {
      toast.error("Negative values are not allowed");
    }
  };

  useEffect(() => {
    if (userContextData.user?.vault !== undefined) {
      let userData = userContextData.user.vault;
      setVault(userData);
      setValue("allowedToSpend", userData.allowedToSpend);
      setValue("onWallet", userData.onWallet);
      setValue("savings", userData.savings);
    }
  }, [setValue, userContextData]);

  return (
    <div className="vault-outter-container box-shadow side-element">
      <div className="vault-header">
        <span className="vault-title">Vault</span>
        <div className="vault-button-display">
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
          <button
            className="vault-edit-button"
            type="button"
            onClick={handleEdit}
          >
            <i className="bi bi-pencil-square" />
          </button>
        </div>
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
                      disabled={edit ? false : true}
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
                  value={
                    showVault
                      ? edit
                        ? field.value
                        : calculateAllowedToSpend()
                      : ""
                  }
                  onChangeValue={(_, value) => {
                    field.onChange(value);
                  }}
                  InputElement={
                    <input
                      disabled={edit ? false : true}
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
                      disabled={edit ? false : true}
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
        {edit ? (
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
        ) : (
          <></>
        )}
      </form>
    </div>
  );
};

export default Vault;
