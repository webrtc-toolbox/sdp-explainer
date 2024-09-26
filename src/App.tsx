import React, { useState } from "react";
import { Tabs } from "antd";
import { LineByLine } from "./components/line-by-line";
import { Header } from "./components/header";
import { TextArea } from "./components/textarea";

import "./App.css";

// import { Input } from "antd";
// const { TextArea } = Input;

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
                label: "line-by-line",
                // children: <LineByLine sdp={sdp} />,
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
