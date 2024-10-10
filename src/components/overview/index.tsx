import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { parse, SessionDescription, MediaDescription, Extmap, PayloadAttribute, RTCPFeedback } from "@webrtc-toolbox/sdp-parser";
import { FoldableSection } from "../foldable-section";
import { Table, Tag, Descriptions, DescriptionsProps } from "antd";

interface OverviewProps {
    sdp: string;
}

function RTPPayload(props: { payloads: PayloadAttribute[] }) {
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

function HdrExt(props: { extmaps: Extmap[] }) {
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

function Ice({ mediaDescription }: { mediaDescription: MediaDescription }) {
    const [descriptionItems, setDescriptionItems] = useState<DescriptionsProps['items']>([]);

    useEffect(() => {
        const newItems: DescriptionsProps['items'] = [];

        if (mediaDescription.attributes.iceUfrag) {
            newItems.push({
                key: 'iceUfrag',
                label: 'ICE Ufrag',
                children: mediaDescription.attributes.iceUfrag,
            });
        }

        if (mediaDescription.attributes.icePwd) {
            newItems.push({
                key: 'icePwd',
                label: 'ICE Pwd',
                children: mediaDescription.attributes.icePwd,
            });
        }

        if (mediaDescription.attributes.iceOptions) {
            newItems.push({
                key: 'iceOptions',
                label: 'ICE Options',
                children: mediaDescription.attributes.iceOptions,
            });
        }

        if (mediaDescription.attributes.setup) {
            newItems.push({
                key: 'setup',
                label: 'DTLS Setup',
                children: mediaDescription.attributes.setup,
            });
        }

        if (mediaDescription.attributes.fingerprints) {
            newItems.push({
                span: 3,
                key: 'fingerprints',
                label: 'DTLS Fingerprints',
                children: mediaDescription.attributes.fingerprints[0].fingerprint,
            });
        }

        if (mediaDescription.attributes.candidates.length > 0) {
            newItems.push({
                key: 'candidates',
                label: 'Candidates',
                span: 3,
                children: <Table
                    bordered
                    dataSource={mediaDescription.attributes.candidates}
                    columns={columns}
                    pagination={false}
                    size="small"
                    rowKey="id"
                />,
            });
        }


        setDescriptionItems(newItems);
    }, [mediaDescription]);

    const columns = [
        {
            title: "Foundation",
            dataIndex: "foundation",
            key: "foundation",
            width: 20,
        },
        {
            title: "Component ID",
            dataIndex: "componentId",
            key: "componentId",
            width: 20,
        },
        {
            title: "Transport",
            dataIndex: "transport",
            key: "transport",
            width: 20,
        },
        {
            title: "Priority",
            dataIndex: "priority",
            key: "priority",
            width: 20,
        },
        {
            title: "Address",
            dataIndex: "connectionAddress",
            key: "connectionAddress",
            width: 20,
        },
        {
            title: "Port",
            dataIndex: "port",
            key: "port",
            width: 20,
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            width: 20,
        },
        // {
        //     title: "Relevant Address",
        //     dataIndex: "relAddr",
        //     key: "relAddr",
        //     width: 20,
        // },
        // {
        //     title: "Relevant Port",
        //     dataIndex: "relPort",
        //     key: "relPort",
        //     width: 20,
        // },
        // {
        //     title: "Extension",
        //     dataIndex: "extension",
        //     key: "extension",
        //     width: 20,
        // },
    ];


    return <div>
        <Descriptions size="small" bordered items={descriptionItems} />
    </div>
}

function MediaDesc(props: { mediaDescription: MediaDescription }) {
    const { mediaDescription } = props;

    const descriptionItems: DescriptionsProps['items'] = [
        {
            key: 'mediaType',
            label: 'Media Type',
            children: mediaDescription.media.mediaType,
        },
        {
            key: 'mid',
            label: 'MID',
            children: mediaDescription.attributes.mid,
        },
        {
            key: 'direction',
            label: 'Direction',
            children: mediaDescription.attributes.direction,
        },

    ];

    return <div>
        <Descriptions size="small" bordered items={descriptionItems} />
    </div>
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
                    <MediaDesc mediaDescription={mediaDescription} />
                    <h4>ICE & DTLS</h4>
                    <Ice mediaDescription={mediaDescription} />
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