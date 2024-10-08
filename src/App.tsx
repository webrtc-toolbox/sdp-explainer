import { useState } from "react";
import { Tabs } from "antd";
import { LineByLine } from "./components/line-by-line";
import { Header } from "./components/header";

import "./App.css";

function App(params: { sdp: string }) {
  const [tabKey, setTabKey] = useState("1");

  function onTabChange(key: string) {
    setTabKey(key);
  }

  function renderTabContent() {
    switch (tabKey) {
      case "1": {
        return <LineByLine sdp={params.sdp} />;
      }
    }
  }

  return (
    <div className="App">
      <div className="parsed-content">
        <Tabs
          activeKey={tabKey}
          size="small"
          className="parse-content-tab"
          defaultActiveKey="1"
          items={[]}
          onChange={onTabChange}
        />
        {renderTabContent()}
      </div>
    </div>
  );
}

export default App;
