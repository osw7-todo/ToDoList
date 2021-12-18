import React, {useState, useEffect} from 'react';
import {StyleSheet, Button, StatusBar, SafeAreaView, Text, Dimensions, ScrollView, View} from 'react-native';
import {viewStyles, textStyles, barStyles, cardStyles, topbarStyles, bottombarStyles} from '../styles';
import {theme} from '../theme';
import { images } from '../images';
import IconButton from '../components/IconButton';
import Task from '../components/Task';
import { Category } from '../components/Category';
import Input from '../components/Input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';

export default function SelectedCategoryScreen({navigation, route}){
    const width = Dimensions.get('window').width;
    const [isReady, setIsReady] = useState(false);

    const [tasks, setTasks] = useState({});
    const {selectedCategory, categoryID} = route.params;

    useEffect(()=>{
        const reloadTab = navigation.addListener('focus',(e)=>{
            setIsReady(false)
        });
        return reloadTab;
      },[navigation]);
    
    const _loadTasks = async () => {
        const loadedTasks = await AsyncStorage.getItem('tasks');
        setTasks(JSON.parse(loadedTasks || '{}'));
    };
    

    const _saveTasks = async tasks => {
        try {
            await AsyncStorage.setItem('tasks',JSON.stringify(tasks));
            setTasks(tasks);
        } catch (e) {
            console.error(e);
        }
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
        return editScreen;
    };


    return isReady? (
        <SafeAreaView style={viewStyles.container}>
            <StatusBar barStyle="light-content" style={barStyles.statusbar}/>
            <CategoryTitle key={categoryID} item={selectedCategory}/>
            <ScrollView width={width-20} onLoad={()=>route.params}>
            {console.log(categoryID)}
            {Object.values(tasks).reverse().filter((filterItem)=>{
                        if(filterItem.category == categoryID){
                            return filterItem
                        } 
                    }).map(item=> (
                        <Task key={item.id} item={item} editTask={_editTask} deleteTask={_deleteTask} toggleTask={_toggleTask}/>
                    ))}
            </ScrollView>
        </SafeAreaView>
    ) : (
        <AppLoading
        startAsync = {_loadTasks}
        onFinish={()=>setIsReady(true)}
        onError={console.error}/>
      );
};


const CategoryTitle = (item) => {  
    return (
        <View style={style.container}>
            <Text style={style.contents}>
            {item.text}</Text>
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
  