import React from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  AsyncStorage,
  ActivityIndicator
} from "react-native";
import { AppLoading, Notifications, Permissions, Font, Icon } from "expo";
import AppNavigator from "./navigation/AppNavigator";
import { Portal } from "react-native-paper";

const ip = "http://172.20.10.3:3000";
export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoadingComplete: false,
      isPushTokenSet: false,
      userToken: ""
    };
  }

  componentDidMount() {
    this.registerForPushNotificationsAsync();

    //this.fetchNews();
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === "ios" && <StatusBar barStyle="default" />}
          {this.state.isPushTokenSet ? (
            <Portal.Host>
              <AppNavigator />
            </Portal.Host>
          ) : (
            <ActivityIndicator
              style={{ alignContent: "center", flex: 1 }}
              size="large"
              color="#0000ff"
            />
          )}
        </View>
      );
    }
  }
  registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return;
    }
    let val = await Notifications.getExpoPushTokenAsync();
    let tokenstatus = this.setUserToken(val);
    this.setState({ isPushTokenSet: tokenstatus });
  };
  setUserToken = async val => {
    let token = await this.getUserToken(val);
    if (val === token) {
      AsyncStorage.setItem("@TOKEN", val);
      this.setState({ userToken: val });
      console.log("token set");
      return true;
    } else if (val !== token) {
      let pushdata = await this.pushUserToken(val);
      console.log("pushed ");
      console.log(pushdata);
      if (pushdata === val) {
        AsyncStorage.setItem("@TOKEN", val);
        this.setState({ userToken: val });
        console.log("succesfuly push token to server");
        console.log("token set");
        return true;
      }
      return false;
    } else {
      console.log("else");
      return false;
    }
  };
  getUserToken = async val => {
    let pushToken = "";
    await fetch(ip + "/user?token=" + val, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        let lastdata = data;
        if (lastdata.length) {
          pushToken = lastdata[0].token;
        }
      })
      .catch(err => {
        console.log(err);
      });
    return pushToken;
  };
  pushUserToken = async val => {
    let pushToken = "";

    await fetch(ip + "/user", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: val
      })
    })
      .then(res => res.json())
      .then(data => {
        let lastdata = data;
        pushToken = lastdata.token;
      })
      .catch(err => console.log(err));

    return pushToken;
  };

  _loadResourcesAsync = async () => {
    return Promise.all([
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font
      })
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
