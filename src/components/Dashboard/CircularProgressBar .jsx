import React from "react";

const CircularProgressBar = ({ percentage, size = 100 }) => {
  const radius = size / 2 - 10; // Adjust for stroke width
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        className={`w-${size} h-${size}`}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--light-gray-color)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--accent-color)"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>
      <span className="absolute md:text-4xl font-bold text-[--text-color]">
        {percentage}%
      </span>
    </div>
  );
};

export default CircularProgressBar;
