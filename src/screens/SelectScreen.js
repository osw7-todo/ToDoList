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

export default function All_Select({navigation, route}) {   
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

    const CheckBox = () => {
        const [checkedList, setCheckedLists] = useState([]);
      
        // 전체 체크 클릭 시 발생하는 함수
        const onCheckedAll = useCallback(
          (checked) => {
            if (checked) {
              const checkedListArray = [];
      
              dataLists.forEach((list) => checkedListArray.push(list));
      
              setCheckedLists(checkedListArray);
            } else {
              setCheckedLists([]);
            }
          },
          [dataLists]
        );
      
        // 개별 체크 클릭 시 발생하는 함수
        const onCheckedElement = useCallback(
          (checked, list) => {
            if (checked) {
              setCheckedLists([...checkedList, list]);
            } else {
              setCheckedLists(checkedList.filter((el) => el !== list));
            }
          },
          [checkedList]
        );
      };


    {/*const image = focused ? require('../assets/due-date.png') : require('../assets/due-date.png') */}
    //when onPress IconButton, show searchbar
    return  isReady? (
        <SafeAreaView style={viewStyles.container}>
            <StatusBar barStyle="dark-content" style={barStyles.statusbar}/> 
           
        
            <View style={cardStyles.card}> 
                <ScrollView width = {width-20} onLoad={(route)=>_addTask(route.params)}>
                {/* 전체선택 checkbox */}
                <input
                    type="checkbox"
                    onChange={(e) => onCheckedAll(e.target.checked)}
                    checked={
                    checkedList.length === 0
                        ? false
                        : checkedList.length === dataLists.length
                        ? true
                        : false
                    }
                />
                    {/* 리스트 나열 */}
                    {Object.values(tasks).reverse().filter((filterItem)=>{
                        return filterItem
                    }).map(item=> (
                        <View style={taskStyle.container}>
                            {/* checkbox */}
                            <input
                                key={item.id}
                                type="checkbox"
                                onChange={(e) => onCheckedElement(e.target.checked, list)}
                                checked={checkedList.includes(list) ? true : false}
                                />
                            {/* 할 일 text */}
                            <Text 
                            style={[taskStyle.contents,
                            {color: (item.completed? theme.done : theme.text)},
                            {textDecorationLine: (item.completed? 'line-through' : 'none')}]}
                            key={item.id} >
                            {item.text} </Text>
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