// src/components/Editor.jsx
import React, { useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import default Quill theme

const Editor = ({ content, setContent }) => {
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "align",
    "list",
    "bullet",
    "link",
    "image",
  ];

  return (
    <div
      style={{
        width: "100%", // Ensure it doesn't expand beyond the card
        height: "300px", // Adjust based on card width
        overflow: "hidden", // Prevents the editor from expanding beyond card
      }}
    >
      <ReactQuill
        value={content}
        onChange={setContent}
        modules={modules}
        formats={formats}
        placeholder="Write your letter here..."
        style={{
          height: "250px", // Set content height within the card
          overflow: "auto", // Allow scroll inside editor without expanding card
        }}
      />
    </div>
  );
};

export default Editor;
