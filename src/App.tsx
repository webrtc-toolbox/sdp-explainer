import React, {useState} from "react";
import {Input} from "antd";
import {Tabs} from "antd";
import {LineByLine} from "./components/line-by-line";
import "./App.css";

const {TextArea} = Input;

function App() {
  const [sdp, setSDP] = useState("");
  const [tabKey, setTabKey] = useState("1");

  function onInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setSDP(e.currentTarget.value);
  }

  function onTabChange(key: string) {
    setTabKey(key);
  }

  function renderTabContent() {
    switch (tabKey) {
      case "1": {
        return <LineByLine sdp={sdp}/>;
      }
    }
  }

  return (
    <div className="App">
      <div className="content-container">
        <TextArea
          className="sdp-textarea"
          style={{resize: "horizontal"}}
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
