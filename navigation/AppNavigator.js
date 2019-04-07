import React from "react";
import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator
} from "react-navigation";

import NewDetailScreen from "../screens/NewDetailScreen";
import NewsScreen from "../screens/NewsScreen";

const NewStack = createStackNavigator(
  { NewDetail: NewDetailScreen, News: NewsScreen },
  { headerMode: "none", initialRouteName: "News" }
);

export default createAppContainer(
  createSwitchNavigator({
    Main: NewStack
  })
);
