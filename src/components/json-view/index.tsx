import React, { useEffect, useState } from "react";
import { parse, SessionDescription } from "@webrtc-toolbox/sdp-parser";
import ReactJson, { CollapsedFieldProps } from 'react-json-view'
import { Alert } from "antd";
import styles from "./index.module.css";

interface JSONViewProps {
    sdp: string;
}

export const JSONView = (props: JSONViewProps) => {
    const { sdp } = props;
    const [sessionDescription, setSessionDescription] = useState<SessionDescription>();
    const [errorMsg, setErrorMsg] = useState<string>();

    function reset() {
        setSessionDescription(undefined);
        setErrorMsg(undefined);
    }

    function onSelect(select: any) {
        console.log(select);
    }

    useEffect(() => {
        reset();

        try {
            const parsed = parse(sdp);
            setSessionDescription(parsed);
        } catch (error) {
            if (error instanceof Error) {
                setErrorMsg(error.message);
            }
        }
    }, [sdp]);

    return <div className={styles["json-view-container"]}>
        {errorMsg && <Alert message={errorMsg} type="error" showIcon />}
        {!errorMsg && <ReactJson src={sessionDescription || {}} displayDataTypes={false} name="sessionDescription" collapsed={true} onSelect={onSelect} />}
    </div>;
};

