import { Editor, EditorEvents, JSONContent } from "@tiptap/react";
import { useEffect } from "react";

interface UseEditorSyncProps {
  editor: Editor | null;
  value: JSONContent;
  onChange: (value: JSONContent) => void;
  editable: boolean;
}

export const useEditorSync = ({
  editor,
  value,
  onChange,
  editable,
}: UseEditorSyncProps) => {
  // 处理外部value变化
  useEffect(() => {
    if (!editor || !value) return;

    // 使用 queueMicrotask 将 setContent 移出 React 渲染周期
    queueMicrotask(() => {
      if (editor.isDestroyed) return;
      const doc = editor.schema.nodeFromJSON(value);
      // 比较value和editor当前内容是否相同
      if (!editor.state.doc.eq(doc)) {
        editor.commands.setContent(value, {
          emitUpdate: false, // 不触发update事件
        });
      }
    });
  }, [value, editor]);

  // 处理内部值变化
  useEffect(() => {
    if (!editor || !onChange) return;

    const handler = ({ transaction }: EditorEvents["transaction"]) => {
      if (!transaction.docChanged) return;
      // 如果文档内容实际变化了, 触发onChange
      const json = editor.getJSON();
      onChange(json);
    };

    editor.on("update", handler);

    return () => {
      editor.off("update", handler);
    };
  }, [editor, onChange]);

  // 处理编辑器可编辑状态变化
  useEffect(() => {
    if (!editor) return;

    editor.setEditable(editable);
  }, [editor, editable]);
};
