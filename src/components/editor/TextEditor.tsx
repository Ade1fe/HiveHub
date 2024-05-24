import { Box } from "@chakra-ui/react";
import { useEffect } from 'react';
import { useEditor, EditorContent, BubbleMenu, FloatingMenu, EditorProvider, Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { MdFormatBold, MdFormatItalic, MdLink, MdImage } from "react-icons/md";
import { BsCodeSlash } from "react-icons/bs";

const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    // TextStyle.configure({ types: [ListItem.name] }),
    StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
      }),
    Image,
    Link,
]

// const content = '<p>Hello World!</p>'

const TextEditor = ({onEditorReady }: any) => {
    const editor = useEditor({
        extensions,
        onUpdate: ({ editor }) => {
            // editor.update({})
        }
        // content,
    });


    useEffect(() => {
        if (editor) {
          onEditorReady(editor);
        }
    }, [editor, onEditorReady]);


    if (!editor) {
        return null;
    };

  return (
    <Box >
        <EditorContent editor={editor} />
        <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }} className="floating-menu">
            <button onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>
                <MdFormatBold />
            </button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>
                <MdFormatItalic />
            </button>
            <button onClick={() => editor.chain().focus().toggleCode().run()} className={editor.isActive('underline') ? 'is-active' : ''}>
                <BsCodeSlash />
            </button>
            <button onClick={() => { const url = prompt('Enter URL'); if (url) editor.chain().focus().setLink({ href: url }).run(); }} className={editor.isActive('link') ? 'is-active' : ''}>
                <MdLink />
            </button>
            <button onClick={() => { const url = prompt('Enter image URL'); if (url) editor.chain().focus().setImage({ src: url }).run(); }}>
                <MdImage />
            </button>
        </FloatingMenu>
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="bubble-menu">
            <button onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>
                <MdFormatBold />
            </button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>
                <MdFormatItalic />
            </button>
            <button onClick={() => editor.chain().focus().toggleCode().run()} className={editor.isActive('underline') ? 'is-active' : ''}>
                <BsCodeSlash />
            </button>
            <button onClick={() => { const url = prompt('Enter URL'); if (url) editor.chain().focus().setLink({ href: url }).run(); }} className={editor.isActive('link') ? 'is-active' : ''}>
                <MdLink />
            </button>
            <button onClick={() => { const url = prompt('Enter image URL'); if (url) editor.chain().focus().setImage({ src: url }).run(); }}>
                <MdImage />
            </button>
        </BubbleMenu>
    </Box>
  )
}

export default TextEditor