import React, { useState, useEffect } from "react";
import { IoTrash, IoDownload } from "react-icons/io5";
import { useData } from "@contexts/DataContext";
import Loader from "../Loader";

const Table = ({ files, urlId }) => {
  const { handleFileDelete, downloadAllFiles } = useData();
  const headers = ["Sr No.", "ID", "File Name", "File Size", "Actions"];
  const [loading, setLoading] = useState(true);
  // States for pagination and search
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFiles, setFilteredFiles] = useState(files);

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Filter files based on the search term
  useEffect(() => {
    const filtered = files.filter((file) =>
      file.desc.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFiles(filtered);
    setLoading(false);
  }, [searchTerm, files]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredFiles.length / filesPerPage);

  // Get current files
  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = filteredFiles.slice(indexOfFirstFile, indexOfLastFile);

  const handleDelete = (fileId, urlId) => {
    handleFileDelete(fileId, urlId);
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="relative overflow-x-auto shadow-md rounded-2xl bg-[--dark-gray-color]">
      <table className="w-full text-sm text-left rtl:text-right text-[--light-gray-color]">
        <caption className="p-5 text-lg font-semibold text-center bg-[--dark-gray-color]">
          <div className="flex justify-center items-center text-3xl p-2">
            <span>Files List</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <input
              type="text"
              placeholder="Search files"
              value={searchTerm}
              onChange={handleSearch}
              className="p-2 rounded border border-[--medium-gray-color] w-1/2 bg-[--dark-gray-color] text-[--light-gray-color]"
            />
            {urlId && files.length > 0 && (
              <button
                className="flex items-center relative w-46 px-4 py-2 bg-[--accent-color] text-base text-[--default-text-color] transition duration-500 ease-in-out transform rounded-lg hover:bg-[--accent-color] hover:bg-green-700"
                onClick={(e) => downloadAllFiles(urlId, e)}
              >
                Download All Files{" "}
                <span className="absolute -right-1 w-4 h-4 top-7 bg-[--error-color] text-[--default-text-color] rounded-full flex items-center justify-center text-xs">
                  {files.length}
                </span>
              </button>
            )}
          </div>
        </caption>
        <thead className="text-xs text-[--light-gray-color] uppercase bg-[--medium-gray-color]">
          <tr>
            {headers.map((header, i) => (
              <th key={i} scope="col" className="px-6 py-3 text-center">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={headers.length} className="px-6 py-4 text-center">
                <Loader />
              </td>
            </tr>
          ) : currentFiles.length > 0 ? (
            currentFiles.map((file, i) => (
              <tr key={file.id} className="border-b">
                <td
                  scope="row"
                  className="px-6 py-4 text-[--default-text-color] text-center"
                >
                  {indexOfFirstFile + i + 1}
                </td>
                <td className="px-6 py-4 text-center">{file.id}</td>
                <td className="px-6 py-4 text-center">{file.desc}</td>
                <td className="px-6 py-4 text-center">{file.filesize}</td>
                <td className="px-6 py-4 flex items-center justify-evenly">
                  <a
                    href={file.downloadUrl}
                    download={file.desc}
                    rel="noopener noreferrer"
                    className="text-[--accent-color]"
                  >
                    <IoDownload size="1.5em" title="Download File" />
                  </a>
                  <button
                    onClick={() => handleDelete(file.id, urlId || null)}
                    className="text-[--error-color]"
                  >
                    <IoTrash size="1.5em" title="Delete File" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={headers.length}
                className="px-6 py-4 text-center text-[--error-color] bg-[--dark-gray-color]"
              >
                No files available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-center items-center mt-4">
        <nav>
          <ul className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <li key={number}>
                  <button
                    onClick={() => paginate(number)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === number
                        ? "bg-[--accent-color] text-[--default-text-color]"
                        : "bg-[--dark-gray-color] text-[--light-gray-color]"
                    }`}
                  >
                    {number}
                  </button>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Table;
