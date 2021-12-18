import React , {useState} from 'react';
import {StyleSheet, View, Text, Button, TouchableHighlight} from 'react-native';
import {theme} from '../theme';
import PropTypes from 'prop-types';
import IconButton from './IconButton';
import {images} from '../images';
import Input from './Input';
import Swipeable from 'react-native-gesture-handler/Swipeable'
import {SwipeListView} from 'react-native-swipe-list-view'

const Task = ({ item, deleteTask, toggleTask, editTask}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(item.text);  

    const datalist = Array(1)
        .fill('')
        .map((_, i) => ({key: `${i}`, text: `${item.text}`}));


    return (
        <SwipeListView 
        data={datalist}
        renderItem={(data, rowMap) => (
            <View style={taskStyle.container}>
            <IconButton type={item.completed ? images.completed : images.uncompleted} //edit
            id = {item.id} onPressOut = {toggleTask} completed={item.completed} />
            <Text style={[taskStyle.contents,
            {color: (item.completed? theme.done : theme.text)},
            {textDecorationLine: (item.completed? 'line-through' : 'none')}]}>
            {item.text}</Text>
        </View>
          )}
          renderHiddenItem={(data, rowMap) => (
            <View style={taskStyle.hiddenContainer}>
            <IconButton type={images.delete} id={item.id} onPressOut={deleteTask}
            completed={item.completed}/>
            {item.completed || <IconButton type={images.update} id={item.id}
            onPressOut={editTask}/>}
            </View>
          )}
          disableRightSwipe
          rightOpenValue={-100}
        />
       /* <Swipeable
        renderRightActions={() =>
            <View style={taskStyle.hiddenContainer}>
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
            </Swipeable> */
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
    hiddenContainer: {
        flexDirection: 'row-reverse',
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