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
  const [sv, setSv] = useState({
    peer: null,
    socket: null
  })
  // const [callSocket, setCallSocket]         = useState(null);
  // const [peerConnection, setPeer]           = useState(null);
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
    sv.socket.emit("user_join_call", room_chat_id, sv.peer.id);
    sv.peer.on('error', function(e) {
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
    sv.socket.emit("end_call", room_chat_id);
    HandleEndCall(sv.peer, streams.localStream);
  }

  const HandleEndCall = (peer, stream) => {
    peer.destroy();
    stream.getTracks().map(track => track.stop());
    setStream({
      localStream: null,
      remoteStreams: null,
      ended: true
    });
    setTimeout(function() {
      if (navigation.canGoBack()) navigation.goBack();
    }, 3000);
  }

  useEffect(function() {
    const socket = io(`${DEFAULT_BASE_URL}/private_call`, {
      extraHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // const peer = new Peer(undefined, {
    //   host: HOST,
    //   port: PORT,
    //   secure: false,
    //   path: "/peer/private/",
    //   debug: 1
    // });
    const peer = new Peer(undefined);
    socket.emit("join_call", {
      room_name: room_chat_id
    });
    initUserMedia(stream => {
      console.log("Already init local stream");
      setStream({
        ...streams,
        localStream: stream,
        remoteStreams: null
      })
    });

    DeviceInfo.getDevice()
      .then(device => {
        setID(device);
      })
      .catch(e => console.error("DEVICE: ", e));
    initUserMedia(stream => {
      setStream({
        ...streams,
        localStream: stream,
        remoteStreams: null
      });
      peer.on("call", call => {
        initUserMedia(stream1 => {
          call.answer(stream1);
          call.on("stream", remoteStream => {
            setStream({
              ...streams,
              localStream: stream1,
              remoteStreams: [remoteStream]
            });
          });
          socket.on("end_call_remote_side", function() {
            peer.destroy();
            stream1.getTracks().map(track => track.stop());
            setStream({
              localStream: null,
              remoteStreams: null,
              ended: true
            });
          });
        })
      });
      socket.on("new_user_joined", (peerID) => {
        console.log("New user joined: ", peerID);
        const call = peer.call(peerID, stream);
        call.on("stream", remoteStream => {
          setStream({
            localStream: stream,
            remoteStreams: [remoteStream]
          })
        });
        call.on("close", () => {
          console.log("Close in device: ", deviceID);
          HandleEndCall(peer, stream);
        });
      });
    })
    setSv({
      peer: peer,
      socket: socket
    });
    return(() => socket.close());
  }, []);

  const NoCameraView = function(props) {
    const {isConnecting, avatar_link, avatar_text} = props;
    return(
      <View style={{width: '100%', height: '100%', display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#5ad0da"}}>
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
      <View style={{width: '100%', height: '100%', display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#5ad0da"}}>
        <Text style={{fontFamily: "NunitoBold", fontSize: 40, color: "#ffffff"}}>Call ended</Text>
        <Text style={{fontFamily: "NunitoSemiBold", fontSize: 15, color: "#ffffff", marginTop: 10}}>Hoping you had a wonderful time</Text>
        <Text style={{fontFamily: "NunitoSemiBold", fontStyle: "italic", fontSize: 10, color: "#ffffff", marginTop: 10}}>Now, we're preparing to go back after 3 seconds!</Text>
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
      {__DEV__ && <Text style={{color: "black"}}>DeviceID: {deviceID}</Text>}
      <ComingCallScreen/>
    </>
  )

  if (streams.ended) return(
    <>
      {__DEV__ && <Text style={{color: "black"}}>DeviceID: {deviceID}</Text>}
      <CallEndScreen/>
    </>
  )

  return(
    <View style={{height: '100%', width: width}}>
      <View style={{position: "absolute", top: 20, right: 20, zIndex: 1000, height: height * 0.25, width: width * 0.3}}>
        {streams.localStream !== null
          ? <RTCView
              mirror={true}
              objectFit={"cover"}
              streamURL={streams.localStream.toURL()}
              zOrder={1000}
              style={{ height: height * 0.25, width: width * 0.3 }}
            />
          : <NoCameraView/>
        }
      </View>

      <View style={{position: "relative", height: '100%', width: '100%', zIndex: 1}}>
        {(Array.isArray(streams.remoteStreams) && streams.remoteStreams.length > 0)
           ? <RTCView
              mirror={true}
              objectFit={"cover"}
              streamURL={streams.remoteStreams[0].toURL()}
              zOrder={1}
              style={{height: '100%', width: '100%'}}
            />
          : <NoCameraView/>
        }
      </View>

      <View style={{
        position: "absolute",
        bottom: 20,
        right: 10,
        zIndex: 2,
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
        <IconButton
          onPress={JoinCall}
          icon={"phone"}
          size={30}
          color={"white"}
          style={{backgroundColor: "#1d6bcc"}}
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
  );

  return(
    <>
      {__DEV__ && <Text style={{color: "black"}}>DeviceID: {deviceID}</Text>}
      {/*<Button onPress={JoinCall}>Call</Button>*/}

      {
        streams.localStream === null
          ? <NoCameraView localStream/>
          : <>
              <View style={{position: "absolute", top: 10, right: 10}}>
                {
                  localStreamState.camera
                   ? <RTCView
                      mirror={true}
                      objectFit={'cover'}
                      streamURL={streams.localStream.toURL()}
                      zOrder={1}
                      style={{height: height * 0.25, width: width * 0.3}}
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
