/*미완료 페이지 just for testing*/
/*
원래는 drawer에서 카테고리 수정 및 생성 가능하게 해서,
drawer에서 카테고리 별로 볼 수 있게 할라했는데,
그러러면 drawer에 목록이 자동으로 추가되게 해야함 (코드에 삽입하는게 아니라, 유저의 입력을 받아서...)
이걸 할 수 없을 것 같아서,
아예 이 카테고리 페이지에서
카테고리 이름 <Select> 하면, 해당 목록 보여주는 식으로 해야할 듯. 
*/
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

class CATEGORY extends Component {
    render() {
      return (
        <View style={styles.container}>
            <Text style={styles.textStyle}> 카테고리별로 볼 수 있는 화면</Text>
        </View>
      );
    }
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default CATEGORY;