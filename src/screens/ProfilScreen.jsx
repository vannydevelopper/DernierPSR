import React, { useRef, useState, useEffect, memo, useCallback } from 'react'
import { View, Text, StyleSheet, useWindowDimensions, ScrollView, Image, TouchableOpacity, RefreshControl, Easing, ActivityIndicator, TouchableWithoutFeedback } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { SimpleLineIcons } from '@expo/vector-icons';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { Button, Icon, useToast } from 'native-base';
import { Transition, Transitioning } from 'react-native-reanimated'
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment'
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

const Activite = memo(({ activite, index }) => {
    var imageSource = ''
    var title = ''
    var detailUrl
    const [detail, setDetail] = useState({})
    const [loadingDetail, setLoadingDetail] = useState(true)

    switch (activite.ID_HISTORIQUE_CATEGORIE) {
        case 1:
            title = "Contrôle plaque"
            imageSource = require('../../assets/car-plaque1.png')
            detailUrl = `http://app.mediabox.bi:1997/plaques?q=${activite.NUMERO_PLAQUE}`
            break;
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
        case 3:
            title = 'Controle techniques'
            imageSource = require('../../assets/mechanic.png')
            detailUrl = `http://app.mediabox.bi:1997/plaques?q=${activite.NUMERO_PLAQUE}`
            break;
        default:
            imageSource = require('../../assets/car.png')
    }

    /* const showDate = index == 0 ? true : moment(activites[index - 1].DATE_INSERTION).date() != moment(activite.DATE_INSERTION).date()
    const ActivityDate = () => {
              return <Text style={styles.activityDate}>{moment(activite.DATE_INSERTION).calendar()}</Text>
    } */
    useEffect(() => {
        (async () => {
            try {
                const detailRes = await fetch(detailUrl)
                const detailResponse = await detailRes.json()
                setDetail({
                    ...detailResponse[0],
                    model: detailResponse[0]?.MARQUE_VOITURE || detailResponse[0]?.CATEGORIES || activite.NUMERO_PERMIS || 'N/A',
                    numero: detailResponse[0]?.NUMERO_PLAQUE || detailResponse[0]?.NUMERO_PERMIS || activite.NUMERO_PLAQUE || 'N/A',
                    proprietaire: detailResponse[0]?.NOM_PROPRIETAIRE || detailResponse[0]?.NOM_PROPRIETAIRE,
                })
            } catch (error) {
                console.log(error)
            }
            setLoadingDetail(false)
        })()
    }, [])
    return (
        <View key={index.toString()}>
            {/* {showDate && <ActivityDate />} */}
            <View style={styles.activity}>
                <View style={styles.activityImage}>
                    <Image source={imageSource} style={{ width: '80%', height: '80%' }} />
                </View>
                {loadingDetail ? <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator animating={true} size="small" color={"black"} />
                </View> :
                    <View style={styles.activityRightSide}>
                        <Text style={styles.activityTitle} numberOfLines={1} >{title}</Text>
                        {detail.model && <Text style={styles.carModel} numberOfLines={1} >

                            {detail.numero} {detail.model != 'N/A' ? `| ${detail.model}` : ''}
                        </Text>}
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.carOwner} numberOfLines={1} >{detail.proprietaire ?? 'Inconnu'}</Text>
                            <Text style={{ color: '#777', textAlign: 'right', flex: 1 }}>
                                {moment(activite.DATE_INSERTION).calendar()} {moment(activite.DATE_INSERTION).format('H:mm')}
                            </Text>
                        </View>
                    </View>}
            </View>
        </View>
    )
})

const PoliceActiviities = ({ initialsActivites }) => {
    const [offset, setOffset] = useState(0);
    const user = useSelector(userSelector)
    const [loading, setLoading] = useState(false)
    const [activites, setActivites] = useState(initialsActivites)

    const onSuivantPress = async () => {
        setOffset(t => t + 10)
        try {
            setLoading(true);
            const response = await fetch(`http://app.mediabox.bi:1997/historiques?offset=${offset + 10}`, {
                headers: {
                    'authorization': "bearer " + user.TOKEN
                },
            })
            const suivant = await response.json()
            setActivites(t => [...t, ...suivant])
        } catch (error) {
            console.log(error)
            // setLoadingPosts(false)
        }
        setLoading(false);
    }

    useEffect(() => {
        setActivites(initialsActivites)
    }, [initialsActivites])

    return (<View
        style={{ paddingHorizontal: 20 }}>
        <View>
            <View style={styles.activities}>
                {activites.map((activity, index) => {
                    return <Activite activite={activity} index={index} key={index} />
                })}
            </View>
            {activites.length == 0 && <Text style={{ color: '#777' }}>Aucune activité </Text>}
            {activites.length >= 10 && <View style={styles.bouton}>
                <Button width={"50%"} size="lg" background={"#000"} borderRadius={20}
                    isLoading={loading}
                    onPress={onSuivantPress}
                    rightIcon={<MaterialIcons name="navigate-next" size={24} color="#fff" />}
                >
                    Suivant
                </Button>
            </View>}
        </View>
    </View>)
}

const CivilActivites = ({ alerts }) => {
    const navigation = useNavigation()
    const user = useSelector(userSelector)
    return (<View
        style={{ paddingHorizontal: 20 }}>
        {alerts.length == 0 && <Text style={{ color: '#777' }}>Aucune alerte</Text>}
        <View>
            {alerts.map(alert => {
                var imagesCount = 0
                if (alert.IMAGE_1) imagesCount++
                if (alert.IMAGE_2) imagesCount++
                if (alert.IMAGE_3) imagesCount++
                return (
                    <TouchableWithoutFeedback onPress={() => navigation.navigate('AlertDetail', { alert })} key={alert.ID_ALERT}>
                        <View style={styles.activity}>
                            <View style={styles.activityImage}>
                                {alert.ID_ALERT_TYPE == 1 ?
                                    <Image source={require('../../assets/car.png')} style={{ width: '80%', height: '80%' }} /> :
                                    <Image source={require('../../assets/police-user.png')} style={{ width: '80%', height: '80%' }} />}
                            </View>
                            <View style={styles.activityRightSide}>
                                <Text style={styles.activityTitle} numberOfLines={1} >
                                    {alert.ID_ALERT_TYPE == 1 ? 'Véhicule' : 'Agent de la police'}
                                </Text>
                                {<Text style={styles.carModel} numberOfLines={1} >
                                    {alert.CIVIL_DESCRIPTION || 'Pas de description'}
                                </Text>}
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Entypo name="megaphone" size={20} color="#777" />
                                            <Text style={{ color: '#777', marginLeft: 2 }} numberOfLines={1} >
                                                {alert.details.length}
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                                            <Entypo name="image" size={20} color="#777" />
                                            <Text style={{ color: '#777', marginLeft: 2 }} numberOfLines={1} >
                                                {imagesCount}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={{ color: '#777', textAlign: 'right', flex: 1 }}>
                                        {moment(alert.DATE_INSERTION).calendar()} {moment(alert.DATE_INSERTION).format('HH:mm')}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                )
            })}
        </View>
    </View>
    )
}

export default function ProfilScreen() {
    const { width, height } = useWindowDimensions()
    const user = useSelector(userSelector);
    const [showProfil, setShowProfil] = useState(false)
    const profilTransitionRef = useRef()
    const dispatch = useDispatch()
    const route = useRoute()
    const navigation = useNavigation()

    const [activites, setActivites] = useState([])
    const [activitesLoading, setActivitesLoading] = useState(true)

    const [alerts, setAlerts] = useState([])
    const [loadingAlerts, setLoadingAlerts] = useState(true)

    const toast = useToast()


    const getActivites = async () => {
        const response = await fetch('http://app.mediabox.bi:1997/historiques', {
            headers: {
                'authorization': "bearer " + user.TOKEN
            },
        })
        if (response.ok) {
            return response.json()
        } else {
            throw response.json()
        }
    }

    const getAlerts = async () => {
        const alertsResponse = await fetch('http://app.mediabox.bi:1997/alerts/historiques', {
            headers: {
                'authorization': "bearer " + user.TOKEN
            }
        })
        if (alertsResponse.ok) {
            return alertsResponse.json()
        } else {
            throw alertsResponse.json()
        }
    }


    const [refreshing, setRefreshing] = useState(false)
    const onRefresh = async () => {
        setRefreshing(true)
        if (user.PSR_ELEMENT_ID) {
            try {
                const freshPosts = await getActivites()
                setActivites(freshPosts)
            } catch (error) {
                console.log(error)
            }
        } else {
            try {
                const alerts = await getAlerts()
                setAlerts(alerts)
            } catch (error) {
                console.log(error)
            }
        }
        setRefreshing(false)
    }

    const onLogOut = async () => {
        await AsyncStorage.removeItem('user')
        dispatch(unsetUserAction())
    }
    var imageUrl = require('../../assets/man.png')
    if (user.PSR_ELEMENT_ID) {
        imageUrl = require('../../assets/police-user.png')
    }
    if (user.SEXE == 1) {
        imageUrl = require('../../assets/woman.png')
    }

    useEffect(() => {
        (async () => {
            if (user.PSR_ELEMENT_ID) {
                try {
                    const freshPosts = await getActivites()
                    setActivites(freshPosts)
                    setActivitesLoading(false)
                    setLoadingAlerts(false)
                } catch (error) {
                    console.log(error)
                    setActivitesLoading(false)
                    setLoadingAlerts(false)
                }
            } else {
                try {
                    const alerts = await getAlerts()
                    setAlerts(alerts)
                    setLoadingAlerts(false)
                    setActivitesLoading(false)
                } catch (error) {
                    console.log(error)
                    setLoadingAlerts(false)
                    setActivitesLoading(false)
                }
            }
        })()
    }, [])

    useFocusEffect(useCallback(() => {
        const deleteAlert = route.params?.deleteAlert
        if (deleteAlert) {
            setAlerts(alerts => alerts.filter(alert => alert.ID_ALERT != deleteAlert))
            toast.show({
                title: "Incident supprimé",
                placement: "bottom",
                status: 'success',
                duration: 2000,
                width: '90%',
                minWidth: 300,
            })
            navigation.setParams({ deleteAlert: null })
        }
    }, [route.params]))
    return (
        <ScrollView style={styles.container}
            refreshControl={<RefreshControl
                colors={["#000"]} refreshing={refreshing}
                onRefresh={onRefresh} />}>

            <LinearGradient
                colors={['#000', '#000', '#000']}
                style={styles.topHeader}
            >
                <View style={styles.appImage}>
                    <Image source={require('../../assets/favicon.png')} style={{ width: '90%', height: '90%', marginBottom: 5 }} />
                </View>

            </LinearGradient>
            <View style={styles.bottomContainer}>
                <View style={styles.profilCard}>
                    <View style={{ width: 100, height: 120, justifyContent: 'center', alignItems: 'center', borderColor: '#777', borderWidth: 0, borderRadius: 15 }}>
                        <Image source={imageUrl} style={{ width: '100%', height: '100%', borderRadius: 15, }} />
                    </View>
                    <View style={styles.cardRightSide}>
                        <Text style={styles.username}>
                            {user.NOM || user.NOM_CITOYEN} {user.PRENOM || user.PRENOM_CITOYEN}
                        </Text>
                        <Text style={styles.userType}>
                            {user.PSR_ELEMENT_ID ? 'police' : 'citoyen'}
                        </Text>
                        <Button size="sm" background={"#000"}
                            // width={'80%'}
                            marginTop={2}
                            px={5}
                            onPress={onLogOut}
                            leftIcon={<Icon as={SimpleLineIcons} name="logout" size={'sm'} color="#fff" />}>
                            Déconnexion
                        </Button>
                    </View>
                </View>

                <Transitioning.View
                    ref={profilTransitionRef}
                    transition={transition}
                    style={styles.userProfile}>
                    <TouchableOpacity onPress={() => {
                        profilTransitionRef.current.animateNextTransition()
                        setShowProfil(t => !t)
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={styles.profileTitle}>Profil</Text>
                            <FontAwesome5 name="angle-down" size={24} color="#777" />
                        </View>
                    </TouchableOpacity>
                    {showProfil && <View>
                        <View style={styles.profilItem}>
                            <Text style={styles.itemTitle}>Nom</Text>
                            <Text style={styles.itemValue}>
                                {user.NOM || user.NOM_CITOYEN}
                            </Text>
                        </View>
                        <View style={styles.profilItem}>
                            <Text style={styles.itemTitle}>Prénom</Text>
                            <Text style={styles.itemValue}>
                                {user.PRENOM || user.PRENOM_CITOYEN}
                            </Text>
                        </View>
                        {user.PSR_ELEMENT_ID != 0 &&
                            <>
                                <View style={styles.profilItem}>
                                    <Text style={styles.itemTitle}>Lieu</Text>
                                    <Text style={styles.itemValue}>
                                        {user.LIEU_EXACTE}
                                    </Text>
                                </View>
                                <View style={styles.profilItem}>
                                    <Text style={styles.itemTitle}>Matricule</Text>
                                    <Text style={styles.itemValue}>
                                        {user.NUMERO_MATRICULE}
                                    </Text>
                                </View>
                            </>}
                        <View style={styles.profilItem}>
                            <Text style={styles.itemTitle}>Cni</Text>
                            <Text style={styles.itemValue}>
                                {user.TELEPHONE || user.CNI}
                            </Text>
                        </View>
                        <View style={styles.profilItem}>
                            <Text style={styles.itemTitle}>Téléphone</Text>
                            <Text style={styles.itemValue}>
                                {user.TELEPHONE || user.NUMERO_CITOYEN}
                            </Text>
                        </View>
                    </View>}
                </Transitioning.View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
                    <Text style={styles.profileTitle}>
                        {user.PSR_ELEMENT_ID ? 'Historiques' : 'Derniers incidents'}
                    </Text>
                    {/* <FontAwesome5 name="angle-down" size={24} color="#777" /> */}
                </View>
                {(activitesLoading || loadingAlerts) ? <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
                    <Text style={{ color: '#777' }}>Chargement...</Text>
                    <ActivityIndicator animating={true} color="#777" style={{ marginLeft: 10 }} />
                </View> :
                    user.PSR_ELEMENT_ID ? <PoliceActiviities initialsActivites={activites} /> :
                        <CivilActivites alerts={alerts} />}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F7F7',
    },
    topHeader: {
        width: '100%',
        minHeight: 180,
        justifyContent: 'center',
        alignItems: 'center'
    },

    appImage: {
        width: 100,
        height: 100,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -50
    },
    bottomContainer: {
    },
    profilCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        width: '90%',
        alignSelf: 'center',
        elevation: 5,
        shadowColor: '#c4c4c4',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: -50
    },
    cardRightSide: {
        paddingVertical: 30,
        flex: 1,
        marginLeft: 20
    },
    username: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    userType: {
        color: '#777'
    },
    userProfile: {
        paddingHorizontal: 20,
        flexGrow: 1
    },
    profileTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        paddingVertical: 10
    },
    profilItem: {
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    itemTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        opacity: 0.8,
    },
    itemValue: {
        color: '#777',
        fontSize: 16
    },

    userActivities: {
        paddingHorizontal: 20
    },
    activities: {
    },
    activityDate: {
        color: '#333',
        opacity: 0.6,
        fontWeight: 'bold',
        marginLeft: 10,
        marginTop: 10
    },
    activity: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10
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
        maxWidth: '50%'
    },
    bouton: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
})