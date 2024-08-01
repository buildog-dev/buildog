import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import { PlusCircledIcon } from "@ui/components/react-icons";

const ParagraphBlock = ({ data, onChange }) => {
  return (
    <div contentEditable="true" onBlur={(e) => onChange(e.target.innerText)}>
      {data.text}
    </div>
  );
};

const HeaderBlock = ({ data, onChange }) => {
  return (
    <h1
      contentEditable="true"
      onBlur={(e) => onChange(e.target.innerText)}
      className="font-bold text-xl"
    >
      {data.text}
    </h1>
  );
};

const ImageBlock = ({ data, onChange }) => {
  return (
    <div>
      <img src={data.url} alt={data.alt} />
      <input
        type="text"
        value={data.alt}
        onChange={(e) => onChange({ ...data, alt: e.target.value })}
      />
    </div>
  );
};

const BlockWrapper = ({ block, index, updateBlockType, updateBlockData }) => {
  const { type, data } = block;

  const handleTypeChange = (value) => {
    updateBlockType(index, value);
  };

  const renderBlock = () => {
    switch (type) {
      case "paragraph":
        return <ParagraphBlock data={data} onChange={(text) => updateBlockData(index, { text })} />;
      case "header":
        return <HeaderBlock data={data} onChange={(text) => updateBlockData(index, { text })} />;
      case "image":
        return <ImageBlock data={data} onChange={(data) => updateBlockData(index, data)} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-start mb-2.5">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <PlusCircledIcon />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="min-w-[200px]">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => handleTypeChange("paragraph")}
          >
            Paragraph
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => handleTypeChange("header")}>
            Header
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => handleTypeChange("image")}>
            Image
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="border">{renderBlock()}</div>
    </div>
  );
};

export default function Editor() {
  const [blocks, setBlocks] = useState<any>([
    { type: "paragraph", data: { text: "This is a paragraph" } },
    { type: "header", data: { text: "This is a header", level: 2 } },
    { type: "image", data: { url: "https://picsum.photos/200/300", alt: "Image description" } },
  ]);

  const addBlock = (type) => {
    setBlocks([...blocks, { type, data: {} }]);
  };

  const updateBlockType = (index, newType) => {
    const newBlocks = [...blocks];
    newBlocks[index].type = newType;
    newBlocks[index].data = newType === "image" ? { url: "", alt: "" } : newBlocks[index].data;
    setBlocks(newBlocks);
  };

  const updateBlockData = (index, newData) => {
    const newBlocks = [...blocks];
    newBlocks[index].data = newData;
    setBlocks(newBlocks);
  };

  const saveContent = () => {
    const content = JSON.stringify(blocks);
    console.log(content);
    // You can send this content to a backend or save it to local storage
  };

  return (
    <div className="editor-container">
      {blocks.map((block, index) => (
        <BlockWrapper
          key={index}
          block={block}
          index={index}
          updateBlockType={updateBlockType}
          updateBlockData={updateBlockData}
        />
      ))}
      <div>
        <button onClick={() => addBlock("paragraph")}>Add Paragraph</button>
        <button onClick={() => addBlock("header")}>Add Header</button>
        <button onClick={() => addBlock("image")}>Add Image</button>
      </div>
    </div>
  );
}
