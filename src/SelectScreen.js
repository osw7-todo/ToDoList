import React, { useState, Component } from 'react';
import {Button, StatusBar, SafeAreaView, Text, Dimensions, ScrollView, View} from 'react-native';
import {viewStyles, textStyles, barStyles, cardStyles, topbarStyles} from './styles';
import Input from './components/Input';
import { images } from './images';
import IconButton from './components/IconButton';
import Task from './components/Task';

export default function SelectScreen() {
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
    const IssueList = () => {
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
    const [newTask, setNewTask] = useState('');
    const[tasks, setTasks] = useState({
        /*'1' : {id: '1', text: "Todo item #1", completed: false},
        '2' : {id: '2', text: "Todo item #2", completed: true},*/
    });
    return (
        <SafeAreaView style={viewStyles.container}>
            <StatusBar barStyle="light-content" style={barStyles.statusbar}/>    
            
            <View style={cardStyles.card}> 
                <ScrollView width = {width-20}>
                    {Object.values(tasks).reverse().map(item=> (
                        <Task key={item.id} item={item} deleteTask={_deleteTask} toggleTask={_toggleTask} updateTask={_updateTask} setDueDate={_setDueDate}/>
                    ))} 
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}