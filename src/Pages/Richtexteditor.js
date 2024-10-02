import React, { useState } from "react";
import { Editor, EditorState, RichUtils, Modifier, AtomicBlockUtils } from "draft-js";
import 'draft-js/dist/Draft.css'; // Import Draft.js styles
import "../Styles/Newstory.css"; // Your CSS file for custom styles

const ImageComponent = (props) => {
  const { src } = props.blockProps;
  return <img src={src} alt="Inserted" style={{ maxWidth: '100%', maxHeight: '400px' }} />;
};

export default function RichTextEditor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const toggleInlineStyle = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const insertImage = () => {
    const url = prompt("Enter image URL", "");
    if (url) {
      const contentState = editorState.getCurrentContent();
      const contentStateWithImage = contentState.createEntity("IMAGE", "IMMUTABLE", { src: url });
      const entityKey = contentStateWithImage.getLastCreatedEntityKey();
      const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithImage });
      setEditorState(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " "));
    }
  };

  const insertCodeBlock = () => {
    const selectionState = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const codeBlock = Modifier.insertText(contentState, selectionState, '```\n\n```', null, null);
    setEditorState(EditorState.push(editorState, codeBlock, "insert-characters"));
  };

  const insertLink = () => {
    const url = prompt("Enter URL", "");
    if (url) {
      const selection = editorState.getSelection();
      if (!selection.isCollapsed()) {
        setEditorState(RichUtils.toggleLink(editorState, selection, url));
      }
    }
  };

  const blockRenderMap = {
    'atomic': {
      component: ImageComponent,
      editable: false,
    },
  };

  return (
    <div className="editor-container">
      <div className="toolbar">
        <button onClick={() => toggleInlineStyle("BOLD")}>Bold</button>
        <button onClick={() => toggleInlineStyle("ITALIC")}>Italic</button>
        <button onClick={() => toggleInlineStyle("UNDERLINE")}>Underline</button>
        <button onClick={insertImage}>Image</button>
        <button onClick={insertCodeBlock}>Code Block</button>
        <button onClick={insertLink}>Link</button>
      </div>
      <div className="editor" onClick={() => editorState.focus()}>
        <Editor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={setEditorState}
          blockRenderMap={blockRenderMap}
        />
      </div>
    </div>
  );
}
