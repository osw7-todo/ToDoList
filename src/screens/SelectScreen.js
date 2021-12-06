import React, { useState, Component } from 'react';
import {StyleSheet, Button, StatusBar, SafeAreaView, Text, Dimensions, ScrollView, View} from 'react-native';
import {viewStyles, textStyles, barStyles, cardStyles, topbarStyles} from '../styles';
import {theme} from '../theme';
import { images } from '../images';
import IconButton from '../components/IconButton';
import Task from '../components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function SelectScreen({navigation, route}) {
    //Issue
    const Issue = () => {
        const [bChecked, setChecked] = useState(false);

        const checkHandler = ({ target }) => {
        setChecked(!bChecked);
        checkedItemHandler(issue.id, target.checked);
        };

        const allCheckHandler = () => setChecked(isAllChecked);

        useEffect(() => allCheckHandler(), [isAllChecked]);

        return (
          <Wrapper>
            <input type="checkbox" checked={bChecked} onChange={(e) => checkHandler(e)} />
          </Wrapper>
        );
    };

    //IssueList
    const IssueList = ({ item, deleteTask}) => {
        const issues = [...Array(10).keys()]; // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        
        /*Check box 개별 선택, 개별 해제*/
        const [checkedItems, setCheckedItems] = useState(new Set());

        const checkedItemHandler = (id, isChecked) => {
            if (isChecked) {
              checkedItems.add(id);
              setCheckedItems(checkedItems);
            } else if (!isChecked && checkedItems.has(id)) {
              checkedItems.delete(id);
              setCheckedItems(checkedItems);
            }
          };

        /*Check box 전체 선택, 전체 해제*/
        const [isAllChecked, setIsAllChecked] = useState(false);

        const allCheckedHandler = (isChecked) => {
            if (isChecked) {
                setCheckedItems(new Set(issues.map(({ id }) => id)));
                setIsAllChecked(true);
            } else {
                checkedItems.clear();
                setCheckedItems(setCheckedItems);
                setIsAllChecked(false);
            }
        };

        return (
            <>
            <Header>
                <input type="checkbox" />
            </Header>
            <List>
                {issues.map((issue, index) => (
                <Issue key={index} />
                ))}
            </List>
            </>
        );
    };  

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

    return isReady? (
        <SafeAreaView style={viewStyles.container}>
            <StatusBar barStyle="light-content" style={barStyles.statusbar}/>    
            
            <View style={cardStyles.card}> 
                <ScrollView width = {width-20}>
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