import React from "react";

const ProfileBadge = ({ ImageUrl, name, email }) => {
  return (
    <>
      <img
        className="w-10 h-10 rounded-full select-none"
        draggable={false}
        src={ImageUrl}
        alt="User Image"
      />
      <div className="ps-3">
        <div className="text-base font-semibold text-[--default-text-color]">
          {name}
        </div>
        <div className="font-normal text-[--light-gray-color]">{email}</div>
      </div>
    </>
  );
};

export default ProfileBadge;
