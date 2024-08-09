import React, { useState, useEffect } from 'react';


const CustomTable = ({ data, columns, itemsPerPage, filterableColumns }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState(data);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    const filtered = data.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const itemValue = item[key];
        if (itemValue == null) return false; // Handle null or undefined values
        return itemValue.toString().toLowerCase().includes(value.toLowerCase());
      });
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [filters, data]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="admin_custom-table-container">
      <div className="admin_filter-section">
        {columns.map(column => (
          filterableColumns.includes(column.key) && (
            <input
              key={column.key}
              type="text"
              placeholder={`Filter ${column.title}`}
              onChange={(e) => handleFilterChange(column.key, e.target.value)}
            />
          )
        ))}
      </div>
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.key}>{row[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="admin_pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>{currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CustomTable;