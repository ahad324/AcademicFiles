import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "@contexts/ActionsContext";
import { FaUserPlus, FaTimes } from "react-icons/fa";

// Define validation schema with Zod
const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const CreateTeacher = () => {
  const { createTeacher } = useAction();
  const [showModal, setshowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Setup react-hook-form with Zod validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleCreateTeacher = async (data) => {
    setIsCreating(true);
    const response = await createTeacher(
      data.email,
      data.password,
      data.username
    );

    if (response) {
      setshowModal(false);
    }
    reset(); // Clear the form fields after submission
    setIsCreating(false);
  };

  return (
    <section className="w-full flex justify-end items-center">
      <button className="popup-button" onClick={() => setshowModal(true)}>
        <FaUserPlus size="1.5em" className="mr-2" />
        Create Teacher
      </button>
      {showModal && (
        <div className="absolute top-0 right-0 backdrop-blur-xl z-10 bg-transparent">
          <button
            type="button"
            className="popup-close-button"
            onClick={() => setshowModal(false)}
          >
            <FaTimes size="2em" />
          </button>

          <div className="flex flex-col items-center justify-center h-screen z-[3] w-screen">
            <form onSubmit={handleSubmit(handleCreateTeacher)} className="form">
              <h2 className="text-2xl mb-2 text-[--default-text-color] font-bold text-center">
                Create Teacher
              </h2>
              <p className="text-center text-[--default-text-color] mb-4">
                Fill in the details to create a new teacher
              </p>
              <div className="mb-3">
                <input
                  autoFocus
                  type="text"
                  placeholder="Username"
                  {...register("username")}
                  className={`${
                    errors.username
                      ? "border-[--error-color]"
                      : "border-gray-300"
                  }`}
                />
                {errors.username && (
                  <p className="error text-xs">{errors.username.message}</p>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                  className={`${
                    errors.email ? "border-[--error-color]" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="error text-xs">{errors.email.message}</p>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                  className={`${
                    errors.password
                      ? "border-[--error-color]"
                      : "border-gray-300"
                  }`}
                />
                {errors.password && (
                  <p className="error text-xs">{errors.password.message}</p>
                )}
              </div>
              <button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Teacher"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default CreateTeacher;
