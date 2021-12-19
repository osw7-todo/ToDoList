import React, {useState, useRef, useEffect} from 'react';
import {StatusBar, SafeAreaView, Text, StyleSheet, TouchableOpacity, Platform, Dimensions, ScrollView, View, Alert} from 'react-native';
import {viewStyles, textStyles, barStyles, cardStyles, rowStyles} from './styles';
import Input from './components/Input';
import Task from './components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import CustomButton from './components/custombutton';
import DraggableFlatList, { RenderItemParams, ScaleDecorator, ShadowDecorator, OpacityDecorator, useOnCellActiveAnimation} from 'react-native-draggable-flatlist';

export default function MainScreen({navigation, route}) { 
    const width = Dimensions.get('window').width; //set window size
    const [isReady, setIsReady] = useState(false);
    const [newTask, setNewTask] = useState('');
    const [tasks, setTasks] = useState({});

    useEffect(()=>{
        const reload = navigation.addListener('focus',(e)=>{
            setIsReady(false);
        });
        return reload;
    },[navigation]);

    useEffect(() => {
        if(route.params?.task, route.params?.id){
            const currentTasks = Object.assign({}, tasks);
            currentTasks[route.params?.id] = route.params?.task;
            _saveTasks(currentTasks);
        }
    }, [route.params?.task, route.params?.id]);
    
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

    const _addTask = () => {
        //alert(`Add: ${newTask}`);
        const ID = Date.now().toString();
        const date = new Date();
        const newTaskObject = {
            [ID]: {id: ID, text: newTask, completed: false, startdate: JSON.stringify(date),
                duedate: JSON.stringify(date), category: null, comment: null },
        };
        console.log(ID);

        setNewTask('');
        _saveTasks({...tasks, ...newTaskObject});        
    };

    const _deleteTask = id => {
        const currentTasks = Object.assign({}, tasks);
        delete currentTasks[id];
        _saveTasks(currentTasks);
    };
    const _toggleTask = id => {
        const currentTasks = Object.assign({}, tasks);
        currentTasks[id]['completed'] = !currentTasks[id]['completed'];
        _saveTasks(currentTasks);
    };

    const _editTask = id => {
        const currentTasks = Object.assign({}, tasks);
        const editScreen = navigation.navigate('EDIT', {selectedTask: currentTasks[id], taskID: id});
        return editScreen;
    };

    const renderItem= ({ item, drag, isActive }) => {    
        return (
            <ScaleDecorator>
                <TouchableOpacity
                  style={[
                    {
                      backgroundColor: isActive ? 'red' : item.backgroundColor,
                      height: item.height,
                        elevation: isActive ? 30 : 0,
                    },
                  ]}
                  /*onLongPress={drag}*/>
                      <Task key={item.id} item={item} editTask={_editTask} deleteTask={_deleteTask} toggleTask={_toggleTask}/>
                </TouchableOpacity>
            </ScaleDecorator>
        )
    };

    const _onBlur = () => {
        setNewTask('');
    };
    const _handleTextChange = text => {
        setNewTask(text);
    };

    var now = new Date();
    var month = now.getMonth() + 1;
    var today = now.getDate();

    return isReady? (
        <SafeAreaView style={viewStyles.container}>
            <StatusBar barStyle="light-content" style={barStyles.statusbar}/>    
            {/* 여기에 헤더 추가할거면 추가*/}

            <View style={cardStyles.card}>
                <View style={rowStyles.context}> 
                    <Text style={[textStyles.title, {fontSize:32}]}> {month}/{today} </Text>
                    <CustomButton text="select" onPress={()=>navigation.navigate('SELECT')}/> 
                </View>
                
                <Input value={newTask} onChangeText={_handleTextChange} onSubmitEditing={_addTask} onBlur={_onBlur}/>

                <DraggableFlatList width = {width-20}
                        data={Object.values(tasks)}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        onDragEnd={({ data }) => {
                            _saveTasks(data)
                        }}
                        simultaneousHandlers={ScrollView}
                />
            </View>
        </SafeAreaView>
    )   :   (
        <AppLoading
            startAsync = {_loadTasks}
            onFinish={()=>setIsReady(true)}
            onError={console.error}/>
    );
};