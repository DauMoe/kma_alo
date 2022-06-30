import React from "react";
import {View, Text, ScrollView, TextInput} from "react-native";
import styled from "styled-components/native";
import {Avatar, IconButton } from "react-native-paper";

const ChatScreenWrapper = styled(ScrollView)`
  padding: 0 15px;
`;

const ChatMessageWrapper = styled(View)`
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  align-self: ${props => props.sender ? "flex-end" : "flex-start"};
`;

const ChatMessage = styled(View)`
  padding: 8px 10px;
  background-color: blueviolet;
  font-size: 16px;
  font-family: "NunitoRegular";
  border-radius: 15px;
`;

const InputMessageWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  background-color: aqua;
  align-items: center;
`;

const InputMessage = styled(TextInput)`
  flex: 1;
  margin: 0 0 0 10px;
  padding: 5px 10px;
  border-radius: 50px;
  background-color: rgba(41,40,42,0.69);
`;

const ChatSection = function() {
    return(
        <ChatScreenWrapper>
            {Array(30).fill(1).map(function(v, index) {
                return (
                    <ChatMessageWrapper key={index} sender={index%2}>
                        {index%2 === 0 ? <Avatar.Text size={35} label={"ff"} style={{marginRight: 5}}/> : undefined}
                        <ChatMessage>
                            <Text>Hi man! {v} {index} lhjasd</Text>
                        </ChatMessage>
                        {index%2 === 0 ? undefined : <Avatar.Text size={35} label={"ff"} style={{marginLeft: 5}}/>}
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
            <IconButton icon="send-circle" size={35} onPress={() => console.log("Sending...")} iconColor={"white"}/>
        </InputMessageWrapper>
    );
}

const ChatScreen = function(props) {

    return (
        <>
            <ChatSection/>
            <InputMessageSection/>
        </>
    );
}

export default ChatScreen;