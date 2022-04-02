import { useState } from "react";
import RichTextEditor from "@/components/Wysiwyg/Wysiwyg";

function Submit() {
  const [value, setValue] = useState<string>("");
  return (
    <RichTextEditor
      value={value}
      onChange={setValue}
      controls={[
        ["bold", "italic", "underline", "strike", "clean"],
        ["link", "image", "video", "blockquote", "codeBlock"],
        ["unorderedList", "h1", "h2", "h3"],
        ["alignLeft", "alignCenter", "alignRight"],
      ]}
    />
  );
}

export default Submit;
