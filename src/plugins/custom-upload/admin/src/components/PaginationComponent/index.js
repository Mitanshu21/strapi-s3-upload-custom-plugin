import React from "react";
import {
  Pagination,
  Button,
  SingleSelect,
  SingleSelectOption,
} from "@strapi/design-system";

const CustomPagination = ({
  page,
  total,
  setCurrentPage,
  pageSize,
  setPageSize,
}) => {
  const pageCount = Math.ceil(total / pageSize);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPageButtons = () => {
    let buttons = [];
    for (let i = 1; i <= pageCount; i++) {
      buttons.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={i === page}
        >
          {i}
        </Button>
      );
    }
    return buttons;
  };

  return (
    <div>
      <Pagination>
        <SingleSelect
          value={pageSize}
          onChange={(value) => setPageSize(value)}
          size="S"
        >
          <SingleSelectOption value="10">10</SingleSelectOption>
          <SingleSelectOption value="20">20</SingleSelectOption>
          <SingleSelectOption value="50">50</SingleSelectOption>
          <SingleSelectOption value="100">100</SingleSelectOption>
        </SingleSelect>
        <Button onClick={() => handlePageChange(1)} disabled={page === 1}>
          &laquo;
        </Button>
        {renderPageButtons()}
        <Button
          onClick={() => handlePageChange(pageCount)}
          disabled={page === pageCount}
        >
          &raquo;
        </Button>
      </Pagination>
    </div>
  );
};

export default CustomPagination;
