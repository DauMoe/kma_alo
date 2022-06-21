import React from "react";
import { View, Text, Dimensions } from "react-native";
import SingleNews from "./SingleNews";

const NewsFeedScreen = function(props) {
    const { width, height } = Dimensions.get("window");
    return(
        <View>
            <SingleNews width={width} height={height}/>
        </View>
    );
}

export default NewsFeedScreen;