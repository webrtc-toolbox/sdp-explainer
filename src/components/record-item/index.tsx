import React from "react";
import type {Record} from "@webrtc-toolbox/sdp-parser";

import styles from "./index.module.css";

interface Props {
  record: Record;
  onClick: (record: Record) => void;
}

export function RecordItem(props: Props) {
  const onClick = function () {
    props.onClick(props.record);
  };


  return (
    <li onClick={onClick} className={styles['record-item']}>
      {props.record.type}={props.record.value}
    </li>
  );
}
