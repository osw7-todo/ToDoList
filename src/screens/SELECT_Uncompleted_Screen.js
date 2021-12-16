import React, { useState, Component, useCallback } from 'react';
import {StyleSheet, Button, StatusBar, SafeAreaView, Text, Dimensions, ScrollView, View} from 'react-native';
import {viewStyles, textStyles, barStyles, cardStyles, topbarStyles} from '../styles';
import {theme} from '../theme';
import { images } from '../images';
import IconButton from '../components/IconButton';
import Task from '../components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';

export default function SELECT_Uncompleted_Screen({navigation, route}) {
    const width = Dimensions.get('window').width;

    const [isReady, setIsReady] = useState(false);
    const [newTask, setNewTask] = useState('');
    const [tasks, setTasks] = useState({ //
        /*'1' : {id: '1', text: "Todo item #1", completed: false},
        '2' : {id: '2', text: "Todo item #2", completed: true},*/
    });

    React.useEffect(()=>{
        const reloadTab = navigation.addListener('focus',(e)=>{
            setIsReady(false)
        });
        return reloadTab;
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

    const _deleteTask = id => {
        const currentTasks = Object.assign({}, tasks);
        delete currentTasks[id];
        //setTasks(currentTasks);
        _saveTasks(currentTasks);
    };


    /* checkbox 구현방법 2 */
    const [checkedList, setCheckedLists] = useState([]);
    
    //dataList에 항목들 저장
    const dataLists = Object.values(tasks).reverse().filter((filterItem)=>{
        if(filterItem.completed == true) {return filterItem}
    })

    // 전체 체크 클릭 시 발생하는 함수
    const onCheckedAll = useCallback(
        (checked) => {
        if (checked) {
            const checkedListArray = [];
    
            dataLists.forEach((item) => checkedListArray.push(item));
    
            setCheckedLists(checkedListArray);
        } else {
            setCheckedLists([]);
        }
        },
        [dataLists]
    );
    
    // 개별 체크 클릭 시 발생하는 함수
    const onCheckedElement = useCallback(
        (checked, item) => {
            if (checked) {
                setCheckedLists([...checkedList, item]);
            } else {
                setCheckedLists(checkedList.filter((el) => el !== item));
            }
        },
        [checkedList]
    );

    return isReady? (
        <SafeAreaView style={viewStyles.container}>
            <StatusBar barStyle="dark-content" style={barStyles.statusbar}/>    
            
            <View style={cardStyles.card}> 
                <ScrollView width = {width-20}>
                    {Object.values(tasks).reverse().filter((filterItem)=>{
                        if(filterItem.completed == false){
                            return filterItem
                        } 
                    }).map(item=> (
                        <View style={taskStyle.container}>
                            {/* checkbox */}
                            {/* <input type = "checkbox"쓰고 싶은데, function이어야한다면서 console error발생...*/}
                            <IconButton
                                key={item.id}
                                type={images.uncompleted}
                                onChange={(e) => onCheckedElement(e.target.checked, item)}
                                checked={checkedList.includes(item) ? true : false}
                            />
    
                            {/* 할 일 text */}
                            <Text style={[taskStyle.contents,
                            {color: (item.completed? theme.done : theme.text)},
                            {textDecorationLine: (item.completed? 'line-through' : 'none')}]}>
                                {item.text} 
                            </Text>
                        </View>
                    ))}
                </ScrollView>
       
                <View style={{flexDirection: 'row'}}>
                    {/*전체선택/해제 여부를 입력받는 checkbox*/}
                    <IconButton
                        type={images.uncompleted}
                        onChange={(e) => onCheckedAll(e.target.checked)}
                        checked={
                        checkedList.length === 0
                            ? false
                            : checkedList.length === dataLists.length
                            ? true
                            : false
                        }
                    />
                    <IconButton type={images.delete} style={{justifyContent: 'felx-end'}}/>
                </View>
            </View>
        </SafeAreaView>
    )   :   (
        <AppLoading
            startAsync = {_loadTasks}
            onFinish={()=>setIsReady(true)}
            onError={console.error}/>
    );
};

const taskStyle = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.itemBackground,
        borderRadius: 10,
        padding: 3, 
        marginTop: 3,
        marginLeft: 0,
    },
    hiddenContainer: {
        flexDirection: 'row-reverse',
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