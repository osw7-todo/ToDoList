import React from 'react';
import { StyleSheet, TextInput, Dimensions } from 'react-native';
import { theme } from '../theme';

const Input = ({ value, onChangeText, onSubmitEditing, onBlur }) => {
    return (
        <TextInput style={inputStyle.textInput}
            placeholder="+ Add a task"
            placeholderTextColor={theme.main}
            maxLength={20}
            keyboardAppearance="dark"
            value={value} onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
            onBlur={onBlur}>
        </TextInput>
    );
};

/*const CategoryInput = ({value, onChangeText, onSubmitEditing, onBlur}) => {
    return(
        <TextInput style={inputStyle.textInput}
            placeholder="+ Add a category"
            placeholderTextColor= {theme.main}
            maxLength={20}
            keyboardAppearance="dark"
            value={value} onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
            onBlur={onBlur}>
        </TextInput>
    );
};*/

const inputStyle = StyleSheet.create({
    textInput: {
        fontSize: 25,
        width: Dimensions.get('window').width - 20,
        height: 60,
        marginTop: 10,
        marginLeft: 15,
        marginRight: 2,
        /* marginLeft: 3,
        marginRight: 3,
        paddingLeft: 15,
        paddingTop: 2, */
        borderRadius: 10,
        backgroundColor: theme.itemBackground,
        color: theme.text,
    },
});

export default Input;
//export default CategoryInput;