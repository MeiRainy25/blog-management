"use client";

import { EditorContent } from "@tiptap/react";
import { useContext } from "react";
import { EditorContext } from "./EditorRoot";

const EditorContentWrapper = () => {
  const editor = useContext(EditorContext);

  if (!editor) return null;

  return (
    <div className={"tiptap-editor"}>
      <EditorContent editor={editor} />
    </div>
  );
};

export default EditorContentWrapper;
