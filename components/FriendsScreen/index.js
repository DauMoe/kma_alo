import React, {useEffect, useState} from "react";
import {View, Text, TextInput, PermissionsAndroid, ScrollView, Image} from "react-native";
import styled from "styled-components/native";
import Contacts from "react-native-contacts";
import {Avatar, Button, withTheme} from "react-native-paper";

const FriendsScreen = function(props) {
    const { colors } = props.theme;
    const [contacts, setContacts] = useState([]);

    const RecommendWrapper = styled(View)`
      padding: 20px 10px;
    `;

    const FriendsWrapper = styled(View)`
    
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

    const ShowMoreRecommendFriend = function() {

    }

    return(
        <ScrollView>
            <RecommendWrapper>
                <RecommendTitle>May you know: </RecommendTitle>
                {Array(2).fill(1).map(value => {
                    return(
                        <View style={{display: "flex", flexDirection: "row", alignItems: "center", marginTop: 10, paddingLeft: 10}}>
                            <Avatar.Text size={50} label={"DM"} style={{marginRight: 15}}/>
                            <View>
                                <Text style={{fontFamily: "NunitoSemiBold", fontSize: 18, color: colors.text}}>Daumoe</Text>
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
                {Array(2).fill(1).map(value => {
                    return(
                        <></>
                    )
                })}
            </FriendsWrapper>
        </ScrollView>
    );

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