import React, {useState, useEffect} from 'react';
import {Button, StatusBar, SafeAreaView, Text, Dimensions, ScrollView, View} from 'react-native';
import {viewStyles, textStyles, barStyles, cardStyles, topbarStyles, bottombarStyles} from './styles';
import { images } from './images';
import IconButton from './components/IconButton';
import Task from './components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';

export default function ViewAll({navigation, route}) {   

    const width = Dimensions.get('window').width;

    const [isReady, setIsReady] = useState(false);
    const [tasks, setTasks] = useState({ //
        /*'1' : {id: '1', text: "Todo item #1", completed: false},
        '2' : {id: '2', text: "Todo item #2", completed: true},*/
    });

    /*
    const item = route.params;
    console.log("===",item);

    Object.values(route.params).reverse().map(function(item){
        console.log(".....",item.id);
        const ID = item.id;
        const newTaskObject = {
        [ID]: {id: ID, text: item.text, completed: item.completed},
        };
    });
    */

    /*
    //tasks = route.params;
    Object.values(route.params).reverse().map(function(item){
        const ID = item.id;
        const newTaskObject = {
            [ID]: {id: ID, text: item.text, completed: item.completed},
        };

        //setTasks({...tasks, ...newTaskObject});
        _saveTasks({...tasks, ...newTaskObject});
    })
    //console.log(data);
    */

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

    return  isReady? (
        <SafeAreaView style={viewStyles.container}>
            <StatusBar barStyle="light-content" style={barStyles.statusbar}/> 

            <View style={cardStyles.card}>  
                <Button  title= 'select' onPress={()=>navigation.navigate('SELECT')} style={[textStyles.title, {alignItems:'flex-end'}]} /> 
                <ScrollView width = {width-20} onLoad={(route)=>_addTask(route.params)}>
                    {Object.values(tasks).reverse().map(item=> (
                        <Task key={item.id} item={item} deleteTask={_deleteTask} toggleTask={_toggleTask} updateTask={_updateTask} setDueDate={_setDueDate}/>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    )   :   (
        <AppLoading
            startAsync = {_loadTasks}
            onFinish={()=>setIsReady(true)}
            onError={console.error}/>
    );
};