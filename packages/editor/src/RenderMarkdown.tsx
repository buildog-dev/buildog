export interface MarkdownNode {
  type: string;
  content: string | MarkdownNode[];
}

export default function RenderMarkdown({ nodes }: { nodes: MarkdownNode[] }) {
  return (
    <>
      {nodes.map((node, index) => {
        switch (node.type) {
          case "h1":
            return (
              <h1 key={index} className="text-2xl font-bold">
                {RenderMarkdown({ nodes: node.content as MarkdownNode[] })}
              </h1>
            );
          case "h2":
            return (
              <h2 key={index} className="text-xl font-bold">
                {RenderMarkdown({ nodes: node.content as MarkdownNode[] })}
              </h2>
            );
          case "h3":
            return (
              <h3 key={index} className="text-lg font-bold">
                {RenderMarkdown({ nodes: node.content as MarkdownNode[] })}
              </h3>
            );
          case "p":
            return <p key={index}>{RenderMarkdown({ nodes: node.content as MarkdownNode[] })}</p>;
          case "ul":
            return (
              <ul key={index} className="list-disc list-inside">
                {RenderMarkdown({ nodes: node.content as MarkdownNode[] })}
              </ul>
            );
          case "li":
            return <li key={index}>{RenderMarkdown({ nodes: node.content as MarkdownNode[] })}</li>;
          case "bold":
            return <strong key={index}>{node.content as string}</strong>;
          case "italic":
            return <em key={index}>{node.content as string}</em>;
          case "code":
            return (
              <code key={index} className="bg-gray-100 rounded px-1">
                {node.content as string}
              </code>
            );
          default:
            return <span key={index}>{node.content as string}</span>;
        }
      })}
    </>
  );
}
