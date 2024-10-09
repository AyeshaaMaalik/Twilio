import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { TwilioVideo } from 'react-native-twilio-video-webrtc';

const TwilioVideoWrapper = forwardRef((props, ref) => {
  const videoRef = useRef(null); // Use useRef to create a ref

  useImperativeHandle(ref, () => ({
    connect: (params) => {
      videoRef.current?.connect(params);
    },
    disconnect: () => {
      videoRef.current?.disconnect();
    },
  }));

  return <TwilioVideo ref={videoRef} {...props} />; // Ensure ref is assigned correctly
});

export default TwilioVideoWrapper;
