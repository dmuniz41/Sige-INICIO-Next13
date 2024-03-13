import React from "react";

export const ShieldSvg = ({ width = 24, height = 24 }) => {
  return (
    <svg
      width={`${width}`}
      height={`${height}`}
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3"></path>
      <path d="M12 11m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
      <path d="M12 12l0 2.5"></path>
    </svg>
  );
};
