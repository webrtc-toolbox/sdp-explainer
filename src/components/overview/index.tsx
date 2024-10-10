import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { parse, SessionDescription, MediaDescription, Extmap, PayloadAttribute, RTCPFeedback } from "@webrtc-toolbox/sdp-parser";
import { FoldableSection } from "../foldable-section";
import { Table, Tag } from "antd";

interface RTPPayloadProps {
    payloads: PayloadAttribute[];
}

function RTPPayload(props: RTPPayloadProps) {
    const [dataSource, setDataSource] = useState<any[]>([]);

    useEffect(() => {
        const dataSource = props.payloads.map((payload: PayloadAttribute) => {
            return {
                key: payload.payloadType,
                payloadType: payload.payloadType,
                encodingName: payload.rtpMap?.encodingName,
                fmtp: payload.fmtp,
                rtcpFeedbacks: payload.rtcpFeedbacks,
            };
        }).sort((a, b) => a.payloadType - b.payloadType);

        setDataSource(dataSource);
    }, [props.payloads]);

    const columns = [
        {
            title: "Payload Type",
            dataIndex: "payloadType",
            width: 100,
        },
        {
            title: "Codec",
            dataIndex: "encodingName",
            width: 100,
        },
        {
            title: "Fmtp",
            dataIndex: "fmtp",
            render: (_: string, { fmtp }: PayloadAttribute) => {
                if (!(fmtp?.parameters)) {
                    return '-';
                }

                return Object.entries(fmtp.parameters).map(([key, value]) => <Tag key={key}>{key}={value}</Tag>)
            }
        },
        {
            title: "RTCP Feedback",
            dataIndex: "rtcpFeedbacks",
            render: (_: string, { rtcpFeedbacks }: PayloadAttribute) => {
                let _rtcpFeedbacks = rtcpFeedbacks as (RTCPFeedback & { parameter?: string })[];

                if (_rtcpFeedbacks.length === 0) {
                    return '-';
                }

                return <>
                    {_rtcpFeedbacks.map((feedback, index) => <Tag key={index}>{feedback.type}{feedback.parameter ? `:${feedback.parameter}` : ''}</Tag>)}
                </>
            }
        }
    ];


    return <div>
        <Table bordered pagination={false} size="small" dataSource={dataSource} rowKey="payloadType" columns={columns} />
    </div>
}

interface HdrExtProps {
    extmaps: Extmap[];
}

function HdrExt(props: HdrExtProps) {
    const columns = [
        {
            title: "ID",
            dataIndex: "entry",
            key: "entry",
            width: 20,
        },
        {
            title: "URI",
            dataIndex: "extensionName",
            key: "extensionName",
            width: 300,
        },
    ];

    return (
        <Table
            bordered
            dataSource={props.extmaps}
            columns={columns}
            pagination={false}
            size="small"
            rowKey="entry"
        />
    );
}

interface OverviewProps {
    sdp: string;
}

export const OverView = (props: OverviewProps) => {
    const { sdp } = props;
    const [sessionDescription, setSessionDescription] = useState<SessionDescription>();

    useEffect(() => {
        try {
            const sessionDescription = parse(sdp);
            setSessionDescription(sessionDescription);
        } catch (error) {
            console.error(error);
        }
    }, [sdp]);

    function renderMediaDescription() {
        if (!sessionDescription) {
            return null;
        }

        return sessionDescription.mediaDescriptions.map((mediaDescription: MediaDescription) => {
            return (
                <FoldableSection title={`Media: ${mediaDescription.media.mediaType}`}>
                    <h4>RTP header extesions</h4>
                    <HdrExt extmaps={mediaDescription.attributes.extmaps} />
                    <h4>RTP payloads</h4>
                    <RTPPayload payloads={mediaDescription.attributes.payloads} />
                </FoldableSection>
            );
        });
    }

    return (
        <div className={styles.overview}>
            {sessionDescription && (
                <>
                    <FoldableSection title="Session Description">
                        {renderMediaDescription()}
                    </FoldableSection>
                </>
            )}
        </div>
    );

}   