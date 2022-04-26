import React, { useState, useEffect } from 'react'
import { Input, Icon, Button, useToast } from 'native-base';
import { EvilIcons } from '@expo/vector-icons';
import Autocomplete from 'react-native-autocomplete-input';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useSelector } from 'react-redux'
import { userSelector } from '../store/selectors/userSelector'
import * as Location from 'expo-location';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableNativeFeedback, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'

export default function ControleScreen() {
    const [questionnaires, setQuestionnaires] = useState([])
    const [loadingQ, setLoadingQ] = useState(true)
    const [location, setLocation] = useState(null)
    const [loading, setLoading] = useState(false)

    const route = useRoute()
    const user = useSelector(userSelector)
    const { ID_IMMATRICULATION, NOM_PROPRIETAIRE, PRENOM_PROPRIETAIRE } = route.params
    const navigation = useNavigation()
    const toast = useToast()
    //pour envoyer les donnees sur un facture pour les payer
    const factureDetails = questionnaires.filter(quest => !quest.STATUT).map(q => {
        return {
            STATUS_MESSAGE: q.INFRACTIONS,
            MONTANT: q.MONTANT
        }
    })
    const facture = {
        payeur: `${NOM_PROPRIETAIRE} ${PRENOM_PROPRIETAIRE}`,
        factureDetails
    }

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://app.mediabox.bi:1997/infractions/questionnaires/plaques')
                const posts = await response.json()
                const freshPosts = posts.map(post => {
                    return {
                        ...post,
                        STATUT: true,
                        // MONTANT: 5000

                    }
                })
                setQuestionnaires(freshPosts)
                setLoadingQ(false)
                // setLoadingPosts(false)

                // console.log(posts)
            } catch (error) {
                setQuestionnaires([])
                setLoadingQ(false)
                // setLoadingPosts(false)
            }
        }
        fetchPosts()
    }, [])

    //Envoie des donnees dans la base en cochant les controles physiques
    const postData = async () => {
        setLoading(true)
        try {
            await fetch("http://app.mediabox.bi:1997/infractions", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'bearer ' + user.TOKEN
                },
                body: JSON.stringify({
                    CONTROLE_TYPE_ID: 2,
                    ID_PLAQUE: ID_IMMATRICULATION,
                    CONTROLES: questionnaires,
                    lat: location.latitude,
                    long: location.longitude
                })
            })
            toast.show({
                title: "Controle avec succes",
                type: "success",
                duration: 2000
            })
            const decoches = questionnaires.filter(q => !q.STATUT)
            if (decoches.length > 0) {
                navigation.navigate('FactureScreen', { facture })
            } else {
                navigation.navigate('Home')
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location.coords);
        })();
    }, []);

    if (loadingQ) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator animating={true} size='large' color={"#ooo"} />
            </View>
        )
    }



    return (
        <ScrollView>
            <View style={styles.container}>

                <View style={styles.principal}>
                    <View style={styles.secondaire}>
                        {/* <Text style={styles.title}>Autres Controles</Text> */}

                        <View style={styles.principalfooter}>
                            <FlatList
                                data={questionnaires}
                                keyExtractor={(no, index) => index}
                                renderItem={({ item, index }) => {
                                    return (
                                        <View style={styles.switch}>
                                            <View>
                                                <Text style={{ fontWeight: "bold", fontSize: 15, opacity: 0.8 }}>{item.INFRACTIONS}</Text>
                                                {!item.STATUT && <Text style={{ color: "red" }}>{item.MONTANT}</Text>}
                                            </View>
                                            <Switch
                                                // thumbColor={item.STATUT ? "#58A0EB" : 'red'}
                                                value={questionnaires.find(q => q.ID_CONTROLES_QUESTIONNAIRES == item.ID_CONTROLES_QUESTIONNAIRES).STATUT}
                                                onValueChange={() => {
                                                    setQuestionnaires(oldQ => oldQ.map(q => {
                                                        if (q.ID_CONTROLES_QUESTIONNAIRES == item.ID_CONTROLES_QUESTIONNAIRES) {
                                                            return {
                                                                ...q,
                                                                STATUT: !(questionnaires.find(q => q.ID_CONTROLES_QUESTIONNAIRES == item.ID_CONTROLES_QUESTIONNAIRES).STATUT)
                                                            }
                                                        }
                                                        return q
                                                    }))
                                                }} />
                                        </View>
                                    )
                                }}
                            />

                        </View>
                        {/* <Text>{JSON.stringify(questionnaires.filter(q => !q.STATUT))}</Text> */}
                        <Button
                            isLoading={loading}
                            marginTop={10} width={"full"} size="lg" background={"#000"} borderRadius={10} onPress={() => postData()}>
                            Enregister
                        </Button>
                    </View>
                </View>

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#F3F7F7',
    },
    principal: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingVertical: 20,
        paddingHorizontal: 10,
        margin: 10,
        borderRadius: 10,
        elevation: 5,


    },
    secondaire: {
        marginLeft: 10,
        flex: 1
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        opacity: 0.8,
        textAlign: 'center'
    },
    principalfooter: {
        // flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 5
    },
    statusTitle: {
        fontSize: 14,
        color: "red"
    },
    amande: {
        fontWeight: "bold",
        fontSize: 17,
        color: "#000"
    },
    bouton: {
        backgroundColor: "#ddd",
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 8,
        fontWeight: "bold",
        opacity: 0.8
    },
    icon: {
        flexDirection: "row",
        justifyContent: "space-between"
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
    switch: {
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "space-between"
    },
    containerStyle: {
        marginTop: 15,
        position: 'absolute',
        width: "100%",
        height: 10

    },
    inputContainerStyle: {
        marginVertical: 10,
        marginHorizontal: 10,
        backgroundColor: "#fff"
    },
    listStyle: {
        marginVertical: 10,
        marginHorizontal: 10
    },
    listContainer: {
        marginVertical: 15,
        marginHorizontal: 5
    },
    listTitle: {
        fontSize: 15,
        // marginBottom:5
    }
})