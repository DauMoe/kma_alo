import React, { useEffect, useRef, useState } from "react";
import { Button, IconButton, withTheme } from "react-native-paper";
import { mediaDevices, RTCPeerConnection, RTCView } from "react-native-webrtc";
import { Dimensions, Text, View } from "react-native";
import { DEFAULT_BASE_URL, HOST, PORT } from "../ReduxSaga/AxiosConfig";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Peer from "react-native-peerjs";
import DeviceInfo from "react-native-device-info";

const VideoCallScreen = function(props) {
  const { colors }                          = props.theme;
  // const { route }                           = props;
  // const { chatInfo }                        = route.params;
  const localViewHeightPercent              = 0.4;
  const { width, height }                   = Dimensions.get("window");
  // const { token }                           = useSelector(state => state.Authenticator);
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIxLCJlbWFpbCI6ImxlaHV5aG9hbmcxMTExOTk5QGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiZGF1bW9lMSIsImlhdCI6MTY2MDMxMDQwMSwiZXhwIjoxODc2MzEwNDAxfQ.kfiEslIiHS2oaap86PtXpV_GI3g0ADhw46MjHc0Uiu4"
  const navigation                          = useNavigation();
  const [callSocket, setCallSocket]         = useState(null);
  const [peerConnection, setPeer]           = useState(null);
  const [localStreamState, setStreamState]  = useState({
    camera: true,
    audio : true,
    useFrontCamera: true
  });
  const [streams, setStream]                = useState({
    localStream: null,
    remoteStreams: [],
    ended: false,
    comingCall: false
  });
  const room_chat_id = "c553e560-fae4-11ec-84ac-215988e5b60c";
  const [deviceID, setID] = useState(null);
  // const { receiver_avatar, receiver_avatar_text, room_chat_id, receiver_first_name, receiver_last_name, type, receiver_uid, receiver_username } = chatInfo;

  const initUserMedia = (callback, options) => {
    const defaultOptions = {audio: localStreamState.audio,
      video: {
        mandatory: {
          minWidth: 500,
          minHeight: 300,
          minFrameRate: 60,
        },
        facingMode: localStreamState.camera ? 'user' : 'environment',
        optional: deviceId
      }
    };
    options = options ? options : defaultOptions;
    let deviceId = null;
    mediaDevices.enumerateDevices()
      .then(devices => {
        devices.map(device => {
          if (device.kind === 'videoinput' && device.facing === (localStreamState.camera ? 'front' : 'environment')) {
            deviceId = device.deviceId;
          }
        });
        if (deviceId) {
          mediaDevices.getUserMedia(options)
            .then(callback)
            .catch(e => console.error("getUserMedia: ", e));
        }
      })
      .catch(e => {
          console.error("enumerateDevices: ", e);
      });
  }

  const JoinCall = () => {
    console.log("START JOIN CALL");
    callSocket.emit("user_join_call", room_chat_id, peerConnection.id);
    peerConnection.on('error', function(e) {
      console.error("PEER: ", e);
    });
  }

  const ToggleCamera = async() => {
    try {
      const videoTrack = await streams.localStream.getVideoTracks()[0];
      videoTrack._switchCamera();
    } catch(e) {
      console.error("ToggleCamera: ", e);
    }
  }

  const EndCall = () => {
    peerConnection.destroy();
    streams.localStream.getTracks().map(track => track.stop());
    setStream({
      localStream: null,
      remoteStreams: null,
      ended: true
    });
    callSocket.emit("end_call", room_chat_id);
  }

  useEffect(function() {

  }, [setCallSocket]);

  useEffect(function() {
    const peer = new Peer(undefined, {
      host: HOST,
      port: "4000",
      secure: false,
      path: "/peer/private/",
      debug: 1
    });
    initUserMedia(stream => {
      const socket = io(`${DEFAULT_BASE_URL}/private_call`, {
        extraHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      socket.emit("join_call", {
        room_name: room_chat_id
      });
      socket.on("end_call_remote_side", function() {
        peer.destroy();
        stream.getTracks().map(track => track.stop());
        setStream({
          localStream: null,
          remoteStreams: null,
          ended: true
        });
      });
      setCallSocket(socket);
      setStream({
        localStream: stream,
        remoteStreams: null
      });
      setPeer(peer);
    });
    DeviceInfo.getDevice()
      .then(device => setID(device))
      .catch(e => console.error("DEVICE: ", e));
  }, [setCallSocket]);

  useEffect(() => {
    if (peerConnection) {
      peerConnection.on("call", call => {
        console.log("Target device: ", deviceID);
        // setStream({
        //   ...streams,
        //   comingCall: true
        // })
        call.answer(streams.localStream);
        call.on("stream", remoteStream => {
          setStream({
            ...streams,
            remoteStreams: [remoteStream]
          });
        });
      });
    }

    if (callSocket) {
      callSocket.on("new_user_joined", (peerID) => {
        initUserMedia(stream => {
          const call = peerConnection.call(peerID, stream);
          call.on("stream", remoteStream => {
            setStream({
              localStream: stream,
              remoteStreams: [remoteStream]
            })
          });
          call.on("close", () => {
            console.log("Close in device: ", deviceID);
            peerConnection.destroy();
            stream.getTracks().map(track => track.stop());
            setStream({
              localStream: null,
              remoteStreams: null,
              ended: true
            });
          });
        })
      });
    }
  }, [peerConnection]);

  const NoCameraView = function(props) {
    const { localStream, hasCamera } = props;
    return(
      <View style={{width: width, height: localStream ? height * localViewHeightPercent : height * 0.2, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "gray"}}>
        <IconButton
          icon="camera-off"
          size={60}
          color={"white"}
        />
        <Text style={{fontFamily: "NunitoRegular", fontSize: 20, color: "white"}}>Camera is off</Text>
      </View>
    );
  }

  const CallEndScreen = function(props) {
    return(
      <View style={{height: height, width: width, display: "flex", justifyContent: "center", alignItems: "center"}}>
        <Text style={{fontFamily: "NunitoBold", fontSize: 40, color: "#1785a6"}}>Ops! Call ended</Text>
        <Text style={{fontFamily: "NunitoSemiBold", fontSize: 15, color: "#33a7c7", marginTop: 10}}>Hoping you had a wonder time</Text>
        <Text style={{fontFamily: "NunitoSemiBold", fontStyle: "italic", fontSize: 10, color: "black", marginTop: 10}}>Now, we're preparing to go back!</Text>
      </View>
    );
  }

  const ComingCallScreen = function() {
    return(
      <View style={{height: height, width: width, display: "flex", justifyContent: "center", alignItems: "center"}}>
        <Text style={{fontFamily: "NunitoBold", fontSize: 30, color: "#af1b95"}}>A call is coming!</Text>
      </View>
    )
  }

  if (streams.comingCall) return (
    <>
      <Text style={{color: "black"}}>DeviceID: {deviceID}</Text>
      <ComingCallScreen/>
    </>
  )

  if (streams.ended) return(
    <>
      <Text style={{color: "black"}}>DeviceID: {deviceID}</Text>
      <CallEndScreen/>
    </>
  )

  return(
    <>
      <Text style={{color: "black"}}>DeviceID: {deviceID}</Text>
      <Button onPress={JoinCall}>Call</Button>

      {
        streams.localStream === null
          ? <NoCameraView localStream/>
          : <>
              <View style={{height: height * localViewHeightPercent, width: width}}>
                {
                  localStreamState.camera
                   ? <RTCView
                      mirror={true}
                      objectFit={'cover'}
                      streamURL={streams.localStream.toURL()}
                      zOrder={1}
                      style={{height: height * localViewHeightPercent, width: width}}
                    />
                  : <NoCameraView localStream/>
                }
                <View style={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  display: "flex",
                  flexDirection: "row"
                }}>
                  <IconButton
                    onPress={ToggleCamera}
                    icon="camera-flip"
                    size={30}
                    color={"white"}
                    style={{backgroundColor: "#757575"}}
                  />
                  <IconButton
                    onPress={EndCall}
                    icon={"phone-hangup"}
                    size={30}
                    color={"white"}
                    style={{backgroundColor: "#d22c2c"}}
                  />
                  {/*<IconButton*/}
                  {/*  onPress={ToggleCameraState}*/}
                  {/*  icon={!localStreamState.camera ? "camera" : "camera-off"}*/}
                  {/*  size={30}*/}
                  {/*  color={"white"}*/}
                  {/*  style={{backgroundColor: "#757575"}}*/}
                  {/*/>*/}
                </View>
              </View>
              <View>
                {Array.isArray(streams.remoteStreams) && streams.remoteStreams.length > 0 &&
                  <RTCView
                    mirror={true}
                    objectFit={'cover'}
                    streamURL={streams.remoteStreams[0].toURL()}
                    zOrder={1}
                    style={{height: height * localViewHeightPercent, width: width}}
                  />
                }
              </View>
            </>
      }
    </>
  );
}

export default withTheme(VideoCallScreen);
