import React from "react";

interface NotificationProps {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  onClose: (id: string) => void;
}

const Notification: React.FC<NotificationProps> = ({
  id,
  type,
  message,
  onClose,
}) => {
  const typeStyles = {
    success:
      "text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200",
    error: "text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200",
    info: "text-blue-500 bg-blue-100 dark:bg-blue-800 dark:text-blue-200",
    warning:
      "text-yellow-500 bg-yellow-100 dark:bg-yellow-800 dark:text-yellow-200",
  };

  const iconPaths = {
    success: (
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m-6 6a9 9 0 1 1 9-9 9 9 0 0 1-9 9Z"
      />
    ),
    error: (
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 6l6 6m0-6-6 6m6-6a9 9 0 1 1-9 9 9 9 0 0 1 9-9Z"
      />
    ),
    info: (
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12V9m0-3h.01M9 18a9 9 0 1 1 9-9 9 9 0 0 1-9 9Z"
      />
    ),
    warning: (
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 2L2 20h16L10 2Zm0 14h0m0-4h0"
      />
    ),
  };

  return (
    <div
      className={`flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 ${typeStyles[type]}`}
      role="alert"
    >
      <div
        className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${typeStyles[type]}`}
      >
        <svg
          className="w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          {iconPaths[type]}
        </svg>
        <span className="sr-only">{type} icon</span>
      </div>
      <div className="ms-3 text-sm font-normal">{message}</div>
      <button
        type="button"
        className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
        onClick={() => onClose(id)}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13"
          />
        </svg>
      </button>
    </div>
  );
};

export default Notification;
