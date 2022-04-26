import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, useWindowDimensions, ScrollView, Image, Vibration } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5, MaterialIcons, AntDesign } from '@expo/vector-icons';
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
                require('../../assets/police.mp3')
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
            <LottieView style={{ width: '100%', height: 300 }} source={require('../../assets/lotties/alert-lamp.json')} autoPlay loop />
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

export default function ImmatriculationsResultScreen() {
    const { width, height } = useWindowDimensions()
    const navigation = useNavigation()
    const route = useRoute()
    const { numero, immatriculation } = route.params
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

    if (immatriculation.INFRACTIONS && !immatriculation.NOM_PROPRIETAIRE) {
        return <NotFoundAlert STATUS_MESSAGE={immatriculation.STATUS_MESSAGE} />
    }


    return (
        <ScrollView keyboardShouldPersistTaps='always'>
            <View style={{ ...styles.container, minHeight: height - 70 }}>
                <View style={styles.header}>
                    <View>
                        <Text style={{ ...styles.title, color: immatriculation.INFRACTIONS ? 'red' : '#333' }}>Immatricul...</Text>
                        <Text style={{ ...styles.numero, color: immatriculation.INFRACTIONS ? 'red' : '#333' }}>{immatriculation.NUMERO_PLAQUE}</Text>
                    </View>
                    <Image source={require('../../assets/car.png')} style={{ height: 80, width: 80 }} />
                </View>
                <View style={styles.resultContent}>
                    <View style={styles.resultItem}>
                        <View style={styles.itemLeft}>
                            <Ionicons name="md-person-outline" size={30} color={'#58A0EB'} />
                            <Text style={styles.itemTitle}>Proprietaire</Text>
                        </View>
                        <Text style={styles.itemValue}>
                            {immatriculation.NOM_PROPRIETAIRE} {immatriculation.PRENOM_PROPRIETAIRE}
                        </Text>
                    </View>
                    <View style={styles.resultItem}>
                        <View style={styles.itemLeft}>
                            <AntDesign name="idcard" size={30} color="#58A0EB" />
                            <Text style={styles.itemTitle}>CNI</Text>
                        </View>
                        <Text style={styles.itemValue}>
                            {immatriculation.NUMERO_IDENTITE}
                        </Text>
                    </View>
                    <View style={styles.resultItem}>
                        <View style={styles.itemLeft}>
                            <FontAwesome5 name="car" size={24} color="#58A0EB" />
                            <Text style={styles.itemTitle}>Modèle</Text>
                        </View>
                        <Text style={styles.itemValue}>
                            {immatriculation.MODELE_VOITURE}
                        </Text>
                    </View>
                    <View style={styles.resultItem}>
                        <View style={styles.itemLeft}>
                            <FontAwesome5 name="car-side" size={24} color="#58A0EB" />
                            <Text style={styles.itemTitle}>Marque</Text>
                        </View>
                        <Text style={styles.itemValue}>
                            {immatriculation.MARQUE_VOITURE}
                        </Text>
                    </View>
                    <View style={styles.resultItem}>
                        <View style={styles.itemLeft}>
                            <Ionicons name="bus-outline" size={24} color="#58A0EB" />
                            <Text style={styles.itemTitle}>Usage</Text>
                        </View>
                        <Text style={styles.itemValue}>
                            {immatriculation.CATEGORIE_USAGE}
                        </Text>
                    </View>
                    <View style={styles.resultItem}>
                        <View style={styles.itemLeft}>
                            <AntDesign name="idcard" size={30} color="#58A0EB" />
                            <Text style={styles.itemTitle}>Carte Rose</Text>
                        </View>
                        <Text style={styles.itemValue}>
                            {immatriculation.NUMERO_CARTE_ROSE}
                        </Text>
                    </View>
                    <View style={styles.resultItem}>
                        <View style={styles.itemLeft}>
                            <AntDesign name="calendar" size={24} color="#58A0EB" />
                            <Text style={styles.itemTitle}>Année de fabrication</Text>
                        </View>
                        <Text style={styles.itemValue}>
                            {immatriculation.ANNEE_FABRICATION}
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