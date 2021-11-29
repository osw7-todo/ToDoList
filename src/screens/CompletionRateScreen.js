/*진행 중인 페이지 just for testing*/
import React, {useState, useEffect} from 'react';
import {Button, StatusBar, SafeAreaView, Text, Dimensions, ScrollView, View} from 'react-native';
import {viewStyles, textStyles, barStyles, cardStyles, generalTextStyles} from '../styles';
import { images } from '../images';
import IconButton from '../components/IconButton';
import Task from '../components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CompletionRate({navigation, route}) { 
  const width = Dimensions.get('window').width;

  const [isReady, setIsReady] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState({ //
      /*'1' : {id: '1', text: "Todo item #1", completed: false},
      '2' : {id: '2', text: "Todo item #2", completed: true},*/
  });

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  React.useEffect(()=>{
      const reloadTab = navigation.addListener('focus',(e)=>{
          setIsReady(false)
      });
      return reloadTab;
  },[navigation]);

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

  var now = new Date();
  var month = now.getMonth() + 1;
  var today = now.getDate();

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

  const doneTasks = Object.values(tasks).reverse().filter((filterItem)=>{
    if(filterItem.completed == true) {return filterItem}
  })

  return  isReady? (
      <SafeAreaView style={viewStyles.container}>
          <StatusBar barStyle="light-content" style={barStyles.statusbar}/> 
          
          <View style={cardStyles.card}>
              <ScrollView width = {width-20} onLoad={(route)=>_addTask(route.params)}>
                <Text style={generalTextStyles.text}> 전체 {Object.values(tasks).length}개 중에</Text>
                <Text style={generalTextStyles.text}> {doneTasks.length}개 완료</Text>
                <Text style={generalTextStyles.text}> completion rate: {(doneTasks.length/Object.values(tasks).length * 100).toFixed(2)}% </Text>
              </ScrollView>
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