import React, {useEffect, useRef, useState} from "react";
import {View, ScrollView, Text, Button, TextInput, Dimensions, TouchableOpacity, Image} from "react-native";
import styled from "styled-components/native";
import {Avatar, IconButton, TextInput as TextInputRNP} from "react-native-paper";
import {useDispatch, useSelector} from "react-redux";
import {GetListChats} from "../ReduxSaga/Chat/Actions";
import {CHAT_SCREEN} from "../Definition";
import 'moment-timezone';
import moment from "moment";
import {useNavigation} from "@react-navigation/native";
import lodash from "lodash";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {DEFAULT_BASE_URL} from "../ReduxSaga/AxiosConfig";

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
  width: 100%;
  padding: 0 20px 10px 20px;
`;

const SearchChatInput = styled(TextInput)`
  padding-left: 20px;
  border-radius: 999999999px;
  background-color: #efefef;
  color: #626262;
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

const LoadingChatScreen = function() {
    return (
        <>
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
                    <SkeletonPlaceholder>
                        <View style={{height: 50, borderRadius: 999999, paddingLeft: 40, paddingRight: 40}}></View>
                    </SkeletonPlaceholder>
                </SearchChatSectionWrapper>
            </View>
            <ListChatSectionWrapper>
                <SkeletonPlaceholder>
                    {Array(10).fill(1).map(function(v, index) {
                        return(
                            <View key={"_loading_chat_" + index} style={{paddingTop: 20, paddingLeft: 20, display: "flex", flexDirection: "row"}}>
                                <View style={{width: 50, height: 50, marginRight: 15, borderRadius: 9999}}></View>
                                <View style={{flex: 1, paddingRight: 30}}>
                                    <View style={{height: 20, width: 100, borderRadius: 10}}></View>
                                    <View style={{height: 20, marginTop: 10, borderRadius: 10}}></View>
                                </View>
                            </View>
                        );
                    })}
                </SkeletonPlaceholder>
            </ListChatSectionWrapper>
        </>
    );
}

const ListChatsScreen = function(props) {
    const navigation                            = useNavigation();
    const { width, height }                     = Dimensions.get("window");
    const dispatch                              = useDispatch();
    const { loaded, error, error_msg, data }    = useSelector(state => state.Chats);
    const [ListChat, setListChat]               = useState([]);
    const [searchChat, setSearchChat]           = useState("");
    const isMount = useRef();

    const GotoChatScreen = function(chatInfo) {
        navigation.navigate(CHAT_SCREEN, {
            chatInfo: chatInfo
        });
    }

    const SearchChat = function(e) {
        setSearchChat(e);
        const FilterChat = lodash.filter(data, chat => chat.display_name.toLowerCase().indexOf(e.toLowerCase()) > -1);
        setListChat(FilterChat);
    }

    useEffect(function() {
        if (!isMount.current) {
            dispatch(GetListChats());
            isMount.current = true;
        } else {
            if (loaded && !error) {
                setListChat(data);
            }
        }
    }, [data]);

    useEffect(function() {
        const unsub = navigation.addListener('focus', () => {
            dispatch(GetListChats());
        });
        return unsub;
    }, [navigation]);

    if (!loaded) return <LoadingChatScreen/>

    if (loaded && !error) {
        return(
            <>
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
                        <SearchChatInput placeholderTextColor={"#b4b4b4"} onChangeText={SearchChat} placeholder={"Search chat"}/>
                    </SearchChatSectionWrapper>
                </View>

                <ListChatSectionWrapper>
                    {Array.isArray(ListChat) && ListChat.map(function(chat, index) {
                        return(
                            <TouchableOpacity onPress={() => GotoChatScreen(chat)} key={"__chat_no_" + index}>
                                <PreviewChatWrapper>
                                    { chat.receiver_avatar === ""
                                        ? <Avatar.Text size={50} label={chat.receiver_avatar_text} style={{marginRight: 15}}/>
                                        : <Image source={{uri: DEFAULT_BASE_URL + chat.receiver_avatar}} style={{width: 50, height: 50, borderRadius: 99999, marginRight: 15}}/>
                                    }
                                    <PreviewChatContent>
                                        <ChatUsername>{chat.display_name}</ChatUsername>
                                        <PreviewMessageWrapper>
                                            <PreviewMessage>{chat.last_message}</PreviewMessage>
                                            <MessageTime>{moment(chat.last_send).isValid() && moment(chat.last_send).format("HH:MM")}</MessageTime>
                                        </PreviewMessageWrapper>
                                    </PreviewChatContent>
                                    {/*<IconButton icon="check-circle" size={15} color={"gray"}/>*/}
                                    {/*<IconButton icon="check-circle-outline" size={15} color={"gray"}/>*/}
                                </PreviewChatWrapper>
                            </TouchableOpacity>
                        )
                    })}
                </ListChatSectionWrapper>
            </>
        );
    }

    if (error) {
        return(
            <View style={{height: height, display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center"}}><Text style={{color: "red"}}>{error_msg}</Text></View>
        );
    }
}

export default ListChatsScreen;