import React, { useState, useRef } from "react";
import {
  AppRegistry,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo,
} from "react-native-twilio-video-webrtc";

const Example = (props) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [status, setStatus] = useState("disconnected");
  const [participants, setParticipants] = useState(new Map());
  const [videoTracks, setVideoTracks] = useState(new Map());
  const [token, setToken] = useState("");
  const twilioRef = useRef(null);

  const _onConnectButtonPress = () => {
    twilioRef.current.connect({ accessToken: token });
    setStatus("connecting");
  };

  const _onEndButtonPress = () => {
    twilioRef.current.disconnect();
  };

  const _onMuteButtonPress = () => {
    twilioRef.current
      .setLocalAudioEnabled(!isAudioEnabled)
      .then((isEnabled) => setIsAudioEnabled(isEnabled));
  };

  const _onFlipButtonPress = () => {
    twilioRef.current.flipCamera();
  };

  const _onRoomDidConnect = ({ roomName, error }) => {
    console.log("onRoomDidConnect: ", roomName);
    setStatus("connected");
  };

  const _onRoomDidDisconnect = ({ roomName, error }) => {
    console.log("[Disconnect]ERROR: ", error);
    setStatus("disconnected");
  };

  const _onRoomDidFailToConnect = (error) => {
    console.log("[FailToConnect]ERROR: ", error);
    setStatus("disconnected");
  };

  const _onParticipantAddedVideoTrack = ({ participant, track }) => {
    console.log("onParticipantAddedVideoTrack: ", participant, track);
    setVideoTracks((originalVideoTracks) => {
      originalVideoTracks.set(track.trackSid, {
        participantSid: participant.sid,
        videoTrackSid: track.trackSid,
      });
      return new Map(originalVideoTracks);
    });
  };

  const _onParticipantRemovedVideoTrack = ({ participant, track }) => {
    console.log("onParticipantRemovedVideoTrack: ", participant, track);
    setVideoTracks((originalVideoTracks) => {
      originalVideoTracks.delete(track.trackSid);
      return new Map(originalVideoTracks);
    });
  };

  return (
    <View style={styles.container}>
      {status === "disconnected" && (
        <View style={styles.connectContainer}>
          <Text style={styles.welcome}>React Native Twilio Video</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={token}
            onChangeText={(text) => setToken(text)}
            placeholder="Enter your access token"
            placeholderTextColor="#ccc"
          />
          <TouchableOpacity
            style={styles.connectButton}
            onPress={_onConnectButtonPress}
          >
            <Text style={styles.connectButtonText}>Connect</Text>
          </TouchableOpacity>
        </View>
      )}

      {(status === "connected" || status === "connecting") && (
        <View style={styles.callContainer}>
          {status === "connected" && (
            <View style={styles.remoteGrid}>
              {Array.from(videoTracks, ([trackSid, trackIdentifier]) => {
                return (
                  <TwilioVideoParticipantView
                    style={styles.remoteVideo}
                    key={trackSid}
                    trackIdentifier={trackIdentifier}
                  />
                );
              })}
            </View>
          )}
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onEndButtonPress}
            >
              <Text style={styles.optionButtonText}>End</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onMuteButtonPress}
            >
              <Text style={styles.optionButtonText}>
                {isAudioEnabled ? "Mute" : "Unmute"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onFlipButtonPress}
            >
              <Text style={styles.optionButtonText}>Flip</Text>
            </TouchableOpacity>
          </View>
          <TwilioVideoLocalView enabled={true} style={styles.localVideo} />
        </View>
      )}

      <TwilioVideo
        ref={twilioRef}
        onRoomDidConnect={_onRoomDidConnect}
        onRoomDidDisconnect={_onRoomDidDisconnect}
        onRoomDidFailToConnect={_onRoomDidFailToConnect}
        onParticipantAddedVideoTrack={_onParticipantAddedVideoTrack}
        onParticipantRemovedVideoTrack={_onParticipantRemovedVideoTrack}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  welcome: {
    fontSize: 24,
    textAlign: "center",
    margin: 10,
    color: "#333",
  },
  connectContainer: {
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  input: {
    height: 50,
    borderColor: "#007bff",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: 300,
    borderRadius: 5,
  },
  connectButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
  },
  connectButtonText: {
    color: "#ffffff",
    fontSize: 18,
  },
  callContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  remoteGrid: {
    flex: 1,
    width: "100%",
  },
  remoteVideo: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 10,
    overflow: "hidden",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#ffffff",
  },
  optionButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  optionButtonText: {
    color: "#ffffff",
    fontSize: 14,
  },
  localVideo: {
    width: 100,
    height: 150,
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default Example;

AppRegistry.registerComponent("MyApp", () => Example);
