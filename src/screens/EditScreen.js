import React, {useState, useEffect} from 'react';
import {Button, StatusBar, SafeAreaView, Text, Dimensions, ScrollView, View} from 'react-native';
import {viewStyles, textStyles, barStyles, cardStyles, topbarStyles, bottombarStyles} from '../styles';
import { images } from '../images';
import IconButton from '../components/IconButton';
import Task from '../components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';

export default function EditScreen({navigation, route}){
    const width = Dimensions.get('window').width;

    const [newCategory, setNewCategory] = useState('');
    const [categories, setCategories] = useState({});

    const [tasks, setTasks] = useState({});

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
 

    const onChange = (id, selectedDate) => {
        const currentTasks = Object.assign({}, tasks);
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'Android');
        setDate(currentDate);
        currentTasks[id.duedate] = currentDate;
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


    return(
        <SafeAreaView styles={viewStyles.container}>
            <ScrollView>
                <Text styles={textStyles.title}> Set Category </Text>
            <RNPickerSelect onValueChange={(value) => console.log(value)}
            items=
            {Object.values(categories).map(item=>
                [{ label: item.text, value: item.id },]
                )}
            />

            <Button title="Set Due Date" onPress={showDatepicker}/>
            {show && <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={date}
            display="default"
            onChange = {onChange}
            />}  
            </ScrollView>
        </SafeAreaView>
    );
};