import React, { useState } from "react";
import {ActivityIndicator, Avatar, Button, withTheme} from "react-native-paper";
import { Dimensions, ScrollView, View, Text, Image, ImageBackground } from "react-native";
import styled from "styled-components";
import { useFocusEffect } from "@react-navigation/native";
import { axiosConfig, DEFAULT_BASE_URL } from "../ReduxSaga/AxiosConfig";
import { GET_USER_PROFILE } from "../API_Definition";

const ProfileScreen = function(props) {
    const { width, height }     = Dimensions.get("window");
    const { colors }            = props.theme;
    const [profileInfo, setProfile]   = useState({});
    const [listPost, setPost]   = useState([]);

    const UserProfileScreen = styled(View)`
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 20px;
        position: relative;
    `;

    const UsernameProfile = styled(Text)`
        font-family: "NunitoBold";
        font-size: 25px;
        color: #333333;
    `;

    const ForeignBackground = function({link}) {
      if (link) {
            return(
              <View style={{position: "absolute", left: 0, right: 0, top: 0, height: '70%'}}>
                  <Image source={{uri: DEFAULT_BASE_URL + link}} style={{width: '100%', height: '100%'}}/>
              </View>
            )
        }
      return <View style={{position: "absolute", left: 0, right: 0, top: 0, height: '70%', backgroundColor: colors.primary}}></View>
    }

    const FetchUserInfo = () => {
        const controller = new AbortController();
        axiosConfig(GET_USER_PROFILE, "get", {
            signal: controller.signal
        })
          .then(r => {
              setProfile(r.data.data.user_data);
          })
          .catch(e => {
              console.error(e.response)
          });
        return controller;
    }

    useFocusEffect(
      React.useCallback(() => {
          const ctrl1 = FetchUserInfo();
          return(() => {
              ctrl1.abort();
          })
      }, [])
    )

    return(
        <View style={{height: height, width: width}}>
            <ScrollView>
                <UserProfileScreen>
                    <ForeignBackground link={profileInfo.avatar_link}/>
                    {
                        profileInfo.avatar_link
                          ? <Image source={{uri: DEFAULT_BASE_URL + profileInfo.avatar_link}} style={{width: 120, height: 120, borderRadius: 99999, borderWidth: 3, borderColor: "white"}}/>
                          : <Avatar.Text size={120} label={profileInfo.avatar_text} style={{borderWidth: 3, borderColor: "white"}}/>
                    }
                    <UsernameProfile>{profileInfo.first_name} {profileInfo.last_name}</UsernameProfile>
                </UserProfileScreen>
            </ScrollView>
        </View>
    );
}

export default withTheme(ProfileScreen);
