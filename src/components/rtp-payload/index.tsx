import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import { PayloadAttribute, RTCPFeedback } from "@webrtc-toolbox/sdp-parser";

interface Props {
    payloads: PayloadAttribute[];
}

export function RTPPayload(props: Props) {
    const [dataSource, setDataSource] = useState<any[]>([]);

    useEffect(() => {
        const dataSource = props.payloads.map((payload: PayloadAttribute) => {
            return {
                key: payload.payloadType,
                payloadType: payload.payloadType,
                encodingName: payload.rtpMap?.encodingName,
                // fmtp: payload.fmtp,
                rtcpFeedbacks: payload.rtcpFeedbacks,
            };
        }).sort((a, b) => a.payloadType - b.payloadType);
        setDataSource(dataSource);
    }, [props.payloads]);

    const columns = [
        {
            title: "Payload Type",
            dataIndex: "payloadType",
            key: "payloadType",
        },
        {
            title: "Codec",
            dataIndex: "encodingName",
        },
        {
            title: "Fmtp",
            dataIndex: "fmtp",
        },
        {
            title: "RTCP Feedback",
            dataIndex: "rtcpFeedbacks",
            render: (_: string, { rtcpFeedbacks }: PayloadAttribute) => {
                return <>
                    {rtcpFeedbacks.map((feedback: RTCPFeedback, index) => <Tag key={index}>{feedback.type}{feedback.parameter ? `:${feedback.parameter}` : ''}</Tag>)}
                </>
            }
        }
    ];


    return <div>
        <Table size="small" dataSource={dataSource} rowKey="payloadType" columns={columns} />
    </div>
}
