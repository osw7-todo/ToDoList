import React from 'react';
import {StyleSheet, TextInput, Dimensions} from 'react-native';
import {theme} from '../theme';

const Search = ({value, onChangeText, onSubmitEditing, onBlur}) => {
    return(
        <TextInput style={searchStyle.textInput}
            placeholder="search..."
            placeholderTextColor= {theme.main}
            maxLength={20}
            keyboardAppearance="dark"
            value={value} onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
            onBlur={onBlur}>
        </TextInput>
    );
};

const searchStyle = StyleSheet.create({
    textInput: {
        fontSize: 25,
        width: Dimensions.get('window').width-100,
        height: 40,
        marginTop: 10,
        marginLeft: 3,
        marginRight: 20,
        paddingLeft: 15,
        paddingTop: 2,
        borderRadius: 10,
        backgroundColor: theme.itemBackground,
        color: theme.text,
    },
});

export default Search;