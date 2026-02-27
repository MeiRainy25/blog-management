import { JSONContent, useEditor } from "@tiptap/react";
import { useEditorSync } from "../sync";
import { baseExtensions } from "../core";
import { DefaultEditorProps, EmptyContent } from "../constant";

interface UseEditorInstanceProps {
  value: JSONContent;
  onChange: (value: JSONContent) => void;
  editable?: boolean;
}

// 返回唯一编辑器实例
export const useEditorInstance = ({
  value,
  onChange,
  editable = true,
}: UseEditorInstanceProps) => {
  console.log(baseExtensions);
  const editor = useEditor({
    extensions: baseExtensions,
    content: EmptyContent,
    editable,
    editorProps: DefaultEditorProps,
    immediatelyRender: false,
  });

  useEditorSync({
    editor,
    value,
    onChange,
    editable,
  });

  return editor;
};
