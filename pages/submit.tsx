import { useState } from "react";

import { Container, Title, Divider, MultiSelect } from "@mantine/core";
import RichTextEditor from "@/components/Wysiwyg/Wysiwyg";

import { SelectCommunity } from "@/components/SelectCommunity";

function Submit() {
  const [value, setValue] = useState<string>("");
  return (
    <Container>
      <Title order={3}>Create a post</Title>
      <Divider my="xs" size="xs" />
      <SelectCommunity />
      <RichTextEditor
        value={value}
        onChange={setValue}
        controls={[
          ["bold", "italic", "underline", "strike", "clean"],
          ["link", "image", "video", "blockquote", "codeBlock"],
          ["unorderedList", "h1", "h2", "h3"],
          ["alignLeft", "alignCenter", "alignRight"],
        ]}
        sx={(theme) => ({
          minHeight: "20rem",
        })}
      />
      <Divider my="md" size="xs" />
    </Container>
  );
}

export default Submit;
