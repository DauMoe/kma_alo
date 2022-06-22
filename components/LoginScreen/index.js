import React, { useState } from "react";;
import styled from "styled-components/native";
import { View, Text, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Dimensions } from "react-native";
import { Button, AnimatedFAB } from "react-native-paper";

const LoginScreenWrapper = styled.KeyboardAvoidingView`
    height: ${props => props.height + "px"};
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
`;

const LoginFormWrapper = styled.View`
    padding: 20px;
    width: ${props => (props.width - 30) + "px"};
`;

const LoginHeader = styled.Text`
    color       : aliceblue;
    font-size   : 60px;
    font-family : "NunitoBlack";
    color       : black;
`;

const LoginTextInput = styled.TextInput`
    background-color: white;
    color           : black;
    position        : relative;
    font-family     : "NunitoBold";
    padding         : 10px;
    border          : solid 2px black;
    border-radius   : 10px;
    &::placeholder {
        color: black
    }
`;

const LoginLabel = styled.Text`
    font-size       : 18px;
    margin-bottom   : 5px;
    color           : black;
    font-family     : "NunitoSemiBold";
`;

const LoginScreen = function(props) {
    const { navigation }            = props;
    const {width, height}           = Dimensions.get("window");
    const [username, setUsername]   = useState("");
    const [password, setPassword]   = useState("");

    return(
        <LoginScreenWrapper behavior={Platform.OS === "ios" ? "padding" : "height"} height={height}>
            <LoginHeader>Login</LoginHeader>
            <Text style={{color: "black"}}>Normal access account</Text>
            <LoginFormWrapper width={width}>
                <View>
                    <LoginLabel>Username:</LoginLabel>
                    <LoginTextInput placeholderTextColor={'#669999'} value={username} onChangeText={setUsername} placeholder="Username or email"/>
                </View>

                <View style={{marginTop: 20}}>
                    <LoginLabel>Password:</LoginLabel>
                    <LoginTextInput placeholderTextColor={'#669999'} value={password} onChangeText={setPassword} placeholder="Your password" secureTextEntry={true}/>
                </View>

                <View style={{marginTop: 20}}>
                    <Button mode="contained" loading={true} onPress={_ => navigation.navigate("Main")}>Login</Button>
                </View>
            </LoginFormWrapper>
            {/* <AnimatedFAB
                icon={'question'}
                onPress={() => console.log('Pressed')}
                visible={true}
                iconMode={'static'} 
            />*/}
        </LoginScreenWrapper>
    );
};

export default LoginScreen;