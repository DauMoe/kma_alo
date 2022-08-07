import React, { useEffect, useState } from "react";
import { Button, IconButton, withTheme } from "react-native-paper";
import { mediaDevices, RTCPeerConnection, RTCView } from "react-native-webrtc";
import { Dimensions, Text, View } from "react-native";
import { DEFAULT_BASE_URL } from "../ReduxSaga/AxiosConfig";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const VideoCallScreen = function(props) {
  const { colors }                          = props.theme;
  const { route }                           = props;
  const { chatInfo }                        = route.params;
  const localViewHeightPercent              = 0.4;
  const { width, height }                   = Dimensions.get("window");
  const { token }                           = useSelector(state => state.Authenticator);
  const navigation                          = useNavigation();
  const [socket, setSocket]                 = useState(null);
  const [localStreamState, setStreamState]  = useState({
    camera: true,
    audio : true,
    useFrontCamera: true
  });
  const [streams, setStream]                = useState({
    localStream: null,
    remoteStreams: []
  });
  const { receiver_avatar, receiver_avatar_text, room_chat_id, receiver_first_name, receiver_last_name, type, receiver_uid, receiver_username } = chatInfo;

  const initPeerConnection = (videoCallSocket) => {
    let deviceId = null, localStream = undefined;
    mediaDevices.enumerateDevices()
      .then(devices => {
        devices.map(device => {
          if (device.kind === 'videoinput' && device.facing === (localStreamState.camera ? 'front' : 'environment')) {
            deviceId = device.deviceId;
          }
        });
        if (deviceId) {
          mediaDevices.getUserMedia({
            audio: localStreamState.audio,
            video: {
              mandatory: {
                minWidth: 500,
                minHeight: 300,
                minFrameRate: 60,
              },
              facingMode: localStreamState.camera ? 'user' : 'environment',
              optional: deviceId
            }
          })
            .then(media => {
              setStream({
                ...localStream,
                localStream: media
              });
              console.log("emitting");
              videoCallSocket.emit("emit_stream", room_chat_id, media, chatInfo, receiver_uid);
            })
            .catch(e => console.error("getUserMedia: ", e));
        }
      })
      .catch(e => {
          console.error("enumerateDevices: ", e);
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

  // const ToggleCameraState = async() => {
  //   try {
  //     const videoTrack = await streams.localStream.getVideoTracks();
  //     console.log(videoTrack);
  //     const cameraState = !localStreamState.camera;
  //     videoTrack.enabled = cameraState;
  //     setStreamState({
  //       ...localStreamState,
  //       camera: cameraState
  //     });
  //   } catch (e) {
  //     console.error("ToggleCameraState: ", e);
  //   }
  // }

  const HandleVideoCallSocket = function(receiveData) {
    console.log("VC: ", receiveData);
  }

  useEffect(function() {
    // initPeerConnection();
  }, []);

  useEffect(function () {
    // console.log("Room name: ", room_chat_id);

    const newSocket = io(`${DEFAULT_BASE_URL}/video_call`, {
      extraHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    newSocket.emit("join_call", {room_name: room_chat_id});
    newSocket.on("listen_add_stream", HandleVideoCallSocket);
    setSocket(newSocket);
    initPeerConnection(newSocket);
    return function() {
      newSocket.close();
    }
  }, [setSocket]);

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

  return(
    <>
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
                    onPress={() => {if(navigation.canGoBack()) navigation.goBack()}}
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
              {Array.isArray(streams.remoteStreams) && streams.remoteStreams.map((stream, index) => {
                <RTCView
                  key={"_video_stream_" + index}
                  mirror={true}
                  objectFit={'contain'}
                  streamURL={stream.toURL()}
                  zOrder={1}
                  style={{height: height * 0.8, width: width}}
                />
              })}
            </>
      }
    </>
  );
}

export default withTheme(VideoCallScreen);
