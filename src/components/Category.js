import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { theme } from '../theme';
import PropTypes from 'prop-types';
import IconButton from './IconButton';
import { images } from '../images';
import CategoryInput from './CategoryInput';

export const Category = ({ item, deleteCategory, updateCategory, moveToCategory }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(item.text);

    const _handleUpdateButtonPress = () => {
        setIsEditing(true);
    };
    const _onSubmitEditing = () => {
        if (isEditing) {
            const editedCategory = Object.assign({}, item, { text });
            setIsEditing(false);
            updateCategory(editedCategory);
        }
    };
    const _onBlur = () => {
        if (isEditing) {
            setIsEditing(false);
            setText(item.text);
        }
    };
    return isEditing ? (
        <CategoryInput value={text} onChangeText={text => setText(text)}
            onSubmitEditing={_onSubmitEditing}
            onBlur={_onBlur} />
    ) : (
        <View style={style.container}>
            <Text style={style.contents}>{item.text}</Text>
            <IconButton type={images.openNew} id={item.id} onPressOut={moveToCategory} />
            <IconButton type={images.update} onPressOut={_handleUpdateButtonPress} />
            <IconButton type={images.delete} id={item.id} onPressOut={deleteCategory} />
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.itemBackground,
        borderRadius: 10,
        padding: 3,
        marginTop: 3,
        marginLeft: 0,
    },
    contents: {
        flex: 1,
        fontSize: 20,
        color: theme.text,
    },

});

Category.propTypes = {
    item: PropTypes.object.isRequired,
};