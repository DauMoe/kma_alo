import React from 'react';
import { TextInput, ToastAndroid } from 'react-native';
import { Modal, Portal, Text, Button, Provider, FAB } from 'react-native-paper';
import styled from 'styled-components/native';
import { setBaseUrl } from './../ReduxSaga/AxiosConfig';
import { useState } from 'react';

const SetIPButton = styled(FAB)`
  position          : absolute;
  bottom            : 80px;
  right             : 20px;
  background-color  : white;
`;

const LoginTextInput = styled(TextInput)`
    background-color: white;
    color           : black;
    position        : relative;
    font-family     : "NunitoBold";
    padding         : 10px 20px;
    border          : solid 2px black;
    border-radius   : 10px;
`;

const SetIPModal = function(props) {
    const [visible, setVisible] = useState(false);
    const [hostIP, setHostIP]   = useState(null);
    const IPReg                 = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = {backgroundColor: 'white', padding: 20};

    const SetBaseUrlinModal = function() {
        if (!IPReg.test(hostIP)) {
            ToastAndroid.show("Your address is not an IP address!", ToastAndroid.SHORT);
        } else {
            ToastAndroid.show(`Now, calling to IP: ${hostIP}`, ToastAndroid.SHORT);
            setBaseUrl(hostIP);
            setVisible(false);
        }
    }

  return (
    <>
        <Portal>
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                <LoginTextInput autoFocus placeholderTextColor="#cacaca" placeholder='Host URL' value={hostIP} onChangeText={setHostIP}/>
                <Button
                    icon="content-save"
                    uppercase={false} 
                    color="white" 
                    style={{backgroundColor: "#58B7E9", borderRadius: 10, marginTop: 20}} 
                    onPress={SetBaseUrlinModal}>
                        Set host
                </Button>
            </Modal>
        </Portal>
        <SetIPButton small color="gray" icon="server" onPress={showModal}/>
    </>
  );
}

export default SetIPModal;