import React from 'react';

const Pagination = ({ totalPages, currentPage, paginate }) => {
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      paginate(pageNumber);
    }
  };

  const getPaginationItems = () => {
    const pages = [];

    if (totalPages <= 5) {
      // Nếu tổng số trang <= 5, hiển thị tất cả các trang
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Nếu tổng số trang > 5, chỉ hiển thị một số trang xung quanh currentPage
      if (currentPage > 1) {
        pages.push(1);
      }

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      if (currentPage < totalPages) {
        pages.push(totalPages);
      }
    }return pages;
  };

  return (
    <div className="flex justify-center mt-4">
      <nav>
        <ul className="flex space-x-2">
          <li>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className={`px-3 py-1 border ${currentPage === 1 ? 'cursor-not-allowed' : 'bg-white text-black'}`}
              disabled={currentPage === 1}
            >
              Trước
            </button>
          </li>
          {/* {Array.from({ length: totalPages }, (_, index) => (
            <li key={index + 1}>
              <button
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 border ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
              >
                {index + 1}
              </button>
            </li>
          ))} */}
          {getPaginationItems().map((page, index) => (
            <li key={index}>
              {page === '...' ? (
                <span className="px-3 py-1">...</span> // Hiển thị dấu ba chấm
              ) : (
                <button
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 border ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
                >
                  {page}
                </button>
              )}
            </li>
          ))}
          <li>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className={`px-3 py-1 border ${currentPage === totalPages ? 'cursor-not-allowed' : 'bg-white text-black'}`}
              disabled={currentPage === totalPages}
            >
              Sau
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
