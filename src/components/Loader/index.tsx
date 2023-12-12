import "./styles.css";
import { Vortex } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="loading-container">
      <Vortex
        visible={true}
        height="80"
        width="80"
        ariaLabel="vortex-loading"
        wrapperStyle={{}}
        wrapperClass="vortex-wrapper"
        colors={[
          "#02733E",
          "#148C54",
          "#03AD5E",
          "#7EA794",
          "#B8D9CD",
          "#E3E2E3",
        ]}
      />
    </div>
  );
};

export default Loader;
