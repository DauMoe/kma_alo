import React, { useEffect, useState } from "react";
import { Button, IconButton, withTheme } from "react-native-paper";
import { mediaDevices, RTCPeerConnection, RTCView } from "react-native-webrtc";
import { Dimensions, Text, View } from "react-native";
import { DEFAULT_BASE_URL, HOST, PORT } from "../ReduxSaga/AxiosConfig";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Peer from "react-native-peerjs";

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
    remoteStreams: []
  });
  // const { receiver_avatar, receiver_avatar_text, room_chat_id, receiver_first_name, receiver_last_name, type, receiver_uid, receiver_username } = chatInfo;

  const initUserMedia = (callback) => {
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
    callSocket.emit("user_join_call", "c553e560-fae4-11ec-84ac-215988e5b60c", peerConnection.id);
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

  useEffect(function() {
    const socket = io(`${DEFAULT_BASE_URL}/private_call`, {
      extraHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    socket.emit("join_call", {
      // room_name: room_chat_id
      room_name: "c553e560-fae4-11ec-84ac-215988e5b60c"
    });
    setCallSocket(socket);
    return function() {
      socket.close();
    }
  }, [setCallSocket]);

  useEffect(() => {
    if (callSocket) {
      callSocket.on("new_user_joined", (peerID) => {
        initUserMedia(stream => {
          const call = peerConnection.call(peerID, stream);
          call.on("stream", remoteStream => {
            setStream({
              localStream: stream,
              remoteStreams: [remoteStream]
            })
          })
        });
      });
    }
  }, [peerConnection]);

  useEffect(function() {
    const peer = new Peer(undefined, {
      host: HOST,
      port: "4000",
      secure: false,
      path: "/peer/private/",
      debug: 1
    });
    setPeer(peer);
    // initUserMedia(stream => {
    //   setStream({
    //     ...streams,
    //     localStream: stream
    //   })
    // });
    peer.on("call", call => {
      console.log("Target device: ", peer.id);
      initUserMedia(stream => {
        call.answer(stream);
        call.on("stream", remoteStream => {
          console.log("Call come");
          setStream({
            localStream: stream,
            remoteStreams: [remoteStream]
          });
        });
      });
    });
  }, []);

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
      <Text style={{color: "black"}}>PeerID: {peerConnection ? peerConnection.id : "Loading..."}</Text>
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
              <View>
                {Array.isArray(streams.remoteStreams) &&
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
