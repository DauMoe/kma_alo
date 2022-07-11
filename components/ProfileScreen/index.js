import React, {useEffect, useState} from "react";
import {View, Text, Image, ScrollView, PermissionsAndroid, ToastAndroid} from "react-native";
import styled from "styled-components/native";
import {axiosConfig, DEFAULT_BASE_URL} from "../ReduxSaga/AxiosConfig";
import {GET_USER_PROFILE, UPDATE_AVATAR} from "../API_Definition";
import {Button, FAB, Modal, Portal, Provider} from "react-native-paper";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from "@react-navigation/native";
import {EDIT_PROFILE_SCREEN} from "../Definition";

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

const UserProfileWrapper = styled(View)`
  margin-top: 20px;
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

const ProfileSkeleton = function() {
    return(
        <View style={{backgroundColor: "gray"}}>
            <View style={{backgroundColor: "white", width: 150, height: 150, borderRadius: 500}}></View>
        </View>
    )
}

const ProfileScreen = function(props) {
    const navigation                = useNavigation();
    const [userProfile, setProfile] = useState({
       first_name   : "",
       last_name    : "",
       username     : "",
       email        : "",
       mobile       : "",
       information  : "",
       avatar_link  : null
    });
    const [showSelectModal, setShow] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const UpdateAvatar = function() {
        console.log("Update");
        const formData = new FormData();
        formData.append("avatar", userProfile.avatar_link);
        const options = {
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }
        // try {
        //     const r = await axiosConfig(UPDATE_AVATAR, "put", options);
        //     console.log(r);
        // } catch(e) {
        //     console.error(e);
        // }
    }

    const GetImageFromCamera = function() {
        setShow(false);
        PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,{
                title: "Camera access",
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
                        "quality": 1
                    });
                    console.log(result);
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
                        console.log(result);
                        UpdateAvatar();
                        // setProfile({
                        //     ...userProfile,
                        //     avatar_link: result.assets[0].uri
                        // });
                    }
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
                        "quality": 1,
                        "includeBase64": false
                    });
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
                        UpdateAvatar();
                        // setProfile({
                        //     ...userProfile,
                        //     avatar_link: result.assets[0].uri
                        // });
                    }
                } catch(e) {
                    console.error("Launch library err: ", e);
                }
            })
            .catch(e => console.error(e))
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

    }

    const GoToEditProfile = function() {
        navigation.push(EDIT_PROFILE_SCREEN);
    }

    useEffect(function() {
        setLoading(true);
        axiosConfig(GET_USER_PROFILE, "get")
            .then(r => {
                setProfile({
                    ...r.data.data.user_data,
                    avatar_link: `${DEFAULT_BASE_URL}${r.data.data.user_data.avatar_link}`
                });
            })
            .catch(e => console.error(e))
            .finally(() => {
                setLoading(false);
            })
    }, []);

    if (isLoading) return (<ProfileSkeleton/>);

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
                    <Image
                        style={{width: 150, height: 150, borderRadius: 200, borderWidth: 2, borderColor: "black"}}
                        source={{uri: `${userProfile.avatar_link}`}}/>
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
            </UserProfileWrapper>
            <SelectImageSource/>
        </>
    );
}

export default ProfileScreen;