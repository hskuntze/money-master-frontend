import ReactPaginate from "react-paginate";
import "./styles.css";

type Props = {
  pageCount: number;
  range: number;
  forcePage?: number;
  onChange?: (pageNumber: number) => void;
  width: number;
};

const Pagination = ({ pageCount, forcePage, range, onChange, width }: Props) => {
  return (
    <div className="pagination-container" style={{width: width}}>
      <ReactPaginate
        pageCount={pageCount}
        pageRangeDisplayed={range}
        marginPagesDisplayed={1}
        containerClassName="pagination-element"
        pageLinkClassName="pagination-item"
        breakClassName="pagination-item"
        previousLabel={
          <div className="pag-arrow pag-left-arrow">
            <i className="bi bi-caret-left-fill" />
          </div>
        }
        nextLabel={
          <div className="pag-arrow pag-right-arrow">
            <i className="bi bi-caret-right-fill" />
          </div>
        }
        previousClassName="arrow-previous"
        nextClassName="arrow-next"
        activeLinkClassName="active-page"
        disabledClassName="arrow-disabled"
        nextLinkClassName="arrow-active-next"
        previousLinkClassName="arrow-active-previous"
        forcePage={forcePage}
        onPageChange={(items) => (onChange ? onChange(items.selected) : {})}
      />
    </div>
  );
};

export default Pagination;