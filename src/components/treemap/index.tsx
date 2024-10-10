import React, { useEffect, useRef, useState } from "react";
//@ts-ignore
import FoamTree from "@carrotsearch/foamtree";
import { parse, SessionDescription } from "@webrtc-toolbox/sdp-parser";

import styles from "./index.module.css";

interface Props {
  sdp: string;
}

interface DataObject {
  label: string;
  groups: DataObject[];
}

export function Treemap(props: Props) {
  const treeElement = useRef<HTMLDivElement>(null);
  const foamTreeRef = useRef<any>(null);
  const [dataObject, setDataObject] = useState<any>();

  function convertSessionDescToDataObject(sessionDesc: SessionDescription) {
    const root: DataObject = {
      label: "",
      groups: [
        {
          label: "Session Description",
          groups: [],
        },
      ],
    };

    for (const mediaDesc of sessionDesc.mediaDescriptions) {
      const mediaDescDataObject: DataObject = {
        label: `Media Description (${mediaDesc.media.mediaType})`,
        groups: [],
      };

      mediaDescDataObject.groups.push({
        label: "payload types",
        groups: mediaDesc.attributes.payloads.map((payload) => {
          const payloadTypeDataObject: DataObject = {
            label: `${payload.rtpMap?.encodingName} (PT: ${payload.payloadType})`,
            groups: [],
          };

          if (payload.rtcpFeedbacks.length > 0) {
            const feedbacks: DataObject = {
              label: "rtcp feedbacks",
              groups: payload.rtcpFeedbacks.map((feedback) => {
                return {
                  label: feedback.type,
                  groups: [],
                };
              }),
            };

            payloadTypeDataObject.groups.push(feedbacks);
          }

          return payloadTypeDataObject;
        }),
      });

      root.groups[0]!.groups!.push(mediaDescDataObject);
    }

    return root;
  }

  useEffect(() => {
    if (!props.sdp.trim()) {
      return;
    }

    try {
      const sessionDescription = parse(props.sdp);

      console.log(sessionDescription);

      setDataObject(convertSessionDescToDataObject(sessionDescription));
    } catch (e) {}
  }, [props.sdp]);

  useEffect(() => {
    if (treeElement.current && !foamTreeRef.current) {
      const foamTree = new FoamTree({
        element: treeElement.current,
        layout: "ordered",
        stacking: "flattened",
        pixelRatio: window.devicePixelRatio || 1,
        maxGroups: Infinity,
        maxGroupLevelsDrawn: Infinity,
        maxGroupLabelLevelsDrawn: Infinity,
        maxGroupLevelsAttached: Infinity,
      });

      foamTreeRef.current = foamTree;
    }
  }, [treeElement.current]);

  useEffect(() => {
    if (foamTreeRef.current) {
      foamTreeRef.current.set({ dataObject });
    }
  }, [dataObject]);

  return (
    <div className={styles["container"]}>
      <div className={styles["tree"]} ref={treeElement}></div>
    </div>
  );
}
