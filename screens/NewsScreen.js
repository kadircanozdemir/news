import React from "react";
import {
  ScrollView,
  StyleSheet,
  FlatList,
  Image,
  Text,
  View,
  TouchableOpacity
} from "react-native";
import { Permissions, Notifications } from "expo";

const PUSH_ENDPOINT = "https://your-server.com/users/push-token";

async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== "granted") {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== "granted") {
    return;
  }

  // Get the token that uniquely identifies this device
  let token = await Notifications.getExpoPushTokenAsync();
  console.log(token);
  // POST the token to your backend server from where you can retrieve it to send push notifications.
  /*
  return fetch(PUSH_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: {
        value: token,
      },
      user: {
        username: 'Brent',
      },
    }),
  });
  */
}

const data = [
  {
    id: 1,
    title: "haber",
    content: "jdklajskld. aksjkla jsd kjaksjd klajdklaj slkjdlsa jdklajskld",
    image:
      "https://images.pexels.com/photos/556416/pexels-photo-556416.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    likes: 4
  },
  {
    id: 2,
    title: "haber",
    content: "jdklajskld. aksjkla jsd kjaksjd klajdklaj slkjdlsa jdklajskld",
    image:
      "https://images.pexels.com/photos/556416/pexels-photo-556416.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    likes: 4
  },
  {
    id: 3,
    title: "haber",
    content: "jdklajskld. aksjkla jsd kjaksjd klajdklaj slkjdlsa jdklajskld",
    image:
      "https://images.pexels.com/photos/556416/pexels-photo-556416.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    likes: 4
  },
  {
    id: 4,
    title: "haber",
    content: "jdklajskld. aksjkla jsd kjaksjd klajdklaj slkjdlsa jdklajskld",
    image:
      "https://images.pexels.com/photos/556416/pexels-photo-556416.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    likes: 4
  },
  {
    id: 6,
    title: "haber",
    content: "jdklajskld. aksjkla jsd kjaksjd klajdklaj slkjdlsa jdklajskld",
    image:
      "https://images.pexels.com/photos/556416/pexels-photo-556416.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    likes: 4
  }
];

export default class NewsScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      news: data,
      notification: {}
    };
  }
  componentDidMount() {
    registerForPushNotificationsAsync();
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }

  _handleNotification = notification => {
    this.setState({ notification: notification });
  };

  _renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => {
        this.props.navigation.navigate("NewDetail", {
          data: item
        });
      }}
      key={index}
      style={{
        width: 300,
        height: 300,
        backgroundColor: "#f8f8f8",
        padding: 5,
        margin: 5,
        alignSelf: "center",
        borderColor: "black"
      }}
    >
      <Text style={{ flex: 1 }}>{item.title}</Text>
      <Image source={{ uri: item.image }} style={{ flex: 6 }} />
      <Text style={{ flex: 2 }}>{item.content}</Text>
    </TouchableOpacity>
  );
  _keyExtractor = (item, index) => item.id.toString();
  render() {
    return (
      <FlatList
        data={this.state.news}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        style={styles.container}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  }
});
