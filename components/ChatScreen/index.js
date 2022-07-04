import React, {Fragment, useEffect, useState} from "react";
import {View, Text, ScrollView, TextInput, TouchableHighlight, Dimensions} from "react-native";
import styled from "styled-components/native";
import {Avatar, Button, IconButton} from "react-native-paper";
import {useDispatch} from "react-redux";
import io from "socket.io-client";
import uuid from "react-native-uuid";
import LinearGradient from "react-native-linear-gradient";
import {DEFAULT_BASE_URL} from "../ReduxSaga/AxiosConfig";

const Theme = {
    primaryColor: "#FFFFFF",
    secondaryColor: "#DCDCDC",
    primaryTextColor: "#333333",
    secondaryTextColor: "#878787"
}

const ChatHeadWrapper = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 5px 0;
    background-color: transparent;
    justify-content: space-between;
`;

const ChatHeadUsername = styled(Text)`
    font-family: "NunitoBold";
    font-size: 25px;
    color: ${Theme.primaryTextColor}
`;

const ChatScreenWrapper = styled(View)`
  padding: 0 10px;
  background-color: ${Theme.primaryColor};
  position: relative;
  flex: 1;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
`;

const ChatMessageWrapper = styled(View)`
  margin-top: ${props => props.isSameSender ? "2px" : "20px"};
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  align-self: ${props => props.sender ? "flex-end" : "flex-start"};
`;

const ChatMessage = styled(TouchableHighlight)`
  padding: 8px 10px;
  background-color: blueviolet;
  font-size: 16px;
  font-family: "NunitoRegular";
  border-radius: 15px;
  border-bottom-right-radius: 0px;
`;

const InputMessageWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  background-color: ${Theme.primaryColor};
  align-items: center;
  padding: 5px 0;
`;

const InputMessage = styled(TextInput)`
  flex: 1;
  margin: 0 0 0 10px;
  padding: 5px 10px;
  border-radius: 50px;
  background-color: #B2B2B2;
`;

const MessageState = {
    SENDING : "SENDING",
    SENT    : "SENT",
    RECEIVED: "RECEIVED",
    SEEN    : "SEEN"
}

const ChatScreen = function(props) {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIsImVtYWlsIjoiaG9hbmduZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImRhdW1vZSIsImlhdCI6MTY1NjI1NjA5NywiZXhwIjoxODcyMjU2MDk3fQ.cotV9sFZeH5p3w-iu25mE2FGxw2id0VOfEwWCVmNQy4";
    const { route, navigation }     = props;
    const { chatInfo }              = route.params;
    const { width, height }         = Dimensions.get("window");
    const dispatch                  = useDispatch();
    const [socket, setSocket]       = useState(null);
    const [msg, setMsg]             = useState("??? WTF bro");
    const [Conversation, setConversation] = useState([]);
    const { avatar, avatar_text, emit_event_id, first_name, last_name, listen_event_id, type, uid, username } = chatInfo;

    const HandleChatSocket = function(receiveData) {
        console.log("R: ", receiveData);
        const senderUid = receiveData.uid;
        const receiveMsg = receiveData.msg;
        const newMessage = {
            ...chatInfo,
            msg     : receiveMsg,
            sender  : senderUid === uid
        };
        setConversation(prevState => [...prevState, newMessage]);
    }

    const sendMessage = function() {
        if (msg.trim() === "") return;
        const newMessage = {
            ...chatInfo,
            msgID   : uuid.v1(),
            msg     : msg,
            sender  : true,
            state   : MessageState.SENDING
        };
        // setMsg("");
        setConversation(prevState => [...prevState, newMessage]);
        socket.emit(emit_event_id, {uid: uid, msg: msg});
    }

    const ChatHeadSection = function() {
        return(
            <ChatHeadWrapper>
                <IconButton icon="chevron-left" size={35} onPress={() => navigation.goBack()} color={Theme.primaryTextColor}/>
                <ChatHeadUsername>Daumoe</ChatHeadUsername>
                <Avatar.Text size={40} label="DM" style={{marginRight: 10}}/>

            </ChatHeadWrapper>
        );
    }

    const ChatSection = function() {
        return(
            <ChatScreenWrapper>
                <ScrollView>
                    {Array.isArray(Conversation) && Conversation.map(function(v, index) {
                        return (
                            <ChatMessageWrapper key={index} sender={v.sender} isSameSender={index > 0  && (v.uid === Conversation[index-1].uid)}>
                                {!v.sender ? <Avatar.Text size={35} label={v.avatar_text} style={{marginRight: 10}}/> : undefined}
                                <ChatMessage sender={v.sender} onLongPress={() => console.log("Long press")}>
                                    <Text style={{color: "white"}}>{v.msg}</Text>
                                </ChatMessage>
                                {v.sender && <IconButton icon="check-circle-outline" size={15} color={"gray"} style={{margin: 0}}/>}
                            </ChatMessageWrapper>
                        )
                    })}
                </ScrollView>
            </ChatScreenWrapper>
        );
    }

    const InputMessageSection = function() {
        return (
            <InputMessageWrapper>
                <InputMessage defaultValue={msg} onChangeText={text => setMsg(text)} placeholder="Type your message"/>
                <IconButton
                    icon="send"
                    style={{
                        transform: [{rotate: '-30deg'}]
                    }}
                    size={25}
                    onPress={sendMessage}
                    animate={true}
                    color={Theme.primaryTextColor}/>
            </InputMessageWrapper>
        );
    }

    useEffect(function () {
        console.log("CHAT: ", {emit_event_id, listen_event_id});

        const newSocket = io(`${DEFAULT_BASE_URL}/private`, {
            extraHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        newSocket.emit("new_private_chat", {emit_event_id, listen_event_id});
        newSocket.on(listen_event_id, HandleChatSocket);
        setSocket(newSocket);
        return function() {
            newSocket.close();
        }
    }, [setSocket]);

    return (
        <>
            <ChatHeadSection/>
            <ChatSection/>
            <InputMessageWrapper>
                <InputMessage defaultValue={msg} onChangeText={text => setMsg(text)} placeholder="Type your message"/>
                <IconButton
                    icon="send"
                    style={{
                        transform: [{rotate: '-30deg'}],
                        backgroundColor: "#16878E",
                        marginLeft: 10,
                        marginRight: 10
                    }}
                    size={22}
                    onPress={sendMessage}
                    animate={true}
                    color={Theme.primaryTextColor}/>
            </InputMessageWrapper>
            {/*<InputMessageSection sendMessage={sendMessage}/>*/}
        </>
    );
}

export default ChatScreen;