import "./styles.css";
import MyInfo from "components/MyInfo";
import Vault from "components/Vault";
import Wishlists from "components/Wishlists";

const Home = () => {
  return (
    <main id="main" className="main-page">
      <section id="main-section" className="main-section">
        <div className="main-content">
          <span>home</span>
        </div>
      </section>
      <aside id="side-section" className="side-section">
        <MyInfo />
        <Vault />
        <Wishlists />
      </aside>
    </main>
  );
};

export default Home;
