import React from 'react';
import { TextInput } from 'react-native';
import { Modal, Portal, Text, Button, Provider, FAB } from 'react-native-paper';
import styled from 'styled-components/native';
import { setBaseUrl } from './../ReduxSaga/AxiosConfig';
import { useState } from 'react';

const SetIPButton = styled(FAB)`
  position: absolute;
  bottom: 80px;
  right: 20px;
  background-color: white;
`;

const LoginTextInput = styled(TextInput)`
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

const SetIPModal = function(props) {
    const [visible, setVisible] = useState(false);
    const [hostIP, setHostIP]   = useState("http://");

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = {backgroundColor: 'white', padding: 20};

    const SetBaseUrl = function() {
        if (hostIP != "") setBaseUrl(hostIP);
        setVisible(false);
    }

  return (
    <>
        <Portal>
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                <LoginTextInput autoFocus placeholder='Host URL' value={hostIP} onChangeText={setHostIP}/>
                <Button uppercase={false} style={{backgroundColor: "yellow", marginTop: 20}} icon="camera" onPress={SetBaseUrl}>Set host url</Button>
            </Modal>
        </Portal>
        <SetIPButton small color="gray" icon="server" onPress={showModal}/>
    </>
  );
}

export default SetIPModal;