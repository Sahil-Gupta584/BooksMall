import React from "react";

function LoadingBtn({ className = "" }) {
  return (
    <div className={className}>
      <div className="loader"></div>
    </div>
  );
}

export default LoadingBtn;