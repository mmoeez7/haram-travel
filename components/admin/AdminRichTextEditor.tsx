"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import {
  TextStyle,
  Color,
  FontSize,
} from "@tiptap/extension-text-style";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Underline as UnderlineIcon,
} from "lucide-react";

const FONT_SIZES = [
  { label: "Default", value: "" },
  { label: "12", value: "12px" },
  { label: "14", value: "14px" },
  { label: "16", value: "16px" },
  { label: "18", value: "18px" },
  { label: "20", value: "20px" },
  { label: "24", value: "24px" },
  { label: "28", value: "28px" },
  { label: "32", value: "32px" },
];

const COLORS = [
  "#1a1a1a",
  "#4b5563",
  "#b45309",
  "#b91c1c",
  "#166534",
  "#1d4ed8",
  "#6b21a8",
  "#ffffff",
];

const toolbarBtn =
  "inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-ink transition hover:bg-cream disabled:opacity-40 data-[active=true]:border-border data-[active=true]:bg-cream";

type AdminRichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
};

export function AdminRichTextEditor({
  value,
  onChange,
  disabled = false,
}: AdminRichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      TextStyle,
      Color,
      FontSize,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
    ],
    content: value || "",
    editable: !disabled,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[320px] px-5 py-4 outline-none prose prose-sm max-w-none text-ink [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_a]:text-gold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
      },
    },
    onUpdate: ({ editor: current }) => {
      const html = current.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
  });

  if (!editor) {
    return (
      <div className="min-h-[380px] rounded-xl border border-border bg-white px-4 py-3 text-sm text-muted">
        Loading editor…
      </div>
    );
  }

  function setLink() {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous || "https://");
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url.trim() })
      .run();
  }

  const currentSize =
    (editor.getAttributes("textStyle").fontSize as string | undefined) || "";

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-cream/50 px-2 py-1.5">
        <button
          type="button"
          disabled={disabled}
          data-active={editor.isActive("bold")}
          className={toolbarBtn}
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
        >
          <Bold className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          disabled={disabled}
          data-active={editor.isActive("italic")}
          className={toolbarBtn}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
        >
          <Italic className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          disabled={disabled}
          data-active={editor.isActive("underline")}
          className={toolbarBtn}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          aria-label="Underline"
        >
          <UnderlineIcon className="h-3.5 w-3.5" />
        </button>

        <span className="mx-1 h-5 w-px bg-border" aria-hidden />

        <button
          type="button"
          disabled={disabled}
          data-active={editor.isActive("heading", { level: 2 })}
          className={toolbarBtn}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          aria-label="Heading 2"
        >
          <Heading2 className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          disabled={disabled}
          data-active={editor.isActive("heading", { level: 3 })}
          className={toolbarBtn}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          aria-label="Heading 3"
        >
          <Heading3 className="h-3.5 w-3.5" />
        </button>

        <span className="mx-1 h-5 w-px bg-border" aria-hidden />

        <label className="flex items-center gap-1 text-[11px] text-muted">
          Size
          <select
            disabled={disabled}
            value={currentSize}
            className="h-8 rounded-md border border-border bg-white px-1.5 text-xs text-ink"
            onChange={(event) => {
              const next = event.target.value;
              if (!next) editor.chain().focus().unsetFontSize().run();
              else editor.chain().focus().setFontSize(next).run();
            }}
          >
            {FONT_SIZES.map((size) => (
              <option key={size.label} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-1 text-[11px] text-muted">
          Color
          <input
            type="color"
            disabled={disabled}
            list="seo-content-colors"
            value={
              (editor.getAttributes("textStyle").color as string | undefined) ||
              "#1a1a1a"
            }
            className="h-8 w-10 cursor-pointer rounded border border-border bg-white p-0.5"
            onChange={(event) =>
              editor.chain().focus().setColor(event.target.value).run()
            }
            aria-label="Text color"
          />
          <datalist id="seo-content-colors">
            {COLORS.map((color) => (
              <option key={color} value={color} />
            ))}
          </datalist>
        </label>

        <span className="mx-1 h-5 w-px bg-border" aria-hidden />

        <button
          type="button"
          disabled={disabled}
          data-active={editor.isActive("bulletList")}
          className={toolbarBtn}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Bullet list"
        >
          <List className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          disabled={disabled}
          data-active={editor.isActive("orderedList")}
          className={toolbarBtn}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Numbered list"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </button>

        <span className="mx-1 h-5 w-px bg-border" aria-hidden />

        <button
          type="button"
          disabled={disabled}
          data-active={editor.isActive({ textAlign: "left" })}
          className={toolbarBtn}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          aria-label="Align left"
        >
          <AlignLeft className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          disabled={disabled}
          data-active={editor.isActive({ textAlign: "center" })}
          className={toolbarBtn}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          aria-label="Align center"
        >
          <AlignCenter className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          disabled={disabled}
          data-active={editor.isActive({ textAlign: "right" })}
          className={toolbarBtn}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          aria-label="Align right"
        >
          <AlignRight className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          disabled={disabled}
          data-active={editor.isActive("link")}
          className={toolbarBtn}
          onClick={setLink}
          aria-label="Link"
        >
          <Link2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
