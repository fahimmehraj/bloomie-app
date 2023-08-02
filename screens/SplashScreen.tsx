import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, View } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import React, { useEffect, useRef } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from '../App';

type Props = NativeStackScreenProps<StackParamList, "Splash">;

export default function SplashScreen({ navigation }: Props) {
    const video = useRef<null | Video>(null);

    useEffect(() => {
        if (!video.current) {
            return;
        }
        video.current.playAsync();
        setTimeout(() => {
            navigation.navigate("Start")
        }, 3900)
    }, [video])

    return (
        <View style={styles.container}>
            <Video
                ref={video}
                style={styles.video}
                source={require("../assets/splash.mov")}
                useNativeControls={false}
                resizeMode={ResizeMode.CONTAIN}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#b294d6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    video: {
        flex: 1,
        alignSelf: 'stretch'
    },
    buttons: {
        margin: 16
    }
});