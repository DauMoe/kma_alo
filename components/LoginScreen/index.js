import React, { useState } from "react";;
import styled from "styled-components/native";
import { View, Text, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Dimensions } from "react-native";
import { Button, AnimatedFAB } from "react-native-paper";

const LoginScreenWrapper = styled.KeyboardAvoidingView`
    background-color: aliceblue;
    height: ${props => props.height + "px"};
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: darkcyan;
`;

const LoginFormWrapper = styled.View`
    padding: 20px;
    width: ${props => (props.width - 30) + "px"};
`;

const LoginHeader = styled.Text`
    color       : aliceblue;
    font-size   : 40px;
    font-family : "NunitoBlack"
`;

const LoginTextInput = styled.TextInput`
    background-color: white;
    color           : black;
    position        : relative;
`;

const LoginLabel = styled.Text`
    font-size       : 17px;
    margin-bottom   : 5px;
    font-weight     : 600;
`;

const LoginScreen = function(props) {
    const {width, height} = Dimensions.get("screen");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    return(
        <LoginScreenWrapper behavior={Platform.OS === "ios" ? "padding" : "height"} height={height}>
            <LoginHeader>Login</LoginHeader>
            <LoginFormWrapper width={width}>
                <View>
                    <LoginLabel>Username:</LoginLabel>
                    <LoginTextInput value={username} onChangeText={setUsername} keyboardType="default"/>
                </View>

                <View style={{marginTop: 20}}>
                    <LoginLabel>Password:</LoginLabel>
                    <LoginTextInput value={password} onChangeText={setPassword} keyboardType="default" secureTextEntry={true}/>
                </View>

                <View>
                    <Button mode="contained" style={{borderRadius: 10, backgroundColor: "gray"}} loading={true}>Login</Button>
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