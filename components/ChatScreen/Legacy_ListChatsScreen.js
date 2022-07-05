import React, {useEffect, useState} from "react";
import {View, ScrollView, Text, Button, TextInput, Dimensions, TouchableOpacity} from "react-native";
import styled from "styled-components/native";
import {Avatar, IconButton, TextInput as TextInputRNP} from "react-native-paper";
import {useDispatch, useSelector} from "react-redux";
import {GetListChats} from "../ReduxSaga/Chat/Actions";
import {CHAT_SCREEN} from "../Definition";
import {err} from "react-native-svg/lib/typescript/xml";

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

const PreviewChatWrapper = styled(View)`
    padding: 15px 10px 0 10px;
    background-color: transparent;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const PreviewChatContent = styled(View)`
    flex: 1;
`;

const ChatUsername = styled(Text)`
  font-family: "NunitoBold";
  font-size: 18px
`;

const PreviewMessage = styled(Text)`
  font-family: "NunitoRegular";
`;

const ListChatSection = function({data, navigation}) {
    const GotoChatScreen = function(chatInfo) {
        navigation.navigate(CHAT_SCREEN, {
            chatInfo: chatInfo
        });
    }

    return (
        <ListChatSectionWrapper>

            {Array.isArray(data) && data.map(function(chat, index) {
                return(
                    <TouchableOpacity onPress={() => GotoChatScreen(chat)} key={"__chat_no_" + index}>
                        <PreviewChatWrapper>
                            {
                                chat.avatar === "" && <Avatar.Text size={50} label={chat.avatar_text} style={{marginRight: 10}}/>
                            }
                            <PreviewChatContent>
                                <ChatUsername>{chat.first_name} {chat.last_name}</ChatUsername>
                                <PreviewMessage>hey hey hey</PreviewMessage>
                            </PreviewChatContent>
                            {/*<IconButton icon="check-circle" size={15} color={"gray"}/>*/}
                            <IconButton icon="check-circle-outline" size={15} color={"gray"}/>
                        </PreviewChatWrapper>
                    </TouchableOpacity>
                )
            })}

        </ListChatSectionWrapper>
    );
}

const Legacy_ListChatsScreen = function(props) {
    const { navigation }                        = props;
    const { width, height }                     = Dimensions.get("window");
    const dispatch                              = useDispatch();
    const { loaded, error, error_msg, data }    = useSelector(state => state.Chats);

    useEffect(function() {
        dispatch(GetListChats());
    }, []);

    if (!loaded) {
        return(
          <View style={{height: height, display: "flex", alignContent: "center", justifyContent: "center"}}><Text style={{color: "black"}}>Loading...</Text></View>
        );
    }

    if (loaded && !error) {
        return(
            <>
                <ChatHeadSection/>
                <SearchChatSection/>
                <ListChatSection data={data.data.data} navigation={navigation}/>
            </>
        );
    }

    if (error) {
        return(
            <View>{error_msg}</View>
        );
    }
}

export default Legacy_ListChatsScreen;