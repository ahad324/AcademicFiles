import React, { useState } from "react";
import { useAction } from "@contexts/ActionsContext";
import ProfileBadge from "@components/ProfileBadge";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import CreateTeacher from "./CreateTeacher";

const AllTeachers = () => {
  const { teachers, teacherImages } = useAction();

  const [visiblePasswords, setVisiblePasswords] = useState({});

  const headers = ["Sr No.", "ID", "Teacher", "Password"];

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="flex flex-col ">
      <CreateTeacher />

      <div className="relative overflow-x-auto shadow-md rounded-lg border border-[--text-color]">
        <table className="w-full text-sm text-left rtl:text-right text-[--light-gray-color] ">
          <caption className="p-5 text-lg font-semibold text-center  bg-[--dark-gray-color] ">
            Teachers List
          </caption>
          <thead className="text-xs text-[--light-gray-color] uppercase bg-[--medium-gray-color]">
            <tr>
              {headers.map((header, i) => (
                <th key={i} scope="col" className="px-6 py-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teachers.length > 0 ? (
              teachers.map((teacher, i) => (
                <tr
                  key={teacher.TeacherID}
                  className=" border-b bg-[--dark-gray-color]"
                >
                  <td
                    scope="row"
                    className="px-6 py-4 text-[--default-text-color]"
                  >
                    {i + 1}
                  </td>
                  <td className="px-6 py-4">{teacher.TeacherID}</td>
                  <th
                    scope="row"
                    className="flex items-center px-6 py-4 whitespace-nowrap "
                  >
                    <ProfileBadge
                      ImageUrl={teacherImages[teacher.TeacherID]}
                      name={teacher.username}
                      email={teacher.email}
                    />
                  </th>
                  <td className="px-6 py-4">
                    {visiblePasswords[teacher.TeacherID]
                      ? teacher.password
                      : "********"}
                    <button
                      type="button"
                      className="ml-2"
                      onClick={() =>
                        togglePasswordVisibility(teacher.TeacherID)
                      }
                    >
                      {visiblePasswords[teacher.TeacherID] ? (
                        <FaEyeSlash size="1.2em" />
                      ) : (
                        <FaEye size="1.2em" />
                      )}
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
                  No teachers available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AllTeachers;
