import React, {useState, useRef, useEffect} from 'react';
import {Button, StatusBar, SafeAreaView, Text, StyleSheet, TouchableOpacity, Platform, Dimensions, ScrollView, View, Alert} from 'react-native';
import {viewStyles, textStyles, barStyles, cardStyles, rowStyles} from './styles';
import Input from './components/Input';
import Task from './components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import CustomButton from './components/custombutton';
import Animated from 'react-native-reanimated';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { FlatList } from 'react-native-gesture-handler';
import DraggableFlatList, { RenderItemParams, ScaleDecorator, ShadowDecorator, OpacityDecorator, useOnCellActiveAnimation} from 'react-native-draggable-flatlist';

export default function MainScreen({navigation, route}) { 
    const width = Dimensions.get('window').width; //set window size
    const [isReady, setIsReady] = useState(false);
    const [newTask, setNewTask] = useState('');
    const [tasks, setTasks] = useState({ //
        /*'1' : {id: '1', text: "Todo item #1", completed: false},
        '2' : {id: '2', text: "Todo item #2", completed: true},*/
    });

    const [markedDates, setMarkedDates] = React.useState(null);
    const [dates, setDates] = React.useState(['2021-12-01', '2022-12-31']);

    React.useEffect(()=>{
        const reload = navigation.addListener('focus',(e)=>{
            setIsReady(false);
        });
        return reload;
    },[navigation]);

    React.useEffect(() => {
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
                duedate: JSON.stringify(date), category: null },
        };
        console.log(ID);

        setNewTask('');
        //setTasks({...tasks, ...newTaskObject});
        _saveTasks({...tasks, ...newTaskObject});        
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

    const _editTask = id => {
        const currentTasks = Object.assign({}, tasks);
        const editScreen = navigation.navigate('EDIT', {selectedTask: currentTasks[id], taskID: id});
        //console.log("go currentTasks\n",currentTasks[id], id);
        return editScreen;
    };

    const renderItem= ({ item, index, drag, isActive }) => {    
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
                  onLongPress={drag}>
                      <Task key={item.id} item={item} editTask={_editTask} deleteTask={_deleteTask} toggleTask={_toggleTask}/>
                 {/*} <Animated.View
                    style={{
                    }}>
                    <Task key={item.id} item={item} editTask={_editTask} deleteTask={_deleteTask} toggleTask={_toggleTask}/>
                </Animated.View> */}
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

    const _addDates = () => {
        var Object=dates.reduce( (c,v) => Object.assign(c, {
            [v]: {maked: true, dotColor: 'red'},
        }),
        {},
        );

        setMarkedDates(obj);
    }

    var now = new Date();
    var month = now.getMonth() + 1;
    var today = now.getDate();

    return isReady? (
        <SafeAreaView style={viewStyles.container}>
            <StatusBar barStyle="dark-content" style={barStyles.statusbar}/>    
            {/* 여기에 헤더 추가할거면 추가*/}

            <View style={cardStyles.card}>
                <View style={rowStyles.context}> 
                    <Text style={[textStyles.title, {fontSize:30}]}> {month}/{today} </Text>
                    <CustomButton text="select" onPress={()=>navigation.navigate('SELECT')}/> 
                </View>
                
                <Input value={newTask} onChangeText={_handleTextChange} onSubmitEditing={_addTask} onBlur={_onBlur}/>

                <DraggableFlatList width = {width-20}
                        data={Object.values(tasks)}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        //onDragBegin={() => setOuterScrollEnabled(false)}
                        onDragEnd={({ data }) => {
                            _saveTasks(data)
                            //setOuterScrollEnabled(true)
                        }}
                        simultaneousHandlers={ScrollView}
                        activationDistance={20}
                />
               {/* <ScrollView width = {width-20} ref={ScrollView}>

                    <Calendar
                        onDayPress = {(day) => {
                            _addDates();
                            }}
                        markedDates={markedDates}
                        />

                    {Object.values(tasks).reverse().map(item=> (
                        <Task key={item.id} item={item} editTask={_editTask} deleteTask={_deleteTask} toggleTask={_toggleTask}
                        renderItem={renderItem}
                        />           
                    ))}
                    </ScrollView> */}
            </View>
        </SafeAreaView>
    )   :   (
        <AppLoading
            startAsync = {_loadTasks}
            onFinish={()=>setIsReady(true)}
            onError={console.error}/>
    );
};