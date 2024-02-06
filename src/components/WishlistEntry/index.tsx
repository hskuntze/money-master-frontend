import { Item } from "types/item";
import "./styles.css";
import { formatNumberToMoney } from "util/formatters";

interface Props {
  id: number;
  title: string;
  sideElement?: boolean;
  elements?: Item[];
}

const WishlistEntry = ({ title, id, elements, sideElement = false }: Props) => {
  function formatItemId(title: string, id: number) {
    title = title.trim();
    title = title.replace(" ", "-");
    return "wishlist-entry-" + title.toLocaleLowerCase();
  }

  return (
    <>
      {sideElement ? (
        <div
          className="wishlist-entry-container side-entry"
          id={formatItemId(title, id)}
        >
          <div className="wishlist-entry">
            <span className="wishlist-entry-title">{title}</span>
          </div>
          <button type="button" className="wishlist-entry-edit-button">
            <i className="bi bi-pencil-square" />
          </button>
        </div>
      ) : (
        <div
          className="wishlist-entry-container whole-entry"
          id={formatItemId(title, id)}
        >
          <div className="wishlist-whole-entry">
            <div className="wishlisy-whole-entry-header">
              <span className="wweh-title">{title}</span>
              <button className="wweh-edit" type="button">
                Edit
              </button>
            </div>
            {/**
             * AGORA É PRECISO AJUSTAR O TAMANHO DA LISTA PARA QUANDO HOUVER VÁRIOS ITENS.
             * ACHO QUE O MELHOR CAMINHO É FAZER UM "OVERFLOW: HIDDEN" E DEIXAR O SCROLL HABILITADO,
             * DESSA FORMA QUANDO HOUVEREM VÁRIOS ITENS BASTA ROLAR O -CONTEÚDO- DO ELEMENTO.
             */}
            {elements?.map((el) => (
              <div className="wishlist-whole-entry-item">
                <div className="wwei-title">
                  <span>{el.name}</span>
                </div>
                <div className="wwei-price-and-link">
                  <div className="wwei-price">
                    <span>{formatNumberToMoney(el.price)} -</span>
                  </div>
                  <div className="wwei-link">
                    <a target="_blank" rel="noreferrer" href={el.link}>
                      Link to the product page
                    </a>
                  </div>
                </div>
                <div className="wwei-source-name">
                  <span>{el.sourcePlatformName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default WishlistEntry;
