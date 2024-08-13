import React, { useEffect, useState } from "react";
import { useData } from "@contexts/DataContext";
import { useAuth } from "@contexts/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .optional(),
});

const Settings = () => {
  const { getuserdetails } = useData();
  const { updatePassword, updateEmail, updateUsername, blockAccount, isAdmin } =
    useAuth();
  const [userID, setuserID] = useState(null);
  const [initialUserDetails, setInitialUserDetails] = useState({
    username: "",
    email: "",
  });
  const [isNameUpdated, setIsNameUpdated] = useState(false);
  const [isEmailUpdated, setIsEmailUpdated] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const fetchUserDetails = async () => {
    const user = await getuserdetails();
    setInitialUserDetails({ username: user.name, email: user.email });
    setValue("username", user.name);
    setValue("email", user.email);
  };
  const fetchUserID = async () => {
    const user = await getuserdetails();
    const id = user.$id;
    setuserID(id);
  };
  useEffect(() => {
    fetchUserDetails();
    fetchUserID();
  }, []);

  const handleNameUpdate = (data) => {
    setIsNameUpdated(false);
    updateUsername(userID, data.username);
  };

  const handleEmailUpdate = async (data) => {
    setIsEmailUpdated(false);
    updateEmail(userID, data.email);
  };

  const handlePasswordUpdate = (data) => {
    setIsPasswordUpdated(false);
    updatePassword(userID, data.password);
  };

  const { username, email, password } = watch();

  useEffect(() => {
    setIsNameUpdated(username !== initialUserDetails.username);
    setIsEmailUpdated(email !== initialUserDetails.email);
    setIsPasswordUpdated(password !== "");
  }, [username, email, password, initialUserDetails]);

  return !isAdmin ? (
    <div className="flex flex-col items-center justify-evenly h-screen z-[3] w-full">
      <form className="form w-full max-w-md">
        <h2 className="font-semibold text-3xl text-[--default-text-color] text-left">
          Settings
        </h2>
        <div className="mb-6">
          <label
            className="block text-[--default-text-color] font-bold mb-2"
            htmlFor="username"
          >
            Name
          </label>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Name"
              {...register("username")}
              className={`flex-grow mr-4 ${
                errors.username
                  ? "border-[--error-color]"
                  : "border-[--light-gray-color]"
              }`}
            />
            <button
              type="button"
              disabled={!isNameUpdated}
              onClick={handleSubmit(handleNameUpdate)}
              className={`py-2 px-4 ${
                !isNameUpdated ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Update
            </button>
          </div>
          {errors.username && (
            <p className="error text-xs text-[--error-color] mt-2">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label
            className="block text-[--default-text-color] font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <div className="flex items-center">
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className={`flex-grow mr-4 ${
                errors.email
                  ? "border-[--error-color]"
                  : "border-[--light-gray-color]"
              }`}
            />
            <button
              type="button"
              disabled={!isEmailUpdated}
              onClick={handleSubmit(handleEmailUpdate)}
              className={`py-2 px-4 ${
                !isEmailUpdated ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Update
            </button>
          </div>
          {errors.email && (
            <p className="error text-xs text-[--error-color] mt-2">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label
            className="block text-[--default-text-color] font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <div className="flex items-center">
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className={`flex-grow mr-4 ${
                errors.password
                  ? "border-[--error-color]"
                  : "border-[--light-gray-color]"
              }`}
            />
            <button
              type="button"
              disabled={!isPasswordUpdated}
              onClick={handleSubmit(handlePasswordUpdate)}
              className={`py-2 px-4 ${
                !isPasswordUpdated ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Update
            </button>
          </div>
          {errors.password && (
            <p className="error text-xs text-[--error-color] mt-2">
              {errors.password.message}
            </p>
          )}
        </div>
      </form>
      <button
        onClick={blockAccount}
        className="border-2 shadow-custom font-semibold rounded-lg p-3 border-[--text-color] bg-[--error-color] text-[--text-color] hover:bg-red-600"
      >
        Block Account
      </button>
    </div>
  ) : (
    <p className="text-[--error-color] font-semibold text-3xl flex items-center justify-center h-full w-full">
      You can go to Your Account on Appwrite to change things.
    </p>
  );
};

export default Settings;
