import React from 'react';
import styled from 'styled-components/native';
import {UserConsumer} from '../contexts/User';
import { Category } from './Category';

const StyledText = styled.Text`
    font-size: 24px;
    margin: 10px;
`;

const User = () => {
    return(
        <UserConsumer>
            {({user})=>{user.categories}}
        </UserConsumer>
    )
};

export default User;