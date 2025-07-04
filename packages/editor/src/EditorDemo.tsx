import { useState } from "react";
import Editor from "./Editor";

const demoContent = `
<h1>Welcome to the Buildog Editor Demo</h1>
<p>This is a <strong>rich text editor</strong> built with <em>Buildog</em> and <u>React</u>. Here are some features you can try:</p>

<h2>Text Formatting</h2>
<ul>
  <li><strong>Bold text</strong></li>
  <li><em>Italic text</em></li>
  <li><u>Underlined text</u></li>
  <li><s>Strikethrough text</s></li>
  <li><code>Inline code</code></li>
  <li><mark>Highlighted text</mark></li>
</ul>

<h2>Headings</h2>
<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>

<h2>Lists</h2>
<h3>Unordered List</h3>
<ul>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ul>

<h3>Ordered List</h3>
<ol>
  <li>First step</li>
  <li>Second step</li>
  <li>Third step</li>
</ol>

<h2>Blockquote</h2>
<blockquote>
  This is a blockquote. Use it to highlight important information or quotes.
</blockquote>

<h2>Table</h2>
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Role</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John Doe</td>
      <td>Developer</td>
      <td>Active</td>
    </tr>
    <tr>
      <td>Jane Smith</td>
      <td>Designer</td>
      <td>Active</td>
    </tr>
  </tbody>
</table>

<p>Try selecting text to see the bubble menu, or click on an empty line to see the floating menu with quick insert options.</p>
`;

export default function EditorDemo(): JSX.Element {
  const [content, setContent] = useState(demoContent);
  const [savedContent, setSavedContent] = useState("");

  const handleSave = (newContent: string) => {
    setSavedContent(newContent);
    console.log("Content saved:", newContent);
    alert("Content saved! Check the console for the HTML output.");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">Buildog Editor Demo</h1>
        <p className="text-gray-600 mb-6">
          Try out the rich text editor with various formatting options, menus, and extensions.
        </p>
      </div>

      <div className="space-y-4">
        <Editor
          initialContent={content}
          onSave={handleSave}
          placeholder="Start writing your document..."
          className="w-full"
        />

        <div className="text-sm text-gray-500">
          <p>
            <strong>Tips:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Select text to see the bubble menu with formatting options</li>
            <li>Click on an empty line to see the floating menu with insert options</li>
            <li>Use the toolbar for comprehensive formatting controls</li>
            <li>Try different text alignments, lists, tables, and media</li>
          </ul>
        </div>
      </div>

      {savedContent && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Last Saved Content (HTML):</h3>
          <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">{savedContent}</pre>
        </div>
      )}
    </div>
  );
}
