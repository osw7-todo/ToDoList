import React, {useState, useEffect} from 'react';
import {StyleSheet, Button, StatusBar, SafeAreaView, Text, Dimensions, ScrollView, View} from 'react-native';
import {viewStyles, textStyles, barStyles, cardStyles, topbarStyles, bottombarStyles} from '../styles';
import {theme} from '../theme';
import Task from '../components/Task';
import CategoryInput from '../components/CategoryInput';
import { Category } from '../components/Category';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';


function CategoryScreen({navigation}){
  const width = Dimensions.get('window').width;
  const [isReady, setIsReady] = useState(false);
  /*카테고리 설정*/
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState({});


  useEffect(()=>{
      const reload = navigation.addListener('focus',(e)=>{
          setIsReady(false);
      });
      return reload;
  },[navigation]);

  const _addCategory = () => {
      const ID = Date.now().toString();
      const newCategoryObject = {
          [ID]: {id: ID, text: newCategory},
      };
  
      setNewCategory('');
      //setCategories({...categories, ...newCategoryObject});
      _saveCategories({...categories, ...newCategoryObject});
  };
  
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

    const _deleteCategory = id => {
      const currentCategories= Object.assign({}, categories);
      delete currentCategories[id];
      _saveCategories(currentCategories);
  };

  const _updateCategory = item => {
      const currentCategories = Object.assign({}, categories);
      currentCategories[item.id] = item;
      //setTasks(currentTasks);
      _saveCategories(currentCategories);
  };

  const _moveToCategory = id => {
    const currentCategories= Object.assign({}, categories);
    const selectedCategoryScreen = navigation.navigate('CATEGORY', {selectedCategory: currentCategories[id], categoryID: id});
    return selectedCategoryScreen;
  }
    
    const _onBlur = () => {
      setNewCategory('');
    };
    const _handleTextChange = text => {
      setNewCategory(text);
    };

    return isReady? (
      <SafeAreaView style={viewStyles.container}>
        <StatusBar barStyle="dark-content" style={barStyles.statusbar}/>
          <View style={cardStyles.card}>
              <ScrollView width = {width-20}>
                    {Object.values(categories).map(item=> (
                        <Category key={item.id} item={item} deleteCategory={_deleteCategory} updateCategory={_updateCategory} moveToCategory={_moveToCategory}/> 
                    ))}
                  <CategoryInput value={newCategory} onChangeText={_handleTextChange} onSubmitEditing={_addCategory} onBlur={_onBlur}/>
              </ScrollView>
          </View>
      </SafeAreaView>
      
    ) :  (
      <AppLoading
          startAsync = {_loadCategories}
          onFinish={()=>setIsReady(true)}
          onError={console.error}/>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default CategoryScreen;