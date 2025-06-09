"use client";

import React from "react";

const EditButton = () => {
  return (
    <button
      className="text-sm px-3 py-1 border border-neutral-300 rounded hover:bg-white/10 transition"
      onClick={() => alert("TODO: 수정 기능")}
    >
      수정
    </button>
  );
};

export default EditButton;