import React from "react";
import {View, ScrollView, Text, Button, TextInput} from "react-native";
import styled from "styled-components/native";
import {Avatar, TextInput as TextInputRNP} from "react-native-paper";

const Theme = {
    primaryColor: "#000",
    secondaryColor: "",
    primaryTextColor: "#FFFFFF"
}

const ChatHeadSectionWrapper = styled(View)`
  background-color: ${Theme.primaryColor};
  color: ${Theme.primaryTextColor};
  display: flex;
  flex-direction: row;
  padding: 20px 15px;
  align-content: center;
`;

const ChatHeadUsername = styled(Text)`
  font-family: "NunitoBold";
  font-size: 22px;
  color: ${Theme.primaryTextColor}
`;

const SearchChatSectionWrapper = styled(View)``;

const SearchChatInput = styled(TextInput)`
  border-radius: 999999999px;
  background-color: #9A9A9A;
  padding-left: 20px;
  
`;

const ListChatSectionWrapper = styled(ScrollView)`

`;

const ChatHeadSection = function() {
    return(
        <ChatHeadSectionWrapper>
            <Avatar.Text size={35} label={"DM"} style={{marginRight: 10}}/>
            <ChatHeadUsername>Chats</ChatHeadUsername>
        </ChatHeadSectionWrapper>
    );
}

const SearchChatSection = function() {
    return(
        <SearchChatSectionWrapper>
            <SearchChatInput placeholder={"Search chat"}/>
        </SearchChatSectionWrapper>
    );
}

const ListChatSection = function() {
    return (
        <ListChatSectionWrapper>

        </ListChatSectionWrapper>
    );
}

const ListChatsScreen = function(props) {
    return(
        <>
            <ChatHeadSection/>
            <SearchChatSection/>
            <ListChatSection/>
        </>
    );
}

export default ListChatsScreen;