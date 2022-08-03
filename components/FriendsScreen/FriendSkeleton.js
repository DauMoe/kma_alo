import React from "react";
import {withTheme} from "react-native-paper";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { View } from "react-native";

const FriendSkeleton = function(props) {
    return(
        <View style={{padding: 20}}>
            <SkeletonPlaceholder>
                <View style={{height: 25, width: 150, borderRadius: 10}}></View>
                {Array(4).fill(1).map((v, index) => {
                    return(
                        <View key={"__friend_rcm_skeleton_" + index} style={{display: "flex", flexDirection: "row", alignItems: "center", marginTop: 10, marginLeft: 10}}>
                            <View style={{width: 50, height: 50, borderRadius: 999999}}></View>
                            <View style={{marginLeft: 20, height: 25, width: 150, borderRadius: 10}}></View>
                        </View>
                    );
                })}

                <View style={{height: 25, width: 150, borderRadius: 10, marginTop: 30}}></View>
                {Array(5).fill(1).map((v, index) => {
                    return(
                        <View key={"__friend_skeleton_" + index} style={{display: "flex", flexDirection: "row", alignItems: "center", marginTop: 10, marginLeft: 10}}>
                            <View style={{width: 50, height: 50, borderRadius: 999999}}></View>
                            <View>
                                <View style={{marginLeft: 20, height: 25, width: 150, borderRadius: 10}}></View>
                                <View style={{marginLeft: 20, height: 18, width: 80, borderRadius: 10, marginTop: 5}}></View>
                            </View>
                        </View>
                    );
                })}
            </SkeletonPlaceholder>
        </View>
    );
}

export default withTheme(FriendSkeleton);