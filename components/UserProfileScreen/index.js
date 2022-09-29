import React, {useEffect, useState} from "react";
import {View, Text, Image, ScrollView, PermissionsAndroid, ToastAndroid, Dimensions} from "react-native";
import styled from "styled-components/native";
import {axiosConfig, DEFAULT_BASE_URL} from "../ReduxSaga/AxiosConfig";
import {GET_USER_PROFILE, UPDATE_AVATAR} from "../API_Definition";
import {Avatar, Button, FAB, Modal, Portal, Provider} from "react-native-paper";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useIsFocused, useNavigation} from "@react-navigation/native";
import {CHANGE_PASS_SCREEN, EDIT_USER_PROFILE_SCREEN, LOGIN_SCREEN} from "../Definition";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { useDispatch } from "react-redux";
import { SignOutAction } from "../ReduxSaga/Authenticator/Actions";

const Theme = {
    primaryColor: "#FFFFFF",
    secondaryColor: "#DCDCDC",
    primaryTextColor: "#333333",
    secondaryTextColor: "#878787"
}

const UserProfileInfoWrapper = styled(View)`
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #D5D5D5;
  padding: 15px;
  margin: 0 10px;
`;

const UserProfileWrapper = styled(ScrollView)`
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
`

const UserProfileTitle = styled(Text)`
  color: ${Theme.primaryTextColor};
  font-family: "NunitoExtraBold";
  font-size: 18px;
`;

const UserProfileContent = styled(Text)`
  color: ${Theme.primaryTextColor};
  font-family: "NunitoRegular";
  font-size: 16px;
`;

const UserAvatarWrapper = styled(View)`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 15px;
`;

const ProfileSkeleton = function({width, height}) {
    return(
        <UserProfileTitle style={{padding: 20}}>
            <SkeletonPlaceholder>
                <View style={{display: "flex", flexDirection: "row", marginBottom: 20}}>
                    <View style={{width: 150, height: 150, borderRadius: 500}}></View>
                    <View style={{justifyContent: "center", marginLeft: 20, flex: 1}}>
                        <View style={{width: 150, height: 50, borderRadius: 500}}></View>
                    </View>
                </View>
                {Array(5).fill(1).map((v, index) => {
                    return(
                      <View key={"__indexprofile_skeleton_" + index} style={{marginTop: 10}}>
                          <View style={{width: 80, height: 30, borderRadius: 5}}></View>
                          <View style={{width: width-40, height: 50, borderRadius: 10, marginTop: 10}}></View>
                      </View>
                    );
                })}
            </SkeletonPlaceholder>
        </UserProfileTitle>
    )
}

const UserProfileScreen = function(props) {
    const navigation                = useNavigation();
    const isFocus                   = useIsFocused();
    const dispatch                  = useDispatch();
    const { width, height }         = Dimensions.get("window");
    const [userProfile, setProfile] = useState({
       first_name   : "",
       last_name    : "",
       username     : "",
       email        : "",
       mobile       : "",
       information  : "",
       avatar_link  : null
    });
    const [avatar, setAvatar] = useState({
        ready: false,
        value: ""
    });
    const [showSelectModal, setShow] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const UpdateAvatar = function(avatarBase64) {
        const formData = new FormData();
        formData.append("avatar", avatarBase64);
        const options = {
            avatarBase64: avatarBase64
        }
        setAvatar({
            ...avatar,
            ready: false
        });
        axiosConfig(UPDATE_AVATAR, "put", options)
            .then(r => {
                setAvatar({
                    ready: true,
                    value: avatarBase64
                });
            })
            .catch(e => {
                console.error("Update avatar error");
                console.log(e.response)
            });
    }

    const GetImageFromCamera = function() {
        setShow(false);
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,{
              title: "Take a shot",
              message:
                "This app would like to use your camera.",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "Allow"
          }
        )
          .then(async() => {
              try {
                  const result = await launchCamera({
                      "mediaType": "photo",
                      "cameraType": "front",
                      "quality": 0.3,
                      "includeBase64": true
                  });
                  HandleImage(result);
              } catch(e) {
                  console.error("Launch camera err: ", e);
              }
          })
          .catch(e => console.error(e))
    }

    const GetImageFromLibrary = function() {
        setShow(false);
        PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,{
                title: "Get image from library",
                message:
                    "This app would like to view your photos.",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "Allow"
            }
        )
            .then(async() => {
                try {
                    const result = await launchImageLibrary({
                        "mediaType": "photo",
                        "cameraType": "front",
                        "quality": 0.3,
                        "includeBase64": true
                    });
                    HandleImage(result);
                } catch(e) {
                    console.error("Launch library err: ", e);
                }
            })
            .catch(e => console.error(e))
    }

    const HandleImage = function(result) {
        if (result.didCancel) {
            console.info("User canceled");
        } else if (result.errorCode === "camera_unavailable") {
            ToastAndroid.show("Camera is not available", ToastAndroid.LONG);
        } else if (result.errorCode === "permission") {
            ToastAndroid.show("Please allow us access camera or gallery", ToastAndroid.LONG);
        } else if (result.errorCode === "others") {
            ToastAndroid.show(result.errorMessage, ToastAndroid.LONG);
        } else if ((result.assets[0].fileSize/1000) > 1000 * 10) {
            ToastAndroid.show("Image file is too large (Max: 10MB)", ToastAndroid.LONG);
        } else {
            const avatarBase64 = "data:image/png;base64," + result.assets[0].base64;
            UpdateAvatar(avatarBase64);
        }
    }

    const SelectImageSource = function() {
        const containerStyle = {backgroundColor: 'white', padding: 20};
        return(
            <Provider>
                <Portal>
                    <Modal visible={showSelectModal} onDismiss={() => setShow(false)} contentContainerStyle={containerStyle}>
                        <Text style={{color: "black", fontFamily: "NunitoSemiBold", fontSize: 16}}>Choose an image source:</Text>
                        <View style={{display: "flex", flexDirection: "row"}}>
                            <Button icon="camera" onPress={GetImageFromCamera} uppercase={false} style={{marginTop: 30, flex: 1}}>
                                Camera
                            </Button>
                            <Button icon="view-gallery" onPress={GetImageFromLibrary} uppercase={false} style={{marginTop: 30, flex: 1}}>
                                Gallery
                            </Button>
                        </View>
                    </Modal>
                </Portal>
            </Provider>
        );
    }

    const Logout = function() {
        dispatch(SignOutAction());
        navigation.reset({
            index: 0,
            routes: [{name: LOGIN_SCREEN}]
        });
    }

    const ChangePassword = function() {
        navigation.navigate(CHANGE_PASS_SCREEN);
    }

    const GoToEditProfile = function() {
        navigation.push(EDIT_USER_PROFILE_SCREEN);
    }

    useEffect(function() {
        setLoading(true);
        const controller = new AbortController();
        axiosConfig(GET_USER_PROFILE, "get", {
            signal: controller.signal
        })
            .then(r => {
                console.log(r);
                setAvatar({
                    ready: true,
                    value: DEFAULT_BASE_URL + r.data.data.user_data.avatar_link
                });
                setProfile(r.data.data.user_data);
            })
            .catch(e => console.error(e))
            .finally(() => {
                setLoading(false);
            });
        return(() => {
           controller.abort();
        });
    }, [props, isFocus]);

    if (isLoading) return (<ProfileSkeleton width={width} height={height}/>);

    return(
        <>
            <UserProfileWrapper>
                <UserAvatarWrapper>
                    <FAB
                        onPress={() => setShow(true)}
                        icon="pencil"
                        small
                        iconColor={"#6A6A6A"}
                        style={{position: "absolute", bottom: 0, zIndex: 1, left: 110, backgroundColor: "white"}}
                    />
                    {!avatar.ready && (
                        <View>
                            <SkeletonPlaceholder>
                                <View style={{width: 150, height: 150, borderRadius: 200, borderWidth: 2, borderColor: "black"}}></View>
                            </SkeletonPlaceholder>
                        </View>
                    )}
                    {avatar.ready && avatar.value !== "" &&
                        <Image
                            style={{width: 150, height: 150, borderRadius: 200, borderWidth: 2, borderColor: "black"}}
                            source={{uri: avatar.value}}
                            key={avatar.value}
                        />
                    }
                    {avatar.ready && avatar.value === "" &&
                        <Avatar.Text label={userProfile.avatar_text} size={150}/>
                    }
                    <View style={{alignItems: "center", justifyContent: "center", flex: 1}}>
                        <Button
                            icon="arrow-right-bold"
                            color="white"
                            uppercase={false}
                            onPress={GoToEditProfile}
                            contentStyle={{flexDirection: 'row-reverse', paddingTop: 3, paddingBottom: 3, fontStyle: "NunitoSemiBold"}}
                            style={{borderRadius: 500, backgroundColor: "#58B7E9"}}>
                            Update profile
                        </Button>
                    </View>
                </UserAvatarWrapper>

                <ScrollView style={{marginTop: 20}}>
                    <UserProfileInfoWrapper>
                        <UserProfileTitle>Email:</UserProfileTitle>
                        <UserProfileContent>{userProfile.email}</UserProfileContent>
                    </UserProfileInfoWrapper>
                    <UserProfileInfoWrapper>
                        <UserProfileTitle>First name:</UserProfileTitle>
                        <UserProfileContent>{userProfile.first_name}</UserProfileContent>
                    </UserProfileInfoWrapper>
                    <UserProfileInfoWrapper>
                        <UserProfileTitle>Last name:</UserProfileTitle>
                        <UserProfileContent>{userProfile.last_name}</UserProfileContent>
                    </UserProfileInfoWrapper>
                    <UserProfileInfoWrapper>
                        <UserProfileTitle>User name:</UserProfileTitle>
                        <UserProfileContent>{userProfile.username}</UserProfileContent>
                    </UserProfileInfoWrapper>
                    <UserProfileInfoWrapper>
                        <UserProfileTitle>Mobile:</UserProfileTitle>
                        <UserProfileContent>{userProfile.mobile}</UserProfileContent>
                    </UserProfileInfoWrapper>
                    <UserProfileInfoWrapper>
                        <UserProfileTitle>Information:</UserProfileTitle>
                        <UserProfileContent>{userProfile.information === "" ? <Text style={{fontStyle: "italic", color: "gray"}}>Nothing here</Text> : userProfile.information}</UserProfileContent>
                    </UserProfileInfoWrapper>
                </ScrollView>
                <View style={{margin: 20}}>
                    <View>
                        <Button
                          icon="key"
                          color="white"
                          uppercase={false}
                          onPress={ChangePassword}
                          contentStyle={{flexDirection: 'row-reverse', paddingTop: 3, paddingBottom: 3}}
                          style={{borderRadius: 10, backgroundColor: "#4ec0fc"}}>
                            CHANGE PASSWORD
                        </Button>
                    </View>
                    <View style={{marginTop: 20}}>
                        <Button
                          icon="logout"
                          color="white"
                          uppercase={false}
                          onPress={Logout}
                          contentStyle={{flexDirection: 'row-reverse', paddingTop: 3, paddingBottom: 3}}
                          style={{borderRadius: 10, backgroundColor: "#DC0000"}}>
                            LOGOUT
                        </Button>
                    </View>
                </View>
            </UserProfileWrapper>
            <SelectImageSource/>
        </>
    );
}

export default UserProfileScreen;
