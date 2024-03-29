import React, { useEffect, useRef, useState } from "react";;
import styled from "styled-components/native";
import { View, Text, TextInput, KeyboardAvoidingView, Dimensions, ToastAndroid } from "react-native";
import { Button, HelperText } from "react-native-paper";
import {CREATE_ACCOUNT_SCREEN, FORGET_PASSWORD_SCREEN, HOST_TABLE, MAIN_SCREEN} from "../Definition";
import BgImage from "./../Media/login_background.svg";
import { TextInput as TextInputRNPaper } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { LocalLoginAction } from "../ReduxSaga/Authenticator/Actions";
import {useNavigation} from "@react-navigation/native";
import { axiosConfig } from "../ReduxSaga/AxiosConfig";
import { LOCAL_LOGIN } from "../API_Definition";

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
    color           : #37B4F3;
    text-decoration : underline;
    text-align      : right;
`;

const CreateNewAccount = styled(Text)`
    font-family     : "NunitoSemiBold";
    color           : #37B4F3;
    text-align      : center;
    font-size       : 15px;
`;

const LoginScreen = function(props) {
    const navigation                = useNavigation();
    const {width, height}           = Dimensions.get("window");
    const [username, setUsername]   = useState(__DEV__ ? "daumoe" : "");
    const [password, setPassword]   = useState(__DEV__ ? "123" : "");
    const [showPass, setPlainPass]  = useState(false);
    const authenticator             = useSelector(state => state.Authenticator);
    const dispatch                  = useDispatch();

    const GotoForgetpasswordScreen = function() {
        navigation.push(FORGET_PASSWORD_SCREEN);
    }

    const GotoCreateAccountScreen = function() {
        navigation.push(CREATE_ACCOUNT_SCREEN);
    }

    const Authenticate = function() {
        if (username.trim() === "") {
            ToastAndroid.show("Enter your username or email", ToastAndroid.SHORT);
            return;
        }
        if (password.trim() === "") {
            ToastAndroid.show("Password is required", ToastAndroid.SHORT);
            return;
        }
        dispatch(LocalLoginAction(username, password));
    }

    useEffect(function() {
        if (authenticator.loaded && authenticator.token) navigation.navigate(MAIN_SCREEN)
    });

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
                            autoFocus={false}
                            label={"Username or email"}
                            mode="flat"
                            value={username}
                            onChangeText={setUsername}
                            left={<TextInputRNPaper.Icon name="account-outline"/>}
                            style={{
                                backgroundColor: "white"
                            }}
                            />
                        {authenticator.error_code === 401 && <HelperText type="error" visible>{authenticator.error_msg}</HelperText>}
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
                        {authenticator.error_code !== 401 && <HelperText type="error" visible>
                            {authenticator.error_msg}
                        </HelperText>}
                    </View>

                    {__DEV__ &&
                      <View style={{marginTop: 5}}>
                          <ForgetPassword onPress={GotoForgetpasswordScreen}>Forget password?</ForgetPassword>
                      </View>
                    }

                    <View style={{marginTop: 20}}>
                        <Button
                            uppercase={false}
                            color="white"
                            style={{backgroundColor: "#58B7E9", borderRadius: 10}}
                            loading={!authenticator.loaded}
                            disabled={!authenticator.loaded}
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
