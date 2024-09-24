import React from 'react'
import {marked} from 'marked'

const renderer = new marked.Renderer();

renderer.link = ({href, title, text}) => {
  return `<a href="${href}" target="_blank" rel="noopener noreferrer" title="${title || ''}">${text}</a>`;
};

export function Marked(markdownText: string) {
  const html = marked(markdownText, {renderer}) as string;
  return <div dangerouslySetInnerHTML={{__html: html}}/>;
}
