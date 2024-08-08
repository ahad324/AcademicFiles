import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";
import { useAction } from "@contexts/ActionsContext";
import ProfileBadge from "@components/ProfileBadge";
import { useAuth } from "@contexts/AuthContext";

const AllURLs = () => {
  const {
    teachers,
    getURLsByTeacher,
    deleteURL,
    teacherImages,
    DomainURL,
    copyToClipboard,
    listTeachers,
    urlsByTeacher,
  } = useAction();
  const [expandedTeacher, setExpandedTeacher] = useState(null);
  const { isAdmin } = useAuth();

  const handleAccordionClick = async (teacherId) => {
    if (expandedTeacher === teacherId) {
      setExpandedTeacher(null);
    } else {
      setExpandedTeacher(teacherId);
      getURLsByTeacher(teacherId);
    }
  };

  useEffect(() => {
    isAdmin && listTeachers();
  }, []);

  return isAdmin ? (
    <div id="accordion-collapse" data-accordion="collapse">
      {teachers.length > 0 ? (
        teachers.map((teacher) => (
          <div
            key={teacher.TeacherID}
            className="border-b-4 border-transparent"
          >
            <h2 id={`accordion-collapse-heading-${teacher.TeacherID}`}>
              <button
                type="button"
                className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-[--light-gray-color] border border-b-0 rounded-xl shadow-custom border-[--light-gray-color] bg-[--dark-gray-color] focus:ring-4 focus:ring-[--medium-gray-color] gap-3"
                data-accordion-target={`#accordion-collapse-body-${teacher.TeacherID}`}
                aria-expanded={expandedTeacher === teacher.TeacherID}
                aria-controls={`accordion-collapse-body-${teacher.TeacherID}`}
                onClick={() => handleAccordionClick(teacher.TeacherID)}
              >
                <div className="flex items-center text-left">
                  <ProfileBadge
                    ImageUrl={teacherImages[teacher.TeacherID]}
                    name={teacher.username}
                    email={teacher.email}
                  />
                </div>
                <svg
                  data-accordion-icon
                  className={`w-3 h-3 ${
                    expandedTeacher === teacher.TeacherID ? "rotate-180" : ""
                  } shrink-0`}
                  aria-hidden="true"
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
              aria-labelledby={`accordion-collapse-heading-${teacher.TeacherID}`}
            >
              <div className="overflow-x-auto bg-[--medium-gray-color] rounded-lg">
                <table className="w-full text-sm text-left text-[--light-gray-color]">
                  <thead className="text-xs uppercase bg-[--medium-gray-color]">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        URL
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-[--dark-gray-color]">
                    {urlsByTeacher[teacher.TeacherID] &&
                    urlsByTeacher[teacher.TeacherID].length > 0 ? (
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
                          <td className="px-6 py-4">
                            <button
                              type="button"
                              className="text-blue-500 hover:text-[--accent-color]"
                              onClick={() =>
                                copyToClipboard(`${DomainURL}${urlID}`)
                              }
                            >
                              <FiCopy size="1.4em" />
                            </button>
                            <button
                              type="button"
                              className="text-[--error-color] ml-2 hover:text-red-600"
                              onClick={() =>
                                deleteURL(teacher.TeacherID, urlID)
                              }
                            >
                              <FaTrash size="1.4em" />
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
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center">
          <p className="px-6 py-4 text-center text-[--error-color] bg-[--dark-gray-color] rounded-lg border border-[--text-color]">
            No teachers available
          </p>
        </div>
      )}
    </div>
  ) : (
    <div>asd</div>
  );
};

export default AllURLs;
