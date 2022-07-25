import React, {useEffect, useState} from "react";
import {View, Text, TextInput, PermissionsAndroid, ScrollView, Image} from "react-native";
import styled from "styled-components/native";
import Contacts from "react-native-contacts";
import {Avatar, Button, withTheme} from "react-native-paper";
import {axiosConfig, DEFAULT_BASE_URL} from "../ReduxSaga/AxiosConfig";
import {GET_LIST_FRIENDS, GET_RECOMMEND_FRIENDS} from "../API_Definition";

const FriendsScreen = function(props) {
    const { colors } = props.theme;
    const [contacts, setContacts] = useState([]);
    const [listFriends, setListFriends] = useState([]);

    const RecommendWrapper = styled(View)`
      padding: 20px 10px;
    `;

    const FriendsWrapper = styled(View)`
      padding: 0 10px;
    `;

    const RecommendTitle = styled(Text)`
      color: ${colors.text};
      font-family: "NunitoBold";
      font-size: 20px;
    `;

    useEffect(function() {
        /***
         * @TODO
         * @First: create action with side effects to check new contact
         * @Second: display new contact from response data
         */

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
                .then(c => {
                    setContacts(c);
                })
                .catch(e => {
                    console.error("C: ", e);
                })
        }).catch(e => {
            console.error("Grant per err: ", e);
        });
    }, []);

    useEffect(function() {
        const GetListFriends = axiosConfig(GET_LIST_FRIENDS, "get");
        const GetRecommendFriends = axiosConfig(GET_RECOMMEND_FRIENDS, "post");
        Promise.all([GetListFriends, GetRecommendFriends])
            .then(r => {
                setListFriends(r[0].data.data.list_friends);
            })
            .catch(e => {
                console.error(e);
            });
        // axiosConfig(GET_LIST_FRIENDS, "get")
        //     .then(r => {
        //         setListFriends(r.data.data.list_friends);
        //     })
        //     .catch(e => console.log(e));
    }, []);

    const ShowMoreRecommendFriend = function() {

    }

    return(
        <ScrollView>
            <RecommendWrapper>
                <Text style={{color: colors.text, fontFamily: "NunitoBold", fontSize: 18}}>Maybe you know:</Text>
                {Array(2).fill(1).map((value, index) => {
                    return(
                        <View key={"_recommend_friend_" + index} style={{display: "flex", flexDirection: "row", alignItems: "center", marginTop: 10, paddingLeft: 10}}>
                            <Avatar.Text size={50} label={"DM"} style={{marginRight: 15}}/>
                            <View>
                                <Text style={{fontFamily: "NunitoBold", fontSize: 16, color: colors.text}}>Daumoe</Text>
                                <View style={{display: "flex", flexDirection: "row", marginTop: 5}}>
                                    <Button raised uppercase={false} style={{borderRadius: 5, backgroundColor: colors.positiveBgColor, marginRight: 15}} color={colors.positiveTextColor} mode="text">
                                        Add friend
                                    </Button>
                                    <Button raised uppercase={false} style={{borderRadius: 5, backgroundColor: colors.negativeBgColor}} color={colors.negativeTextColor} mode="text">
                                        Remove
                                    </Button>
                                </View>
                            </View>
                        </View>
                    )
                })}
                <Button uppercase={false} style={{marginTop: 10}} onPress={ShowMoreRecommendFriend} mode="text">See more</Button>
            </RecommendWrapper>
            <FriendsWrapper>
                <Text style={{color: colors.text, fontFamily: "NunitoBold", fontSize: 18}}>Friends:</Text>
                {listFriends.map((friend, index) => {
                    return(
                        <View key={"_list_friend_" + index} style={{display: "flex", flexDirection: "row", alignItems: "center", marginTop: 10, paddingLeft: 10}}>
                            {friend.avatar_link === ""
                                ? <Avatar.Text size={50} label={friend.avatar_text} style={{marginRight: 15}}/>
                                : <Image source={{uri: DEFAULT_BASE_URL + friend.avatar_link}} style={{width: 50, height: 50, borderRadius: 99999, marginRight: 15}}/>}
                            <View>
                                <Text style={{fontFamily: "NunitoBold", fontSize: 18, color: colors.text}}>{friend.display_name}</Text>
                            </View>
                        </View>
                    )
                })}
            </FriendsWrapper>
        </ScrollView>
    )

    // return(
    //     <ScrollView>
    //         {contacts.map((contact, index) => {
    //             return(
    //               <Text key={index} style={{color: "black"}}>{JSON.stringify(contact.phoneNumbers[0])}</Text>
    //             );
    //         })}
    //     </ScrollView>
    // );
}

export default withTheme(FriendsScreen);