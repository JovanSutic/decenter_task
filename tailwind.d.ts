import "tailwindcss/tailwind.css";

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // Extend the HTMLAttributes to include Tailwind classes
    className?: string;
  }
}