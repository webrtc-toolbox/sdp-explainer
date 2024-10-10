import React, { useState } from "react";
import { Tabs } from "antd";
import { LineByLine } from "./components/line-by-line";
import { Header } from "./components/header";
import { TextArea } from "./components/textarea";
import { JSONView } from "./components/json-view";
import { OverView } from "./components/overview";
import { Treemap } from "./components/treemap";
import "./App.css";

function App() {
  const [textareaInput, setTextareaInput] = useState("");
  const [sdp, setSDP] = useState("");
  const [tabKey, setTabKey] = useState("1");

  function onInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const input = e.currentTarget.value;
    setTextareaInput(input);

    try {
      const obj = JSON.parse(input);

      if ("sdp" in obj && typeof obj.sdp === "string") {
        setTextareaInput(obj.sdp);
        setSDP(obj.sdp);
        return;
      }
    } catch (e) {}

    setSDP(input);
  }

  function onTabChange(key: string) {
    setTabKey(key);
  }

  function renderTabContent() {
    switch (tabKey) {
      case "1": {
        return <LineByLine sdp={sdp} />;
      }
      case "2": {
        return <Treemap sdp={sdp} />;
      }
      case "3": {
        return <OverView sdp={sdp} />;
      }
      case "4": {
        return <JSONView sdp={sdp} />;
      }
    }
  }

  return (
    <div className="App">
      <Header />
      <div className="content-container">
        <TextArea
          value={textareaInput}
          className="sdp-textarea"
          // style={{ resize: "horizontal" }}
          onChange={onInputChange}
        ></TextArea>
        <div className="parsed-content">
          <Tabs
            activeKey={tabKey}
            size="small"
            className="parse-content-tab"
            defaultActiveKey="1"
            items={[
              {
                key: "1",
                label: "Line-by-Line",
              },
              // {
              //   key: "2",
              //   label: "treemap",
              // },
              {
                key: "3",
                label: "Overview",
              },
              {
                key: "4",
                label: "JSON",
              },
            ]}
            onChange={onTabChange}
          />
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

export default App;
