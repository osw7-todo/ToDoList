import React, { useState } from 'react';
import { StatusBar, SafeAreaView, Text, Dimensions, ScrollView, View } from 'react-native';
import { viewStyles, barStyles, cardStyles, generalTextStyles } from '../styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';

export default function CompletionRate({ navigation, route }) {
    const width = Dimensions.get('window').width;
    const [isReady, setIsReady] = useState(false);

    const [tasks, setTasks] = useState({ //
        /*'1' : {id: '1', text: "Todo item #1", completed: false},
        '2' : {id: '2', text: "Todo item #2", completed: true},*/
    });
    const [categories, setCategories] = useState({});

    React.useEffect(() => {
        const reloadTab = navigation.addListener('focus', (e) => {
            setIsReady(false)
        });
        return reloadTab;
    }, [navigation]);


    const _load = async () => {
        const loadedTasks = await AsyncStorage.getItem('selectedTask');
        const loadedCategories = await AsyncStorage.getItem('categories');
        setTasks(JSON.parse(loadedTasks || '{}'));
        setCategories(JSON.parse(loadedCategories || '{}'));
    };


    /* [완료된 일 개수 세기]
    * 완료된 일을 doneTasks배열에 저장
    * 그 후에 doneTask.length를 이용하면, 개수를 셀 수 있음.
    */

    /* [전체 개수 세기]
    * {Object.values(tasks).length} 로 개수 셀 수 있음.
    */

    /*
    * (미완료된 일)/(전체개수) 를 하면, 비율을 알 수 있음.
    * 이때 소수점 반올림은, (숫자).toFixed(2)로 가능. 소수점이하 수를 2자리로 고정한다는 의미.
    */

    const doneTasks = Object.values(tasks).reverse().filter((filterItem) => {
        if (filterItem.completed == true) { return filterItem }
    })

    return isReady ? (
        <SafeAreaView style={viewStyles.container}>
            <StatusBar barStyle="light-content" style={barStyles.statusbar} />

            <View style={cardStyles.card}>

                <ScrollView width={width - 20} onLoad={(route) => _addTask(route.params)}>
                    <Text style={generalTextStyles.text}> [All] </Text>
                    <Text style={generalTextStyles.text}> done: {doneTasks.length}   /   total:{Object.values(tasks).length} </Text>
                    <Text style={generalTextStyles.text}> completion rate: {(doneTasks.length / Object.values(tasks).length * 100).toFixed(2)}% </Text>
                    {Object.values(categories).map(item => (
                        <CategoryCompletion key={item.id} item={item} tasks={tasks}/>
                    ))}
                </ScrollView>

            </View>
        </SafeAreaView>
    ) : (
        <AppLoading
            startAsync={_load}
            onFinish={() => setIsReady(true)}
            onError={console.error} />
    );
};

const CategoryCompletion = ({ item, tasks }) => {

    const doneTasks = Object.values(tasks).reverse().filter((filterItem) => {
        if(filterItem.category == item.id){
            if (filterItem.completed == true){
                return filterItem }
        }
    });

    const allTasks = Object.values(tasks).filter((filterItem) =>
        {if (filterItem.category == item.id) { return filterItem }});

    return (
        <View>
            <Text style={generalTextStyles.text}> [{item.text}] </Text>
            <Text style={generalTextStyles.text}> done: {doneTasks.length}   /   total:{allTasks.length} </Text>
            <Text style={generalTextStyles.text}> completion rate: {(doneTasks.length / allTasks.length * 100).toFixed(2)}*% </Text>
        </View>
    );
};