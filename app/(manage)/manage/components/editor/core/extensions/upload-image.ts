import Image from "@tiptap/extension-image";

export const UploadImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      uploadId: {
        default: null,
      },
      uploading: {
        default: false,
      },
    };
  },
});
