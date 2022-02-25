/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import CodePush from 'react-native-code-push';
import LoginScreen from "react-native-login-screen";
import { StyleSheet, Text, Modal, ActivityIndicator, View } from 'react-native';

const IndicatorHUD = (props) => {
  const { isLoading, color, size, text } = props

  return (
    <Modal transparent style={styles.modal} animationType="fade" visible={isLoading} onRequestClose={() => {}}>
      <View style={styles.transparentView} />
      <View style={styles.mainContainer}>
        <View style={[styles.curvedCornerView, { backgroundColor: 'gray' }]}>
          <ActivityIndicator color={color} size={size} />
          <Text style={styles.text}>{text}</Text>
        </View>
      </View>
    </Modal>
  )
}
class App extends React.Component {
  state = {
    updateProgress: 0,
    codepushStatus: CodePush.SyncStatus.UP_TO_DATE
  }

  async componentDidMount() {
    this.restartIfPendingUpdate()
  }

  async componentDidUpdate() {
    this.restartIfPendingUpdate()
  }

  isUpdating = () => {
    const isDownloading = this.state.codepushStatus === CodePush.SyncStatus.DOWNLOADING_PACKAGE
    const isInstalling = this.state.codepushStatus === CodePush.SyncStatus.INSTALLING_UPDATE

    return isDownloading || isInstalling
  }

  restartIfPendingUpdate = async () => {
    const update = await CodePush.getUpdateMetadata(CodePush.UpdateState.PENDING)
    if (update) {
      codepush.restartApp()
    }
  }

  codePushDownloadDidProgress(progress) {
    this.setState({
      updateProgress: progress.receivedBytes / progress.totalBytes
    })
  }

  render() {
    return (
      <View style={styles.container}>
        {
          this.isUpdating() && <IndicatorHUD isLoading size={'large'} text={'Updating'} />
        }
        <View>
          <LoginScreen
            disableDivider
            disableSocialButtons
            // logoImageSource={require("./assets/logo.png")}
            haveAccountText={'Forgot Password?'}
            style={styles.loginContainer}
            onLoginPress={() => {}}
            onHaveAccountPress={() => {}}
          />
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  loginContainer: {
    flex: 0.8,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textContainer: {
    paddingHorizontal: 40,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderColor: 'gray',
  },
  text: {
    color: 'gray',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  mainContainer: {
    position: 'absolute',
    elevation: 10,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modal: {
    flex: 1
  },
  transparentView: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  },
  text: {
    paddingTop: 4,
    color: 'white'
  },
  curvedCornerView: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8
  }
});

let CodePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  installMode: CodePush.InstallMode.ON_NEXT_RESTART,
  mandatoryInstallMode: CodePush.InstallMode.ON_NEXT_RESTART,
   updateDialog: {
    appendReleaseDescription: true,
    title: "A new update is available!"
  }
}

export default CodePush(CodePushOptions)(App);
// export default App;
