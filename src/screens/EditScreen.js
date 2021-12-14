import React, {useState, useEffect} from 'react';
import {StyleSheet, Button, StatusBar, SafeAreaView, Text, Dimensions, ScrollView, View} from 'react-native';
import {viewStyles, textStyles, barStyles, cardStyles, topbarStyles, bottombarStyles} from '../styles';
import {theme} from '../theme';
import { images } from '../images';
import IconButton from '../components/IconButton';
import Input from '../components/Input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import User from '../components/User';
import UserContext, {UserProvider} from '../contexts/User';

export default function EditScreen({navigation, route}){
    const width = Dimensions.get('window').width;

    const [isReady, setIsReady] = useState(false);
    const [tasks, setTasks] = useState({});

    const {selectedTask, taskID} = route.params;

    useEffect(()=>{
      const reloadTab = navigation.addListener('focus',(e)=>{
          setIsReady(false)
      });
      return reloadTab;
    },[navigation]);


  const _saveTasks = async selectedTask => {
    try {
        await AsyncStorage.setItem('selectedTask',JSON.stringify(selectedTask));
        setTasks(selectedTask);
    } catch (e) {
        console.error(e);
    }
};

    const _loadTasks = async () => {
      const loadedTasks = await AsyncStorage.getItem('selectedTask');
      setTasks(JSON.parse(loadedTasks || '{}'));
    };


    const _updateTask = item => {
      navigation.setParams({selectedTask: item,});
      //setTasks(currentTasks);
      _saveTasks(selectedTask);
  };

  /*duedate 설정*/
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || JSON.parse(selectedTask.duedate);
        setShow(Platform.OS === 'Android');
        setDate(currentDate);
        alert(`Due: ${currentDate.getMonth()+1}/${currentDate.getDate()}`);
        selectedTask.duedate = JSON.stringify(currentDate);
        setIsReady(false);
      };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
      };
    
      const showDatepicker = () => {
        showMode('date');
      };


      /*카테고리 설정*/
     // const [categories, setCategories] = useState(<User/>);


      //var due = new Date(JSON.parse(selectedTask.duedate));

    return isReady? (
      <UserProvider>
        <SafeAreaView style={viewStyles.container}>
          <StatusBar barStyle="dark-content" style={barStyles.statusbar}/>
            <ScrollView width={width-20} onLoad={()=>route.params}>
            <Text style={textStyles.contents}>
            Select a Category
            </Text>
           {/* <RNPickerSelect onValueChange={(value) => console.log(value)}
            items=
            {Object.values(<User/>).map(item=>
                [{ label: item.text, value: item.id},]
                )}
            /> */}
            <EditTask key={taskID} item={selectedTask} duedate={selectedTask.duedate} updateTask={_updateTask}/>
            <Text style={textStyles.contents}>
            {/*Due: {due.getMonth() + 1} / {due.getDate()}    원래 깔끔하게 형식 바꿔서 출력하고 싶었는데 JSON.parse 한 번 더 한 것 때문에 오류남*/}
             Due: {selectedTask.duedate}
            </Text>
            <Button title="Set Due Date" onPress={showDatepicker}/>
            {show && <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={date}
            display="default"
            onChange = {onChange}
            />}
            </ScrollView>
            <Button title="Save" onPress={() =>{
              navigation.navigate({
                name: 'main',
                params: {task: selectedTask, id: taskID},
                merge: true,
              })
            }}/>
        </SafeAreaView>
        </UserProvider>
    ) : (
      <AppLoading
      startAsync = {_loadTasks}
      onFinish={()=>setIsReady(true)}
      onError={console.error}/>
    );
};


const EditTask = ({item, updateTask, setDueDate}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(item.text);


  const _handleUpdateButtonPress = () => {
      setIsEditing(true);
  };
  const _onSubmitEditing = () => {
      if (isEditing) {
          const editedTask = Object.assign({}, item, {text});
          setIsEditing(false);
          updateTask(editedTask);
      }
  };
  const _onBlur = () => {
      if (isEditing) {
          setIsEditing(false);
          setText(item.text);
      }
  };


  return isEditing ? (
      <Input value={text} onChangeText={text => setText(text)}
      onSubmitEditing={_onSubmitEditing}
      onBlur={_onBlur} />
  ) : (
      <View style={taskStyle.container}>
          <Text style={taskStyle.contents}>
          {item.text}</Text>
          {<IconButton type = {images.update} onPressOut={_handleUpdateButtonPress}/>}
      </View>
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
  contents: {
      flex: 1,
      fontSize: 20,
      color: theme.text,
  },
});