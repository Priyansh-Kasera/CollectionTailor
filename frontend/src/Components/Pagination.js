import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { COLORS } from "../assets/colors";

const Pagination = ({ noOfPage, page, setPage }) => {
  const goToNextPage = () => {
    if (page === noOfPage) {
      return;
    }
    setPage((page) => page + 1);
  };
  const goToPreviousPage = () => {
    if (page === 1) {
      return;
    }
    setPage((page) => page - 1);
  };
  if (!noOfPage) {
    return null;
  }
  return (
    <div className="mt-12 flex flex-row justify-between gap-4">
      <button
        className="rounded-full p-1 border"
        style={{ borderColor: COLORS.slate }}
        onClick={goToPreviousPage}
      >
        <MdKeyboardArrowLeft color={COLORS.slate} size={28} />
      </button>
      <div className="flex flex-row gap-4 justify-start flex-1 overflow-scroll no-scrollbar ">
        <div className="ml-auto" />
        {Array.from({ length: noOfPage }).map((_, index) => {
          const handePageClick = () => {
            setPage(index + 1);
          };
          return (
            <button
              className="rounded-full  border aspect-square"
              style={{
                borderColor: COLORS.slate,
                backgroundColor: page === index + 1 ? COLORS.slate : "",
              }}
              onClick={handePageClick}
            >
              <p
                style={{
                  color: page === index + 1 ? COLORS.imageBG : COLORS.slate,
                }}
                className="text-sm md:text-base"
              >
                {index + 1}
              </p>
            </button>
          );
        })}
        <div className="mr-auto" />
      </div>
      <button
        className="rounded-full p-1 border"
        style={{ borderColor: COLORS.slate }}
        onClick={goToNextPage}
      >
        <MdKeyboardArrowRight color={COLORS.slate} size={28} />
      </button>
    </div>
  );
};
export default Pagination;
