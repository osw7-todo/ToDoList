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

export default function MainScreen({navigation}) {
    
    const width = Dimensions.get('window').width; //set window size
    const [isReady, setIsReady] = useState(false);
    const [newTask, setNewTask] = useState('');
    const [tasks, setTasks] = useState({ //
        /*'1' : {id: '1', text: "Todo item #1", completed: false},
        '2' : {id: '2', text: "Todo item #2", completed: true},*/
    });

    React.useEffect(()=>{
        const reload = navigation.addListener('tabPress',(e)=>{
            setIsReady(false)
        });
        return reload;
    },[navigation]);
    
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const onChange = (id, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'Android');
        setDate(currentDate);
        id.duedate = currentDate;
        var formattedDate = (currentDate.getMonth() + 1) + "/" + currentDate.getDate();
        alert(`Due: ${formattedDate}`);
      };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
      };
    
      const showDatepicker = () => {
        showMode('date');
      };

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
        alert(`Add: ${newTask}`);
        const ID = Date.now().toString();
        const newTaskObject = {
            [ID]: {id: ID, text: newTask, completed: false, startdate: date, duedate: null},
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
            <StatusBar barStyle="light-content" style={barStyles.statusbar}/>    

            <View style={topbarStyles.topbar}>
                <IconButton type={images.menubar} onPress={() => navigation.openDrawer()}/> 
                {/*cf) navigation.closeDrawer(), navigation.toggleDrawer()*/}
                <Text style={textStyles.title}> {month}/{today} </Text>
                <Text style={textStyles.title}> Today </Text>
            </View>

            <View style={cardStyles.card}> 
                <Button  title= 'select' onPress={()=>navigation.navigate('SELECT')} style={[textStyles.title, {alignItems:'flex-end'}]} /> 
                
                <Input value={newTask} onChangeText={_handleTextChange} onSubmitEditing={_addTask} onBlur={_onBlur}
                /*onPress={()=>{
                    navigation.navigate('ViewAllScreen', {all : tasks})}}*/
                />
                
                <ScrollView width = {width-20}>
                    {Object.values(tasks).reverse().map(item=> (
                        <Task key={item.id} item={item} deleteTask={_deleteTask} toggleTask={_toggleTask}
                        updateTask={_updateTask} setDueDate={_setDueDate}
                        />
                    ))}
                </ScrollView>
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={date}
                        display="default"
                        onChange = {onChange}
                    />
                )}
            </View>
        </SafeAreaView>
    )   :   (
        <AppLoading
            startAsync = {_loadTasks}
            onFinish={()=>setIsReady(true)}
            onError={console.error}/>
    );
};