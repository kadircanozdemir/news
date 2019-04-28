import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Appbar, Portal, Dialog, Button, Text } from "react-native-paper";
import NewsItem from "./components/NewsItem";

export default class NewDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.navigation.state.params.data,
      token: this.props.navigation.state.params.token
    };
    //this.handleToUpdate = this.handleToUpdate.bind(this);
  }
  /* handleToUpdate() {
    this.fetchNews();
  } */

  _goBack = () => {
    console.log("go back");
    this.props.navigation.state.params.refreshFunction();
    this.props.navigation.goBack();
  };
  _onMore = () => console.log("Shown more");
  _showDialog = () => this.setState({ visible: true });
  _hideDialog = () => {
    this.setState({ visible: false });
  };
  updateViewCount = async item => {
    let viewsArr = [...item.views];
    viewsArr.push(this.state.token);
    await fetch("http://192.168.14.244:3000/news/" + item._id, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        views: viewsArr
      })
    })
      .then(res => res.json())
      .then(data => {
        //console.log(data);
        this.setState({ data: data });
      })
      .catch(err => console.log(err));
  };
  componentDidMount() {
    this.updateViewCount(this.state.data);
  }
  componentDidUpdate(nexProps) {
    if (
      this.props.navigation.state.params.data !==
      nexProps.navigation.state.params.data
    ) {
      this.setState({ data: nexProps.navigation.state.params.data });
    }
  }
  render() {
    const { token, data } = this.state;
    const tittle = data.title;
    return (
      <View style={styles.container}>
        <Appbar.Header style={{ backgroundColor: "#00e6e6" }}>
          <Appbar.BackAction onPress={this._goBack} />
          <Appbar.Content
            title={tittle.slice(0, 7) + "..."}
            subtitle="Detaylar"
          />
          <Appbar.Action icon="more-vert" onPress={this._showDialog} />
        </Appbar.Header>
        <Portal>
          <Dialog visible={this.state.visible} onDismiss={this._hideDialog}>
            <Dialog.Title>{data.views.length} Görüntülenme</Dialog.Title>
            <Dialog.Actions>
              <Button onPress={this._hideDialog} color={"#3333ff"}>
                Tamam
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <NewsItem
          data={data}
          token={token}
          onPress={() => {}}
          handleToUpdate={() => {}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  developmentModeText: {
    marginBottom: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center"
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginTop: 3,
    marginLeft: -10
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)"
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4
  },
  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center"
  },
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center"
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center"
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7"
  }
});
