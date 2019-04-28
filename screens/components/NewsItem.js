import React from "react";
import { Platform, StyleSheet } from "react-native";
import { Card, Title, Paragraph, IconButton, Text } from "react-native-paper";
import moment from "moment";

export default class NewsItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.props.data,
      userToken: this.props.token,
      liked: false,
      disliked: false
    };
  }
  like = async item => {
    const { userToken } = this.state;
    if (!item.likes.includes(userToken)) {
      let likesArr = [...item.likes];
      likesArr.push(userToken);
      await fetch("http://192.168.14.244:3000/news/" + item._id, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          likes: likesArr
        })
      })
        .then(res => res.json())
        .then(data => {
          this.setState({ item: data, liked: true });
          this.props.handleToUpdate();
        })
        .catch(err => console.log(err));
    }
  };
  undoLike = async item => {
    const { userToken } = this.state;
    if (item.likes.includes(userToken)) {
      let likesArr = [...item.likes];
      likesArr.pop(userToken);
      await fetch("http://192.168.14.244:3000/news/" + item._id, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          likes: likesArr
        })
      })
        .then(res => res.json())
        .then(data => {
          this.setState({ item: data, liked: false });
          this.props.handleToUpdate();
        })
        .catch(err => console.log(err));
    }
  };
  dislike = async item => {
    const { userToken } = this.state;
    if (!item.dislikes.includes(userToken)) {
      let dislikesArr = [...item.dislikes];
      dislikesArr.push(userToken);
      await fetch("http://192.168.14.244:3000/news/" + item._id, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          dislikes: dislikesArr
        })
      })
        .then(res => res.json())
        .then(data => {
          this.setState({ item: data, disliked: true });
          this.props.handleToUpdate();
        })
        .catch(err => console.log(err));
    }
  };
  undoDislike = async item => {
    const { userToken } = this.state;
    if (item.dislikes.includes(userToken)) {
      let dislikesArr = [...item.dislikes];
      dislikesArr.pop(userToken);
      await fetch("http://192.168.14.244:3000/news/" + item._id, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          dislikes: dislikesArr
        })
      })
        .then(res => res.json())
        .then(data => {
          this.setState({ item: data, disliked: false });
          this.props.handleToUpdate();
        })
        .catch(err => console.log(err));
    }
  };
  isLiked = async item => {
    const { userToken } = this.state;
    if (item.likes.includes(userToken)) {
      await this.setState({ liked: true });
    } else {
      await this.setState({ liked: false });
    }
  };
  isDisliked = async item => {
    const { userToken } = this.state;
    if (item.dislikes.includes(userToken)) {
      await this.setState({ disliked: true });
    } else {
      await this.setState({ disliked: false });
    }
  };
  componentDidMount() {
    this.isLiked(this.state.item);
    this.isDisliked(this.state.item);
  }
  /* componentDidUpdate(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.isLiked(nextProps.data);
      this.isDisliked(nextProps.data);
    }
  } */
  render() {
    const item = this.state.item;
    return (
      <Card
        style={{
          margin: 5
        }}
        onPress={this.props.onPress}
      >
        <Card.Title
          title={item.title.slice(0, 45) + " ..."}
          subtitle={item.authors.slice(0, 30)}
        />
        <Card.Cover source={{ uri: item.image }} style={{}} />
        <Card.Content>
          <Title>{item.title}</Title>
          <Paragraph>{item.content}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <IconButton
            icon="thumb-up"
            color={this.state.liked ? "blue" : "grey"}
            size={20}
            onPress={() => {
              if (this.state.liked) {
                this.undoLike(item);
              } else {
                this.undoDislike(item);
                this.like(item);
              }
            }}
          />
          <IconButton
            icon="thumb-down"
            color={this.state.disliked ? "blue" : "grey"}
            size={20}
            onPress={() => {
              if (this.state.disliked) {
                this.undoDislike(item);
              } else {
                this.undoLike(item);
                this.dislike(item);
              }
            }}
          />
          <Text>{item.likes.length - item.dislikes.length} VOTES </Text>
          <Text>Yayınlanma: {moment(item.release).format("d/MM/YYYY")}</Text>
        </Card.Actions>
      </Card>
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
