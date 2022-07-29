import React, {useRef, useState} from "react";
import {
    ActivityIndicator,
    Button, DefaultTheme,
    FAB,
    HelperText,
    IconButton,
    Modal,
    Portal,
    Provider,
    withTheme
} from "react-native-paper";
import styled from "styled-components/native";
import { FlatGrid } from "react-native-super-grid";
import {RichEditor, RichToolbar, actions} from "react-native-pell-rich-editor";
import {
    Alert,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    PermissionsAndroid,
    Platform,
    SafeAreaView,
    ScrollView,
    Text, ToastAndroid, TouchableOpacity,
    View
} from "react-native";
import {launchCamera, launchImageLibrary} from "react-native-image-picker";
import {useNavigation} from "@react-navigation/native";
import {axiosConfig} from "../ReduxSaga/AxiosConfig";
import {NEW_POST} from "../API_Definition";

const CreatePostScreen = function(props) {
    const { colors }                    = props.theme;
    const navigation                    = useNavigation();
    const { width , height }            = Dimensions.get("window");
    const [listMedia, addMedia]         = useState([]);
    const [loading, setLoading]         = useState(false);
    const [content, setContent]         = useState("");
    const [showSelectModal, setShow]    = useState(false);

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
                        "quality": 1,
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
                        "quality": 1,
                        "includeBase64": true
                    });
                    HandleImage(result);
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
            addMedia([...listMedia, {
                content: avatarBase64,
                type: result.assets[0].fileName
            }]);
        }
    }

    const CreatePost = function() {
        if (content.trim() === "") {
            ToastAndroid.show("Write something huh?", ToastAndroid.LONG);
            return;
        }
        setLoading(true);
        axiosConfig(NEW_POST, "post", {
            title: "",
            content: content,
            media: listMedia
        })
            .then(r => {
                ToastAndroid.show(r.data.description, ToastAndroid.LONG);
                navigation.pop();
            })
            .catch(e => {
                ToastAndroid.show(`Sorry, trouble now: ${e.message}`, ToastAndroid.LONG);
                console.error(e);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const DeleteMedia = function(index) {
        let CopyMedias = [...listMedia];
        CopyMedias.splice(index, 1);
        addMedia(CopyMedias);
    }

    const ConfirmDeleteMedia = function(index) {
        Alert.alert(
            "Delete?",
            "This image will be removed",
            [{
                text: "Delete",
                onPress: () => DeleteMedia(index)
            }, {
                text: "Cancel",
                style: "cancel"
            }]
        )
    }

    const MediaItem = function(props) {
        const { item } = props;
        return (
            <TouchableOpacity onLongPress={() => ConfirmDeleteMedia(item.index)}>
                <Image source={{uri: item.item.content}} style={{width: (width-10)/2, height: 150, resizeMode: "contain"}}/>
            </TouchableOpacity>
        )
    }

    const richText = useRef();
    return(
        <>
            <View>
                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 10,
                    alignItems: "center",
                    backgroundColor: "white"
                }}>
                    <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                        <IconButton onPress={() => {!loading ? navigation.pop() : null}} icon="keyboard-backspace"/>
                        <Text style={{
                            fontFamily: "NunitoExtraBold",
                            color: colors.text,
                            fontSize: 20
                        }}>New Post</Text>
                    </View>
                    <Button
                        loading={loading}
                        disabled={loading}
                        onPress={CreatePost}
                        uppercase={false}
                        mode="text"
                        color="white"
                        style={{
                            backgroundColor: colors.positiveBgColor,
                            borderRadius: 5
                        }}
                    >{loading ? "Creating" : "Create"}</Button>
                </View>
                <RichToolbar
                    disabled={loading}
                    editor={richText}
                />
                <RichEditor
                    disabled={loading}
                    ref={richText}
                    pasteAsPlainText
                    placeholder="How are you today?"
                    onChange={setContent}
                />

                {listMedia.length > 0 &&
                    <>
                        <HelperText
                            style={{
                                fontStyle: "italic",
                                color: "#ad3737"
                            }}
                        >Tip: Hold to remove image</HelperText>
                        <FlatGrid
                            spacing={10}
                            data={listMedia}
                            itemDimension={150}
                            renderItem={item => (<MediaItem item={item}/>)}
                        />
                    </>
                }

            </View>
            <SelectImageSource/>
            <FAB
                disabled={loading}
                style={{
                    position: "absolute",
                    bottom: 10,
                    right: 10
                }}
                small
                icon="image-filter-center-focus-strong"
                onPress={() => setShow(true)}/>
        </>
    );
}

export default withTheme(CreatePostScreen);