import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, StatusBar, SafeAreaView, Text, Dimensions, ScrollView, View, TextInput } from 'react-native';
import { viewStyles, textStyles, barStyles } from '../styles';
import { theme } from '../theme';
import { images } from '../images';
import IconButton from '../components/IconButton';
import Input from '../components/Input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';

export default function EditScreen({ navigation, route }) {
  const width = Dimensions.get('window').width;

  const [isReady, setIsReady] = useState(false);
  const [tasks, setTasks] = useState({});
  const [categories, setCategories] = useState({});

  const { selectedTask, taskID } = route.params;

  useEffect(() => {
    const reloadTab = navigation.addListener('focus', (e) => {
      setIsReady(false)
    });
    return reloadTab;
  }, [navigation]);


  const _saveTasks = async selectedTask => {
    try {
      await AsyncStorage.setItem('selectedTask', JSON.stringify(selectedTask));
      setTasks(selectedTask);
    } catch (e) {
      console.error(e);
    }
  };

  const _saveComment = (item) => {
    selectedTask.comment = item;
    _saveTasks(selectedTask);
  }

  const _load = async () => {
    const loadedTasks = await AsyncStorage.getItem('selectedTask');
    const loadedCategories = await AsyncStorage.getItem('categories');
    setTasks(JSON.parse(loadedTasks || '{}'));
    setCategories(JSON.parse(loadedCategories || '{}'));
  };


  const _updateTask = item => {
    navigation.setParams({ selectedTask: item, });
    _saveTasks(selectedTask);
  };

  /*duedate 설정*/
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || JSON.parse(selectedTask.duedate);
    setShow(Platform.OS === 'Android');
    if(event.type == "set"){
      setDate(currentDate);
      alert(`Due: ${currentDate.getMonth() + 1}/${currentDate.getDate()}`);
      selectedTask.duedate = JSON.stringify(currentDate);
      setIsReady(false);
    }
    else{
      return null;
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };


  //var due = new Date(JSON.parse(selectedTask.duedate));

  /*이미지 넣기*/
  // const[photoUrl, setPhotoUrl] = useState(images.photo);
  const changevalue = (value) => {
    selectedTask.category = value;
    setIsReady(false);
  }

  var due = selectedTask.duedate.split('T')[0] + "\"";

  return isReady ? (
    <SafeAreaView style={viewStyles.container}>
      <StatusBar barStyle="light-content" style={barStyles.statusbar} />
      <ScrollView width={width - 20} onLoad={() => route.params}>
        <Text style={textStyles.contents}>
          Category
        </Text>
        <RNPickerSelect
          value={selectedTask.category}
          onValueChange={changevalue}
          //placeholder={{label: "Select a Category"}}
          items={(() => Object.values(categories).map((item) =>
            ({ label: item.text, value: item.id })
          ))() }
        />
        <EditTask key={taskID} item={selectedTask} duedate={selectedTask.duedate} updateTask={_updateTask} />
        <Text style={textStyles.contents}>
          {/*Due: {due.getMonth() + 1} / {due.getDate()}    원래 깔끔하게 형식 바꿔서 출력하고 싶었는데 JSON.parse 한 번 더 한 것 때문에 오류남*/}
          Due: {due}
        </Text>
        <Button title="Set Due Date" onPress={showDatepicker} />
        {show && <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={date}
          display="default"
          onChange={onChange}
        />}

        <Comment item={selectedTask.comment} saveComment={_saveComment} />

      </ScrollView>
      <Button title="Save" onPress={() => {
        navigation.navigate({
          name: 'main',
          params: { task: selectedTask, id: taskID },
          merge: true,
        })
      }} />
    </SafeAreaView>
  ) : (
    <AppLoading
      startAsync={_load}
      onFinish={() => setIsReady(true)}
      onError={console.error} />
  );
};


const EditTask = ({ item, updateTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(item.text);


  const _handleUpdateButtonPress = () => {
    setIsEditing(true);
  };
  const _onSubmitEditing = () => {
    if (isEditing) {
      const editedTask = Object.assign({}, item, { text });
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
      {<IconButton type={images.update} onPressOut={_handleUpdateButtonPress} />}
    </View>
  );

};

const taskStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.itemBackground,
    borderRadius: 10,
    margin: 3,
    /* padding: 3, */
    marginTop: 3,
    marginLeft: 0,
  },
  contents: {
    flex: 1,
    fontSize: 20,
    color: theme.text,
  },
});

const Comment = ({ item, saveComment }) => {
  const [isEditing, setIsEditing] = useState(true);
  const [text, setText] = useState(item);

  const _handleUpdateButtonPress = () => {
    setIsEditing(true);
  };

  const _onSubmitEditing = () => {
    if (isEditing) {
      setIsEditing(false);
      saveComment(text);
    }
  };

  const _onBlur = () => {
    if (isEditing) {
      setIsEditing(false);
      setText(text);
      saveComment(text);
    }
  };

  return isEditing ? (
    <View style={commentStyle.container}>
      <TextInput
        style={commentStyle.textInput}
        value={text}
        placeholder="comment... press to write"
        placeholderTextColor={theme.text}
        onChangeText={text => setText(text)}
        onSubmitEditing={_onSubmitEditing}
        onBlur={_onBlur}
        multiline={true}
      />
    </View>
  ) : (
    <View style={commentStyle.container}>
      <Text style={commentStyle.contents} onPress={_handleUpdateButtonPress}>
        {text}</Text>
    </View>
  );
};

const commentStyle = StyleSheet.create({
  textInput: {
    fontSize: 15,
    width: Dimensions.get('window').width - 20,
    marginLeft: 3,
    marginRight: 3,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 2,
    borderRadius: 10,
    backgroundColor: theme.itemBackground,
    color: theme.main,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.itemBackground,
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
    marginLeft: 0,
  },
  contents: {
    flex: 1,
    fontSize: 15,
    paddingLeft: 15,
    paddingRight: 15,
    color: theme.main,
  },
});