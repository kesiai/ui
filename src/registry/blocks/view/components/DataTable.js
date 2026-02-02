import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  Checkbox
} from "xui";
import { 
  ChevronUp, 
  ChevronDown, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Loader2
} from "lucide-react";
import { _t } from 'xadmin-i18n'

const DataTable = ({
  columns = [],
  dataSource = [],
  rowKey = "id",
  loading = false,
  pagination = { pageSize: 10, current: 1, total: 0 },
  onChange,
  scroll,
  bordered = false,
  title,
  footer,
  size = "default",
  caption,
  className = "",
  expandable,
  rowSelection,
  ...restProps
}) => {
  const [currentPage, setCurrentPage] = useState(pagination?.current || 1);
  const [pageSize, setPageSize] = useState(pagination?.pageSize || 10);
  const [sortedInfo, setSortedInfo] = useState({});
  const selectedRowKeys = rowSelection?.selectedRowKeys || [];

  useEffect(() => {
    if (pagination?.current) {
      setCurrentPage(pagination.current);
    }
    if (pagination?.pageSize) {
      setPageSize(pagination.pageSize);
    }
  }, [pagination]);

  // Calculate current page data
  const getCurrentPageData = () => {
    if (!pagination) return dataSource;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return dataSource.slice(startIndex, endIndex);
  };

  // Handle pagination change
  const handlePaginationChange = (page, newPageSize) => {
    setCurrentPage(page);
    setPageSize(newPageSize);
    onChange &&
      onChange({ current: page, pageSize: newPageSize }, sortedInfo, {});
  };

  // Handle sort change
  const handleSortChange = (column) => {
    if (!column.sorter) return;

    const newSortedInfo = {
      columnKey: column.dataIndex,
      order:
        sortedInfo.columnKey === column.dataIndex &&
        sortedInfo.order === "ascend"
          ? "descend"
          : "ascend",
    };

    setSortedInfo(newSortedInfo);
    onChange && onChange({ current: currentPage, pageSize }, newSortedInfo, {});
  };

  // Handle row selection
  const handleRowSelect = (record, selected) => {
    rowSelection?.onSelect?.(record, selected);
  };

  // Sort data if needed
  const getSortedData = (data) => {
    if (!sortedInfo.columnKey) return data;

    const { columnKey, order } = sortedInfo;
    const column = columns.find((col) => col.dataIndex === columnKey);

    if (!column || !column.sorter) return data;

    return [...data].sort((a, b) => {
      const result =
        typeof column.sorter === "function"
          ? column.sorter(a, b)
          : String(a[columnKey]).localeCompare(String(b[columnKey]));

      return order === "ascend" ? result : -result;
    });
  };

  // Render table header
  const renderHeader = () => (
    <TableHeader>
      <TableRow>
        {rowSelection && (
          <TableHead className="w-10">
            <Checkbox
              checked={
                selectedRowKeys.length > 0 &&
                selectedRowKeys.length === dataSource.length
              }
              onChange={(e) => {
                rowSelection?.onSelectAll?.(e.target.checked);
              }}
            />
          </TableHead>
        )}
        {columns.map((column, index) => (
          <TableHead
            key={column.dataIndex || index}
            className={`${column.width ? `w-[${column.width}px]` : ""} ${
              column.sorter ? "cursor-pointer hover:bg-muted/70" : ""
            }`}
            style={{
              ...column.style,
              textAlign: column.align || "left",
            }}
            onClick={() => column.sorter && handleSortChange(column)}
          >
            <div className="flex items-center space-x-1">
              <span>{column.title}</span>
              {column.sorter && (
                <span>
                  {sortedInfo.columnKey === column.dataIndex ? (
                    sortedInfo.order === "ascend" ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="h-4 w-4 opacity-30" />
                  )}
                </span>
              )}
            </div>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );

  // Render table body
  const renderBody = () => {
    const currentData = getSortedData(getCurrentPageData());

    return (
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell
              colSpan={columns.length + (rowSelection ? 1 : 0)}
              className="h-24 text-center"
            >
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin h-5 w-5 mr-3 text-primary" />
                <span>{_t('Loading')}...</span>
              </div>
            </TableCell>
          </TableRow>
        ) : currentData.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={columns.length + (rowSelection ? 1 : 0)}
              className="h-24 text-center text-muted-foreground"
            >
              {_t('No Data')}
            </TableCell>
          </TableRow>
        ) : (
          currentData.map((record, index) => (
            <React.Fragment key={record[rowKey] || index}>
              <TableRow className={"hover:bg-muted/50" + (selectedRowKeys.includes(record[rowKey]) ? " bg-muted/30" : "")}>
                {rowSelection && (
                  <TableCell className="w-10">
                    <Checkbox
                      checked={selectedRowKeys.includes(record[rowKey])}
                      onChange={(e) => handleRowSelect(record, e.target.checked)}
                    />
                  </TableCell>
                )}
                {columns.map((column, cellIndex) => (
                  <TableCell
                    key={column.dataIndex || cellIndex}
                    style={{
                      textAlign: column.align || "left",
                      ...column.bodyCellStyle,
                    }}
                    className={column.className || ""}
                  >
                    {column.render
                      ? column.render(record[column.dataIndex], record, index)
                      : record[column.dataIndex]}
                  </TableCell>
                ))}
              </TableRow>
              {expandable && expandable.expandedRowRender && (
                <TableRow className="bg-muted/20">
                  <TableCell colSpan={columns.length + (rowSelection ? 1 : 0)} className="p-0">
                    <div className="px-4 py-2">
                      {expandable.expandedRowRender(record, index)}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))
        )}
      </TableBody>
    );
  };

  // Render table footer with pagination
  const renderFooter = () => {
    if (!pagination) return null;

    const total = pagination.total || dataSource.length;
    const totalPages = Math.ceil(total / pageSize);

    return (
      <TableFooter>
        <TableRow>
          <TableCell colSpan={columns.length + (rowSelection ? 1 : 0)}>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">
                {`Total ${total} items`}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
                  disabled={currentPage === 1}
                  onClick={() =>
                    handlePaginationChange(currentPage - 1, pageSize)
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    handlePaginationChange(currentPage + 1, pageSize)
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </TableCell>
        </TableRow>
      </TableFooter>
    );
  };

  // Generate table class name
  const tableClassName = [
    className,
    "w-full border-collapse",
    size === "small" ? "text-sm" : size === "large" ? "text-base" : "text-sm",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="w-full">
      {title && (
        <div className="mb-2 text-lg font-medium">
          {typeof title === "function" ? title() : title}
        </div>
      )}
      <div className={bordered ? "rounded-md border" : ""}>
        <Table className={tableClassName} {...restProps}>
          {caption && <TableCaption>{caption}</TableCaption>}
          {renderHeader()}
          {renderBody()}
          {renderFooter()}
        </Table>
      </div>
      {footer && (
        <div className="mt-2 text-sm text-muted-foreground">
          {typeof footer === "function" ? footer() : footer}
        </div>
      )}
    </div>
  );
};

export default DataTable;
