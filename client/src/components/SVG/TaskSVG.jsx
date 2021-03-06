import React from "react";

const TaskSVG = ({ classes }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`${classes}`}
      aria-hidden="true"
      focusable="false"
      width="1em"
      height="1em"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 36 36"
    >
      <path
        d="M29.29 4.95h-7.2a4.31 4.31 0 0 0-8.17 0H7a1.75 1.75 0 0 0-2 1.69v25.62a1.7 1.7 0 0 0 1.71 1.69h22.58A1.7 1.7 0 0 0 31 32.26V6.64a1.7 1.7 0 0 0-1.71-1.69zm-18 3a1 1 0 0 1 1-1h3.44v-.63a2.31 2.31 0 0 1 4.63 0V7h3.44a1 1 0 0 1 1 1v1.8H11.25zm14.52 9.23l-9.12 9.12l-5.24-5.24a1.4 1.4 0 0 1 2-2l3.26 3.26l7.14-7.14a1.4 1.4 0 1 1 2 2z"
        fill="currentColor"
      />
    </svg>
  );
};

export default TaskSVG;
