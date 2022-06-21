import React from "react";;
import styled from "styled-components/native";
import { View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Platform } from "react-native";
import { Button, TextInput } from "react-native-paper";

const LoginScreen = function(props) {
    return(
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <TextInput mode="flat" label={"Username"} placeholder="Username or email"/>
            <Button icon="camera" mode="outlined" loading={true} style={{backgroundColor: "green"}}>FFF</Button>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;