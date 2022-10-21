import React, {useCallback, useEffect, useState} from "react";
import {
  View,
  Text,
  TextInput,
  PermissionsAndroid,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList
} from "react-native";
import styled from "styled-components/native";
import Contacts from "react-native-contacts";
import {ActivityIndicator, Avatar, Button, withTheme} from "react-native-paper";
import {axiosConfig, DEFAULT_BASE_URL} from "../ReduxSaga/AxiosConfig";
import {
  ACCEPT_FRIEND,
  ADD_FRIEND,
  CANCEL_FRIEND,
  GET_LIST_FRIENDS,
  GET_RECOMMEND_FRIENDS,
  GET_USER_PROFILE,
  SEARCH_FRIEND,
} from "../API_Definition";
import {useIsFocused, useNavigation} from "@react-navigation/native";
import FriendSkeleton from "./FriendSkeleton";
import {PROFILE_SCREEN} from "../Definition";
import lodash from 'lodash';

const Theme = {
  primaryColor: "#FFFFFF",
  secondaryColor: "#DCDCDC",
  primaryTextColor: "#333333",
  secondaryTextColor: "#878787",
  helpTextColor: "#b2b2b2"
}

const FriendsScreen = function(props) {
    const { colors } = props.theme;
    const [listFriends, setListFriends] = useState([]);
    const [pendingRequest, setListPendingRequest] = useState([]);
    const [listRecommendFriends, setRecommends] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    const [isLoading, setLoading] = useState(true);
    const isFocus = useIsFocused();
    const navigation = useNavigation();
    const [triggerReRender, setReRender] = useState(false);
    const { width, height } = Dimensions.get("window");
    const [searchResult, setResult]             = useState([]);
    const [searchChat, setSearchChat]           = useState("");

    const RecommendWrapper = styled(View)`
      padding: 20px 0px;
    `;

    const FriendsWrapper = styled(View)`
      padding: 0 20px;
      margin-top: 20px;
    `;

    const SearchChatSectionWrapper = styled(View)`
      width: 100%;
      padding: 0 0 10px 0;
    `;

    const SearchChatInput = styled(TextInput)`
      padding-left: 20px;
      border-radius: 999999999px;
      background-color: #efefef;
      color: #626262;
    `;

    const RecommendTitle = styled(Text)`
      color: ${colors.text};
      font-family: "NunitoBold";
      font-size: 20px;
    `;

    const ChatUsername = styled(Text)`
      font-family: "NunitoBold";
      font-size: 18px;
      color: ${Theme.primaryTextColor};
    `;

    const PreviewChatWrapper = styled(View)`
      padding: 20px 10px 0 10px;
      background-color: transparent;
      display: flex;
      flex-direction: row;
      align-items: center;
    `;

    useEffect(function() {
      /***
       * @TODO
       * @First: create action with side effects to check new contact
       * @Second: display new contact from response data
       */

      const controller = new AbortController();
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: "Contacts Permission",
          message:
            "This app would like to view your contacts.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "Allow"
        }
      ).then(r => {
        Contacts.getAll()
          .then(contacts => {
            const ListContact = [];
            for (const contact of contacts) {
              if (contact.phoneNumbers[0]?.number) {
                ListContact.push({
                  mobile: contact.phoneNumbers[0].number.replace(/ /g,''),
                });
              }
            }
            // console.log(ListContact);
            const GetListFriends = axiosConfig(GET_LIST_FRIENDS, "get", {
              signal: controller.signal
            });
            const GetRecommendFriends = axiosConfig(GET_RECOMMEND_FRIENDS, "post", {
              list_contacts: ListContact,
              signal: controller.signal
            });
            const GetUserInfo = axiosConfig(GET_USER_PROFILE, "get", {
              signal: controller.signal
            });
            Promise.all([GetListFriends, GetRecommendFriends, GetUserInfo])
              .then(r => {
                setListFriends(r[0].data.data.list_friends);
                setListPendingRequest(r[0].data.data.pending_request);
                setRecommends(r[1].data.data.recommend_friends);
                setUserInfo(r[2].data.data.user_data);
              })
              .catch(e => {
                console.error(e.response.data);
              })
              .finally(() => setLoading(false));
          })
          .catch(e => {
              console.error("C: ", e);
              setLoading(false);
          })
      }).catch(e => {
        console.error("Grant per err: ", e);
        setLoading(false);
      });
      return(() => {
        controller.abort();
      })
    }, [isFocus, triggerReRender]);

    const _findFriend = function(query) {
      axiosConfig(SEARCH_FRIEND, "get", {
        params: {
          q: query
        }
      })
        .then(r => {
          setResult(r.data.data.result);
        })
        .catch(e => console.log(e.response));
    }

    const _findFriendDebounce = useCallback(lodash.debounce(_findFriend, 500), []);

    const SearchChat = function(e) {
      setSearchChat(e??"");
      const query = e  ?? searchChat;
      if (query === "") {
        setResult([]);
      } else {
        _findFriendDebounce(query);
      }
    }

    const AddFriend = function(uid) {
      axiosConfig(ADD_FRIEND, "post", {
        uid: uid
      })
        .then(r => {
          setReRender(!triggerReRender);
        })
        .catch(e => console.error(e));
    }

    const CancelFriendRequest = function(uid) {
      axiosConfig(CANCEL_FRIEND, "delete", {
        data: {
          uid: uid
        }
      })
        .then(r => {
          setReRender(!triggerReRender);
        })
        .catch(e => console.error(e.response.data));
    }

    const AcceptFriendRequest = function(uid) {
      axiosConfig(ACCEPT_FRIEND, "post", {
        uid: uid
      })
        .then(r => {
          setReRender(!triggerReRender);
        })
        .catch(e => console.error(e.response.data));
    }

    const Go2Profile = function(friend_data) {
      navigation.push(PROFILE_SCREEN, {
        uid: friend_data.uid
      });
    }

    if (isLoading) return <FriendSkeleton/>;

    return(
      <>
        <FriendsWrapper>
          <SearchChatInput placeholderTextColor={"#b4b4b4"} onChangeText={SearchChat} placeholder={"Find friends ..."}/>
        </FriendsWrapper>
        {
          (Array.isArray(searchResult) && searchResult.length > 0)
           ?
            <FlatList
              // refreshing={false}
              // onRefresh={SearchChat}
              ListEmptyComponent={<View style={{height: 200, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}><Text style={{color: "black", fontFamily: "NunitoSemiBold", fontSize: 16}}>No result</Text></View>}
              data={searchResult}
              renderItem={({item, index}) => (
                <TouchableOpacity onPress={() => Go2UserProfile()} key={"__chat_no_" + index}>
                  <PreviewChatWrapper>
                    {item.avatar_link === ""
                      ? <Avatar.Text size={50} label={item.avatar_link} style={{ marginRight: 15 }} />
                      : <Image source={{ uri: DEFAULT_BASE_URL + item.avatar_link }} style={{ width: 50, height: 50, borderRadius: 99999, marginRight: 15 }} />
                    }
                    <PreviewChatContent>
                      <ChatUsername>{item.display_name}</ChatUsername>
                    </PreviewChatContent>
                  </PreviewChatWrapper>
                </TouchableOpacity>
              )}
            />
           : 
           <>
            <FriendsWrapper>
              <Text style={{color: colors.text, fontFamily: "NunitoBold", fontSize: 18}}>You:</Text>
              <View style={{display: "flex", flexDirection: "row", alignItems: "center", marginTop: 10, paddingLeft: 10}}>
                {userInfo.avatar_link === ""
                  ? <Avatar.Text size={50} label={userInfo.avatar_text} style={{marginRight: 15}}/>
                  : <Image source={{uri: DEFAULT_BASE_URL + userInfo.avatar_link}} style={{width: 50, height: 50, borderRadius: 99999, marginRight: 15}}/>}
                <View>
                  <TouchableOpacity onPress={() => Go2Profile(userInfo)}>
                    <Text style={{fontFamily: "NunitoBold", fontSize: 18, color: colors.text}}>{userInfo.first_name + " " + userInfo.last_name}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </FriendsWrapper>
            <ScrollView style={{height: 300}}>
              {(listRecommendFriends.length > 0 || pendingRequest.length > 0) &&
                <FriendsWrapper>
                  <Text style={{color: colors.text, fontFamily: "NunitoBold", fontSize: 18}}>May you know:</Text>
                  {pendingRequest.map((data, index) => {
                    return(
                      <View key={"_pending_friend_" + index} style={{display: "flex", flexDirection: "row", alignItems: "center", marginTop: 10, paddingLeft: 10}}>
                        {data.avatar_link === ""
                          ? <Avatar.Text size={50} label={data.avatar_text} style={{marginRight: 15}}/>
                          : <Image source={{uri: DEFAULT_BASE_URL + data.avatar_link}} style={{width: 50, height: 50, borderRadius: 99999, marginRight: 15}}/>}
                        <View>
                          <TouchableOpacity onPress={() => Go2Profile(data)}>
                            <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                              <Text style={{fontFamily: "NunitoBold", fontSize: 16, color: colors.text}}>
                                {data.first_name} {data.last_name}&nbsp;
                              </Text>
                              <Text style={{fontFamily: "NunitoRegular", fontSize: 10, color: colors.text}}>(Pending request)</Text>
                            </View>
                          </TouchableOpacity>
                          <View style={{display: "flex", flexDirection: "row", marginTop: 5}}>
                            {
                              data.type === "PENDING" ?
                                <Button raised onPress={_ => CancelFriendRequest(data.uid)} uppercase={false} style={{borderRadius: 5, backgroundColor: colors.negativeBgColor}} color={colors.negativeTextColor} mode="text">
                                  Cancel request
                                </Button>
                              :
                                <Button raised onPress={_ => AcceptFriendRequest(data.uid)} uppercase={false} style={{borderRadius: 5, backgroundColor: colors.acceptRequestColor}} color={colors.negativeTextColor} mode="text">
                                  Accept request
                                </Button>
                            }
                          </View>
                        </View>
                      </View>
                    )
                  })}
    
                  {listRecommendFriends.map((data, index) => {
                    return(
                      <View key={"_recommend_friend_" + index} style={{display: "flex", flexDirection: "row", alignItems: "center", marginTop: 10, paddingLeft: 10}}>
                        {data.avatar_link === ""
                          ? <Avatar.Text size={50} label={data.avatar_text} style={{marginRight: 15}}/>
                          : <Image source={{uri: DEFAULT_BASE_URL + data.avatar_link}} style={{width: 50, height: 50, borderRadius: 99999, marginRight: 15}}/>}
                        <View>
                          <TouchableOpacity onPress={() => Go2Profile(data)}>
                            <Text style={{fontFamily: "NunitoBold", fontSize: 16, color: colors.text}}>{data.first_name} {data.last_name}</Text>
                          </TouchableOpacity>
                          <View style={{display: "flex", flexDirection: "row", marginTop: 5}}>
                            <Button raised uppercase={false} style={{borderRadius: 5, backgroundColor: colors.positiveBgColor, marginRight: 15}} color={colors.positiveTextColor} mode="text" onPress={() => AddFriend(data.uid)}>
                              Add friend
                            </Button>
                            {/*<Button raised uppercase={false} style={{borderRadius: 5, backgroundColor: colors.negativeBgColor}} color={colors.negativeTextColor} mode="text">*/}
                            {/*  Remove*/}
                            {/*</Button>*/}
                          </View>
                        </View>
                      </View>
                    )
                  })}
                  {/*<Button uppercase={false} style={{marginTop: 10}} onPress={ShowMoreRecommendFriend} mode="text">See more</Button>*/}
                </FriendsWrapper>
              }
              <FriendsWrapper>
                <Text style={{color: colors.text, fontFamily: "NunitoBold", fontSize: 18}}>Friends:</Text>
                {listFriends.length === 0 && <Text style={{
                  fontFamily: "NunitoSemiBold",
                  fontSize: 16,
                  color: colors.text,
                  textAlign: "center",
                  marginTop: 10
                }}>Ops! Seem like you have no friend. Find someone!</Text>}
                {listFriends.map((friend, index) => {
                  return(
                    <View key={"_list_friend_" + index} style={{display: "flex", flexDirection: "row", alignItems: "center", marginTop: 10, paddingLeft: 10}}>
                      {friend.avatar_link === ""
                        ? <Avatar.Text size={50} label={friend.avatar_text} style={{marginRight: 15}}/>
                        : <Image source={{uri: DEFAULT_BASE_URL + friend.avatar_link}} style={{width: 50, height: 50, borderRadius: 99999, marginRight: 15}}/>}
                      <View>
                        <TouchableOpacity onPress={() => Go2Profile(friend)}>
                          <Text style={{fontFamily: "NunitoBold", fontSize: 18, color: colors.text}}>{friend.display_name}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )
                })}
                </FriendsWrapper>
            </ScrollView>
           </>

        }
      </>
    )
}

export default withTheme(FriendsScreen);
