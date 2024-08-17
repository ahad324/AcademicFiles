import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";
import { useAction } from "@contexts/ActionsContext";
import ProfileBadge from "@components/ProfileBadge";
import { useAuth } from "@contexts/AuthContext";
import Table from "../Table";
import { useData } from "../../../contexts/DataContext";

const AllURLs = () => {
  const {
    teachers,
    deleteURL,
    teacherImages,
    DomainURL,
    copyToClipboard,
    urlsByTeacher,
    getUserID,
  } = useAction();
  const { fetchFilesByUrlID, filesByUrl } = useData();
  const [expandedTeacher, setExpandedTeacher] = useState(null);
  const [expandedUrl, setExpandedUrl] = useState(null);
  const [ID, setID] = useState(null);
  const { isAdmin } = useAuth();

  const handleAccordionClick = async (teacherId) => {
    setExpandedTeacher(expandedTeacher === teacherId ? null : teacherId);
    setExpandedUrl(expandedTeacher === teacherId && null);
  };

  const handleUrlClick = async (urlID) => {
    setExpandedUrl(expandedUrl === urlID ? null : urlID);
    if (expandedUrl !== urlID) {
      await fetchFilesByUrlID(urlID);
    }
  };

  const fetchUserData = async () => {
    const id = await getUserID();
    setID(id);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const renderTeacherUrls = (teacher) => (
    <div key={teacher.TeacherID} className="border-b-4 border-transparent">
      <h2 id={`accordion-collapse-heading-${teacher.TeacherID}`}>
        <button
          type="button"
          className="flex items-center justify-between w-full p-5 font-medium text-[--light-gray-color] border border-b-0 rounded-xl shadow-custom bg-[--dark-gray-color] focus:ring-4 gap-3"
          aria-expanded={expandedTeacher === teacher.TeacherID}
          onClick={() => handleAccordionClick(teacher.TeacherID)}
        >
          <div className="flex text-left">
            <ProfileBadge
              ImageUrl={teacherImages[teacher.TeacherID]}
              name={teacher.username}
              email={teacher.email}
            />
          </div>
          <span className="relative top-0 text-[--accent-color]">
            Urls:{urlsByTeacher[teacher.TeacherID].length}
          </span>
          <svg
            className={`w-3 h-3 ${
              expandedTeacher === teacher.TeacherID ? "rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5L5 1 1 5"
            />
          </svg>
        </button>
      </h2>
      <div
        id={`accordion-collapse-body-${teacher.TeacherID}`}
        className={expandedTeacher === teacher.TeacherID ? "" : "hidden"}
      >
        <div className="overflow-x-auto bg-[--dark-gray-color] rounded-lg border border-[--text-color]">
          <table className="w-full text-sm text-left text-[--light-gray-color]">
            <thead className="text-xs uppercase bg-[--medium-gray-color]">
              <tr>
                <th className="px-6 py-3">URL</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[--dark-gray-color]">
              {urlsByTeacher[teacher.TeacherID]?.length ? (
                urlsByTeacher[teacher.TeacherID].map((urlID, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-6 py-4">
                      <a
                        href={`${DomainURL}${urlID}`}
                        className="text-blue-500 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {`${DomainURL}${urlID}`}
                      </a>
                    </td>
                    <td className="px-6 py-4 flex items-center">
                      <button
                        className="text-blue-500 hover:text-[--accent-color]"
                        onClick={() => copyToClipboard(`${DomainURL}${urlID}`)}
                      >
                        <FiCopy size="1.4em" />
                      </button>
                      <button
                        className="text-[--error-color] ml-2 hover:text-red-600"
                        onClick={async (e) => {
                          e.target.style.pointerEvents = "none";
                          await deleteURL(teacher.TeacherID, urlID);
                          e.target.style.pointerEvents = "all";
                        }}
                      >
                        <FaTrash size="1.4em" />
                      </button>
                      <button
                        className="text-blue-500 hover:text-[--accent-color] ml-2"
                        onClick={() => handleUrlClick(urlID)}
                      >
                        {expandedUrl === urlID ? "Hide Files" : "Show Files"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border border-[--text-color]">
                  <td
                    colSpan="2"
                    className="px-6 py-4 text-center text-[--error-color]"
                  >
                    No URLs available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {expandedUrl && filesByUrl[expandedUrl] && (
            <Table files={filesByUrl[expandedUrl]} urlId={expandedUrl} />
          )}
        </div>
      </div>
    </div>
  );

  const renderUserUrls = () =>
    urlsByTeacher[ID]?.map((urlID, index) => (
      <div key={index} className="border border-[--text-color] rounded-lg">
        <div
          type="button"
          className="flex items-center justify-between w-full p-5 font-medium text-[--light-gray-color] border border-b-0 rounded-xl shadow-custom bg-[--dark-gray-color] focus:ring-4 gap-3 cursor-pointer"
          onClick={() => handleUrlClick(urlID)}
        >
          <span>{`${DomainURL}${urlID}`}</span>
          <div className="flex items-center">
            <button
              className="text-blue-500 hover:text-[--accent-color] mr-2"
              onClick={() => copyToClipboard(`${DomainURL}${urlID}`)}
            >
              <FiCopy size="1.4em" />
            </button>
            <button
              className="text-[--error-color] hover:text-red-600"
              onClick={() => deleteURL(ID, urlID)}
            >
              <FaTrash size="1.4em" />
            </button>
          </div>
        </div>
        {expandedUrl === urlID && filesByUrl[urlID] && (
          <Table files={filesByUrl[urlID]} urlId={urlID} />
        )}
      </div>
    ));

  return (
    <div id="accordion-collapse" data-accordion="collapse">
      {isAdmin ? (
        teachers.length > 0 ? (
          teachers.map(renderTeacherUrls)
        ) : (
          <div className="flex items-center justify-center">
            <p className="px-6 py-4 text-center text-[--error-color] bg-[--dark-gray-color] rounded-lg border border-[--text-color]">
              No teachers available
            </p>
          </div>
        )
      ) : (
        renderUserUrls()
      )}
    </div>
  );
};

export default AllURLs;
