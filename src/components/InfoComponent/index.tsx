import AuthImg from "assets/images/Financial-Management.svg";

const InfoComponent = () => {
  return (
    <div className="auth-info">
      <h3>Welcome to Money Master!</h3>
      <span>
        Here you have a space to manage your personal finances and focus on what
        you want to have.
      </span>
      <img
        className="auth-img"
        src={AuthImg}
        alt="auth-img"
        aria-describedby="Desenho de uma moça sentada sobre livros utilizando um laptop. Ao fundo um quadro com riscos representando variações de lucro e prejuízo, e logo a frente deste quadro uma calculadora gigante."
      />
    </div>
  );
};

export default InfoComponent;