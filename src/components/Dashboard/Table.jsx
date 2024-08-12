import React from "react";
import { IoTrash, IoDownload } from "react-icons/io5";
import { useData } from "@contexts/DataContext";

const Table = ({ files, urlId }) => {
  const { handleFileDelete, downloadAllFiles } = useData();
  const headers = ["Sr No.", "ID", "File Name", "File Size", "Actions"];

  const handledelete = (fileid, urlId) => {
    handleFileDelete(fileid, urlId);
  };
  return (
    <div className="relative overflow-x-auto shadow-md rounded-lg border border-[--text-color]">
      <table className="w-full text-sm text-left rtl:text-right text-[--light-gray-color]">
        <caption className="p-5 text-lg font-semibold text-center  bg-[--dark-gray-color]">
          Files List
          {urlId && files.length > 0 && (
            <div className="flex justify-end w-ful rounded-lg">
              <button
                className="flex items-center relative w-34 px-4 py-2 bg-[--accent-color] text-base text-[--default-text-color] transition duration-500 ease-in-out transform rounded-lg  hover:bg-[--accent-color] hover:bg-green-700"
                onClick={(e) => downloadAllFiles(urlId, e)}
              >
                Download All{" "}
                <span className="absolute -right-1 w-4 h-4 top-7 bg-[--error-color] text-[--default-text-color] rounded-full flex items-center justify-center text-xs">
                  {files.length}
                </span>
              </button>
            </div>
          )}
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
          {files.length > 0 ? (
            files.map((file, i) => {
              return (
                <tr key={file.id} className="border-b bg-[--dark-gray-color]">
                  <td
                    scope="row"
                    className="px-6 py-4 text-[--default-text-color]  text-center"
                  >
                    {i + 1}
                  </td>
                  <td className="px-6 py-4 text-center">{file.id}</td>
                  <td className="px-6 py-4 text-center">{file.desc}</td>
                  <td className="px-6 py-4 text-center">{file.filesize}</td>
                  <td className="px-6 py-4 flex items-center justify-evenly ">
                    <a
                      href={file.downloadUrl}
                      download={file.desc}
                      rel="noopener noreferrer"
                      className="text-[--accent-color]"
                    >
                      <IoDownload size="1.5em" title="Download File" />
                    </a>
                    <button
                      onClick={() => handledelete(file.id, urlId || null)}
                      className="text-[--error-color]"
                    >
                      <IoTrash size="1.5em" title="Delete File" />
                    </button>
                  </td>
                </tr>
              );
            })
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
    </div>
  );
};

export default Table;
