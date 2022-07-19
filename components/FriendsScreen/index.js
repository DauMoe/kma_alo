import React, {useEffect, useState} from "react";
import {View, Text, TextInput, PermissionsAndroid, Button, ScrollView, Image} from "react-native";
import styled from "styled-components/native";
import Contacts from "react-native-contacts";
import {Avatar} from "react-native-paper";

const FriendsScreen = function(props) {
    const [contacts, setContacts] = useState([]);

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

    const RecommendSection = () => {
        return (
          <>
              {Array(10).fill(1).map(value => {
                  return(
                      <View style={{display: "flex", flexDirection: "row", alignItems: "center", marginTop: 10, paddingLeft: 10}}>
                        <Avatar.Text size={40} label={"DM"} style={{marginRight: 10}}/>
                        <Text style={{fontFamily: "NunitoExtraBold", fontSize: 20}}>Daumoe</Text>
                          <View style={{display: "flex"}}>

                          </View>
                      </View>
                  )
              })}
          </>
        );
    }

    return(
        <ScrollView>
            <RecommendSection/>
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

export default FriendsScreen;