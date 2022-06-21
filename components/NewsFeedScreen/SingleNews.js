import React from "react";
import { View, Text, Image } from "react-native";
import { Avatar } from "react-native-paper";
import { Col, Row, Grid } from "react-native-paper-grid";
import styled from "styled-components/native";

const NewsWrapper = styled.View`
    padding: 10px;
    background-color: #646464;
`;

const NewsHeader = styled.View`
    display: flex;
    align-items: center;
    flex-direction: row;
`;

const NewsUsername = styled.Text`
    color: white;
    font-family: "NunitoBold";
    font-size: 18px;
`;

const NewsContent = styled.Text`
    color: white;
    font-family: "NunitoRegular";
    font-size: 14px;
    margin-top: 12px;
`;

const NewsMedia = styled(Grid)`
    height: fit-content;
`;

const PostTimestamp = styled.Text`
    font-size: 10px;
    font-style: italic;
`;

const SingleNews = function(props) {
    const { width, height } = props;
    return(
        <NewsWrapper>
            <NewsHeader>
                <Avatar.Text size={50} label="DM" style={{marginRight: 10}}/>
                <View>
                    <NewsUsername>Daumoe</NewsUsername>
                    {/* <PostTimestamp>Jun 17 at 9:09 PM</PostTimestamp> */}
                    <PostTimestamp>Posted 3h ago</PostTimestamp>
                </View>
            </NewsHeader>

            <NewsContent>
                <Text>chuyển sinh thành người vợ của tổng tài iq số 8 nằm ngang đầy quyền lực, sở hữu khối tài sản ròng lên tới 10000000000 tỷ đô tiêu 3 đời chắc là gần hết và là ceo của tập đoàn đứng top 1 thế giới 🥰🙏 lạnk lẽo với tất cả mọi người, ngọt ngào với mỗi mình iem</Text>
            </NewsContent>

            <NewsMedia>
                <Row>
                    <Col>
                        <Image style={{resizeMode: "contain", width: "100%", height: 100}} source={{ uri: 'https://reactnative.dev/img/tiny_logo.png'}}/>
                    </Col>
                </Row>
            </NewsMedia>
        </NewsWrapper>
    );
}

export default SingleNews;