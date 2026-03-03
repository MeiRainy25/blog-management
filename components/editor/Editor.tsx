import { JSONContent } from "@tiptap/react";
import { EditorRef, EditorRoot } from "./ui/EditorRoot";
import EditorContent from "./ui/EditorContent";
import { RefObject } from "react";

interface EditorProps {
  value: JSONContent;
  onChange?: (value: JSONContent) => void;
  editable?: boolean;
  ref?: RefObject<EditorRef | null>;
}

const Editor: React.FC<EditorProps> = ({
  value,
  onChange,
  editable = false,
  ref,
}) => {
  const onChangeEvent = (value: JSONContent) => {
    onChange?.(value);
  };
  return (
    <EditorRoot
      value={value}
      onChange={onChangeEvent}
      editable={editable}
      ref={ref}
    >
      <EditorContent />
    </EditorRoot>
  );
};

export default Editor;
