import React, { useState } from "react";;
import styled from "styled-components/native";
import { View, Text, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Dimensions, ToastAndroid, ImageBackground } from "react-native";
import { Button, AnimatedFAB } from "react-native-paper";
import { MAIN_SCREEN } from "../ScreenName";
import {axiosConfig} from "../ReduxSaga/AxiosConfig";
import AsyncStorageNpm from "@react-native-async-storage/async-storage";
import BgImage from "./../Media/login_background.svg";
import { TextInput as TextInputRNPaper } from "react-native-paper";

const LoginScreenWrapper = styled(View)`
    height          : ${props => props.height + "px"};
    display         : flex;
    align-items     : center;
    justify-content : center;
    background-color: #2A719D;
    position        : relative;
`;

const LoginBgImage = styled(BgImage)`
    position: absolute; 
`;

const LoginFormWrapper = styled(View)`
    padding         : 20px 30px 15px 30px;
    width           : ${props => (props.width - 26) + "px"};
    background-color: white;
    border-radius   : 30px;
`;

const LoginHeaderWrapper = styled(View)`
    margin-bottom: 25px;
`;

const LoginHeader = styled(Text)`
    color       : #329FD9;
    font-size   : 48px;
    font-family : "NunitoBlack";
    text-align: center;
`;

const LoginDescription = styled(Text)`
    color: #4ACAF9;
    text-align: center;
    font-family: "NunitoMedium";
`;

const LoginTextInput = styled(TextInput)`
    background-color: white;
    color           : #3F3F3F;
    position        : relative;
    font-family     : "NunitoBold";
    padding         : 4px 10px;
    font-size: 18px;
    border: none;
    border-bottom-width: 1.5px;
    border-bottom-color: #8C8B8B;
    border-radius   : 10px;
`;

const LoginLabel = styled(Text)`
    font-size       : 18px;
    margin-bottom   : 5px;
    color           : black;
    font-family     : "NunitoSemiBold";
`;

const ForgetPassword = styled(Text)`
    font-family     : "NunitoMediumItalic";
    color: #37B4F3;
    text-decoration: underline;
    text-align: right;
`;

const CreateNewAccount = styled(Text)`
    font-family     : "NunitoSemiBold";
    color: #37B4F3;
    text-align: center;
    font-size: 15px;
`;

const LoginScreen = function(props) {
    const { navigation }            = props;
    const {width, height}           = Dimensions.get("window");
    const [username, setUsername]   = useState("");
    const [password, setPassword]   = useState("");
    const [isLoading, setLoading]   = useState(false);

    const GotoForgetpasswordScreen = function() {
        console.log("Forget password");
    }

    const GotoCreateAccountScreen = function() {
        console.log("Forget password");
    }

    const Authenticate = function() {
        setLoading(true);
        setTimeout(function() {
            setLoading(false);
        }, 2000);
        // axiosConfig().post("/login")
        //     .then(r => {
        //         console.log(r)
        //         //Login ok
        //         AsyncStorageNpm.setItem("token", "", function(err) {
        //             if (err) {
        //                 console.error("Login-1 (Token return but can't save to async store): ", err);
        //                 ToastAndroid.show("Sorry, please try again later (code: Login-1)", ToastAndroid.SHORT);
        //             }
        //         });
        //     })
        //     .catch(e => {
        //         console.error("Login-2: ", e);
        //         ToastAndroid.show("Sorry, please try again later (code: Login-2)", ToastAndroid.SHORT);
        //     })
        //     .finally(function() {
        //         setLoading(false);
        //     });
    }

    return(
        <KeyboardAvoidingView behavior="height">
            <LoginScreenWrapper height={height}>
                <LoginBgImage height={height} width={width}/>
                <LoginFormWrapper width={width}>
                    <LoginHeaderWrapper>
                        <LoginHeader>HALO</LoginHeader>
                        <LoginDescription>Let's in!</LoginDescription>
                    </LoginHeaderWrapper>
                    
                    <View>
                        <TextInputRNPaper 
                            autoFocus
                            label={"Username or email"} 
                            mode="flat"
                            value={username}
                            onChangeText={setUsername}
                            left={<TextInputRNPaper.Icon name="account-outline"/>}
                            style={{
                                backgroundColor: "white"
                            }}
                            />
                    </View>

                    <View style={{marginTop: 20}}>
                        <TextInputRNPaper 
                            label={"Password"}
                            mode="flat"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            left={<TextInputRNPaper.Icon name="lock-outline"/>}
                            style={{
                                backgroundColor: "white"
                            }}
                            />
                    </View>

                    <View style={{marginTop: 5}}>
                        <ForgetPassword onPress={GotoForgetpasswordScreen}>Forget password?</ForgetPassword>
                    </View>

                    <View style={{marginTop: 20}}>
                        <Button 
                            uppercase={false} 
                            color="white" 
                            style={{backgroundColor: "#58B7E9", borderRadius: 10}} 
                            loading={isLoading} 
                            disabled={isLoading} 
                            onPress={Authenticate}>
                                Login
                        </Button>
                    </View>

                    <View style={{marginTop: 18}}>
                        <Text style={{color: "#888888", textAlign: "center", marginBottom: 10}}>or</Text>
                        <CreateNewAccount onPress={GotoCreateAccountScreen}>Create new account</CreateNewAccount>
                    </View>
                </LoginFormWrapper>
            </LoginScreenWrapper>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;