interface MarkdownNode {
  type: string;
  content: string | MarkdownNode[];
}

function parseInlineMarkdown(text: string): MarkdownNode[] {
  const result: MarkdownNode[] = [];
  let currentText = "";

  const pushCurrentText = () => {
    if (currentText) {
      result.push({ type: "text", content: currentText });
      currentText = "";
    }
  };

  for (let i = 0; i < text.length; i++) {
    if (text[i] === "*" && text[i + 1] === "*") {
      pushCurrentText();
      const end = text.indexOf("**", i + 2);
      if (end !== -1) {
        result.push({ type: "bold", content: text.slice(i + 2, end) });
        i = end + 1;
      } else {
        currentText += "**";
        i++;
      }
    } else if (text[i] === "_") {
      pushCurrentText();
      const end = text.indexOf("_", i + 1);
      if (end !== -1) {
        result.push({ type: "italic", content: text.slice(i + 1, end) });
        i = end;
      } else {
        currentText += "_";
      }
    } else if (text[i] === "`") {
      pushCurrentText();
      const end = text.indexOf("`", i + 1);
      if (end !== -1) {
        result.push({ type: "code", content: text.slice(i + 1, end) });
        i = end;
      } else {
        currentText += "`";
      }
    } else {
      currentText += text[i];
    }
  }

  pushCurrentText();
  return result;
}

export function parseMarkdown(markdown: string): MarkdownNode[] {
  const lines = markdown.split("\n");
  const result: MarkdownNode[] = [];
  let currentList: MarkdownNode | null = null;

  for (const line of lines) {
    if (line.startsWith("# ")) {
      result.push({ type: "h1", content: parseInlineMarkdown(line.slice(2)) });
    } else if (line.startsWith("## ")) {
      result.push({ type: "h2", content: parseInlineMarkdown(line.slice(3)) });
    } else if (line.startsWith("### ")) {
      result.push({ type: "h3", content: parseInlineMarkdown(line.slice(4)) });
    } else if (line.startsWith("- ")) {
      if (!currentList) {
        currentList = { type: "ul", content: [] };
        result.push(currentList);
      }
      (currentList.content as MarkdownNode[]).push({
        type: "li",
        content: parseInlineMarkdown(line.slice(2)),
      });
    } else if (line.trim() === "") {
      currentList = null;
    } else {
      result.push({ type: "p", content: parseInlineMarkdown(line) });
    }
  }

  return result;
}
