import React, {Fragment} from "react";
import {View, Text, ScrollView, TextInput, TouchableHighlight, Dimensions} from "react-native";
import styled from "styled-components/native";
import {Avatar, Button, IconButton} from "react-native-paper";

const ThemeColor = "#767676";

const ChatHeadWrapper = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 20px;
    background-color: ${ThemeColor};
`;

const ChatHeadInfo = styled(View)`
    flex: 1;
`;

const ChatHeadUsername = styled(Text)`
    font-family: "NunitoExtraBold";
    font-size: 18px;
`;

const ChatHeadStatus = styled(Text)`
    font-size: 12px;
    color: gray;
    font-family: "NunitoBold";
`;

const ChatHeadOption = styled(View)`
  align-self: flex-end;
`;

const ChatScreenWrapper = styled(ScrollView)`
  padding: 10px 5px;
  background-color: ${ThemeColor};
`;

const ChatMessageWrapper = styled(View)`
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  align-self: ${props => props.sender ? "flex-end" : "flex-start"};
`;

const ChatMessage = styled(TouchableHighlight)`
  padding: 8px 10px;
  background-color: blueviolet;
  font-size: 16px;
  font-family: "NunitoRegular";
  border-radius: 15px;
`;

const InputMessageWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  background-color: ${ThemeColor};
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

const ChatHeadSection = function() {
    return(
        <ChatHeadWrapper>
            <Avatar.Text size={40} label="DM" style={{marginRight: 10}}/>
            <ChatHeadInfo>
                <ChatHeadUsername>Daumoe</ChatHeadUsername>
                <ChatHeadStatus>Active now</ChatHeadStatus>
            </ChatHeadInfo>
            <ChatHeadOption>
                <IconButton icon="dots-vertical" color={"#FFFFFF"}></IconButton>
            </ChatHeadOption>
        </ChatHeadWrapper>
    );
}

const ChatSection = function() {
    return(
        <ChatScreenWrapper>
            {Array(30).fill(1).map(function(v, index) {
                return (
                    <ChatMessageWrapper key={index} sender={index%2}>
                        {index%2 === 0 ? <Avatar.Text size={35} label={"ff"} style={{marginRight: 10}}/> : undefined}
                        <ChatMessage onLongPress={() => console.log("Long press")}>
                            <Text>Hi man! {v} {index} lhjasd</Text>
                        </ChatMessage>
                    </ChatMessageWrapper>
                )
            })}
        </ChatScreenWrapper>
    );
}

const InputMessageSection = function() {
    return (
        <InputMessageWrapper>
            <InputMessage placeholder="Type your message"/>
            <IconButton icon="send" style={{transform: [{rotate: '-30deg'}]}} size={25} onPress={() => console.log("Sending...")} animate={true} color={"#E4E4E4"}/>
        </InputMessageWrapper>
    );
}

const ChatScreen = function(props) {
    const { width, height } = Dimensions.get("window");
    return (
        <>
            <ChatHeadSection/>
            <ChatSection/>
            <InputMessageSection/>
        </>
    );
}

export default ChatScreen;