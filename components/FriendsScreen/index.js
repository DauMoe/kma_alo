import React, {useEffect, useState} from "react";
import {View, Text, TextInput, PermissionsAndroid, Button, ScrollView} from "react-native";
import styled from "styled-components/native";
import Contacts from "react-native-contacts";

// PermissionsAndroid.request(
//     PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
//     {
//         'title': 'Contacts',
//         'message': 'This app would like to view your contacts.',
//         'buttonPositive': 'Please accept bare mortal'
//     }
// )
//     .then(Contacts.getAll()
//         .then((contacts) => {
//             // work with contacts
//             console.log(contacts)
//         })
//         .catch((e) => {
//             console.log(e)
//         }))

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

    return(
        <ScrollView>
            {contacts.map((contact, index) => {
                return(
                  <Text key={index} style={{color: "black"}}>{JSON.stringify(contact.phoneNumbers[0])}</Text>
                );
            })}
        </ScrollView>
    );
}

export default FriendsScreen;