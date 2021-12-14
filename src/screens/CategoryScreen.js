/*미완료 페이지 just for testing*/
/*
원래는 drawer에서 카테고리 수정 및 생성 가능하게 해서,
drawer에서 카테고리 별로 볼 수 있게 할라했는데,
그러러면 drawer에 목록이 자동으로 추가되게 해야함 (코드에 삽입하는게 아니라, 유저의 입력을 받아서...)
이걸 할 수 없을 것 같아서,
아예 이 카테고리 페이지에서
카테고리 이름 <Select> 하면, 해당 목록 보여주는 식으로 해야할 듯. 
*/
import React, {useState, useEffect} from 'react';
import {StyleSheet, Button, StatusBar, SafeAreaView, Text, Dimensions, ScrollView, View} from 'react-native';
import {viewStyles, textStyles, barStyles, cardStyles, topbarStyles, bottombarStyles} from '../styles';
import {theme} from '../theme';
import Task from '../components/Task';
import CategoryInput from '../components/CategoryInput';
import { Category } from '../components/Category';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import UserContext, { UserConsumer } from '../contexts/User';


function CategoryScreen({navigation, route}){
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
    const selectedCategoryScreen = navigation.navigate('CATEGORY', {selectedCategory: JSON.stringify(currentCategories[id]), categoryID: id});
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
              <UserConsumer>
              {({dispatch}) => {
                dispatch(categories);
              }}
              </UserConsumer>
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