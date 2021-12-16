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
        //setTasks(currentTasks);
        _saveTasks(currentTasks);
    };
   
    const _getData = async() => {
        try {
            await AsyncStorage.getAllKeys().then(async keys => {
                await AsyncStorage.multiGet(keys).then(key => {
                  key.forEach(data => {
                    //Object.values(data).reverse().map(function(item){ console.log(item) })
                    console.log(data[1]); //values
                  });
                });
            });
        } catch (error) {
            console.log(error);
        }
        //AsyncStorage.getAllKeys().then((keys)=> AsyncStorage.multiGet(keys).then((keys)=>console.log(keys[1])))

        /*
        AsyncStorage.setItem('KEY', JSON.stringify(array));
        Object.values(AsyncStorage.getAllKeys).reverse().map(function(item){
            console.log(item)
        });
        */
        
        /*
        const keys = await AsyncStorage.getAllKeys;
        const result = await AsyncStorage.multiGet(keys);
        return result.map(req => JSON.parse(req)).forEach(console.log);
        */
    }

    /* checkbox 구현방법 2 */
    const [checkedList, setCheckedList] = useState([]);
    const dataLists = Object.values(tasks).reverse(); //dataList에 해당화면에서 넘어온 항목들 저장
    
    // 전체 체크 클릭 시 발생하는 함수
    const onCheckedAll = useCallback(
        (checked) => {
        alert("전체 클릭 함수 호출됨")
        if (checked) {
            alert("전체 선택됨")
            dataLists.forEach((item) => checkedList.push(item.id));
            setCheckedList(checkedList);
        } else {
            alert("전체 해제됨")
            setCheckedList([]);
        }
        },
        [dataLists]
    );
    
    // 개별 체크 클릭 시 발생하는 함수
    const onCheckedElement = useCallback(
        (checked, item) => {
            alert("개별 클릭 호출됨")
            if (checked) {
                alert("개별 선택")
                checkedList.push(item.id);
                setCheckedList(checkedList);
            } else {
                alert("개별 해제")
                setCheckedList(checkedList.filter((el) => el !== item.id));
            }
        },
        [checkedList]
    );

    // 선택된 거 삭제하는 함수
    const deleteSelectedTask = useCallback(
        (checked, item) => {
            alert("개별 클릭 호출됨")
            if (checked) {
                setCheckedLists([...checkedList, item]);
            } else {
                setCheckedLists(checkedList.filter((el) => el !== item));
            }
        },
        [checkedList]
    );

    const [check, setCheck] = useState(false);

    return isReady? (
        <SafeAreaView style={viewStyles.container}>
            <StatusBar barStyle="dark-content" style={barStyles.statusbar}/>    
            
            <View style={cardStyles.card}> 
                <ScrollView width = {width-20}>
                    {dataLists.map((item)=> (
                        <View style={taskStyle.container}>
                            {/* checkbox */}
                            <CheckBox
                                key={item.id}
                                onPress={(e) => onCheckedElement(e.target.checked, item)}
                                checked={ alert("개별선택 상태바뀜"), checkedList.includes(item.id) ? true : false }
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
                    <IconButton type={images.delete} style={{justifyContent: 'felx-end'}}/>
                    <CustomButton text = "test" onPress={_getData}/>
                    <CheckBox checked={check} onPress={() => setCheck(!check)} />
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