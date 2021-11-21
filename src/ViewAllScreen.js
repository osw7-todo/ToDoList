import React, {useState} from 'react';
import {Button, StatusBar, SafeAreaView, Text, Dimensions, ScrollView, View} from 'react-native';
import {viewStyles, textStyles, barStyles, cardStyles, topbarStyles, bottombarStyles} from './styles';
import Input from './components/Input';
import { images } from './images';
import IconButton from './components/IconButton';
import Task from './components/Task';
import { NavigationContainer } from '@react-navigation/native';

export default function ViewAll({navigation}) {
    
    const width = Dimensions.get('window').width;
    const [newTask, setNewTask] = useState('');
    const[tasks, setTasks] = useState({
        /*'1' : {id: '1', text: "Todo item #1", completed: false},
        '2' : {id: '2', text: "Todo item #2", completed: true},*/
    });

    const _addTask = () => {
        alert(`Add: ${newTask}`);
        const ID = Date.now().toString();
        const newTaskObject = {
            [ID]: {id: ID, text: newTask, completed: false},
        };
        setNewTask('');
        setTasks({...tasks, ...newTaskObject });
    }
    const _deleteTask = id => {
        const currentTasks = Object.assign({}, tasks);
        delete currentTasks[id];
        setTasks(currentTasks);
    };
    const _toggleTask = id => {
        const currentTasks = Object.assign({}, tasks);
        currentTasks[id]['completed'] = !currentTasks[id]['completed'];
        setTasks(currentTasks);
    };
    const _updateTask = item => {
        const currentTasks = Object.assign({}, tasks);
        currentTasks[item.id] = item;
        setTasks(currentTasks);
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
    var now = new Date();
    var month = now.getMonth() + 1;
    var date = now.getDate();

    return (
        <SafeAreaView style={viewStyles.container}>
            <StatusBar barStyle="light-content" style={barStyles.statusbar}/>    
            
            <View style={topbarStyles.topbar}>
                <IconButton type={images.menubar}/>
                <Text style={textStyles.title}> {month}/{date} </Text>
                <Text style={textStyles.title}> Today </Text>
            </View>

            <View style={cardStyles.card}> 
                <Button  title= 'select' onPress={()=>navigation.navigate('SELECT')} style={[textStyles.title, {alignItems:'flex-end'}]} /> 
                
                <Input value={newTask} onChangeText={_handleTextChange} onSubmitEditing={_addTask} onBlur={_onBlur} />
                
                <ScrollView width = {width-20}>
                    {Object.values(tasks).reverse().map(item=> (
                        <Task key={item.id} item={item} deleteTask={_deleteTask} toggleTask={_toggleTask} updateTask={_updateTask} setDueDate={_setDueDate}/>
                    ))} 
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};