import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import FileHandler from "@tiptap/extension-file-handler";
import { UploadImage } from "./extensions/upload-image";
import { Dropcursor, Placeholder } from "@tiptap/extensions";
import { Editor } from "@tiptap/react";
import { DefaultPlaceholder } from "../constant";
import { uploadImage } from "@/app/api/query";
import { Markdown } from "@tiptap/markdown";

// 图片上传
export const ImgHandler = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await uploadImage(formData);
    const imgUrl = response?.url ?? "";
    return imgUrl;
  } catch (e) {
    console.error(e);
    return "";
  }
};

// 文件上传处理
const imgHandler = async (editor: Editor, files: File[], pos: number) => {
  for (const file of files) {
    const uploadId = crypto.randomUUID();
    const imgUrl = URL.createObjectURL(file);
    editor
      .chain()
      .insertContentAt(pos, {
        type: "image",
        attrs: { src: imgUrl, uploadId, uploading: true },
      })
      .run();
    const url = await ImgHandler(file);
    const { state, view } = editor;
    const { doc } = state;
    let tr = editor.state.tr;
    doc.descendants((node, pos) => {
      if (node.type.name === "image" && node.attrs.uploadId === uploadId) {
        tr = state.tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          src: url,
          uploading: false,
        });
      }
    });
    if (tr.docChanged) {
      view.dispatch(tr);
    }
  }
};

export const baseExtensions = [
  StarterKit,
  Placeholder.configure({
    placeholder: DefaultPlaceholder,
  }),
  Image, // 图片扩展
  UploadImage, // 上传图片扩展
  Dropcursor.configure({
    class: "dropcursor",
  }),
  FileHandler.configure({
    allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
    onDrop: imgHandler,
    onPaste: (currentEditor, files, htmlContent) => {
      if (htmlContent) {
        return false;
      }
      const { from: pos } = currentEditor.state.selection;
      imgHandler(currentEditor, files, pos);
    },
  }), // 文件处理扩展
  Markdown,
];
