import {StyleSheet} from 'react-native';
import {theme} from './theme';

export const viewStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
}); 

export const textStyles = StyleSheet.create({
    title: {
        fontSize: 40,
        fontWeight: '600',
        color: theme.main,
        alignItems: 'flex-start',
        marginTop: 0,
        marginLeft: 0,
    },
    contents: {
        textAlign: 'left',
        fontSize: 20,
        color: theme.main,
        marginBottom: 5,
    },
});

export const barStyles = StyleSheet.create({
    statusbar: {
        backgroundColor: theme.background,
    },
});

/*card view 스타일 추가*/
export const cardStyles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        flex: 1,
        borderRadius: 10,
        margin: 10 //edit margin for ViewAllScreen
    },
});

/*앱 상단바 스타일 추가*/
export const rowStyles = StyleSheet.create({
    context: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        marginTop: 3,
        marginLeft:0,
    },
});

/*일반 글씨 스타일 추가*/
export const generalTextStyles = StyleSheet.create({
    text: {
        flex: 1,
        fontSize: 20,
        color: theme.text,
    },
});