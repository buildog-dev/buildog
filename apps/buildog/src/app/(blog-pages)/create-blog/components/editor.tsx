import React from "react";
import { Textarea } from "@ui/components/textarea";
import { useState } from "react";

interface EditorIF {
  content: string;
  onInput: (value: string) => void;
}

const Editor: React.FC<EditorIF> = (props) => {
  const [content, setContent] = useState(props.content);
  const onInputHandler = (e) => {
    setContent(e.currentTarget.value);
    props.onInput(e.currentTarget.value);
  };
  return (
    <div className="w-full">
      <Textarea
        id="markdownContent"
        className="
                        w-full h-full min-h-[calc(100vh-110px)] 
                        rounded-md border border-input 
                        bg-transparent text-sm shadow-sm 
                        placeholder:text-muted-foreground 
                        focus-visible:outline-none focus-visible:ring-1 
                        focus-visible:ring-ring disabled:cursor-not-allowed 
                        disabled:opacity-50"
        onInput={onInputHandler}
        value={content}
        placeholder="Enter your blog content"
      />
    </div>
  );
};
export default Editor;
