import React , {useState} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import {theme} from '../theme';
import PropTypes from 'prop-types';
import IconButton from './IconButton';
import {images} from '../images';
import Input from './Input';

export const Category = item => {
    return (
        <View>
            <Text>{item.text}</Text>
        </View>
    )
}