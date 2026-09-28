import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useState } from "react";

/**
 * Editor visual para descripciones con TipTap
 * Permite formato: Bold, Italic, Títulos, Listas, Links
 */
export function DescriptionEditor({
  value,
  onChange,
  placeholder = "Escribe la descripción...",
}) {
  const [showPreview, setShowPreview] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: "text-base text-slate-700 leading-relaxed",
          },
        },
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc list-inside my-4",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal list-inside my-4",
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleHeading2 = () =>
    editor.chain().focus().toggleHeading({ level: 2 }).run();
  const toggleHeading3 = () =>
    editor.chain().focus().toggleHeading({ level: 3 }).run();
  const toggleBulletList = () =>
    editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () =>
    editor.chain().focus().toggleOrderedList().run();
  const addLink = () => {
    const url = prompt("URL:");
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  };
  const clearFormatting = () => editor.chain().focus().clearNodes().run();

  const buttonClass = (isActive) =>
    `px-3 py-2 rounded text-sm font-medium transition ${
      isActive
        ? "bg-blue-500 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 p-3 flex gap-2 flex-wrap">
        <button
          onClick={toggleBold}
          className={buttonClass(editor.isActive("bold"))}
          type="button"
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>

        <button
          onClick={toggleItalic}
          className={buttonClass(editor.isActive("italic"))}
          type="button"
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>

        <div className="w-px bg-slate-200"></div>

        <button
          onClick={toggleHeading2}
          className={buttonClass(editor.isActive("heading", { level: 2 }))}
          type="button"
          title="Título 2"
        >
          H2
        </button>

        <button
          onClick={toggleHeading3}
          className={buttonClass(editor.isActive("heading", { level: 3 }))}
          type="button"
          title="Título 3"
        >
          H3
        </button>

        <div className="w-px bg-slate-200"></div>

        <button
          onClick={toggleBulletList}
          className={buttonClass(editor.isActive("bulletList"))}
          type="button"
          title="Lista con puntos"
        >
          • Lista
        </button>

        <button
          onClick={toggleOrderedList}
          className={buttonClass(editor.isActive("orderedList"))}
          type="button"
          title="Lista numerada"
        >
          1. Lista
        </button>

        <div className="w-px bg-slate-200"></div>

        <button
          onClick={addLink}
          className={buttonClass(editor.isActive("link"))}
          type="button"
          title="Agregar link"
        >
          🔗 Link
        </button>

        <button
          onClick={clearFormatting}
          className="px-3 py-2 rounded text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition"
          type="button"
          title="Limpiar formato"
        >
          ✖ Limpiar
        </button>

        <div className="flex-1"></div>

        <button
          onClick={() => setShowPreview(!showPreview)}
          className="px-3 py-2 rounded text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
          type="button"
        >
          {showPreview ? "✏️ Editar" : "👁️ Preview"}
        </button>
      </div>

      {/* Editor o Preview */}
      {!showPreview ? (
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none p-4 min-h-80 focus:outline-none"
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
          }}
        />
      ) : (
        <div
          className="prose prose-sm max-w-none p-4 min-h-80"
          dangerouslySetInnerHTML={{ __html: value }}
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
          }}
        />
      )}

      {/* Caracteres */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 text-xs text-slate-500">
        {value.replace(/<[^>]*>/g, "").length} caracteres
      </div>
    </div>
  );
}

export default DescriptionEditor;
