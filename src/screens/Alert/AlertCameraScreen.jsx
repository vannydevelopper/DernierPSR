import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Image, useWindowDimensions, AppState } from 'react-native'
import { Camera } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from 'native-base'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker';

export default function AlertCameraScreen() {
    const { width } = useWindowDimensions()
    const cameraRef = useRef(null)
    const [photo, setPhoto] = useState(null)
    const navigation = useNavigation()
    const [isActive, setIsActive] = useState(AppState.currentState);

    const isFocused = useIsFocused();

    const openGallery = async () => {
        const result = await ImagePicker.launchCameraAsync({
            presentationStyle: ''
        })
        console.log(result)
        /* let result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  quality: 1,
        });
        console.log(result) */
    }

    const onTakePicture = async () => {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 })
        setPhoto(photo)
    }

    const onImageSelect = async () => {
        navigation.navigate('AlertPlaqueQuestion', { photo })
    }

    useLayoutEffect(() => {
        const subscription = AppState.addEventListener("change", (nextAppState) => {
            AppState.currentState = nextAppState;
            setIsActive(AppState.currentState === "active");
        }
        );
        return () => {
            if (subscription?.remove) {
                subscription?.remove();
            }
        };
    }, [])
    return (
        <View style={styles.container}>
            {photo ?
                <View style={styles.takedPhoto}>
                    <Image source={{ uri: photo.uri }} style={{ width: '100%', height: '100%' }} />
                    <View style={styles.photoActions}>
                        <TouchableOpacity style={styles.retryBtn} onPress={() => setPhoto(null)}>
                            <MaterialCommunityIcons name="camera-retake-outline" size={30} color="#777" />
                        </TouchableOpacity>
                        <Button size="lg" background={"#58A0EB"} borderRadius={10} width={100} height={50} onPress={onImageSelect}>
                            Ok
                        </Button>
                    </View>
                </View> :
                (isActive && isFocused && <Camera style={styles.camera} type={"back"} ratio="16:9" ref={cameraRef}>
                    <View style={{ ...styles.bottomActions, width }}>
                        <TouchableOpacity style={{ ...styles.pictureCircle, marginLeft: (width / 2) - 40 }} onPress={onTakePicture}>
                            <View style={styles.whitePictureCircle} />
                        </TouchableOpacity>
                        <TouchableWithoutFeedback onPress={openGallery}>
                            <View style={styles.galleryOpener}>
                                <Image source={require('../../../assets/picture.png')} style={{ width: '80%', height: '100%' }} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </Camera>)}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000'
    },
    takedPhoto: {
        width: '100%',
        height: '80%'
    },
    camera: {
        width: '100%',
        height: '80%'
    },
    bottomActions: {
        position: 'absolute',
        bottom: 0,
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    pictureCircle: {
        width: 80,
        height: 80,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    whitePictureCircle: {
        width: '80%',
        height: '80%',
        backgroundColor: '#fff',
        borderRadius: 100,
    },
    galleryOpener: {
        backgroundColor: '#fff',
        width: 40,
        height: 30,
        marginLeft: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    photoActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 10
    },
    retryBtn: {
        backgroundColor: '#fff',
        borderRadius: 10,
        height: 50,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
})