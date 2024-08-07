import React, { useEffect, useState } from "react";
import { useAction } from "@contexts/ActionsContext";
import { FaTrash } from "react-icons/fa";

const AllTeachers = () => {
  const { listTeachers, deleteTeacher } = useAction();
  const [teachers, setTeachers] = useState([]);

  const fetchTeachers = async () => {
    const teacherList = await listTeachers();
    setTeachers(teacherList);
  };

  const handleDelete = async (userId) => {
    await deleteTeacher(userId);
    fetchTeachers();
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen p-4">
      <h2 className="text-2xl mb-4 text-[--text-color] font-bold">
        Teacher List
      </h2>
      <div className="w-full max-w-4xl overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-[--secondary-color] text-[--default-text-color]">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-[--card-bg]">
            {teachers.map((teacher) => (
              <tr key={teacher.$id} className="border-b">
                <td className="p-2">{teacher.username}</td>
                <td className="p-2">{teacher.email}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(teacher.$id)}
                    className="text-[--error-color] hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllTeachers;
