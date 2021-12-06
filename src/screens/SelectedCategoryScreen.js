import React, {useState, useEffect} from 'react';
import {StyleSheet, Button, StatusBar, SafeAreaView, Text, Dimensions, ScrollView, View} from 'react-native';
import {viewStyles, textStyles, barStyles, cardStyles, topbarStyles, bottombarStyles} from '../styles';
import {theme} from '../theme';
import { images } from '../images';
import IconButton from '../components/IconButton';
import Task from '../components/Task';
import { Category } from '../components/Category';
import Input from '../components/Input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';

export default function SelectedCategoryScreen({navigation, route}){
    const width = Dimensions.get('window').width;
    const [isReady, setIsReady] = useState(false);
    const [categories, setCategories] = useState({});

    const [tasks, setTasks] = useState({});

    const {selectedCategory, categoryID} = route.params;
    //console.log(selectedCategory);

    useEffect(()=>{
        const reloadTab = navigation.addListener('focus',(e)=>{
            setIsReady(false)
        });
        return reloadTab;
      },[navigation]);

    const _saveCategories = async categories => {
        try {
            await AsyncStorage.setItem('categories',JSON.stringify(categories));
            setCategories(categories);
        } catch (e) {
            console.error(e);
        }
      };
    
    const _loadCategories = async () => {
        const loadedCategories = await AsyncStorage.getItem('categories');
        setCategories(JSON.parse(loadedCategories || '{}'));
    };
    
    const _loadTasks = async () => {
        const loadedTasks = await AsyncStorage.getItem('tasks');
        setTasks(JSON.parse(loadedTasks || '{}'));
    };

    const _updateCategory = item => {
        const currentCategories = Object.assign({}, categories);
        currentCategories[item.id] = item;
        //setTasks(currentTasks);
        _saveCategories(currentCategories);
    };


    return isReady? (
        <SafeAreaView style={viewStyles.container}>
            <StatusBar barStyle="light-content" style={barStyles.statusbar}/>
            <Text>{selectedCategory}</Text>
            <ScrollView width={width-20} onLoad={()=>route.params}>
            {Object.values(tasks).reverse().filter((filterItem)=>{
                        if(filterItem.category == categoryID){
                            return filterItem
                        } 
                    }).map(item=> (
                        <Task key={item.id} item={item}/>
                    ))}
            </ScrollView>
        </SafeAreaView>
    ) : (
        <AppLoading
        startAsync = {_loadCategories, _loadTasks}
        onFinish={()=>setIsReady(true)}
        onError={console.error}/>
      );
};

const CategoryTitle = ({item, updateCategory}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(item.text);
  
  
    const _handleUpdateButtonPress = () => {
        setIsEditing(true);
    };
    const _onSubmitEditing = () => {
        if (isEditing) {
            const editedCategory = Object.assign({}, item, {text});
            setIsEditing(false);
            updateCategory(editedCategory);
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
        <View style={style.container}>
            <Text style={style.contents}>
            {item.text}</Text>
            {<IconButton type = {images.update} onPressOut={_handleUpdateButtonPress}/>}
        </View>
    );
  
  };

  
const style = StyleSheet.create({
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
  