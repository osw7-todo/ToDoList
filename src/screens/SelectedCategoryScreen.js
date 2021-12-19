import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, StatusBar, SafeAreaView, Text, Dimensions, ScrollView, View } from 'react-native';
import { viewStyles, rowStyles, textStyles, barStyles, cardStyles, topbarStyles, bottombarStyles } from '../styles';
import { theme } from '../theme';
import Task from '../components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import CustomButton from '../components/custombutton';

export default function SelectedCategoryScreen({ navigation, route }) {
    const width = Dimensions.get('window').width;
    const [isReady, setIsReady] = useState(false);

    const [tasks, setTasks] = useState({});
    const { selectedCategory, categoryID } = route.params;
    //console.log("get selectedCategory\n",route.params);

    useEffect(() => {
        const reloadTab = navigation.addListener('focus', (e) => {
            setIsReady(false)
        });
        return reloadTab;
    }, [navigation]);

    const _loadTasks = async () => {
        const loadedTasks = await AsyncStorage.getItem('tasks');
        setTasks(JSON.parse(loadedTasks || '{}'));
    };


    const _saveTasks = async tasks => {
        try {
            await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
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
        const editScreen = navigation.navigate('EDIT', { selectedTask: currentTasks[id], taskID: id });
        return editScreen;
    };

    const [sortingData, setSortingData] = useState(true);

    return isReady ? (
        <SafeAreaView style={viewStyles.container}>
            <StatusBar barStyle="light-content" style={barStyles.statusbar} />
            <View style={cardStyles.card}>
                <View style={rowStyles.category}>
                    <CustomButton text="sortS" onPress={() => setSortingData(true)} />
                    <Text style={textStyles.title}>{selectedCategory.text}</Text>
                    <CustomButton text="sortD" onPress={() => setSortingData(false)} />
                </View>
                <ScrollView width={width - 20} onLoad={() => route.params}>
                    {Object.values(tasks).reverse()
                        .sort((a, b) => {
                            if (sortingData) {
                                return (a.startdate > b.startdate) ? 1 : -1;
                            } else {
                                return (a.duedate > b.duedate) ? 1 : -1;
                            }
                        }).filter((filterItem) => {
                            if (filterItem.category == categoryID) {
                                return filterItem
                            }
                        }).map(item => (
                            <Task key={item.id} item={item} editTask={_editTask} deleteTask={_deleteTask} toggleTask={_toggleTask} />
                        ))
                    }
                </ScrollView>
            </View>
        </SafeAreaView>
    ) : (
        <AppLoading
            startAsync={_loadTasks}
            onFinish={() => setIsReady(true)}
            onError={console.error} />
    );
};


const style = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.itemBackground,
        borderRadius: 10,
        margin: 3, /* */
        marginTop: 3,
        marginLeft: 0,
    },
    contents: {
        flex: 1,
        fontSize: 20,
        color: theme.text,
    },
});
