import React, {useState} from 'react';
import {Button, StatusBar, SafeAreaView, Text, Dimensions, ScrollView, View, Alert} from 'react-native';
import {viewStyles, textStyles, barStyles, cardStyles, topbarStyles} from './styles';
import Input from './components/Input';
import { images } from './images';
import IconButton from './components/IconButton';
import Task from './components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function MainScreen({navigation, route}) {
    
    const width = Dimensions.get('window').width; //set window size
    const [isReady, setIsReady] = useState(false);
    const [newTask, setNewTask] = useState('');
    const [tasks, setTasks] = useState({ //
        /*'1' : {id: '1', text: "Todo item #1", completed: false},
        '2' : {id: '2', text: "Todo item #2", completed: true},*/
    });
    const [date, setDate] = useState(new Date());

    React.useEffect(()=>{
        const reload = navigation.addListener('focus',(e)=>{
            setIsReady(false);
        });
        return reload;
    },[navigation]);
    
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
        const newTaskObject = {
            [ID]: {id: ID, text: newTask, completed: false, startdate: date,
                duedate: date, category: "all"},
        };

        setNewTask('');
        //setTasks({...tasks, ...newTaskObject});
        _saveTasks({...tasks, ...newTaskObject});        
    }

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

    const _editTask = id => {
        const currentTasks = Object.assign({}, tasks);
        const editScreen = navigation.navigate('EDIT', {selectedTask: currentTasks[id], taskID: id});
        return editScreen;
    }
    

   

      const _setDueDate = id=> {
        const currentTasks = Object.assign({}, tasks);
        showDatepicker();
        //setTasks(currentTasks);
        _saveTasks(currentTasks);
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
            <StatusBar barStyle="dark-content" style={barStyles.statusbar}/>    

            {/* 여기에 헤더 추가할거면 추가*/}

            <View style={cardStyles.card}> 
                <Button  title= 'select' onPress={()=>navigation.navigate('SELECT')} style={[textStyles.title, {alignItems:'flex-end'}]} /> 
                
                <Input value={newTask} onChangeText={_handleTextChange} onSubmitEditing={_addTask} onBlur={_onBlur}/>
                
                <ScrollView width = {width-20}>
                    {Object.values(tasks).reverse().map(item=> (
                        <Task key={item.id} item={item} editTask={_editTask} deleteTask={_deleteTask} toggleTask={_toggleTask}
                        updateTask={_updateTask} setDueDate={_setDueDate}
                        />                   

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