import React from "react";
import app, { use } from "xadmin";
import { _t } from "xadmin-i18n";

import {
  Button,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "xui";

const PaginationComponent = ({
  total,
  current,
  pageSize = 10,
  onChange,
  showSizeChanger = false,
  pageSizeOptions = ["10", "20", "50", "100"],
  onShowSizeChange,
  showQuickJumper = false,
  showTotal,
  size,
  disabled = false,
  simple = false,
  className,
  maxButtons = 6,
  ...props
}) => {
  // Use either the antd-style props or fall back to original props
  const totalPages = Math.ceil(total / pageSize) || 1;
  const currentPage = current || 1;
  const handlePageChange = onChange;

  return (
    <Pagination className={className} {...props}>
      <PaginationContent>
        {currentPage > 1 && !disabled && (
          <PaginationPrevious onClick={() => handlePageChange(currentPage - 1, pageSize)} />
        )}

        {Array.from({ length: Math.min(totalPages, maxButtons) }).map((_, index) => {
          let pageNumber;

          if (totalPages <= maxButtons) {
            // Show all pages if total pages are less than maxButtons
            pageNumber = index + 1;
          } else if (currentPage <= Math.ceil(maxButtons / 2)) {
            // Near the start
            if (index < maxButtons - 2) {
              pageNumber = index + 1;
            } else if (index === maxButtons - 2) {
              return <PaginationEllipsis key="ellipsis" />;
            } else {
              pageNumber = totalPages;
            }
          } else if (currentPage >= totalPages - Math.floor(maxButtons / 2)) {
            // Near the end
            if (index === 0) {
              pageNumber = 1;
            } else if (index === 1) {
              return <PaginationEllipsis key="ellipsis" />;
            } else {
              pageNumber = totalPages - (maxButtons - 1 - index);
            }
          } else {
            // In the middle
            if (index === 0) {
              pageNumber = 1;
            } else if (index === 1) {
              return <PaginationEllipsis key="ellipsis-1" />;
            } else if (index === maxButtons - 1) {
              pageNumber = totalPages;
            } else if (index === maxButtons - 2) {
              return <PaginationEllipsis key="ellipsis-2" />;
            } else {
              const offset = index - 2;
              pageNumber =
                currentPage - Math.floor((maxButtons - 5) / 2) + offset;
            }
          }

          return (
            <PaginationItem key={pageNumber} disabled={disabled}>
              <PaginationLink
                isActive={pageNumber === currentPage}
                onClick={() => !disabled && handlePageChange(pageNumber, pageSize)}
                size={size}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {currentPage < totalPages && !disabled && (
          <PaginationNext onClick={() => handlePageChange(currentPage + 1, pageSize)} />
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default (props) => {
  const { emptyComponent, maxButtons = 6, ...pagerProps } = props;
  const { items, activePage, changePage } = use("model.pagination");

  if (items > 1 || emptyComponent == undefined) {
    return (
      <PaginationComponent showQuickJumper={items > 10} showSizeChanger={false} current={activePage} 
        pageSize={1} total={items} onChange={changePage} {...pagerProps}
      />
    );
  } else {
    return emptyComponent !== undefined ? (
      emptyComponent
    ) : (
      <Button {...pagerProps}>{_t("No paging")}</Button>
    );
  }
};
