import React, {useState, useEffect} from 'react';
import {StyleSheet, Button, StatusBar, SafeAreaView, Text, Dimensions, ScrollView, View} from 'react-native';
import {viewStyles, textStyles, barStyles, cardStyles, topbarStyles, bottombarStyles} from '../styles';
import {theme} from '../theme';
import { images } from '../images';
import IconButton from '../components/IconButton';
import Task from '../components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import DateTimePicker from '@react-native-community/datetimepicker';
import Search from '../components/Search';

export default function ViewAll({navigation, route}) {   
    const width = Dimensions.get('window').width;

    const [isReady, setIsReady] = useState(false);
    const [newTask, setNewTask] = useState('');
    const [tasks, setTasks] = useState({ //
        /*'1' : {id: '1', text: "Todo item #1", completed: false},
        '2' : {id: '2', text: "Todo item #2", completed: true},*/
    });

    const [searchText, setSearchText] = useState('');

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    React.useEffect(()=>{
        const reloadTab = navigation.addListener('focus',(e)=>{
            setIsReady(false)
        });
        return reloadTab;
    },[navigation]);

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

    const _setDueDate = item => {
        const currentTasks = Object.assign({}, tasks);
        showDatepicker();
        setTasks(currentTasks);
    };

     /*=== 체크박스 전체 단일 개체 선택 ===*/
    const handleSingleCheck = (checked, id) => {
        if (checked) {
        setCheckItems([...checkItems, id]);
        } else {
        // 체크 해제
        setCheckItems(checkItems.filter((el) => el !== id));
        }
    };

    /*=== 체크박스 전체 선택 ===*/
    const handleAllCheck = (checked) => {
        if (checked) {
        console.log("wow");
        const idArray = [];
        // 전체 체크 박스가 체크 되면 id를 가진 모든 elements를 배열에 넣어주어서,
        // 전체 체크 박스 체크
        posts.forEach((el) => idArray.push(el.id));
        setCheckItems(idArray);
        }

        // 반대의 경우 전체 체크 박스 체크 삭제
        else {
        setCheckItems([]);
        }
    };

    {/*const image = focused ? require('../assets/due-date.png') : require('../assets/due-date.png') */}
    //when onPress IconButton, show searchbar
    return  isReady? (
        <SafeAreaView style={viewStyles.container}>
            <StatusBar barStyle="dark-content" style={barStyles.statusbar}/> 
            
            <View style={cardStyles.card}> 
                <ScrollView width = {width-20} onLoad={(route)=>_addTask(route.params)}>
                    {Object.values(tasks).reverse().filter((filterItem)=>{
                        return filterItem
                    }).map(item=> (
                        <View style={taskStyle.container}>
                            
                            <Text style={[taskStyle.contents,
                            {color: (item.completed? theme.done : theme.text)},
                            {textDecorationLine: (item.completed? 'line-through' : 'none')}]}>
                            {item.text}</Text>
                        </View>
                    ))}
                </ScrollView>
                <View style={{flexDirection: 'row'}}>
                    {/*아이콘 양끝 정렬 구현안됨. flex-start(end)써도 왜 적용이 안되는지 잘 모르겠음*/}
                    <IconButton type={images.uncompleted} style={{justifyContent: 'felx-start'}} />
                    <IconButton type={images.delete} style={{justifyContent: 'felx-end'}}/>
                </View>
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