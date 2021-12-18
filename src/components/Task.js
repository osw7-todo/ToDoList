import React , {useState} from 'react';
import {StyleSheet, View, Text, Button, TouchableHighlight} from 'react-native';
import {theme} from '../theme';
import PropTypes from 'prop-types';
import IconButton from './IconButton';
import {images} from '../images';
import Swipeable from 'react-native-gesture-handler/Swipeable'

const Task = ({ item, deleteTask, toggleTask, editTask}) => {

    return (
        <Swipeable
        renderRightActions={() =>
            <View style={taskStyle.container}>
            {item.completed || <IconButton type={images.update} id={item.id}
            onPressOut={editTask}/>}
            <IconButton type={images.delete} id={item.id} onPressOut={deleteTask}
            completed={item.completed}/>
            </View>}>
        <View style={taskStyle.container}>
            <IconButton type={item.completed ? images.completed : images.uncompleted} //edit
            id = {item.id} onPressOut = {toggleTask} completed={item.completed} />
            <Text style={[taskStyle.contents,
            {color: (item.completed? theme.done : theme.text)},
            {textDecorationLine: (item.completed? 'line-through' : 'none')}]}>
            {item.text}</Text>
        </View>
        </Swipeable>
    );
};

const taskStyle = StyleSheet.create({
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

Task.propTypes = {
    item: PropTypes.object.isRequired,
    deleteTask: PropTypes.func.isRequired,
    toggleTask: PropTypes.func.isRequired,
};

export default Task;