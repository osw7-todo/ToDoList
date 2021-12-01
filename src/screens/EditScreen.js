import React, {useState, useEffect} from 'react';
import {StyleSheet, Button, StatusBar, SafeAreaView, Text, Dimensions, ScrollView, View} from 'react-native';
import {viewStyles, textStyles, barStyles, cardStyles, topbarStyles, bottombarStyles} from '../styles';
import {theme} from '../theme';
import { images } from '../images';
import IconButton from '../components/IconButton';
import Task from '../components/Task';
import Input from '../components/Input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';

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
      navigation.setParams({selectedTask: item});
      //setTasks(currentTasks);
      _saveTasks(selectedTask);
  };

  /*duedate 설정*/
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

    const onChange = (id, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'Android');
        setDate(currentDate);
        var formattedDate = (currentDate.getMonth() + 1) + "/" + currentDate.getDate();
        selectedTask.duedate = formattedDate;
        alert(`Due: ${formattedDate}`);
      };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
      };
    
      const showDatepicker = () => {
        showMode('date');
      };


/*카테고리 설정*/
      const [newCategory, setNewCategory] = useState('');
      const [categories, setCategories] = useState({
          /*  '1' : {id: '1', text: "Category #1"},
            '2' : {id: '2', text: "Category #2"}, */
        });
        
      const _addCategory = () => {
          const ID = Date.now().toString();
          const newCategoryObject = {
              [ID]: {id: ID, text: newCategory},
          };
      
          setNewCategory('');
          //setTasks({...tasks, ...newTaskObject});
          _saveCategories({...categories, ...newCategoryObject});
      }
      
        const _saveCategories = async categories => {
          try {
              await AsyncStorage.setItem('categories',JSON.stringify(categories));
              setCategories(categories);
          } catch (e) {
              console.error(e);
          }
        };


    return isReady? (
        <SafeAreaView style={viewStyles.container}>
          <StatusBar barStyle="dark-content" style={barStyles.statusbar}/>
            <ScrollView width={width-20} onLoad={()=>route.params}>
            <Text style={textStyles.contents}>
            Select a Category
            </Text>
            <RNPickerSelect onValueChange={(value) => console.log(value)}
            items=
            {Object.values(categories).map(item=>
                [{ label: item.text, value: item.id },]
                )}
            />
            <EditTask key={taskID} item={selectedTask} duedate={selectedTask.duedate} updateTask={_updateTask}/>
            <Text style={textStyles.contents}>
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
            <Button title="Save" onPress={()=> navigation.goBack()}/>
        </SafeAreaView>
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

}

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