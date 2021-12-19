import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StatusBar, SafeAreaView, Dimensions, ScrollView, View } from 'react-native';
import { viewStyles, textStyles, barStyles, cardStyles, topbarStyles, bottombarStyles } from '../styles';
import Task from '../components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import CustomButton from '../components/custombutton';
import DraggableFlatList, { RenderItemParams, ScaleDecorator, ShadowDecorator, OpacityDecorator, useOnCellActiveAnimation } from 'react-native-draggable-flatlist';

export default function Completed({ navigation, route }) {
    const width = Dimensions.get('window').width;

    const [isReady, setIsReady] = useState(false);
    const [newTask, setNewTask] = useState('');
    const [tasks, setTasks] = useState({ //
        /*'1' : {id: '1', text: "Todo item #1", completed: false},
        '2' : {id: '2', text: "Todo item #2", completed: true},*/
    });

    React.useEffect(() => {
        const reloadTab = navigation.addListener('focus', (e) => {
            setIsReady(false)
        });
        return reloadTab;
    }, [navigation]);

    //const item = route.params;
    //console.log("===",item);

    /*
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
            await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
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

    const _editTask = id => {
        const currentTasks = Object.assign({}, tasks);
        const editScreen = navigation.navigate('EDIT', { selectedTask: currentTasks[id], taskID: id });
        return editScreen;
    };


    const renderItem = ({ item, index, drag, isActive }) => {
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
                    <Task key={item.id} item={item} editTask={_editTask} deleteTask={_deleteTask} toggleTask={_toggleTask} />
                    {/*} <Animated.View
                    style={{
                    }}>
                    <Task key={item.id} item={item} editTask={_editTask} deleteTask={_deleteTask} toggleTask={_toggleTask}/>
                </Animated.View> */}
                </TouchableOpacity>
            </ScaleDecorator>
        )
    };

    return isReady ? (
        <SafeAreaView style={viewStyles.container}>
            <StatusBar barStyle="dark-content" style={barStyles.statusbar} />

            <View style={cardStyles.card}>
                <CustomButton text="select" onPress={() => navigation.navigate('SELECT_Completed')} />

                <DraggableFlatList width={width - 20}
                    data={Object.values(tasks).filter((filterItem) => {
                        if (filterItem.completed == true) {
                            return filterItem
                        }
                    })}
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
            </View>
        </SafeAreaView>
    ) : (
        <AppLoading
            startAsync={_loadTasks}
            onFinish={() => setIsReady(true)}
            onError={console.error} />
    );
};