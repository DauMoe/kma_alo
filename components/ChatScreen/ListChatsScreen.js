import React, {useEffect, useState} from "react";
import {View, ScrollView, Text, Button, TextInput, Dimensions, TouchableOpacity} from "react-native";
import styled from "styled-components/native";
import {Avatar, IconButton, TextInput as TextInputRNP} from "react-native-paper";
import {useDispatch, useSelector} from "react-redux";
import {GetListChats} from "../ReduxSaga/Chat/Actions";
import {CHAT_SCREEN} from "../Definition";
import 'moment-timezone';
import moment from "moment";

const Theme = {
    primaryColor: "#FFFFFF",
    secondaryColor: "#DCDCDC",
    primaryTextColor: "#333333",
    secondaryTextColor: "#878787"
}

const ChatHeadSectionWrapper = styled(View)`
  color: ${Theme.primaryTextColor};
  display: flex;
  flex-direction: row;
  padding: 20px 15px;
  align-content: center;
`;

const ChatHeadUsername = styled(Text)`
  font-family: "NunitoExtraBold";
  font-size: 28px;
  color: ${Theme.primaryTextColor}
`;

const SearchChatSectionWrapper = styled(View)`
  width: 100px
`;

const SearchChatInput = styled(TextInput)`
  border-radius: 999999999px;
  background-color: #9A9A9A;
  padding-left: 20px;
  
`;

const ListChatSectionWrapper = styled(ScrollView)`

`;

const PreviewChatWrapper = styled(View)`
    padding: 20px 10px 0 10px;
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
  font-size: 18px;
  color: ${Theme.primaryTextColor};
`;

const PreviewMessageWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  align-content: space-between;
  padding-right: 5px;
`;

const PreviewMessage = styled(Text)`
  font-family: "NunitoRegular";
  color: ${Theme.secondaryTextColor};
  flex: 1
`;

const MessageTime = styled(Text)`
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
                if (true) {
                    return(
                        <TouchableOpacity onPress={() => GotoChatScreen(chat)} key={"__chat_no_" + index}>
                            <PreviewChatWrapper>
                                {
                                    chat.receiver_avatar === "" && <Avatar.Text size={50} label={chat.receiver_avatar_text} style={{marginRight: 15}}/>
                                }
                                <PreviewChatContent>
                                    <ChatUsername>{chat.receiver_first_name} {chat.receiver_last_name}</ChatUsername>
                                    <PreviewMessageWrapper>
                                        <PreviewMessage>{chat.last_message}</PreviewMessage>
                                        <MessageTime>{moment(chat.last_send).isValid() && moment(chat.last_send).format("HH:MM")}</MessageTime>
                                    </PreviewMessageWrapper>
                                </PreviewChatContent>
                                {/*<IconButton icon="check-circle" size={15} color={"gray"}/>*/}
                                <IconButton icon="check-circle-outline" size={15} color={"gray"}/>
                            </PreviewChatWrapper>
                        </TouchableOpacity>
                    )
                }
            })}

        </ListChatSectionWrapper>
    );
}

const ListChatsScreen = function(props) {
    const { navigation }                        = props;
    const { width, height }                     = Dimensions.get("window");
    const dispatch                              = useDispatch();
    const { loaded, error, error_msg, data }    = useSelector(state => state.Chats);

    const ChatHeadSection = function() {
        return(
            <View style={{
                backgroundColor: Theme.primaryColor,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                paddingBottom: 10
            }}>
                <ChatHeadSectionWrapper>
                    <ChatHeadUsername>Message</ChatHeadUsername>
                </ChatHeadSectionWrapper>
                <SearchChatSectionWrapper>
                    <SearchChatInput placeholder={"Search chat"}/>
                </SearchChatSectionWrapper>
            </View>
        );
    }

    useEffect(function() {
        dispatch(GetListChats());
    }, []);

    if (!loaded) {
        return(
            <View style={{height: height, display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center"}}><Text style={{color: "black"}}>Loading...</Text></View>
        );
    }

    if (loaded && !error) {
        return(
            <>
                <ChatHeadSection/>
                <ListChatSection data={data.data.data} navigation={navigation}/>
            </>
        );
    }

    if (error) {
        return(
            <View style={{height: height, display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center"}}><Text style={{color: "black"}}>{error_msg}</Text></View>
        );
    }
}

export default ListChatsScreen;