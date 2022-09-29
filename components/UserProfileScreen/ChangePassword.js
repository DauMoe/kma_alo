import React, {useState} from "react";
import {Button, HelperText, IconButton, TextInput as TextInputRNPaper, withTheme} from "react-native-paper";
import {Text, ToastAndroid, View} from "react-native";
import styled from "styled-components";
import {useNavigation} from "@react-navigation/native";
import {axiosConfig} from "../ReduxSaga/AxiosConfig";
import {CHANGE_PASSWORD} from "../API_Definition";
const ChangePasswordWrapper = styled(View)`
  margin: 10px;
`;

const ChangePassword = function(props) {
  const navigation = useNavigation();
  const { colors } = props.theme;
  const [password, setPassword]   = useState({
    current : "",
    new_pass: "",
    repeat  : ""
  });
  const [showPass, setPlainPass]  = useState({
    current : false,
    new_pass: false,
    repeat  : false
  });

  const [err, setErr] = useState({
    pos1: "",
    pos2: ""
  });
  const [loading, setLoading] = useState(false);

  const SaveChangePassword = function() {
    if (password.current.trim() === "" || password.new_pass.trim() === "" || password.repeat.trim() === "") {
      setErr({
        pos1: "Password can't be blank"
      });
    } else if (password.new_pass.trim() !== password.repeat.trim()) {
      setErr({
        pos2: "Repeat password is not match"
      })
    } else {
      setErr({
        pos1: "",
        pos2: ""
      });
      setLoading(true);
      axiosConfig(CHANGE_PASSWORD, "post", {
        current_password: password.current,
        new_password: password.new_pass
      })
        .then(r => {
          ToastAndroid.show(r.data.description, ToastAndroid.LONG);
          setTimeout(() => {
            if (navigation.canGoBack()) navigation.goBack();
          }, ToastAndroid.LONG);
        })
        .catch(e => {
          setErr({
            pos2: e.response.data.description
          })
        })
        .finally(() => {
          setLoading(false);
        })
    }
  }

  return(
    <>
      <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
        <IconButton icon="chevron-left" size={35} onPress={() => {
          if (!loading && navigation.canGoBack()) {navigation.goBack()}
        }} color={colors.primaryTextColor}/>
        <Text style={{
          fontFamily: "NunitoBold",
          color: "black",
          fontSize: 20
        }}>Change password</Text>
      </View>
      <ChangePasswordWrapper>
        <TextInputRNPaper
          label={"Current password"}
          mode="flat"
          value={password.current}
          onChangeText={e => setPassword({
            ...password,
            current: e
          })}
          secureTextEntry={!showPass.current}
          left={<TextInputRNPaper.Icon name="lock-outline"/>}
          right={<TextInputRNPaper.Icon name={showPass.current ? "eye" : "eye-off"} onPress={_ => setPlainPass({
            ...showPass,
            current: !showPass.current
          })}/>}
          style={{
            backgroundColor: "white"
          }}
        />
        {err.pos1?.length>0 && <HelperText type={"error"}>{err.pos1}</HelperText>}
        <TextInputRNPaper
          label={"New password"}
          mode="flat"
          value={password.new_pass}
          onChangeText={e => setPassword({
            ...password,
            new_pass: e
          })}
          secureTextEntry={!showPass.new_pass}
          left={<TextInputRNPaper.Icon name="lock-outline"/>}
          right={<TextInputRNPaper.Icon name={showPass.new_pass ? "eye" : "eye-off"} onPress={_ => setPlainPass({
            ...showPass,
            new_pass: !showPass.new_pass
          })}/>}
          style={{
            backgroundColor: "white",
            marginTop: 10
          }}
        />
        <TextInputRNPaper
          label={"Repeat new password"}
          mode="flat"
          value={password.repeat}
          onChangeText={e => setPassword({
            ...password,
            repeat: e
          })}
          secureTextEntry={!showPass.repeat}
          left={<TextInputRNPaper.Icon name="lock-outline"/>}
          right={<TextInputRNPaper.Icon name={showPass.repeat ? "eye" : "eye-off"} onPress={_ => setPlainPass({
            ...showPass,
            repeat: !showPass.repeat
          })}/>}
          style={{
            backgroundColor: "white",
            marginTop: 10
          }}
        />
        {err.pos2?.length > 0 && <HelperText type={"error"}>{err.pos2}</HelperText>}
        <View style={{marginTop: 10}}>
          <Button
            loading={loading}
            icon="content-save"
            color="white"
            uppercase={false}
            onPress={SaveChangePassword}
            contentStyle={{flexDirection: 'row-reverse', paddingTop: 3, paddingBottom: 3}}
            style={{borderRadius: 10, backgroundColor: "#DC0000"}}>
            Save
          </Button>
        </View>
      </ChangePasswordWrapper>
    </>
  )
}

export default withTheme(ChangePassword);
