import React,{useEffect} from 'react';
import {Platform, Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
//import * as Permissions from 'expo-permissions';

import styled from 'styled-components';
import PropTypes from 'prop-types';
import {MaterialIcons} from '@expo/vector-icons';


const Container = styled.View`
    align-self: center;
    margin-bottom: 30px;
`;

const StyledImage = styled.Image`
    width: 100px;
    height: 100px;
`;

const ButtonContainer = styled.TouchableOpacity`
    position: absoulte;
    bottom: 0;
    right: 0;
    width: 30px;
    height: 30px;
    border-radius: 15px;
    justify-content: center;
    align-items: center;
`;

const ButtonIcon = styled(MaterialIcons).attrs({
    name: 'photo-camera',
    size: 22,
});

const PhotoButton = ({onPress}) => {
    return (
        <ButtonContainer onPress={onPress}>
            <ButtonIcon />
        </ButtonContainer>
    );
}

const Image = ({imageStyle, showButton}) => {
    return (
        <Container>
            <StyledImage style={imageStyle} />
            {showButton && <PhotoButton/>}
        </Container>
    );
};

Image.defaultProps= {
    rounded: false,
    showButton: false,
};

Image.propTypes = {
    uri: PropTypes.string,
    imageStyle: PropTypes.object,
    showButton: PropTypes.bool,
};

export default Image;