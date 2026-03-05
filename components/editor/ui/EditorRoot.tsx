"use client";

import { createContext, useImperativeHandle } from "react";
import { Editor, JSONContent } from "@tiptap/react";
import { useEditorInstance } from "../hook";

export const EditorContext = createContext<Editor | null>(null);

export type EditorRef = {
  getNodeIds: (nodeTypeName: string) => string[];
  getNodeAttrs: <T extends Record<string, any> = any>(
    nodeTypeName: string,
  ) => T[];
  focus: () => void;
  commands: () => Editor["commands"] | undefined;
  getJson: () => JSONContent;
  getMarkdown: () => string;
};

interface EditorRootProps {
  children: React.ReactNode;
  value: JSONContent;
  onChange: (value: JSONContent) => void;
  editable?: boolean;
  ref?: React.RefObject<EditorRef | null>;
}

export const EditorRoot: React.FC<EditorRootProps> = ({
  children,
  value,
  onChange,
  editable,
  ref,
}) => {
  const editor = useEditorInstance({
    value,
    onChange,
    editable,
  });

  useImperativeHandle(
    ref,
    () => ({
      getNodeIds: (nodeTypeName: string) => {
        const ids: string[] = [];
        editor?.state.doc.descendants((node) => {
          if (node.type.name !== nodeTypeName) return;
          const idRaw = node.attrs?.id;
          if (!idRaw) return;
          const id = String(idRaw);
          if (!ids.includes(id)) {
            ids.push(id);
          }
        });
        return ids;
      },
      getNodeAttrs: <T extends Record<string, any> = any>(
        nodeTypeName: string,
      ) => {
        const attrs: T[] = [];
        editor?.state.doc.descendants((node) => {
          if (node.type.name !== nodeTypeName) return;
          attrs.push(node.attrs as T);
        });
        return attrs;
      },
      focus: () => editor?.commands.focus(),
      commands: () => editor?.commands,
      getJson: () => editor?.getJSON() as JSONContent,
      getMarkdown: () => editor?.getMarkdown() ?? "",
    }),
    [editor],
  );

  return (
    <EditorContext.Provider value={editor}>{children}</EditorContext.Provider>
  );
};
