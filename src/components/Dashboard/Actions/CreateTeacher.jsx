import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "@contexts/ActionsContext";

// Define validation schema with Zod
const schema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .nonempty("Username is required"),
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const CreateTeacher = () => {
  const { createTeacher } = useAction();

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
    await createTeacher(data.email, data.password, data.username);
    reset(); // Clear the form fields after submission
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen z-[3] w-full">
      <form onSubmit={handleSubmit(handleCreateTeacher)} className="form">
        <h2 className="text-2xl mb-2 text-[--default-text-color] font-bold text-center">
          Create Teacher
        </h2>
        <p className="text-center text-[--default-text-color] mb-4">
          Fill in the details to create a new teacher
        </p>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Username"
            {...register("username")}
            className={`${
              errors.username ? "border-[--error-color]" : "border-gray-300"
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
              errors.password ? "border-[--error-color]" : "border-gray-300"
            }`}
          />
          {errors.password && (
            <p className="error text-xs">{errors.password.message}</p>
          )}
        </div>
        <button type="submit">Create Teacher</button>
      </form>
    </div>
  );
};

export default CreateTeacher;
