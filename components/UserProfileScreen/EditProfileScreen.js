import React, {useEffect, useState} from "react";
import {View, Text, TextInput, ScrollView, Dimensions, ToastAndroid} from "react-native";
import styled from "styled-components/native";
import {axiosConfig, DEFAULT_BASE_URL} from "../ReduxSaga/AxiosConfig";
import {GET_USER_PROFILE, UPDATE_USER_INFO} from "../API_Definition";
import {Button, IconButton} from "react-native-paper";
import {useNavigation} from "@react-navigation/native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const Theme = {
    primaryColor: "#FFFFFF",
    secondaryColor: "#DCDCDC",
    primaryTextColor: "#333333",
    secondaryTextColor: "#878787"
}

const TopBarEditProfile = styled(View)`
  display: flex;
  flex-direction: row;
  padding: 10px 5px 10px 0;
  align-items: center;
`;

const TopBarEditProfileText = styled(Text)`
  font-family: "NunitoExtraBold";
  font-size: 28px;
  color: ${Theme.primaryTextColor}
`;

const EditProfileInfoWrapper = styled(View)`
  padding: 15px 15px 0 15px;
`;

const EditProfileTitle = styled(Text)`
  font-family: "NunitoExtraBold";
  font-size: 18px;
  color: ${Theme.primaryTextColor};
  margin-bottom: 5px;
`;

const EditProfileInput = styled(TextInput)`
    color: ${Theme.primaryTextColor};
    border-radius: 10px;
    border-style: solid;
    border-width: 2px;
    border-color: gray;
    padding-left: 15px;
    padding-right: 15px;
    font-family: "NunitoRegular";
`;

const SkeletonWrapper = styled(View)`
  height: 20px;
  width: 100px;
  border-radius: 10px;
`;

const EditProfileSkeleton = function({width, height}) {
  return(
      <View style={{padding: 20}}>
          <SkeletonPlaceholder>
              {Array(5).fill(1).map((v, index) => {
                  return(
                      <View key={"_skeleton_" + index} style={{marginBottom: 20}}>
                          <View style={{width: 100, height: 20, borderRadius: 5}}></View>
                          <View style={{width: width-40, height: 50, borderRadius: 10, marginTop: 5}}></View>
                      </View>
                  );
              })}
          </SkeletonPlaceholder>
      </View>
  );
};

const EditProfileScreen = function(props) {
    const navigation = useNavigation();
    const { width, height } = Dimensions.get("window");
    const [EditProfile, setProfile] = useState({
        first_name  : "",
        last_name   : "",
        email       : "",
        mobile      : "",
        information : "",
        username    : ""
    });
    const [isLoading, setLoading] = useState(false);

    const SaveProfile = function() {
        if (EditProfile.first_name.trim() === "") {
            ToastAndroid.show("Enter your first name!", ToastAndroid.LONG);
            return;
        }
        if (EditProfile.last_name.trim() === "") {
            ToastAndroid.show("Enter your last name!", ToastAndroid.LONG);
            return;
        }
        if (EditProfile.email.trim() === "") {
            ToastAndroid.show("Enter your email!", ToastAndroid.LONG);
            return;
        }
        if (EditProfile.mobile.trim() === "") {
            ToastAndroid.show("Enter your mobile!", ToastAndroid.LONG);
            return;
        }
        if (EditProfile.username.trim() === "") {
            ToastAndroid.show("Enter your username!", ToastAndroid.LONG);
            return;
        }
        axiosConfig(UPDATE_USER_INFO, "put", EditProfile)
            .then(r => {
                setProfile(r.data.data.user_data);
                ToastAndroid.show("Update info successful", ToastAndroid.LONG);
                navigation.goBack();
            })
            .catch(e => {
                console.log(Object.keys(e));
                console.error(JSON.stringify(e.response.data))
            });
    }

    useEffect(function() {
        setLoading(true);
        axiosConfig(GET_USER_PROFILE, "get")
            .then(r => {
                setProfile(r.data.data.user_data);
            })
            .catch(e => console.error(e))
            .finally(() => {
                setLoading(false);
            })
    }, []);

    return(
        <View>
            <TopBarEditProfile>
                <IconButton icon="chevron-left" size={35} onPress={() => navigation.goBack()} color={Theme.primaryTextColor}/>
                <TopBarEditProfileText>Edit profile</TopBarEditProfileText>
            </TopBarEditProfile>
            {isLoading
                ? <EditProfileSkeleton width={width} height={height}/>
                : <>
                    <ScrollView>
                        <EditProfileInfoWrapper>
                            <EditProfileTitle>Email:</EditProfileTitle>
                            <EditProfileInput defaultValue={EditProfile.email} onChangeText={e => setProfile({...EditProfile, email: e})}/>
                        </EditProfileInfoWrapper>
                        <EditProfileInfoWrapper>
                            <EditProfileTitle>First name:</EditProfileTitle>
                            <EditProfileInput defaultValue={EditProfile.first_name} onChangeText={e => setProfile({...EditProfile, first_name: e})}/>
                        </EditProfileInfoWrapper>
                        <EditProfileInfoWrapper>
                            <EditProfileTitle>Last name:</EditProfileTitle>
                            <EditProfileInput defaultValue={EditProfile.last_name} onChangeText={e => setProfile({...EditProfile, last_name: e})}/>
                        </EditProfileInfoWrapper>
                        <EditProfileInfoWrapper>
                            <EditProfileTitle>Username:</EditProfileTitle>
                            <EditProfileInput defaultValue={EditProfile.username} onChangeText={e => setProfile({...EditProfile, username: e})}/>
                        </EditProfileInfoWrapper>
                        <EditProfileInfoWrapper>
                            <EditProfileTitle>Mobile:</EditProfileTitle>
                            <EditProfileInput defaultValue={EditProfile.mobile} onChangeText={e => setProfile({...EditProfile, mobile: e})}/>
                        </EditProfileInfoWrapper>
                        <EditProfileInfoWrapper>
                            <EditProfileTitle>Information:</EditProfileTitle>
                            <EditProfileInput defaultValue={EditProfile.information} onChangeText={e => setProfile({...EditProfile, information: e})}/>
                        </EditProfileInfoWrapper>
                        <View style={{margin: 20}}>
                            <Button
                                icon="content-save"
                                color="white"
                                uppercase
                                onPress={SaveProfile}
                                contentStyle={{paddingTop: 3, paddingBottom: 3}}
                                style={{borderRadius: 10, backgroundColor: "#61dafb"}}>
                                Save
                            </Button>
                        </View>
                    </ScrollView>
                </>}
        </View>
    )
}

export default EditProfileScreen;