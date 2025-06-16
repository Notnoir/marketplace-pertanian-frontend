import React from "react";

export default function Toast({ message, type = "success", onClose }) {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div className={`fixed top-4 right-4 z-50`}>
      <div className={`text-white px-4 py-3 rounded shadow-lg ${bgColor}`}>
        <div className="flex items-center justify-between">
          <span>{message}</span>
          <button className="ml-4 text-white" onClick={onClose}>
            &times;
          </button>
        </div>
      </div>
    </div>
  );
}
