import   { useMemo, useState } from 'react';
// Import the Slate components and React plugin.
import { Slate, Editable, withReact} from 'slate-react';
// Import the Slate editor factory.
import { createEditor, Transforms, Editor } from 'slate';

// eslint-disable-next-line react/prop-types
const ConElement = ({ attributes, children, element }) => {
  // eslint-disable-next-line react/prop-types
  switch (element.type) {
    case 'blockquote':
      return <blockquote {...attributes}>{children}</blockquote>;
    // case 'paragraph':
    //   return <p {...attributes}>{children}</p>;
    case 'heading':
      return <h1 {...attributes}>{children}</h1>; 
    case 'paragraph':
      default:
      return <p {...attributes}>{children}</p>;
  }
};

// eslint-disable-next-line react/prop-types
const BlockButton = ({ format, editor }) => {

  // Function to check if the block type is active
  const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n.type === format,
    mode: "all",
  });
  return !!match;
  };

  // Function to toggle block types
  const toggleBlock = (editor, format) => {
    const isActive = isBlockActive(editor, format);
    
     // eslint-disable-next-line react/prop-types
     if (!editor.selection) { console.log("invalid selection"); return;}

    Transforms.setNodes(
      editor,
      { type: isActive ? 'paragraph' : format },
      { 
        // at: [0],
        // match: node => {
        //   console.log('n', Editor.isBlock(editor, node))
        // //   Editor.isBlock(editor, node)
        // },
        // eslint-disable-next-line react/prop-types
        at: editor.selection,
        //.isBlock distinguish codeBlock 
        // match: n => Editor.isBlock(editor, n),   
        split: true,
      }
    );
    console.log(222, editor,  format);
    // eslint-disable-next-line react/prop-types
    console.log('newselection', editor.selection);
    
  };

  return (
    
    <button
      onClick={() =>
        toggleBlock(editor, format)
      }
    >
      {format}
    </button>
  );
};


const SimpleSlateEditor = () => {
  
  const editor = useMemo(() => withReact(createEditor()), []);
 
  const [value, setValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.'
      }],
    }
  ]);

  return (
    <Slate editor={editor} initialValue={value} 
      onChange={(newValue) => {
        if (newValue !== value){
        setValue(newValue);
        console.log('change', newValue);}
      }}
    >
      <div>
        <BlockButton format="paragraph" editor={editor}/>
        <BlockButton format="blockquote" editor={editor}/>
        <BlockButton format="heading" editor={editor} />
      </div>
      <Editable
        renderElement={props => <ConElement {...props} />}
        placeholder="Enter some text..."
      />
    </Slate>
  );
};

export default SimpleSlateEditor;