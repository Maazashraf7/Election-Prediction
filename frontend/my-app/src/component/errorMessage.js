import React from "react";

function ErrorMessage({ message }) {
  return (
    <div className="text-red-500 text-center font-semibold">
      {message}
    </div>
  );
}

export default ErrorMessage;
