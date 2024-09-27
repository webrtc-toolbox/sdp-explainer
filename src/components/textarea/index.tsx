import React, { ChangeEventHandler, useEffect, useRef, useState } from "react";
import styles from "./index.module.css";

interface Props {
  className?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement> | undefined;
  value: string;
}

export function TextArea(props: Props) {
  const [lineNumbers, setLineNumbers] = useState<number[]>([]);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const linesElement = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(document.createElement("canvas"));
  const context = useRef<CanvasRenderingContext2D>(
    canvas.current.getContext("2d"),
  );

  const calculateNumLines = (str: string): number => {
    if (!textarea.current || !context.current) {
      return 0;
    }

    debugger;
    const textareaWidth = textarea.current.getBoundingClientRect().width;
    const words = str.split(" ");
    let lineCount = 0;
    let currentLine = "";
    for (let i = 0; i < words.length; i++) {
      const wordWidth = context.current.measureText(words[i] + " ").width;
      const lineWidth = context.current.measureText(currentLine).width;

      if (lineWidth + wordWidth > textareaWidth) {
        lineCount++;
        currentLine = words[i] + " ";
      } else {
        currentLine += words[i] + " ";
      }
    }

    if (currentLine.trim() !== "") {
      lineCount++;
    }

    return lineCount;
  };

  const calculateLineNumbers = () => {
    const lines = props.value.split("\n");
    const numLines = lines.map((line) => calculateNumLines(line));

    let lineNumbers = [];
    let i = 1;
    while (numLines.length > 0) {
      const numLinesOfSentence = numLines.shift();
      lineNumbers.push(i);
      if (numLinesOfSentence! > 1) {
        Array(numLinesOfSentence! - 1)
          .fill("")
          .forEach((_) => lineNumbers.push(""));
      }
      i++;
    }

    return lineNumbers;
  };

  const displayLineNumbers = () => {
    // const newLineNumbers = calculateLineNumbers();
    const lines = props.value.split("\n");
    const newLineNumbers = [];
    for (let i = 0; i < lines.length; i++) {
      newLineNumbers.push(i + 1);
    }

    setLineNumbers(newLineNumbers);
  };

  const onTextAreaScroll = () => {
    if (linesElement.current && textarea.current) {
      linesElement.current.scrollTop = textarea.current.scrollTop;
    }
  };

  useEffect(() => {
    displayLineNumbers();
  }, [props.value]);

  useEffect(() => {
    if (context.current) {
      context.current.font =
        '14px -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif';
    }
  }, [context.current]);

  return (
    <div className={`${styles["container"]} ${props.className || ""}`}>
      <div ref={linesElement} className={styles["lines"]}>
        {lineNumbers.map((line, i) => {
          if (line) {
            return (
              <div key={i} className={styles["line-block"]}>
                {line}
              </div>
            );
          } else {
            return (
              <div key={i} className={styles["line-block"]}>
                &nbsp;
              </div>
            );
          }
        })}
      </div>

      <textarea
        ref={textarea}
        className={styles["textinput"]}
        onChange={props.onChange}
        onScroll={onTextAreaScroll}
        value={props.value}
      ></textarea>
    </div>
  );
}
