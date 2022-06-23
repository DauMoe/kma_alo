import React, { useState } from "react";;
import styled from "styled-components/native";
import { View, Text, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Dimensions, ToastAndroid, ImageBackground } from "react-native";
import { Button } from "react-native-paper";
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
    padding         : 10px 30px 30px 30px;
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
    text-align  : center;
`;

const LoginDescription = styled(Text)`
    color       : #4ACAF9;
    text-align  : center;
    font-family : "NunitoMedium";
`;

const GoBackLoginScreen = styled(Text)`
    font-family     : "NunitoSemiBold";
    color: #37B4F3;
    text-align: center;
    font-size: 15px;
    text-decoration: underline;
`;

const ForgetPasswordScreen = function(props) {
    const { navigation }            = props;
    const {width, height}           = Dimensions.get("window");
    const [email, setEmail]         = useState("");
    const [isLoading, setLoading]   = useState(false);

    const SendForgetPasswordtoEmail = function() {
        const emailReg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/gi;
        if (!emailReg.test(email)) {
            ToastAndroid.show("Invalid email", ToastAndroid.SHORT);
        } else {
            setLoading(true);
            ToastAndroid.show("Please check your email", ToastAndroid.SHORT);
            setTimeout(function() {
                setLoading(false);
            }, 2000);
        }
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
                        <LoginHeader>Hmm</LoginHeader>
                        <LoginDescription>Do you remember your email?</LoginDescription>
                    </LoginHeaderWrapper>
                    
                    <View>
                        <TextInputRNPaper 
                            autoFocus
                            label={"Your email"} 
                            mode="flat"
                            value={email}
                            onChangeText={setEmail}
                            left={<TextInputRNPaper.Icon name="email-outline"/>}
                            style={{
                                backgroundColor: "white"
                            }}
                            />
                    </View>

                    <View style={{marginTop: 20}}>
                        <Button 
                            uppercase={false} 
                            color="white" 
                            style={{backgroundColor: "#58B7E9", borderRadius: 10}} 
                            loading={isLoading} 
                            disabled={isLoading} 
                            onPress={SendForgetPasswordtoEmail}>
                                Send
                        </Button>
                    </View>

                    <View style={{marginTop: 30}}>
                        <GoBackLoginScreen onPress={_ => navigation.goBack()}>Go back</GoBackLoginScreen>
                    </View>
                </LoginFormWrapper>
            </LoginScreenWrapper>
        </KeyboardAvoidingView>
    );
};

export default ForgetPasswordScreen;