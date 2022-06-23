import React, { useState } from "react";;
import styled from "styled-components/native";
import { View, Text, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Dimensions, ToastAndroid, ImageBackground } from "react-native";
import { Button, AnimatedFAB, HelperText } from "react-native-paper";
import { FORGET_PASSWORD_SCREEN, MAIN_SCREEN } from "../ScreenName";
import {axiosConfig, setToken} from "../ReduxSaga/AxiosConfig";
import AsyncStorageNpm from "@react-native-async-storage/async-storage";
import BgImage from "./../Media/login_background.svg";
import { TextInput as TextInputRNPaper } from "react-native-paper";
import { LOCAL_LOGIN } from './../API_Definition';

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
    const [userErr, setUserErr]     = useState("");
    const [password, setPassword]   = useState("");
    const [passErr, setPassErr]     = useState("");
    const [showPass, setPlainPass]  = useState(false);
    const [isLoading, setLoading]   = useState(false);

    const GotoForgetpasswordScreen = function() {
        navigation.push(FORGET_PASSWORD_SCREEN);
    }

    const GotoCreateAccountScreen = function() {
        console.log("Forget password");
    }

    const Authenticate = function() {
        if (username === "") {
            setUserErr("Enter your username or email");
            return;
        } else {
            setUserErr("");
        }
        if (password === "") {
            setPassErr("Password is required");
            return;
        } else {
            setPassErr("");
        }
        const data = {
            username: username,
            password: password
        };
        setLoading(true);
        axiosConfig().post(LOCAL_LOGIN, data)
            .then(r => {
                const token = r.data.data.token;
                setToken(token);
                AsyncStorageNpm.setItem("token", "", function(err) {
                    if (err) {
                        console.error("Login-1 (Token return but can't save to async store): ", err);
                        ToastAndroid.show("Sorry, please try again later (code: Login-1)", ToastAndroid.SHORT);
                    } else {
                        navigation.navigate(MAIN_SCREEN);
                    }
                });
            })
            .catch(e => {
                console.error("Login-2: ", e.response.data.description);
                const { status, data } = e.response;
                console.log(status);
                if (status === 401) {
                    setUserErr(data.description);
                    setPassErr("");
                } else {
                    setUserErr("");
                    setPassErr(data.description);
                }
            })
            .finally(function() {
                setLoading(false);
            });
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
                        <HelperText type="error" visible={userErr.length > 0}>{userErr}</HelperText>
                    </View>

                    <View style={{marginTop: 20}}>
                        <TextInputRNPaper 
                            label={"Password"}
                            mode="flat"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPass}
                            left={<TextInputRNPaper.Icon name="lock-outline"/>}
                            right={<TextInputRNPaper.Icon name={showPass ? "eye" : "eye-off"} onPress={_ => setPlainPass(!showPass)}/>}
                            style={{
                                backgroundColor: "white"
                            }}
                            />
                        <HelperText type="error" visible={passErr.length > 0}>{passErr}</HelperText>
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