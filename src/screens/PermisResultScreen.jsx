import React, { useState, useEffect, useRef } from 'react'
import {
    View, Text, StyleSheet, useWindowDimensions, TouchableNativeFeedback,
    ActivityIndicator, TouchableOpacity, ScrollView, Image, Switch, Vibration
} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { Button, Icon } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { Audio } from 'expo-av';
import moment from 'moment'
import { Transition, Transitioning } from 'react-native-reanimated'
moment.updateLocale('fr', {
    calendar: {
        sameDay: "[Aujourd'hui]",
        lastDay: "[Hier]",
        nextDay: 'DD-M-YYYY',
        lastWeek: 'DD-M-YYYY',
        sameElse: 'DD-M-YYYY',
    }
})


import { useDispatch, useSelector } from 'react-redux'
import { unsetUserAction } from '../store/actions/userActions';
import { userSelector } from '../store/selectors/userSelector';

const transition = (
    <Transition.Together>
        <Transition.In type="fade" durationMs={200} />
        <Transition.Change />
        <Transition.Out type="fade" durationMs={200} />
    </Transition.Together>
)

const NotFoundAlert = ({ INFRACTIONS, STATUS_MESSAGE, factPermis }) => {
    // console.log(INFRACTIONS)
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
            <LottieView style={{ width: '100%', height: 300 }} source={require('../../assets/lotties/alert-lamp.json')} autoPlay loop />
            <Text style={styles.errorTitle}>{STATUS_MESSAGE}</Text>
            <View>
                <View style={styles.amandes}>
                    <AntDesign name="creditcard" size={24} color={'red'} />
                    <Text style={styles.itemTitle}>Amandes</Text>
                </View>
                <View style={styles.infra}>
                    <Text style={styles.itemValue}>
                        {INFRACTIONS.MONTANT} Fbu
                    </Text>

                    <Button width={"40%"} size="lg" background={"#000"} borderRadius={20}
                        onPress={() => navigation.navigate('FactureScreen', { facture: factPermis })}
                        marginTop={-3}>
                        Payer
                    </Button>
                </View>
            </View>

            {/* <Text style={styles.errorTitle}>{INFRACTIONS.MONTANT}</Text> */}
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


export default function PermisResultScreen() {
    const { width, height } = useWindowDimensions()
    const navigation = useNavigation()
    const user = useSelector(userSelector);
    const route = useRoute()
    const { numero, permis } = route.params
    const [s, setSound] = useState();
    const [showProfil, setShowProfil] = useState(false)
    const [showActivities, setShowActivities] = useState(true)
    const [activites, setActivites] = useState([])
    const profilTransitionRef = useRef()
    const activitiesTransitionRef = useRef()
    const factureDetails = []
    if (permis.INFRACTIONS) {
        factureDetails.push({ ...permis.INFRACTIONS, STATUS_MESSAGE: permis.STATUS_MESSAGE })
    }
    const factPermis = {
        payeur: `${permis.NOM_PROPRIETAIRE}`,
        factureDetails
    }

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

    if (permis.INFRACTIONS && !permis.NUMERO_PERMIS) {
        return <NotFoundAlert INFRACTIONS={permis.INFRACTIONS} STATUS_MESSAGE={permis.STATUS_MESSAGE}
            factPermis={factPermis}
        />
    }

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://app.mediabox.bi:1997/historiques/permis', {
                    method: 'POST',
                    body: JSON.stringify({
                        numeroPermis: permis.NUMERO_PERMIS,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': "bearer " + user.TOKEN
                    },
                })
                const posts = await response.json()
                const freshPosts = posts
                setActivites(freshPosts)

                console.log(freshPosts, user.TOKEN)
            } catch (error) {
                console.log(error)
                // setLoadingPosts(false)
            }
        }
        fetchPosts()
    }, [])

    const Activite = ({ activite, index }) => {
        var imageSource = ''
        var title = ''
        var detailUrl
        const [detail, setDetail] = useState({})
        const [loadingDetail, setLoadingDetail] = useState(true)

        switch (activite.ID_HISTORIQUE_CATEGORIE) {
            case 4:
                title = 'Scan permis'
                imageSource = require('../../assets/qr-code-scan.png')
                detailUrl = `http://app.mediabox.bi:1997/permis?q=${activite.NUMERO_PERMIS}`
                break;
            case 2:
                title = 'Vérification Permis'
                imageSource = require('../../assets/badge.png')
                detailUrl = `http://app.mediabox.bi:1997/permis?q=${activite.NUMERO_PERMIS}`
                break;
            default:
                imageSource = require('../../assets/car.png')
        }
        const showDate = index == 0 ? true : moment(activites[index - 1].DATE_INSERTION).date() != moment(activite.DATE_INSERTION).date()
        const ActivityDate = () => {
            return <Text style={styles.activityDate}>{moment(activite.DATE_INSERTION).calendar()}</Text>
        }

        useEffect(() => {
            (async () => {
                try {
                    const detailRes = await fetch(detailUrl)
                    const detailResponse = await detailRes.json()
                    setDetail({
                        ...detailResponse[0],
                        model: detailResponse[0]?.MARQUE_VOITURE || detailResponse[0]?.CATEGORIES,
                        numero: detailResponse[0]?.NUMERO_PLAQUE || detailResponse[0]?.NUMERO_PERMIS,
                        proprietaire: detailResponse[0]?.NOM_PROPRIETAIRE || detailResponse[0]?.NOM_PROPRIETAIRE,
                    })
                } catch (error) {
                    console.log(error, detailUrl)
                }
                setLoadingDetail(false)
            })()
        }, [])

        return (
            <View key={index.toString()}>
                {showDate && <ActivityDate />}
                <View style={styles.activity}>
                    <View style={styles.activityImage}>
                        <Image source={imageSource} style={{ width: '80%', height: '80%' }} />
                    </View>
                    {loadingDetail ? <View style={{ flex: 1, justifyContent: 'center' }}>
                        <ActivityIndicator animating={true} size="small" color={"black"} />
                    </View> :
                        <View style={styles.activityRightSide}>
                            <Text style={styles.activityTitle} numberOfLines={1} >{title}</Text>
                            {activite.MONTANT ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ color: !activite.IS_PAID ? 'red' : 'green' }} numberOfLines={1} >
                                    {activite.MONTANT} Fbu
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: -10 }}>
                                    <Text style={{ color: '#777' }}>{!activite.IS_PAID ? 'Non payé' : 'payé'} </Text>
                                    {!activite.IS_PAID ? <AntDesign name="closecircleo" size={20} color="red" style={{ marginLeft: 5 }} /> :
                                        <AntDesign name="checkcircleo" size={20} color="green" />}
                                </View>
                            </View> :
                                detail.model && <Text style={styles.carModel} numberOfLines={1} >{detail.model} | {detail.numero}</Text>}
                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 10 }}>
                                <Text style={styles.carOwner} numberOfLines={1} >{detail.proprietaire}</Text>
                                <Text style={{ color: '#777', alignSelf: 'flex-end' }}>{moment(activite.DATE_INSERTION).format('H:m')}</Text>
                            </View>
                        </View>}
                </View>
            </View>
        )
    }


    return (
        <ScrollView keyboardShouldPersistTaps='always'>
            <View style={{ ...styles.container, minHeight: height - 70 }}>
                <View style={styles.header}>
                    <Image source={require('../../assets/badge-1.png')} style={{ height: 100 }} />
                </View>
                <View style={styles.resultContent}>
                    <View style={styles.resultItem}>
                        <View style={styles.itemLeft}>
                            <Ionicons name="md-person-outline" size={30} color={'#58A0EB'} />
                            <Text style={styles.itemTitle}>Proprietaire</Text>
                        </View>
                        <Text style={styles.itemValue}>
                            {permis.NOM_PROPRIETAIRE}
                        </Text>
                    </View>


                    <View style={styles.resultItem}>
                        <View style={styles.itemLeft}>
                            <AntDesign name="idcard" size={30} color="#58A0EB" />
                            <Text style={styles.itemTitle}>Numéro du permis</Text>
                        </View>
                        <Text style={styles.itemValue}>
                            {permis.NUMERO_PERMIS}
                        </Text>
                    </View>

                    <View style={styles.resultItem}>
                        <View style={styles.itemLeft}>
                            {/* <AntDesign name="calendar" size={24} color= "#58A0EB" /> */}
                            <AntDesign name="creditcard" size={24} color="#58A0EB" />
                            <Text style={{ ...styles.itemTitle, color: numero == 4 ? '#000' : '#000' }}>Categorie</Text>
                        </View>
                        <Text style={styles.itemValue}>
                            {permis.CATEGORIES}
                        </Text>
                    </View>

                    <View style={styles.resultItem}>
                        <View style={styles.itemLeft}>
                            <AntDesign name="calendar" size={24} color={numero == 4 ? 'red' : "#58A0EB"} />
                            <Text style={{ ...styles.itemTitle, color: numero == 4 ? 'red' : '#333' }}>Date Naissance</Text>
                        </View>
                        <Text style={{ ...styles.itemValue, color: numero == 4 ? 'red' : '#333' }}>
                            {moment(permis.DATE_NAISSANCE).format('DD-M-YYYY')}
                            {/*).format('DD-M-YYYY') {dateN[0]} */}
                        </Text>
                    </View>

                    <View style={styles.resultItem}>
                        <View style={styles.itemLeft}>
                            <AntDesign name="calendar" size={24} color={permis.INFRACTIONS ? 'red' : "#58A0EB"} />
                            <Text style={{ ...styles.itemTitle, color: permis.INFRACTIONS ? 'red' : '#333' }}>Date Debut</Text>
                        </View>
                        <Text style={{ ...styles.itemValue, color: permis.INFRACTIONS ? 'red' : '#333' }}>
                            {moment(permis.DATE_DELIVER).format('DD-M-YYYY')}
                            {/* {datep[0]} */}
                        </Text>
                    </View>
                    <View style={styles.resultItem}>
                        <View style={styles.itemLeft}>
                            <AntDesign name="calendar" size={24} color={permis.INFRACTIONS ? 'red' : "#58A0EB"} />
                            <Text style={{ ...styles.itemTitle, color: permis.INFRACTIONS ? 'red' : '#333' }}>Date de validité</Text>
                        </View>
                        <Text style={{ ...styles.itemValue, color: permis.INFRACTIONS ? 'red' : '#333' }}>
                            {moment(permis.DATE_EXPIRATION).format('DD-M-YYYY')}
                            {/* {dateExp[0]} */}
                        </Text>
                    </View>


                    {permis.INFRACTIONS && <View style={styles.resultItem}>
                        <View style={styles.itemLeft}>
                            {/* <AntDesign name="calendar" size={24} color="#58A0EB" /> */}
                            <AntDesign name="creditcard" size={24} color={permis.INFRACTIONS ? 'red' : "#58A0EB"} />
                            <Text style={{ ...styles.itemTitle, color: permis.INFRACTIONS ? 'red' : '#333' }}>Amandes</Text>
                        </View>
                        <View >
                            <Text style={styles.itemValue}>
                                {permis.INFRACTIONS.MONTANT} Fbu
                            </Text>
                        </View>
                    </View>}
                </View>

                {/* <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("#4775CA")}>
                    <View style={styles.principal}>
                        <View style={styles.secondaire}>
                            <View style={styles.icon}>
                                <Text style={styles.title}>Historiques</Text>
                            </View>
                            <View>
                                <Text style={styles.statusTitle}>Plaque|it4668h</Text>
                            </View>
                            <View style={styles.principalfooter}>
                                <Text style={styles.amande}>perte</Text>
                            </View>
                        </View>
                    </View>
                </TouchableNativeFeedback> */}


                <View style={styles.bouton}>
                    <Button width={"30%"} size="lg" background={"#000"} borderRadius={20}
                        onPress={() => navigation.goBack()}
                        marginTop={10}>
                        ok
                    </Button>

                    {/* {permis.INFRACTIONS && <Button width={"30%"} size="lg" background={"#000"} borderRadius={20}
                        onPress={() => navigation.navigate('FactureScreen', { facture: factPermis })}
                        marginTop={10}>
                        Payer
                    </Button>} */}

                    {user.PSR_ELEMENT_ID != 0 && <Button width={"35%"} size="lg" background={"#000"} borderRadius={20}
                        onPress={() => navigation.navigate('PermisControle', { ID_PERMIS: permis.ID_PERMIS, NUMERO_PERMIS: permis.NUMERO_PERMIS, NOM_PROPRIETAIRE: permis.NOM_PROPRIETAIRE, HISTORIQUE: permis.ID_HISTORIQUE })}
                        marginTop={10}>
                        Contrôle
                    </Button>}
                </View>
                <View
                    ref={activitiesTransitionRef}
                    transition={transition}>
                    <View onPress={() => {
                        activitiesTransitionRef.current.animateNextTransition()
                        setShowActivities(t => !t)
                        setShowProfil(false)
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={styles.profileTitle}>Historiques</Text>
                            {/* <FontAwesome5 name="angle-down" size={24} color="#777" /> */}
                        </View>
                    </View>
                    {/* <Text>{JSON.stringify(activites)}</Text> */}
                    {<View style={styles.activities}>
                        {activites.map((activity, index) => {
                            return <Activite activite={activity} index={index} key={index} />
                        })}
                    </View>}

                    {/* <View style={styles.bouton}>
                        <Button width={"30%"} size="lg" background={"#000"} borderRadius={20}
                            // onPress={() => navigation.goBack()}
                            onPress={()=>OffsetFunction(activites)}
                            marginTop={10}>
                            Suivant
                        </Button>
                    </View> */}
                </View>
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
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        opacity: 0.6,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center"
    },
    numero: {
        fontSize: 16
    },
    resultContent: {
        width: '100%',
        // backgroundColor: "red",
        borderBottomColor: "#ddd",
        borderBottomWidth: 2,
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
        opacity: 0.8
    },
    bouton: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10
    },
    amandes: {
        flexDirection: "row",
        marginRight: "60%",
        marginTop: 15,
    },
    infra: {
        flexDirection: "row",
        justifyContent: "space-between",
        // borderBottomColor: "#ddd",
        // borderBottomWidth: 2,
        justifyContent: "space-between"
    },
    principal: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingVertical: 10,
        margin: 3,
        // borderRadius: 10,
        elevation: 5
    },
    secondaire: {
        marginLeft: 10,
        flex: 1
    },
    icon: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    amande: {
        fontWeight: "bold",
        fontSize: 17,
        color: "#000"
    },
    activity: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5
    },
    activityImage: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E8F5FE',
        borderRadius: 15
    },
    activityRightSide: {
        marginLeft: 20,
        flex: 1
    },
    activityTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        marginBottom: 2,
        width: '90%'
    },
    carModel: {
        color: '#777',
        width: '90%'
    },
    carOwner: {
        color: '#777',
        width: '90%'
    },
    // userProfile: {
    //     paddingHorizontal: 20,
    //     flexGrow: 1
    // },
    profileTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        paddingVertical: 10
    },

})