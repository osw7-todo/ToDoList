/*미완료 페이지 just for testing*/
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

class Uncompleted extends Component {
  render() {
    return (
      <View style={styles.container}>
          <Text style={styles.textStyle}>uncompleted screen</Text>
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

export default Uncompleted;