import React from "react";
import { StyleSheet, FlatList, View, AsyncStorage, Switch } from "react-native";
import {
  Appbar,
  Portal,
  Dialog,
  Button,
  Checkbox,
  List
} from "react-native-paper";
import NewsItem from "./components/NewsItem";
import { Notifications } from "expo";

const ip = "http://172.20.10.3:3000";
export default class NewsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      news: [],
      notification: {},
      userToken: "",
      visible: false,
      categories: [
        "SPORTS",
        "POLITICS",
        "BUSINESS",
        "ENTERTAINMENT",
        "CRIME",
        "TRAVEL",
        "TECH"
      ],
      checkeds: [false, false, false, false, false, false, false],
      filterQuery: ""
    };
    this.handleToUpdate = this.handleToUpdate.bind(this);
  }
  handleToUpdate() {
    this.fetchNews();
  }
  _handleNotification(notification) {
    const { data } = notification;
    console.log(data);
    this.props.navigation.navigate("NewDetail", {
      data: data,
      token: this.state.userToken,
      refreshFunction: this.refreshFunction
    });
  }
  componentDidMount() {
    this.fetchNews();
    AsyncStorage.getItem("@TOKEN")
      .then(token => {
        this.setState({ userToken: token });
      })
      .catch(err => console.log(err));
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }
  fetchNews = async () => {
    await fetch(ip + "/news?" + this.state.filterQuery, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        this.setState({ news: data });
      })
      .catch(err => console.log(err));
  };
  setFilterQuery = async () => {
    const { categories, checkeds } = this.state;
    let qstring = "";
    await categories.map((categori, index) => {
      if (checkeds[index]) {
        qstring = qstring + `&category=${categori}`;
      }
    });
    console.log(qstring);
    await this.setState({ filterQuery: qstring });
  };

  _showDialog = () => this.setState({ visible: true });
  _hideDialog = async () => {
    await this.setFilterQuery();
    await this.refreshFunction();

    this.setState({ visible: false });
    //console.log(this.state.filterQuery);
  };
  _keyExtractor = (item, index) => index.toString();
  refreshFunction = async () => {
    await fetch(ip + "/news?" + this.state.filterQuery, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        this.setState({ news: null }, () => {
          this.setState({ news: data });
        });
      })
      .catch(err => console.log(err));
  };

  _renderItem = ({ item, index }) => (
    <NewsItem
      key={index}
      data={item}
      token={this.state.userToken}
      onPress={() => {
        this.props.navigation.navigate("NewDetail", {
          data: item,
          token: this.state.userToken,
          refreshFunction: this.refreshFunction
        });
      }}
      handleToUpdate={this.handleToUpdate}
    />
  );
  render() {
    return (
      <View style={styles.container}>
        <Appbar.Header style={{ backgroundColor: "#f8f8f8" }}>
          <Appbar.Content title={"NEWS APP"} subtitle="Haberler" />
          <Appbar.Action icon="filter-list" onPress={this._showDialog} />
        </Appbar.Header>
        <Portal>
          <Dialog visible={this.state.visible} onDismiss={this._hideDialog}>
            <Dialog.Title>Kategorileri Filtrele</Dialog.Title>
            <Dialog.Content>
              <List.Section>
                {this.state.categories.map((data, index) => {
                  let checked = this.state.checkeds[index];
                  return (
                    <List.Item
                      key={index}
                      title={data}
                      right={() => {
                        return (
                          <Checkbox
                            status={checked ? "checked" : "indeterminate"}
                            onPress={() => {
                              let checks = [...this.state.checkeds];
                              checks[index] = !checks[index];
                              this.setState({ checkeds: checks });
                            }}
                            color={"#3333ff"}
                          />
                        );
                      }}
                    />
                  );
                })}
              </List.Section>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={this._hideDialog} color={"#3333ff"}>
                Kaydet
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <FlatList
          data={this.state.news}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
