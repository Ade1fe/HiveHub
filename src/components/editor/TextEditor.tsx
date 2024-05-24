import { Box } from "@chakra-ui/react";
import { useEffect } from "react";
// @ts-ignore
import { useEditor, EditorContent, BubbleMenu, FloatingMenu, EditorProvider, Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit";
import { MdFormatBold, MdFormatListNumbered, MdFormatItalic, MdLink, MdImage } from "react-icons/md";
import { BsCodeSlash } from "react-icons/bs";
import { AiTwotoneCode } from "react-icons/ai";
import { BsTypeItalic, BsBlockquoteLeft } from "react-icons/bs";
import { PiParagraphLight, PiTextTThin, PiListBulletsBold, PiCodeBlockFill } from "react-icons/pi";
import { CiUndo, CiRedo } from "react-icons/ci";
// const content = '<p>Hello World!</p>'

const TextEditor = ({ onChange, ref, onBlur, onFocus, placeholder }: {onBlur: any, onFocus: any, ref: any, onChange: (richText: string) => void; placeholder: string; }) => {
    const editor = useEditor({
        extensions: [StarterKit.configure()],
        content: ref,
        editorProps: {
            attributes: {
                class: 'contentEdit'
            }
        },
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
    });


    // useEffect(() => {
    //     if (!editor) {
    //         return '<p>' + placeholder + '</p>';
    //     };
    // }, [editor, placeholder]);


    if (!editor) {
        return 'null';
    };

  return (
    <Box>
        <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }} className="floating-menu">
            <button onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>
                <MdFormatBold />
            </button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>
                <BsTypeItalic />
            </button>
            <button onClick={() => editor.chain().focus().toggleCode().run()} disabled={!editor.can().chain().focus().toggleCode().run()} className={editor.isActive('underline') ? 'is-active' : ''}>
                <AiTwotoneCode />
            </button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}>
                <PiTextTThin size='22' fontWeight='800' />
            </button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}>
                <PiTextTThin size='18' />
            </button>
            <button onClick={() => editor.chain().focus().toggleBulletList().run()} disabled={!editor.can().chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}>
                <PiListBulletsBold />
            </button>
            <button onClick={() => editor.chain().focus().toggleOrderedList().run()} disabled={!editor.can().chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}>
                <MdFormatListNumbered />
            </button>
            <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} disabled={!editor.can().chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? 'is-active' : ''}>
                <PiCodeBlockFill />
            </button>
            <button onClick={() => editor.chain().focus().toggleBlockquote().run()} disabled={!editor.can().chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'is-active' : ''}>
                <BsBlockquoteLeft />
            </button>
            <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()}>
                <CiUndo />
            </button>
            <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()}>
                <CiRedo />
            </button>
        </FloatingMenu>
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="bubble-menu">
        <button onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>
                <MdFormatBold />
            </button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>
                <BsTypeItalic />
            </button>
            <button onClick={() => editor.chain().focus().toggleCode().run()} disabled={!editor.can().chain().focus().toggleCode().run()} className={editor.isActive('underline') ? 'is-active' : ''}>
                <AiTwotoneCode />
            </button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}>
                <PiTextTThin size='22' fontWeight='800' />
            </button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}>
                <PiTextTThin size='18' />
            </button>
            <button onClick={() => editor.chain().focus().toggleBulletList().run()} disabled={!editor.can().chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}>
                <PiListBulletsBold />
            </button>
            <button onClick={() => editor.chain().focus().toggleOrderedList().run()} disabled={!editor.can().chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}>
                <MdFormatListNumbered />
            </button>
            <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} disabled={!editor.can().chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? 'is-active' : ''}>
                <PiCodeBlockFill />
            </button>
            <button onClick={() => editor.chain().focus().toggleBlockquote().run()} disabled={!editor.can().chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'is-active' : ''}>
                <BsBlockquoteLeft />
            </button>
            <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()}>
                <CiUndo />
            </button>
            <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()}>
                <CiRedo />
            </button>
        </BubbleMenu>
        <EditorContent editor={editor} />
        
    </Box>
  )
}

export default TextEditor