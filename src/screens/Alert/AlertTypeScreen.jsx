import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, useWindowDimensions, ScrollView, ImageBackground, TouchableNativeFeedback, Image, Vibration, BackHandler } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, Icon } from 'native-base';

export default function AlertTypeScreen() {
    const { width, height } = useWindowDimensions()
    const navigation = useNavigation()
    const route = useRoute()
    return (
        <>
            <ImageBackground source={require('../../../assets/psr3.png')} resizeMode="cover" style={styles.image}>
                <ScrollView keyboardShouldPersistTaps='always'>
                    <View style={{ ...styles.container, minHeight: height - 95 }}>
                        <Text style={styles.title}>Alerte pour :</Text>
                        <View style={styles.options}>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#ddd')} onPress={() => navigation.navigate('AlertPlaqueForm', { alertType: 1 })}>
                                <View style={styles.option}>
                                    <View style={styles.imageIcon}>
                                        <Image source={require('../../../assets/car.png')} style={{ width: '60%', height: '60%' }} />
                                    </View>
                                    <Text style={styles.optionName}>Un véhicule</Text>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#ddd')} onPress={() => navigation.navigate('AlertPlaqueQuestion', { alertType: 2 })}>
                                <View style={styles.option}>
                                    <View style={styles.imageIcon}>
                                        <Image source={require('../../../assets/police-user.png')} style={{ width: '60%', height: '60%' }} />
                                    </View>
                                    <Text style={styles.optionName}>Agent de la police</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                        <Button width={"50%"} size="lg" background={"#000"} borderRadius={20}
                            onPress={() => navigation.goBack()}
                            marginTop={10}
                            style={{ marginLeft: 20 }}
                            leftIcon={<Icon as={Ionicons} name="arrow-back-outline" size={'sm'} color="#fff" />}>
                            Retourner
                        </Button>
                    </View>
                </ScrollView>
            </ImageBackground>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#F3F7F7',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        marginVertical: 30,
        opacity: 0.8,
        paddingHorizontal: 20
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    imageIcon: {
        width: 60,
        height: 60,
        backgroundColor: '#fff',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    optionName: {
        marginLeft: 15,
        fontSize: 16
    },

    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#F3F7F7',
    },
    errorTitle: {
        fontSize: 25,
        color: 'red',
        fontWeight: 'bold',
        opacity: 0.8
    },
    image: {
        flex: 1,
        justifyContent: "center",
    },
})