import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import {theme} from '../theme';

class customButton extends Component {
	render() {
		const { text, onPress} = this.props;
		return (
		  <TouchableOpacity style={styles.btn}
			onPress={() => onPress()}
		  >
			 <Text style={styles.text}>{text}</Text>
		  </TouchableOpacity>
		);
	}
}

customButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
    btn: {
        borderRadius: 10,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.background,
        width: 80,
        height: 35,
    },
    text: {
        fontSize: 20,
        //fontWeight: 'bold',
        textAlign: 'center',
        color:theme.main,
    }
});

export default customButton;