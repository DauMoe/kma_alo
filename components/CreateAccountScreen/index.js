import React, {useEffect, useState} from "react";
import {
    Dimensions,
    KeyboardAvoidingView,
    ScrollView,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View
} from "react-native";
import styled from "styled-components/native";
import {useNavigation} from "@react-navigation/native";
import BgImage from "../Media/login_background.svg";
import {Button, HelperText, TextInput as TextInputRNPaper} from "react-native-paper";
import {LOGIN_SCREEN} from "../Definition";
import {useDispatch} from "react-redux";
import {axiosConfig} from "../ReduxSaga/AxiosConfig";
import {LOCAL_SIGNUP} from "../API_Definition";

const SingupScreenWrapper = styled(View)`
    height          : ${props => props.height + "px"};
    display         : flex;
    align-items     : center;
    justify-content : center;
    background-color: #2A719D;
    position        : relative;
`;

const SignupBgImage = styled(BgImage)`
    position: absolute; 
`;

const SignupFormWrapper = styled(View)`
    padding         : 20px 30px 15px 30px;
    width           : ${props => (props.width - 26) + "px"};
    background-color: white;
    border-radius   : 30px;
`;

const SignupHeader = styled(Text)`
    color       : #329FD9;
    font-size   : 48px;
    font-family : "NunitoBlack";
    text-align: center;
`;

const SignupDescription = styled(Text)`
    color: #4ACAF9;
    text-align: center;
    font-family: "NunitoMedium";
`;

const SignupTextInput = styled(TextInput)`
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

const SignupLabel = styled(Text)`
    font-size       : 18px;
    margin-bottom   : 5px;
    color           : black;
    font-family     : "NunitoSemiBold";
`;

const SignupHeaderWrapper = styled(View)`
    margin-bottom: 25px;
`;

const GoBack = styled(Text)`
    font-family     : "NunitoSemiBold";
    color           : #37B4F3;
    text-align      : center;
    font-size       : 15px;
`;

const CreateAccountScreen = function(props) {
    const navigation        = useNavigation();
    const { width, height } = Dimensions.get("window");
    const dispatch          = useDispatch();
    const [isLoading, setLoading] = useState(false);
    const [msg, setMsg] = useState({
        value: "",
        isErr: false
    });
    // const { signup_loaded, sign_up_success_msg, signup_err, signup_err_msg } = useSelector(state => state.Authenticator);
    const [newAccount, setAccountInfo] = useState({
        first_name      : "",
        last_name       : "",
        username        : "",
        mobile          : "",
        email           : "",
        password        : "",
        repeat_password : "",
    });

    const [showPass, setShow] = useState({
       password: false,
       repeat_password: false
    });

    const CreateNewAccount = function() {
        if (newAccount.email.trim() === "") {
            setMsg({
                value: "Email is required!",
                isErr: true
            });
        } else if (newAccount.first_name.trim() === "") {
            setMsg({
                value: "First name is required!",
                isErr: true
            });
        } else if (newAccount.last_name.trim() === "") {
            setMsg({
                value: "Last name is required!",
                isErr: true
            });
        } else if (newAccount.username.trim() === "") {
            setMsg({
                value: "Username is required!",
                isErr: true
            });
        } else if (newAccount.mobile.trim() === "") {
            setMsg({
                value: "Mobile is required!",
                isErr: true
            });
        } else if (newAccount.password.trim() === "") {
            setMsg({
                value: "Password can't be blank",
                isErr: true
            });
        } else if (newAccount.password !== newAccount.repeat_password) {
            setMsg({
                value: "Repeat password must be the same with your password",
                isErr: true
            });
        } else {
            setMsg({
                value: "",
                isErr: false
            });
            setLoading(true);
            axiosConfig(LOCAL_SIGNUP, "post", newAccount)
                .then(r => {
                    setMsg({
                        isErr: false,
                        value: r.data.description
                    });
                })
                .catch(e => {
                   setMsg({
                       isErr: true,
                       value: e.response.data.description
                   });
                })
                .finally(() => setLoading(false));
        }
    }

    return(
        <KeyboardAvoidingView behavior="height">
            <SingupScreenWrapper height={height}>
                <SignupBgImage height={height} width={width}/>
                <SignupFormWrapper width={width}>
                    <SignupHeaderWrapper>
                        <SignupHeader>HALO</SignupHeader>
                        <SignupDescription>Join with us!</SignupDescription>
                    </SignupHeaderWrapper>

                    <View style={{maxHeight: height/2}}>
                        <ScrollView>
                            <View>
                                <TextInputRNPaper
                                    autoFocus={false}
                                    label={"Email"}
                                    mode="flat"
                                    defaultValue={newAccount.email}
                                    onChangeText={(e) => setAccountInfo({...newAccount, email: e})}
                                    left={<TextInputRNPaper.Icon name="email-outline"/>}
                                    style={{
                                        backgroundColor: "white"
                                    }}
                                />
                            </View>

                            <View style={{marginTop: 20}}>
                                <TextInputRNPaper
                                    autoFocus={false}
                                    label={"First name"}
                                    mode="flat"
                                    defaultValue={newAccount.first_name}
                                    onChangeText={(e) => setAccountInfo({...newAccount, first_name: e})}
                                    left={<TextInputRNPaper.Icon name="account-outline"/>}
                                    style={{
                                        backgroundColor: "white"
                                    }}
                                />
                            </View>

                            <View style={{marginTop: 20}}>
                                <TextInputRNPaper
                                    autoFocus={false}
                                    label={"Last name"}
                                    mode="flat"
                                    defaultValue={newAccount.last_name}
                                    onChangeText={(e) => setAccountInfo({...newAccount, last_name: e})}
                                    left={<TextInputRNPaper.Icon name="account-outline"/>}
                                    style={{
                                        backgroundColor: "white"
                                    }}
                                />
                            </View>

                            <View style={{marginTop: 20}}>
                                <TextInputRNPaper
                                    autoFocus={false}
                                    label={"Username"}
                                    mode="flat"
                                    defaultValue={newAccount.username}
                                    onChangeText={(e) => setAccountInfo({...newAccount, username: e})}
                                    left={<TextInputRNPaper.Icon name="account-outline"/>}
                                    style={{
                                        backgroundColor: "white"
                                    }}
                                />
                            </View>

                            <View style={{marginTop: 20}}>
                                <TextInputRNPaper
                                    autoFocus={false}
                                    label={"Mobile"}
                                    mode="flat"
                                    defaultValue={newAccount.mobile}
                                    onChangeText={(e) => setAccountInfo({...newAccount, mobile: e})}
                                    left={<TextInputRNPaper.Icon name="cellphone"/>}
                                    style={{
                                        backgroundColor: "white"
                                    }}
                                />
                            </View>

                            <View style={{marginTop: 20}}>
                                <TextInputRNPaper
                                    autoFocus={false}
                                    label={"Password"}
                                    mode="flat"
                                    defaultValue={newAccount.password}
                                    onChangeText={(e) => setAccountInfo({...newAccount, password: e})}
                                    secureTextEntry={!showPass.password}
                                    left={<TextInputRNPaper.Icon name="key"/>}
                                    right={<TextInputRNPaper.Icon name={showPass.password ? "eye" : "eye-off"} onPress={_ => setShow({...showPass, password: !showPass.password})}/>}
                                    style={{
                                        backgroundColor: "white"
                                    }}
                                />
                            </View>

                            <View style={{marginTop: 20}}>
                                <TextInputRNPaper
                                    autoFocus={false}
                                    label={"Repeat password"}
                                    mode="flat"
                                    defaultValue={newAccount.repeat_password}
                                    onChangeText={(e) => setAccountInfo({...newAccount, repeat_password: e})}
                                    left={<TextInputRNPaper.Icon name="key"/>}
                                    secureTextEntry={!showPass.repeat_password}
                                    right={<TextInputRNPaper.Icon name={showPass.repeat_password ? "eye" : "eye-off"} onPress={_ => setShow({...showPass, repeat_password: !showPass.repeat_password})}/>}
                                    style={{
                                        backgroundColor: "white"
                                    }}
                                />
                            </View>
                        </ScrollView>
                    </View>
                    <HelperText style={{fontStyle: "italic", color: "#58B7E9"}} visible={true}>* Scroll to fill all fields</HelperText>
                    <View style={{marginTop: 20, marginBottom: 5}}>
                        <Button
                            loading={isLoading}
                            disabled={isLoading}
                            uppercase
                            color="white"
                            onPress={CreateNewAccount}
                            style={{backgroundColor: "#58B7E9", borderRadius: 10}}>
                            Create account
                        </Button>
                    </View>
                    <View>
                        <HelperText style={msg.isErr ? {textAlign: "center", color: "red"} : {textAlign: "center", color: "green"}} visible={true}>{msg.value}</HelperText>
                    </View>
                    <TouchableOpacity onPress={() => navigation.pop()}>
                        <GoBack>Go back</GoBack>
                    </TouchableOpacity>
                </SignupFormWrapper>
            </SingupScreenWrapper>
        </KeyboardAvoidingView>
    )
}

export default CreateAccountScreen;
