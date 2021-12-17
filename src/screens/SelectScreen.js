import React, { useState, Component, useCallback } from 'react';
import {StyleSheet, StatusBar, SafeAreaView, Text, Dimensions, ScrollView, View} from 'react-native';
import {viewStyles, barStyles, cardStyles} from '../styles';
import {theme} from '../theme';
import { images } from '../images';
import IconButton from '../components/IconButton';
import CustomButton from '../components/custombutton';
import Task from '../components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import { CheckBox } from 'react-native-elements/dist/checkbox/CheckBox';

export default function SelectScreen({navigation, route}) {
    const width = Dimensions.get('window').width;

    const [isReady, setIsReady] = useState(false);
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
        _saveTasks(currentTasks);
    };

    /* checkbox 구현방법 2 */
    const [checkedList, setCheckedList] = useState([]);
    const dataLists = Object.values(tasks).reverse(); //dataList에 해당화면에서 넘어온 항목들 저장
    
    // 전체 체크 클릭 시 발생하는 함수
    //문제점: !checked를 하면 전체선택만 되고, checked를 하면 전체해제만 되고... 어쨌든 둘 중 하나만 계속 작동됨. toggle이 안됨..
    const onCheckedAll = useCallback(
        (checked) => {
            alert("전체 클릭 함수 호출됨")
            if (!checked) {
                const checkedListArray = [];

                alert("전체 선택됨")
                dataLists.forEach((item) => checkedListArray.push(item));
                setCheckedList(checkedListArray);
            } else {
                alert("전체 해제됨")
                setCheckedList([]);
            }
        },
        [dataLists]
    );
    
    // 개별 체크 클릭 시 발생하는 함수
    //문제점: !checked를 하면 개별선택만 잘되고, checked를 하면 개별해제만 되고... 위의 거랑 같은 상황
    const onCheckedElement = useCallback(
        (checked, item) => {
            alert("개별 클릭 호출됨")
            if (checked) {
                alert("개별 선택")
                setCheckedList([...checkedList, item]);
            } else {
                alert("개별 해제")
                setCheckedList(checkedList.filter((el) => el !== item));
            }
        },
        [checkedList]
    );

    // 선택된 거 삭제하는 함수
    const deleteSelectedTask = () => {
            alert("삭제함수 호출됨")
            {/* 문제점: list 맨 마지막꺼 한개만 삭제됨. */}
            checkedList.forEach((item) => _deleteTask(item.id));
            setCheckedList([]);
    }

    const [check, setCheck] = useState(false);

    return isReady? (
        <SafeAreaView style={viewStyles.container}>
            <StatusBar barStyle="dark-content" style={barStyles.statusbar}/>    
            
            <View style={cardStyles.card}> 
                <ScrollView width = {width-20}>
                {checkedList.map((task)=> ( <Text> {task.text} {task.id}</Text>))}
                    {dataLists.map((item)=> (
                        <View style={taskStyle.container}>
                            {/* checkbox */}
                            <CheckBox
                                key={item.id}
                                onPress={(e) => onCheckedElement(e.target.checked, item)}
                                checked={ alert("개별선택 상태바뀜"),  checkedList.includes(item) ? true : false  }
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
                    <CheckBox
                        onPress={(e) => onCheckedAll(e.target.checked)}
                        checked={
                            alert("전체선택 상태바뀜"),
                            checkedList.length === 0
                                ? false
                                : checkedList.length === dataLists.length
                                ? true
                                : false
                        }
                    />
                    <IconButton type={images.delete} onPressOut={deleteSelectedTask} style={{justifyContent: 'felx-end'}}/>
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