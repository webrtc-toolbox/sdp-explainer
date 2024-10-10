import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { parse, SessionDescription, MediaDescription, Extmap } from "@webrtc-toolbox/sdp-parser";
import { RTPPayload } from "../rtp-payload";
import { FoldableSection } from "../foldable-section";
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
                    <ul>
                        {mediaDescription.attributes.extmaps.map((extmap: Extmap) => {
                            return (
                                <li key={extmap.entry}>
                                    {extmap.extensionName}
                                </li>
                            );
                        })}
                    </ul>
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
                        <FoldableSection title="ICE" />
                        {/* <h2>ICE</h2> */}
                        {/* <h2>DTLS</h2> */}
                        {renderMediaDescription()}
                        {/* <FoldableSection title="Media" /> */}
                    </FoldableSection>
                </>
                // <>
                //     <h1>Session Description</h1>
                //     <h2>ICE</h2>
                //     <h2>DTLS</h2>
                //     {renderMediaDescription()}
                // </>
            )}
        </div>
    );

}   