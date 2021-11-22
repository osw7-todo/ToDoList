import React, {useState, useEffect} from 'react';
import {Button, StatusBar, SafeAreaView, Text, Dimensions, ScrollView, View} from 'react-native';
import {viewStyles, textStyles, barStyles, cardStyles, topbarStyles, bottombarStyles} from './styles';
import Input from './components/Input';
import { images } from './images';
import IconButton from './components/IconButton';
import Task from './components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';

export default function ViewAll({navigation, item}) {   
    const width = Dimensions.get('window').width;

    const _saveTasks = async tasks => {
        try {
            await AsyncStorage.setItem('tasks',JSON.stringify(tasks));
            setTasks(tasks);
        } catch (e) {
            console.error(e);
        }
    };

    const _loadTasks = async () => {
        const loadedTasks = await AsyncStorage.getItem('tasks');
        setTasks(JSON.parse(loadedTasks || '{}'));
    };

    const [tasks, setTasks] = useState({});
    _saveTasks({...tasks, ...setTasks});

    /*
    const _addTask = route => {
        alert(`Add: hey`);
        const ID = route.id;
        const newTaskObject = {
            [ID]: {id: route.id, text: route.text, completed: route.completed},
        };
        setNewTask('');
        setTasks({...tasks, ...newTaskObject });

        //navigation.navigate('ViewAll', {[tasks] : [tasks]})
    }
    */

    const _deleteTask = id => {
        const currentTasks = Object.assign({}, tasks);
        delete currentTasks[id];
        //setTasks(currentTasks);
        _saveTasks(currentTasks);
    };
    const _toggleTask = id => {
        const currentTasks = Object.assign({}, tasks);
        currentTasks[id]['completed'] = !currentTasks[id]['completed'];
        //setTasks(currentTasks);
        _saveTasks(currentTasks);
    };
    const _updateTask = item => {
        const currentTasks = Object.assign({}, tasks);
        currentTasks[item.id] = item;
        //setTasks(currentTasks);
        _saveTasks(currentTasks);
    };

    const _setDueDate = item => {
        const currentTasks = Object.assign({}, tasks);
        setTasks(currentTasks);
    };

    const _onBlur = () => {
        setNewTask('');
    };
    const _handleTextChange = text => {
        setNewTask(text);
    };

    return ( //똑같은 tasks를 받아 집어넣기만 하면 해결
        <SafeAreaView style={viewStyles.container}>
            <StatusBar barStyle="light-content" style={barStyles.statusbar}/> 

            
            <View style={cardStyles.card}>  
                <Button  title= 'select' onPress={()=>navigation.navigate('SELECT')} style={[textStyles.title, {alignItems:'flex-end'}]} /> 
                <ScrollView width = {width-20} onLoad={(route)=>_addTask(route.params)}>
                    {Object.values(tasks).reverse().map(item=> (
                        <Task key={item.id} item={item} deleteTask={_deleteTask} toggleTask={_toggleTask} updateTask={_updateTask}/>
                    ))} 
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};