import React, {ReactNode, useEffect, useState} from "react";
import {Collapse} from "antd";
import {Parser, SessionDescription, Record} from "@webrtc-toolbox/sdp-parser";
import {RecordItem} from "../record-item";
import {RecordExplainer} from "../record-explainer";

import type {CollapseProps} from "antd";

import "./index.css";

interface Props {
  sdp: string;
}

interface CollapseItemType {
  key: number;
  label: string;
  children?: ReactNode;
}

export function LineByLine(props: Props) {
  const [collapseItems, setCollapseItems] = useState<CollapseProps["items"]>(
    [],
  );
  const [selectedRecord, setSelectedRecord] = useState<Record | undefined>(
    undefined,
  );
  const [sessionDesc, setSessionDesc] = useState<SessionDescription>();

  useEffect(() => {
    parseSDPLineByLine(props.sdp);
  }, [props.sdp]);

  function handleRecordClick(record: Record) {
    setSelectedRecord(record);
  }

  function parseSDPLineByLine(sdp: string): void {
    if (!sdp.trim()) {
      setSelectedRecord(undefined);
      setCollapseItems([]);
      renderRecords([]);
      return;
    }

    let newCollapseItems: CollapseProps["items"] = [];
    let collapseKey = 1;

    const parser = new Parser();

    try {
      const sessionDesc = parser.parse(sdp);
      setSessionDesc(sessionDesc);

      const sessionCollapseItem: CollapseItemType = {
        key: collapseKey,
        label: "session description",
        children: undefined,
      };
      collapseKey++;

      const records: Record[] = parser.getRecords();
      const sessionRecords: Record[] = [];

      let i = 0;
      for (; i < records.length; i++) {
        const record = records[i];
        if (record.type !== "m") {
          sessionRecords.push(record);
        } else {
          break;
        }
      }
      sessionCollapseItem.children = renderRecords(sessionRecords);

      newCollapseItems.push(sessionCollapseItem);

      while (i < records.length) {
        const mediaCollapseItem: CollapseItemType = {
          key: collapseKey,
          label: "media description",
          children: undefined,
        };
        collapseKey++;

        const mediaRecords: Record[] = [];
        for (; i < records.length; i++) {
          const record = records[i];

          if (mediaRecords.length !== 0 && record.type === "m") {
            break;
          } else {
            mediaRecords.push(record);
          }
        }

        mediaCollapseItem.children = renderRecords(mediaRecords);

        newCollapseItems.push(mediaCollapseItem);
      }

      setCollapseItems(newCollapseItems);
    } catch (e) {
      console.error(e);
    }
  }

  function renderRecords(records: Record[]): React.ReactNode {
    return (
      <ul className="record-list">
        {records.map((record, index) => {
          return (
            <RecordItem
              key={index}
              record={record}
              onClick={handleRecordClick}
            />
          );
        })}
      </ul>
    );
  }

  return (
    <div className="linebyline-container">
      <div className="collapse-container">
        <Collapse
          className="collapse-component"
          size="small"
          items={collapseItems}
        />
      </div>
      <RecordExplainer record={selectedRecord} sessionDesc={sessionDesc}/>
    </div>
  );
}
