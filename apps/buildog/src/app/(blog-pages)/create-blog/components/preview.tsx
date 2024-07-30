import React, { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PreviewProps {
  content: string;
}

const Preview: React.FC<PreviewProps> = (props) => {
  return (
    <article className="!max-w-full prose dark:prose-invert">
      <Markdown
        className="
                w-full h-full min-h-[calc(100vh-110px)] 
                rounded-md border border-input 
                bg-transparent text-sm shadow-sm 
                placeholder:text-muted-foreground 
                focus-visible:outline-none focus-visible:ring-1 
                focus-visible:ring-ring disabled:cursor-not-allowed 
                disabled:opacity-50"
        remarkPlugins={[remarkGfm]}
      >
        {props.content}
      </Markdown>
    </article>
  );
};

export default Preview;
