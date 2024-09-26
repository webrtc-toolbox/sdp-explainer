import React from "react";
import type {
  Record,
  SessionDescription,
  Extmap,
  RTPMap,
  RTCPFeedback,
  Fmtp,
  SSRC,
  SSRCGroup
} from "@webrtc-toolbox/sdp-parser";
import "./index.css";
import {Marked} from "../marked";

interface Props {
  record?: Record;
  sessionDesc?: SessionDescription;
}

function ExplainVersion() {
  return Marked(`**v=0**\n
The "v=" field gives the version of the Session Description Protocol.  This memo defines version 0.  There is no minor version number.\n
[RFC 4566](https://datatracker.ietf.org/doc/html/rfc4566#section-5.1)
`);
}

function ExplainOrigin() {
  return Marked(`**o=&lt;username&gt; &lt;sess-id&gt; &lt;sess-version&gt; &lt;nettype&gt; &lt;addrtype&gt; &lt;unicast-address&gt;**\n
The "o=" field gives the originator of the session (her username and the address of the user's host) plus a session identifier and version number.\n
The value of the &lt;username&gt; field SHOULD be "-". The sess-id MUST be representable by a 64-bit signed integer, and the value MUST be less than (2**63)-1. It is RECOMMENDED that the sess-id be constructed by generating a 64-bit quantity with the highest bit set to zero and the remaining 63 bits being cryptographically random. The value of the &lt;nettype&gt; &lt;addrtype&gt; &lt;unicast-address&gt; tuple SHOULD be set to a non-meaningful address, such as IN IP4 0.0.0.0, to prevent leaking a local IP address in this field; this problem is discussed in [I-D.ietf-rtcweb-ip-handling]. As mentioned in [RFC4566], the entire o= line needs to be unique, but selecting a random number for &lt;sess-id&gt; is sufficient to accomplish this.\n
[RFC 4566](https://datatracker.ietf.org/doc/html/rfc4566#section-5.2) [JSEP Initial Offers](https://rtcweb-wg.github.io/jsep/#rfc.section.5.2.1) [JSEP Subsequent Offers](https://rtcweb-wg.github.io/jsep/#rfc.section.5.2.2)
 `);
}

function ExplainSessionName() {
  return Marked(`**s=&lt;session name&gt;**\n
The third SDP line MUST be a "s=" line, as specified in [RFC4566], Section 5.3; to match the "o=" line, a single dash SHOULD be used as the session name, e.g. "s=-". Note that this differs from the advice in [RFC4566] which proposes a single space, but as both "o=" and "s=" are meaningless in JSEP, having the same meaningless value seems clearer.
  `);
}

function ExplainTiming() {
  return Marked(`**t=&lt;start-time&gt; &lt;stop-time&gt;**\n
 The "t=" lines specify the start and stop times for a session; both &lt;start-time&gt; and &lt;stop-time&gt; SHOULD be set to zero, e.g. "t=0 0".`);
}

function ExplainGroup() {
  return Marked(
    `Once all m= sections have been generated, a session-level "a=group" attribute MUST be added as specified in [RFC5888]. This attribute MUST have semantics "BUNDLE", and MUST include the mid identifiers of each m= section. The effect of this is that the JSEP implementation offers all m= sections as one bundle group. However, whether the m= sections are bundle-only or not depends on the bundle policy.`,
  );
}

function ExplainMsidSemantic() {
  return (
    <div>
      <p>{`This lines gives an unique identifier for the WebRTC Media Stream (WMS) during the PeerConnection’s life. This identifier that will be used in the a=msid attributes for each m-line belonging to a specific Media Stream (in our case both audio and video m-lines). This means that the RTP media stream (identified by the SSRC field present in every RTP packet) belongs to that media stream and that it is a track of that media stream.  It is an explicit association of an individual RTP media stream to the MediaStream WebRTC object. For more info about this refer to draft-ietf-mmusic-msid`}</p>
    </div>
  );
}

function ExplainExtMapAllowMixed() {
  return (
    <div>
      <p>{` In order to allow for backward interoperability with systems that
   do not support the mixing of one-byte and two-byte header extensions,
   this document defines the "a=extmap-allow-mixed" Session Description
   Protocol (SDP) [RFC4566] attribute to indicate if the participant is
   capable of supporting this new mode.`}</p>
      <p>
        <a
          href="https://www.rfc-editor.org/rfc/rfc8285.html#section-6"
          target="_blank"
        >
          RFC 8285
        </a>
      </p>
    </div>
  );
}

function ExplainMedia() {
  return (
    <div>
      <p style={{fontWeight: 700}}>{`m=<media> <port> <proto> <fmt> ...`}</p>
      <p>{`An m= section is generated for each RtpTransceiver that has been added to the PeerConnection, excluding any stopped RtpTransceivers; this is done in the order the RtpTransceivers were added to the PeerConnection. If there are no such RtpTransceivers, no m= sections are generated; more can be added later, as discussed in [RFC3264], Section 5.`}</p>
      <p>{`For each m= section generated for an RtpTransceiver, establish a mapping between the transceiver and the index of the generated m= section.`}</p>
      <p>{`Each m= section, provided it is not marked as bundle-only, MUST generate a unique set of ICE credentials and gather its own unique set of ICE candidates. Bundle-only m= sections MUST NOT contain any ICE credentials and MUST NOT gather any candidates.`}</p>
      <p>{`For DTLS, all m= sections MUST use all the certificate(s) that have been specified for the PeerConnection; as a result, they MUST all have the same [RFC8122] fingerprint value(s), or these value(s) MUST be session-level attributes.`}</p>
    </div>
  );
}

function ExplainIceUfrag() {
  return (
    <div>
      <p>{`The "ice-ufrag" and "ice-pwd" attributes convey the username fragment and password used by ICE for message integrity.`}</p>
      <p>{`The "ice-pwd" and "ice-ufrag" attributes can appear at either the
   session-level or media-level.  When present in both, the value in the
   media-level takes precedence.  Thus, the value at the session-level
   is effectively a default that applies to all data streams, unless
   overridden by a media-level value.  Whether present at the session or
   media-level, there MUST be an ice-pwd and ice-ufrag attribute for
   each data stream.  If two data streams have identical ice-ufrag's,
   they MUST have identical ice-pwd's`}</p>
      <p>
        <a
          href="https://datatracker.ietf.org/doc/html/draft-ietf-mmusic-ice-sip-sdp-24"
          target="_blank"
        >
          Session Description Protocol (SDP) Offer/Answer procedures for
          Interactive Connectivity Establishment (ICE)
        </a>
      </p>
    </div>
  );
}

function ExplainConnection() {
  return (
    <div>
      <p
        style={{fontWeight: 700}}
      >{` c=<nettype> <addrtype> <connection-address>`}</p>
      <p>{`The m= line MUST be followed immediately by a "c=" line, as specified in [RFC4566], Section 5.7. Again, as no candidates are available yet, the "c=" line must contain the "dummy" value "IN IP4 0.0.0.0", as defined in [I-D.ietf-ice-trickle], Section 5.1.`}</p>
      <p>{`Each "m=" and c=" line MUST be filled in with the port and address of the default candidate for the m= section, as described in [I-D.ietf-mmusic-ice-sip-sdp], Section 3.2.1.2. Note that in certain cases, the m= line protocol may not match that of the default candidate, because the m= line protocol value MUST match what was supplied in the offer, as described above.`}</p>
    </div>
  );
}

function ExplainRTCP() {
  return (
    <div>
      <p
        style={{fontWeight: 700}}
      >{`rtcp-attribute = "a=rtcp:" port  [nettype space addrtype space connection-address] CRLF`}</p>
      <p>{`The RTCP attribute is used to document the RTCP port used for media stream, when that port is not the next higher (odd) port number following the RTP port described in the media line.`}</p>
      <p>{``}</p>
    </div>
  );
}

function ExplainIcePwd() {
  return Marked(`The "ice-ufrag" and "ice-pwd" attributes convey the username
fragment and password used by ICE for message integrity.

The "ice-pwd" and "ice-ufrag" attributes can appear at either the
session-level or media-level.  When present in both, the value in the
media-level takes precedence.  Thus, the value at the session-level
is effectively a default that applies to all data streams, unless
overridden by a media-level value.  Whether present at the session or
media-level, there MUST be an ice-pwd and ice-ufrag attribute for
each data stream.  If two data streams have identical ice-ufrag's,
they MUST have identical ice-pwd's.`);
}

function ExplainIceOptions() {
  return Marked(`**Trickle ICE** is a supplementary mode of ICE
operation in which candidates can be exchanged incrementally as soon
as they become available (and simultaneously with the gathering of
other candidates).  Connectivity checks can also start as soon as
candidate pairs have been created.  Because Trickle ICE enables
candidate gathering and connectivity checks to be done in parallel,
the method can considerably accelerate the process of establishing a
communication session.

[I-D.ietf-ice-trickle](https://datatracker.ietf.org/doc/html/draft-ietf-ice-trickle-21)
  `);
}

function ExplainFingerrpint() {
  return Marked(`
  Because DTLS-SRTP is required, one or more "a=fingerprint" attribute must be presented.\n
  When establishing DTLS-SRTP connection, the fingerprint will be verified against DTLS certificate 
  allowing peers to authenticate each other before starting to transmit media.\n
  [RFC8122](https://datatracker.ietf.org/doc/html/rfc8122)
  `);
}

function ExplainSetup() {
  return Marked(`
  The 'setup' attribute indicates which of the end points should initiate the TCP connection establishment.\n
  
  In the context of WebRTC DTLS-SRTP connection establishment, the endpoint that is the offerer **MUST** use the setup attribute
  value of **setup:actpass** and be prepared to receive a DTLS client_hello before it receives the answer.\n
        
  The answerer MUST use either a setup attribute value of **setup:active** or **setup:passive**.
  Note that if the answerer uses setup:passive, then the DTLS handshake will
  not begin until the answerer is received, which adds additional
  latency. **setup:active** allows the answer and the DTLS handshake to
  occur in parallel.  Thus, **setup:active** is **RECOMMENDED**.  Whichever
  party is active **MUST** initiate a DTLS handshake by sending a
  ClientHello over each flow (host/port quartet).\n

  [RFC 5763](https://datatracker.ietf.org/doc/html/rfc5763#section-5) [RFC 4145](https://datatracker.ietf.org/doc/html/rfc4145#section-4.1)
  `);
}

function ExplainMid() {
  return Marked(`
  The MID is a "media stream identification" value, as defined in [RFC5888], Section 4,
  which provides a more robust way to identify the m= section in the session description.\n
  
  The "a=group:BUNDLE" attribute MUST include the MID identifiers specified in the bundle group.
  `);
}

function ExplainExtmap(props: { att: any }) {
  const extmap = props.att as Extmap | undefined;
  if (!extmap) {
    return Marked(`
The a=extmap attribute in SDP is used to define a mapping for an RTP header extension,
which allows the inclusion of additional metadata in RTP packets.\n`);
  } else {
    const extension = extmap.extensionName;

    const explainMap: { [key: string]: string } = {
      "urn:ietf:params:rtp-hdrext:toffset": `
  **${extension}** is an RTP header extension that provides a way to convey
  a timestamp offset for media packets.\n
  [rfc5450  Transmission Time Offsets in RTP Streams](https://www.rfc-editor.org/rfc/rfc5450.html)\n
  `,
      "http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time": `
**${extension}** is the **Absolute Send Time extension** used to stamp RTP packets with a timestamp showing the departure time from the system
 that put this packet on the wire (or as close to this as we can manage).\n
 
[libwebrtc](https://webrtc.googlesource.com/src/+/refs/heads/main/docs/native-code/rtp-hdrext/abs-send-time) 
  `,
      "urn:3gpp:video-orientation": `
**urn:3gpp:video-orientation** is an RTP header extension that conveys the orientation of video frames,
typically in the context of mobile devices.\n

[3GPP TS 26.114](https://www.etsi.org/deliver/etsi_ts/126100_126199/126114/16.07.00_60/ts_126114v160700p.pdf)\n
`,
      "http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01": `
**http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01** containing a transport-
wide packet sequence number and an RTCP feedback message feeding back
the arrival times and sequence numbers of the packets received on a
connection.\n

[draft-holmer-rmcat-transport-wide-cc-extensions-01](https://datatracker.ietf.org/doc/html/draft-holmer-rmcat-transport-wide-cc-extensions-01)
`,
      "http://www.webrtc.org/experiments/rtp-hdrext/playout-delay": `
**http://www.webrtc.org/experiments/rtp-hdrext/playout-delay** is an RTP extension to enable the RTP sender to try and limit
the amount of playout delay at the receiver in a certain range. A minimum and maximum delay from the sender provides
guidance on the range over which the receiver can smooth out rendering.\n

[libwebrtc](https://webrtc.googlesource.com/src/+/refs/heads/main/docs/native-code/rtp-hdrext/playout-delay)
      `,
      "http://www.webrtc.org/experiments/rtp-hdrext/video-content-type": `
The Video Content Type extension is used to communicate a video content type from sender to receiver of rtp video stream.\n 
A value of 0x00 means unspecified, and a value of 0x01 means **screenshare**.\n
[libwebrtc](https://webrtc.googlesource.com/src/+/refs/heads/main/docs/native-code/rtp-hdrext/video-content-type)
`,
      "http://www.webrtc.org/experiments/rtp-hdrext/video-timing": `
The Video Timing extension is used to communicate a timing information on per-frame basis to receiver of rtp video stream.

[libwebrtc](https://webrtc.googlesource.com/src/+/refs/heads/main/docs/native-code/rtp-hdrext/video-timing)
`,
      "http://www.webrtc.org/experiments/rtp-hdrext/color-space": `
The color space extension is used to communicate color space information and optionally also metadata that is needed in
order to properly render a high dynamic range (HDR) video stream.\n
[libwebrtc](https://webrtc.googlesource.com/src/+/refs/heads/main/docs/native-code/rtp-hdrext/color-space),
      `,
      "urn:ietf:params:rtp-hdrext:sdes:mid": `
it defines an RTP header extension that can carry RTCP source description (SDES) items.\n

[RFC 8852](https://datatracker.ietf.org/doc/rfc8852/)
`,
      "urn:ietf:params:rtp-hdrext:sdes:rtp-stream-id": `
it defines an RTP header extension that can carry RTCP source description (SDES) items.\n

[RFC 8852](https://datatracker.ietf.org/doc/rfc8852/)
`,
      "urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id": `
it defines an RTP header extension that can carry RTCP source description (SDES) items.\n

[RFC 8852](https://datatracker.ietf.org/doc/rfc8852/)
      `,
      'urn:ietf:params:rtp-hdrext:ssrc-audio-level': `**urn:ietf:params:rtp-hdrext:ssrc-audio-level** 
defines a mechanism by which packets of Real-time
 Transport Protocol (RTP) audio streams can indicate, in an RTP header
 extension, the audio level of the audio sample carried in the RTP
 packet.
 
 [RFC 6464](https://datatracker.ietf.org/doc/rfc6464/)`,
    };

    return Marked(`
The a=extmap attribute in SDP is used to define a mapping for an RTP header extension,
which allows the inclusion of additional metadata in RTP packets.\n

${explainMap[extension]}
`);
  }
}

function ExplainRTPMap(props: { att: any }) {
  const rtpMap = props.att as RTPMap | undefined;
  if (!rtpMap) {
    return <div></div>;
  }

  const codec = rtpMap.encodingName;

  const explainMap: { [key: string]: string } = {
    vp8: `
  **VP8** is one of the mandatory video codecs must be supported by a fully WebRTC-compliant browser.
  [RFC 7741](https://datatracker.ietf.org/doc/html/rfc7741) describes the RTP payload format for VP8 video.\n
    `,
    rtx: `**RTX**  RTP retransmission is an effective packet loss recovery technique for
   real-time applications with relaxed delay bounds. [RFC 4588](https://datatracker.ietf.org/doc/html/rfc4588) describes the RTP
   payload format for performing retransmissions.`,
    vp9: `The **VP9** video codec was developed by Google, and is the successor to
its earlier VP8 [RFC6386] codec.  Above the compression improvements
and other general enhancements above VP8, VP9 is also designed in a
way that allows spatially-scalable video encoding. [draft-ietf-payload-vp9-16](https://datatracker.ietf.org/doc/draft-ietf-payload-vp9/16/) 
describes an RTP [RFC3550] payload specification applicable to the transmission of video streams encoded using the VP9 video codec.`,
    h264: `Support for AVC's Constrained Baseline (CB) profile is required in all fully-compliant WebRTC implementations.
    
 [RFC 6184](https://datatracker.ietf.org/doc/html/rfc6184) describes an RTP Payload format for the ITU-T Recommendation H.264 video codec and the technically identical
 ISO/IEC International Standard 14496-10 video codec.    
    `,
    av1: `[RTP Payload Format For AV1](https://aomediacodec.github.io/av1-rtp-spec/) describes an RTP payload format for the AV1 video codec.`,
    red: `**RED** stands for REDundant coding and it is a RTP payload format defined in RFC 2198 for encoding redundant audio or video data.\n
    
[RFC 2198](https://datatracker.ietf.org/doc/html/rfc2198) 
    `,
    ulpfec: `**ULPFEC** stands for Uneven Level Protection Forward Error Correction. 
It is one of the solutions included in WebRTC to recover from audio and video packet loss.

[RFC 5109](https://datatracker.ietf.org/doc/html/rfc5109)`,
    'flexfec-03': `**FlexFEC** is a Forward Error Correction (FEC) scheme used in WebRTC to enhance the reliability of video streams.
    
[RFC 8627](https://datatracker.ietf.org/doc/html/rfc8627)`,
    opus: `The **Opus** format, defined by [RFC 6716](https://datatracker.ietf.org/doc/html/rfc6716) is the primary format for audio in WebRTC.
The RTP payload format for Opus is found in [RFC 7587](https://datatracker.ietf.org/doc/html/rfc7587).`

  };

  return Marked(`
   This attribute maps from an RTP payload type number (as used in
   an "m=" line) to an encoding name denoting the payload format
   to be used.  It also provides information on the clock rate and
   encoding parameters.\n
   
   ${explainMap[codec.toLowerCase()]}
  `);
}

function ExplainRTCPFb(props: { att: any }) {
  const rtcpfb = props.att as RTCPFeedback | undefined;

  if (!rtcpfb) {
    return null;
  }

  let explain = "";

  switch (rtcpfb.type) {
    case "nack": {
      explain += `**nack** feedback type indicates that negative acknowledgements for feedback are supported.\n`;

      switch (rtcpfb.parameter) {
        case "pli": {
          explain += `\n**pli** indicates the use of Picture Loss Indication feedback.`;
          break;
        }
        case "sli": {
          explain += `\n**sli** indicates the use of Slice Loss Indication feedback.`;
          break;
        }
        case "rpsi": {
          explain += `\n**rpsi** indicates the use of Reference Picture Selection Indication feedback.`;
          break;
        }
        default: {
          explain += `\nThe feedback type nack, **without parameters**, indicates use of the Generic NACK feedback format.\n`;
          break;
        }
      }
      break;
    }
    case "ack": {
      explain += `**ack** feedback type indicates that positive acknowledgements for feedback are supported.`;
      break;
    }
    case "goog-remb": {
      explain += `**goog-remb** feedback message is used to notify a sender of multiple media
   streams over the same RTP session of the total estimated available
   bit rate on the path to the receiving side of this RTP session.
   
   [draft-alvestrand-rmcat-remb-03](https://datatracker.ietf.org/doc/html/draft-alvestrand-rmcat-remb-03)`;
      break;
    }
    case "transport-cc": {
      explain += `**transport-cc** is a Transport-wide RTCP feedback message, which sends back a message containing an
   arrival timestamp and a packet identifier for each packet received.
   
   [draft-holmer-rmcat-transport-wide-cc-extensions-01](https://datatracker.ietf.org/doc/html/draft-holmer-rmcat-transport-wide-cc-extensions-01#section-3)
   `;
      break;
    }
    case "ccm": {
      explain += `**ccm** is the Codec Control Message defined in [RFC 5104](https://www.rfc-editor.org/rfc/rfc5104.html).\n`;

      switch (rtcpfb.parameter) {
        case "fir": {
          explain += `\n **fir** indicates support of the Full Intra Request (FIR).`;
          break;
        }
      }
      break;
    }
    default:
      break;
  }

  return Marked(`
The a=rtcp-fb attribute in SDP is used to specify feedback parameters for RTP streams,
allowing receivers to provide feedback to senders about the quality of the media transmission.\n

${explain}
  `);
}

function ExplainFMTP(props: { att: any }) {
  const fmtp = props.att as Fmtp | undefined;

  let explain = "";

  if (fmtp) {
    if ("apt" in fmtp.parameters) {
      explain += `\nFor each primary codec where RTP retransmission should be used,
a corresponding "a=rtpmap" line indicating "rtx" with the clock rate of the primary codec and an "a=fmtp" line
that references the payload type of the primary codec.`;
    }

    if ("profile-id" in fmtp.parameters) {
      explain += `\nThe value of **profile-id** is an integer indicating the
default VP9 coding profile.

VP9 coding profiles:
| Profile  | Color Depth | Chroma Subsampling |
|----------|-------------|--------------------|
| 0        |8 bit/sample | 4:2:0              |
| 1        |8 bit        | 4:2:2, 4:4:4       |
| 2        | 10 or 12 bit| 4:2:0              |
| 3        | 10 or 12 bit| 4:2:2, 4:4:4       |
`;
    }

    if ("level-asymmetry-allowed" in fmtp.parameters) {
      explain += `\n **level-asymmetry-allowed** parameter MAY be used in SDP Offer/Answer to indicate
whether level asymmetry, i.e., sending media encoded at a
different level in the offerer-to-answerer direction than the
level in the answerer-to-offerer direction, is allowed. [RFC 6184](https://datatracker.ietf.org/doc/html/rfc6184#section-8.1)\n`;
    }

    if ("packetization-mode" in fmtp.parameters) {
      explain += `\nWhen the value of **packetization-mode** is equal to 0 or
packetization-mode is not present, the single NAL mode MUST be
used. When the value of **packetization-mode** is equal to 1, the non-interleaved mode MUST
be used.  When the value of **packetization-mode** is equal to 2,
the interleaved mode MUST be used. [RFC 6184](https://datatracker.ietf.org/doc/html/rfc6184#section-8.1)\n`;
    }

    if ("profile-level-id" in fmtp.parameters) {
      explain += `\nThe **profile-level-id** parameter indicates the default sub-
profile (i.e., the subset of coding tools that may have been
used to generate the stream or that the receiver supports) and
the default level of the stream or the receiver supports. [RFC 6184](https://datatracker.ietf.org/doc/html/rfc6184#section-8.1)\n`;
    }

    if ('level-idx' in fmtp.parameters) {
      explain += `\nThe **level-idx** parameter is an integer indicating the highest AV1 level that may have been used to
generate the bitstream or that the receiver supports. The range of possible values is identical to the seq_level_idx
syntax element specified in AV1. If the parameter is not present, it MUST be inferred to be 5 (level 3.1).\n`
    }

    if ('profile' in fmtp.parameters) {
      explain += `\nThe **profile** parameter is an integer indicating the highest AV1 profile that may have been used to 
generate the bitstream or that the receiver supports. The range of possible values is identical to the seq_profile syntax element
specified in AV1. If the parameter is not present, it MUST be inferred to be 0 (“Main” profile).\n`;
    }

    if ('tier' in fmtp.parameters) {
      explain += `\nThe **tier** parameter is an integer indicating the highest tier that may have been used to generate
the bitstream or that the receiver supports. The range of possible values is identical to the seq_tier syntax element
specified in AV1. If the parameter is not present, the tier MUST be inferred to be 0.\n`;
    }

    if ('repair-window' in fmtp.parameters) {
      explain += `\n**repair-window**: The time that spans the source packets and the
corresponding repair packets.  The size of the repair window is
specified in microseconds.\n`;
    }

    if ('minptime' in fmtp.parameters) {
      explain += `\n**minptime**: the minimum duration of media represented by a packet
(according to Section 6 of [RFC4566]) that SHOULD be encapsulated
in a received packet, in milliseconds rounded up to the next full
integer value.\n`;
    }

    if ('stereo' in fmtp.parameters) {
      explain += `\n**stereo** specifies whether the decoder prefers receiving stereo or
mono signals.  Possible values are 1 and 0, where 1 specifies that
stereo signals are preferred, and 0 specifies that only mono
signals are preferred.\n`;
    }

    if ('sprop-stereo' in fmtp.parameters) {
      explain += `\n**sprop-stereo** specifies whether the sender is likely to produce
stereo audio.  Possible values are 1 and 0, where 1 specifies that
stereo signals are likely to be sent, and 0 specifies that the
sender will likely only send mono.\n`;
    }

    if ('useinbandfec' in fmtp.parameters) {
      explain += `\n**useinbandfec**:  specifies that the decoder has the capability to take
advantage of the Opus in-band FEC.\n`;
    }
  }

  return Marked(`**fmtp** allows parameters that are specific to a
particular format to be conveyed in a way that SDP does not
have to understand them.

${explain}`);
}

function ExplainRecvOnly() {
  return Marked(
    `If the offerer wishes to only receive media from its peer, it MUST mark the stream as recvonly.`,
  );
}

function ExplainRTCPMux() {
  return Marked(`**a=rtcp-mux** attribute indicates the desire to multiplex RTP and
RTCP onto a single port.

[RFC 5761](https://datatracker.ietf.org/doc/html/rfc5761#section-5.1.3)`);
}

function ExplainRTCPRsize() {
  return Marked(`**a=rtcp-rsize** Session Description Protocol
(SDP) [RFC4566] attribute to indicate if the session participant is
capable of supporting Reduced-Size RTCP for applications that use SDP
for configuration of RTP sessions.

[RFC 5506](https://datatracker.ietf.org/doc/html/rfc5506)
`);
}

function ExplainCandidate() {
  return Marked(`**a=candidate &lt;foundation&gt; &lt;component-id&gt; &lt;transport&gt; &lt;priority&gt; &lt;connection-address&gt; &lt;port&gt; &lt;cand-type&gt;**
  
The **candidate** attribute is a media-level attribute only.  It contains
a transport address for a candidate that can be used for connectivity checks.

&lt;foundation&gt;: It is an identifier that is equivalent for two candidates that are of the
same type, share the same base, and come from the same STUN server.

&lt;component-id&gt;: For data streams based on RTP, candidates for the actual RTP media MUST have a
component ID of 1, and candidates for RTCP MUST have a component ID of 2.

&lt;transport&gt;: indicates the transport protocol for the candidate.

&lt;priority&gt;: This priority will be used by ICE to determine the order of the
connectivity checks and the relative preference for candidates.
Higher-priority values give more priority over lower values.

&lt;connection-address&gt;: It is the IP address of the candidate.

&lt;port&gt;: It is the port of the candidate.

&lt;cand-type&gt;: The values "host", "srflx", "prflx", and "relay" for host, server reflexive, peer reflexive, and relayed candidates.

[draft-ietf-mmusic-ice-sip-sdp-24](https://datatracker.ietf.org/doc/html/draft-ietf-mmusic-ice-sip-sdp-24)
`);
}

function ExplainIceLite() {
  return Marked(`**ice-lite** is a minimal version of the ICE specification,
intended for servers running on a public IP address. 

**ice-lite** is easy to implement, requiring the media server to only answer incoming STUN binding requests
and acting as a controlled entity in the ICE process itself. 
This simplicity makes it quite popular among implementations of SFUs and other media servers.`)
}

function ExplainSendOnly() {
  return Marked(`If the offerer wishes to only send media to its peer, it MUST mark the stream as sendonly.`);
}

function ExplainSSRC(props: { att: any }) {
  const ssrc = props.att as (SSRC | undefined);

  if (!ssrc) {
    return null;
  }

  let explain = '';

  if ('cname' in ssrc.attributes) {
    explain += `\nThe **cname** source attribute associates a media source with its
Canonical End-Point Identifier (CNAME) source description (SDES) item.\n`;
  }

  if ('msid' in ssrc.attributes) {
    explain += `\n**msid** is the same as MediaStream ID in JavaScript.\n`;
  }

  return Marked(`**SSRC** specifies the Synchronization Source (SSRC) identifier for a particular media source.
SSRC defines a mechanism to describe RTP media sources, which are
identified by their synchronization source (SSRC) identifiers, in
SDP, to associate attributes with these sources, and to express
relationships among sources.

${explain}
`)
}

function ExplainMsid() {
  return Marked(`**msid** attribute allows endpoints to associate RTP streams that are described in separate
media descriptions with the right MediaStreams. It also allows endpoints to carry an identifier for each MediaStreamTrack
in its "appdata" field.\n

[RFC 8830](https://www.rfc-editor.org/rfc/rfc8830.html)
`);
}

function ExplainSSRCGroup(props: { att: any }) {
  let ssrcGroup = props.att as (SSRCGroup | undefined);

  if (!ssrcGroup) {
    return null;
  }

  let explain = '';
  if (ssrcGroup.semantic === 'FID') {
    explain += '**FID** means Flow Identification, which is an RTX repair flow.';
  }


  return Marked(`**ssrc-group** expresses a relationship among
several sources of an RTP session.

${explain}

[RFC 5576](https://datatracker.ietf.org/doc/html/rfc5576)
`);
}

function ExplainRid() {
  return Marked(`The use of **rid** identifiers allows the individual encodings to be disambiguated
even though they are all part of the same m= section.

**RIDs** can be used to express dependencies between multiple layers of scalable encodings. 
Adding scalable layers to a session within a multiparty conference
gives a selective forwarding unit (SFU) further flexibility to
selectively forward packets from a source that best match the
bandwidth and capabilities of diverse receivers. [RFC 8851](https://datatracker.ietf.org/doc/html/rfc8851#section-11.2)
`);
}

export function RecordExplainer(props: Props) {
  if (!props.record || !props.sessionDesc) {
    return <div></div>;
  }

  const {record, sessionDesc} = props;

  function renderExplain() {
    switch (record.type) {
      case "v": {
        return <ExplainVersion/>;
      }
      case "o": {
        return <ExplainOrigin/>;
      }
      case "s": {
        return <ExplainSessionName/>;
      }
      case "t": {
        return <ExplainTiming/>;
      }
      case "m": {
        return <ExplainMedia/>;
      }
      case "c": {
        return <ExplainConnection/>;
      }
      case "a": {
        if (!record.attribute) {
          return;
        }

        switch (record.attribute.attField) {
          case "group": {
            return <ExplainGroup/>;
          }
          case "msid-semantic": {
            return <ExplainMsidSemantic/>;
          }
          case "extmap-allow-mixed": {
            return <ExplainExtMapAllowMixed/>;
          }
          case "rtcp": {
            return <ExplainRTCP/>;
          }
          case "ice-ufrag": {
            return <ExplainIceUfrag/>;
          }
          case "ice-pwd": {
            return <ExplainIcePwd/>;
          }
          case "ice-options": {
            return <ExplainIceOptions/>;
          }
          case "fingerprint": {
            return <ExplainFingerrpint/>;
          }
          case "setup": {
            return <ExplainSetup/>;
          }
          case "mid": {
            return <ExplainMid/>;
          }
          case "extmap": {
            return <ExplainExtmap att={record?.attribute?.parsed}/>;
          }
          case "rtpmap": {
            return <ExplainRTPMap att={record?.attribute?.parsed}/>;
          }
          case "rtcp-fb": {
            return <ExplainRTCPFb att={record?.attribute?.parsed}/>;
          }
          case "fmtp": {
            return <ExplainFMTP att={record?.attribute?.parsed}/>;
          }
          case "recvonly": {
            return <ExplainRecvOnly/>;
          }
          case "rtcp-mux": {
            return <ExplainRTCPMux/>;
          }
          case "rtcp-rsize": {
            return <ExplainRTCPRsize/>;
          }
          case "candidate": {
            return <ExplainCandidate/>;
          }
          case 'ice-lite': {
            return <ExplainIceLite/>
          }
          case 'sendonly': {
            return <ExplainSendOnly/>
          }
          case 'ssrc': {
            return <ExplainSSRC att={record.attribute.parsed}/>
          }
          case 'msid': {
            return <ExplainMsid/>
          }
          case 'ssrc-group': {
            return <ExplainSSRCGroup att={record?.attribute.parsed}/>
          }
          case 'rid': {
            return <ExplainRid/>
          }
        }
        break;
      }
    }
  }

  return <div className="explainer-container">{renderExplain()}</div>;
}
