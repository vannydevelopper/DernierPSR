import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, useWindowDimensions, ScrollView, Image, Vibration } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5, MaterialIcons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, Icon } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { Audio } from 'expo-av';

const NotFoundAlert = ({ STATUS_MESSAGE }) => {
    const [s, setSound] = useState();
    const navigation = useNavigation()
    useEffect(() => {
        (async () => {
            const { sound } = await Audio.Sound.createAsync(
                require('../../assets/wrong.mp3')
            );
            setSound(sound);
            await sound.playAsync()
            Vibration.vibrate(1000, true)
        })()

        return async () => {
            if (s) {
                s.unloadAsync();
                Vibration.cancel()
            }
        }
    }, [])
    return (
        <View style={styles.errorContainer}>
            <LottieView style={{ width: '100%', height: 300 }} source={require('../../assets/lotties/not-found.json')} autoPlay loop />
            <Text style={styles.errorTitle}>{STATUS_MESSAGE}</Text>
            <Button width={"50%"} size="lg" background={"#000"} borderRadius={20}
                onPress={() => navigation.goBack()}
                marginTop={10}
                style={{ marginLeft: 20 }}
                leftIcon={<Icon as={Ionicons} name="arrow-back-outline" size={'sm'} color="#fff" />}>
                Retourner
            </Button>
        </View>
    )
}

export default function ControleResultScreen() {
    const { width, height } = useWindowDimensions()
    const navigation = useNavigation()
    const route = useRoute()
    const { numero, controle } = route.params
    const [s, setSound] = useState();


    useEffect(() => {
        (async () => {
            if (numero == 4) {
                const { sound } = await Audio.Sound.createAsync(
                    require('../../assets/wrong.mp3')
                );
                setSound(sound);
                await sound.playAsync()
                Vibration.vibrate(1000, true)
            }
        })()

        return async () => {
            if (s) {
                s.unloadAsync();
                Vibration.cancel()
            }
        }
    }, [])
    // console.log(controle)
    if (controle.INFRACTIONS && !controle.ID_CONTROLE) {
        return <NotFoundAlert STATUS_MESSAGE={controle.STATUS_MESSAGE} />
    }
    return (
        <ScrollView keyboardShouldPersistTaps='always'>
            <View style={{ ...styles.container, minHeight: height - 70 }}>
                <View style={styles.header}>
                    <View>
                        <Text style={{ ...styles.title, color: controle.INFRACTIONS ? 'red' : '#333' }}>Co. Technique</Text>
                        <Text style={{ ...styles.title, color: controle.INFRACTIONS ? 'red' : '#333' }}>{controle.NUMERO_PLAQUE}</Text>
                    </View>
                    <Image source={require('../../assets/mechanic.png')} style={{ height: 80, width: 80 }} />
                </View>
                <View style={styles.resultContent}>
                    <View style={styles.resultItem}>
                        <View style={styles.itemLeft}>
                            <Ionicons name="md-person-outline" size={30} color={'#58A0EB'} />
                            <Text style={styles.itemTitle}>Proprietaire</Text>
                        </View>
                        <Text style={styles.itemValue}>
                            {controle.PROPRIETAIRE}
                        </Text>
                    </View>
                    <View style={{ ...styles.resultItem, borderBottomWidth: 1, borderBottomColor: '#b9d3ed' }}>
                        <View style={styles.itemLeft}>
                            <AntDesign name="idcard" size={30} color="#58A0EB" />
                            <Text style={styles.itemTitle}>Numéro de contrôle</Text>
                        </View>
                        <Text style={styles.itemValue}>
                            {controle.NUMERO_CONTROLE}
                        </Text>
                    </View>
                    <View style={styles.resultItem}>
                        <View style={styles.itemLeft}>
                            <FontAwesome5 name="car" size={24} color="#58A0EB" />
                            <Text style={styles.itemTitle}>Type</Text>
                        </View>
                        <Text style={styles.itemValue}>
                            {controle.TYPE_VEHICULE}
                        </Text>
                    </View>
                    {/* <View style={styles.resultItem}>
                                                            <View style={styles.itemLeft}>
                                                                      <FontAwesome5 name="car-side" size={24} color="#58A0EB" />
                                                                      <Text style={styles.itemTitle}>Numero Chassis</Text>
                                                            </View>
                                                            <Text style={styles.itemValue}>
                                                                      {controle.NUMERO_CHASSIS}
                                                            </Text>
                                                  </View> */}
                    <View style={styles.resultItem}>
                        <View style={styles.itemLeft}>
                            <FontAwesome5 name="car" size={24} color="#58A0EB" />
                            <Text style={styles.itemTitle}>Numéro de plaque</Text>
                        </View>
                        <Text style={styles.itemValue}>
                            {controle.NUMERO_PLAQUE}
                        </Text>
                    </View>
                    <View style={{ ...styles.resultItem, borderBottomWidth: 1, borderBottomColor: '#b9d3ed' }}>
                        <View style={styles.itemLeft}>
                            <MaterialCommunityIcons name="car-cog" size={30} color="#58A0EB" />
                            <Text style={styles.itemTitle}>Numéro de chassis</Text>
                        </View>
                        <Text style={styles.itemValue}>
                            {controle.NUMERO_CHASSIS}
                        </Text>
                    </View>
                    <View style={styles.resultItem}>
                        <View style={styles.itemLeft}>
                            <AntDesign name="calendar" size={24} color={controle.INFRACTIONS ? 'red' : "#58A0EB"} />
                            <Text style={{ ...styles.itemTitle, color: controle.INFRACTIONS ? 'red' : '#333' }}>Date Debut</Text>
                        </View>
                        <Text style={{ ...styles.itemValue, color: numero == 4 ? 'red' : '#333' }}>
                            {controle.DATE_DEBUT}
                        </Text>
                    </View>
                    <View style={styles.resultItem}>
                        <View style={styles.itemLeft}>
                            <AntDesign name="calendar" size={24} color={controle.INFRACTIONS ? 'red' : "#58A0EB"} />
                            <Text style={{ ...styles.itemTitle, color: controle.INFRACTIONS ? 'red' : '#333' }}>Date de validité</Text>
                        </View>
                        <Text style={{ ...styles.itemValue, color: numero == 4 ? 'red' : '#333' }}>
                            {controle.DATE_VALIDITE}
                        </Text>
                    </View>
                </View>
                <Button width={"50%"} size="lg" background={"#000"} borderRadius={20}
                    onPress={() => navigation.goBack()}
                    marginTop={10}
                    leftIcon={<Icon as={Ionicons} name="arrow-back-outline" size={'sm'} color="#fff" />}>
                    Retourner
                </Button>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F7F7',
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        opacity: 0.6
    },
    numero: {
        fontSize: 16
    },
    resultContent: {
        width: '100%',
    },
    resultItem: {
        paddingVertical: 10,
        /* borderBottomColor: '#ddd',
        borderBottomWidth: 1 */
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        opacity: 0.8,
        marginLeft: 10
    },
    itemValue: {
        color: '#777',
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
        opacity: 0.8,
        alignItems: "center",
        textAlign: "center"
    }
})