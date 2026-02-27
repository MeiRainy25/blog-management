import { EditorProps } from "@tiptap/pm/view";
import { JSONContent } from "@tiptap/react";

// 空内容
export const EmptyContent: JSONContent = {
  type: "doc",
  content: [
    // 最小可编辑文档结构 否则focus会展示选中状态而非光标闪烁
    {
      type: "paragraph",
    },
  ],
};

// 默认editorProps
export const DefaultEditorProps: EditorProps = {
  attributes: {
    class: "ProseMirror",
  },
};

// 默认Placeholder
export const DefaultPlaceholder = "输入内容...";
