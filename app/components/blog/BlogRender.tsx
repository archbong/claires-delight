"use client";

import parse, { domToReact, Element, DOMNode } from "html-react-parser";
import DOMPurify from "dompurify";

interface BlogRendererProps {
  content: string;
}

export default function BlogRenderer({ content }: BlogRendererProps) {
  const sanitized = DOMPurify.sanitize(content);

  const options = {
    replace: (domNode: DOMNode) => {
      if (domNode instanceof Element) {
        // Remove dangerous tags
        if (["script", "iframe", "object"].includes(domNode.name)) return null;

        // Custom rendering for headings and paragraphs
        switch (domNode.name) {
          case "h1":
            return (
              <h1 className="text-4xl font-bold my-6">
                {domToReact(domNode.children as any[])}
              </h1>
            );
          case "h2":
            return (
              <h2 className="text-3xl font-semibold my-4">
                {domToReact(domNode.children as any[])}
              </h2>
            );
          case "p":
            return (
              <p className="text-gray-800 my-2">
                {domToReact(domNode.children as any[])}
              </p>
            );
          case "ul":
            return (
              <ul className="list-disc pl-6 my-2">
                {domToReact(domNode.children as any[])}
              </ul>
            );
          case "li":
            return (
              <li className="my-1">{domToReact(domNode.children as any[])}</li>
            );
          default:
            return undefined; // leave other tags as-is
        }
      }
    },
  };

  return <div className="prose prose-lg">{parse(sanitized, options)}</div>;
}