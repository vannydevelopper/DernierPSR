import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, useWindowDimensions, View, Text, TouchableNativeFeedback, TouchableWithoutFeedback, Image, ScrollView, ActivityIndicator } from 'react-native'
import { Entypo, Ionicons } from '@expo/vector-icons';
import { Button, Icon, Input, useToast } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import { useSelector } from 'react-redux';
import { userSelector } from '../../store/selectors/userSelector';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import * as Location from 'expo-location';

export default function AlertPlaqueQuestions() {
    const { width, height } = useWindowDimensions()
    const [description, setDescription] = useState('')
    const [location, setLocation] = useState(null)
    const route = useRoute()
    const navigation = useNavigation()
    const [images, setImages] = useState([])
    const [questionnaires, setQuestionnaires] = useState([])
    const [policequestionnaires, setPoliceQuestionnaires] = useState([])
    const [selectedQuestionnaires, setSelectedQuestionnaires] = useState([])
    const [loading, setLoading] = useState(false)
    const photoTypeSelectRef = useRef(null)
    const user = useSelector(userSelector)
    const toast = useToast()
    const [loadingQuestions, setLoadingQuestions] = useState(true)

    const { alertType, ID_IMMATRICULATION, photo } = route.params


    const askLocationPermission = async () => {
        let { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
        if (locationStatus !== 'granted') {
            console.log('Permission to access location was denied');
            setLocation(false)
            return;
        }
        var location = await Location.getCurrentPositionAsync({});
        setLocation(location)
    }

    //Pour recuperer les donnees pour une vehivule
    useEffect(() => {
        const fetchQuestion = async () => {
            var url
            if (alertType == 1) {
                url = 'http://app.mediabox.bi:1997/alerts/questionnaires/vehicules'
            } else if (alertType == 2) {
                url = 'http://app.mediabox.bi:1997/alerts/questionnaires/polices'
            }

            try {
                const response = await fetch(url)
                const question = await response.json()
                // const fetchQuestion = question
                const fetchQuestion = question

                setQuestionnaires(fetchQuestion)

                // console.log(fetchQuestion)
            } catch (error) {
                console.log(error)
            }
            setLoadingQuestions(false)

        }
        askLocationPermission()
        fetchQuestion()
    }, [])


    const onTakePictureSelect = async () => {
        photoTypeSelectRef.current?.close()
        const photo = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true
        })
        if (!photo.cancelled) {
            setImages(t => [...t, photo])
        }
    }

    const onSelectPictureSelect = async () => {
        photoTypeSelectRef.current?.close()
        const photo = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true
        });
        if (!photo.cancelled) {
            setImages(t => [...t, photo])
        }
    }

    const onCameraSelect = () => {
        photoTypeSelectRef.current?.open()
    }

    const onPhotoRemove = (photo) => {
        const newImages = images.filter(image => image.uri != photo.uri)
        setImages(newImages)
    }

    //fonction pour selectionner pour cocher et decocher une question
    const onQuestionSelect = (question) => {
        const isSelected = selectedQuestionnaires.find(q => q.ID_CONTROLES_QUESTIONNAIRES == question.ID_CONTROLES_QUESTIONNAIRES)
        if (isSelected) {
            const newSelectedQuestionnaires = selectedQuestionnaires.filter(q => q.ID_CONTROLES_QUESTIONNAIRES != question.ID_CONTROLES_QUESTIONNAIRES)
            setSelectedQuestionnaires(newSelectedQuestionnaires)
        } else {
            setSelectedQuestionnaires(t => {
                return [...t, question]
            })
        }
    }
    //fonction pour envoyer les donnees dans la base 
    const Enregistrer = async () => {
        const form = new FormData()

        form.append('ALERT_TYPE', alertType)
        form.append('LATITUDE', location.coords.latitude)
        form.append('LONGITUDE', location.coords.longitude)
        if (ID_IMMATRICULATION) {
            form.append('ID_IMMATRICULATION', ID_IMMATRICULATION)
        }
        if (description != '') {
            form.append('CIVIL_DESCRIPTION', description)
        }

        if (selectedQuestionnaires.length > 0) {
            form.append('QUESTIONNAIRES', JSON.stringify(selectedQuestionnaires))
        }
        if (images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                const manipResult = await manipulateAsync(
                    images[i].uri,
                    [
                        // { resize: { width: 300 } }
                    ],
                    { compress: 0.7, format: SaveFormat.JPEG }
                );
                let localUri = manipResult.uri;
                let filename = localUri.split('/').pop();
                let match = /\.(\w+)$/.exec(filename);
                let type = match ? `image/${match[1]}` : `image`;
                form.append('IMAGES', {
                    uri: localUri, name: filename, type
                })
            }
        }
        setLoading(true);
        try {
            const response = await fetch("http://app.mediabox.bi:1997/alerts", {
                method: "POST",
                body: form,
                headers: {
                    'authorization': "bearer " + user.TOKEN
                },
            })
            const data = await response.json()
            if (response.ok) {
                toast.show({
                    title: "Merci pour votre alerte",
                    placement: "bottom",
                    status: 'success',
                    duration: 2000,
                    width: '90%',
                    minWidth: 300
                })
                navigation.navigate('Home')
            } else {
                console.log(data)
            }
        } catch (error) {
            console.log(error)
            toast.show({
                title: "Erreur, réessayer plus tard",
                placement: "bottom",
                status: 'error',
                duration: 2000,
                width: '90%',
                minWidth: 300
            })
        }
        setLoading(false);
    }
    if (loadingQuestions) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator animating={true} size="large" color="#000" />
            </View>
        )
    }
    if (location === false) {
        return <View style={{ alignContent: 'center', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Text>Pas d'accès à la localisation</Text>
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple('#fff')}
                useForeground={true}
                onPress={() => askLocationPermission()}
            >
                <View style={{ backgroundColor: '#ddd', borderRadius: 10, padding: 10, marginTop: 50 }}>
                    <Text>Autoriser l'accès</Text>
                </View>
            </TouchableNativeFeedback>
        </View>
    }

    return (
        <>
            <ScrollView keyboardShouldPersistTaps={"always"}>
                <View style={{ ...styles.container, minHeight: height - 95 }}>
                    <Text style={styles.title}>C'est quoi l'incident ? (<Entypo name="check" size={20} color="#58A0EB" />)</Text>
                    {questionnaires.map((question, index) => {
                        const isSelected = selectedQuestionnaires.find(q => q.ID_CONTROLES_QUESTIONNAIRES == question.ID_CONTROLES_QUESTIONNAIRES)
                        return (
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#ddd')} onPress={() => onQuestionSelect(question)} key={question.ID_CONTROLES_QUESTIONNAIRES}>
                                <View style={styles.option}>
                                    <Text style={{ ...styles.optionName, color: isSelected ? '#58A0EB' : "#777" }}>{question.INFRACTIONS}</Text>
                                    {/* <Text style={{ color: "red" }}>{index.MONTANT}</Text> */}
                                    {isSelected && <Entypo name="check" size={20} color="#58A0EB" />}
                                </View>
                            </TouchableNativeFeedback>
                        )
                    })}
                    <Input multiline mb={5} minHeight={100} value={description} onChangeText={(desc) => setDescription(desc)} alignSelf="center" width={"90%"} borderColor="#58A0EB" mt={2} placeholder="Description" size='xl' py={2} />
                    <Text style={styles.imagesTitlte}>Images</Text>
                    <View style={styles.addImageContainer}>
                        {images.map((image, index) => {
                            return (
                                <TouchableWithoutFeedback onPress={() => onPhotoRemove(image)} key={index}>
                                    <View style={{ ...styles.addImage, borderWidth: 0, marginLeft: index > 0 ? 10 : 0 }} >
                                        <Image source={{ uri: image.uri }} style={{ width: '100%', height: '100%', borderRadius: 5 }} />
                                        <View style={styles.removeFavoritesBadge}>
                                            <Text style={styles.favBadgeText}>-</Text>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            )
                        })}
                        {images.length < 3 && <TouchableWithoutFeedback onPress={onCameraSelect}>
                            <View style={{ ...styles.addImage, marginLeft: images.length > 0 ? 10 : 0 }}>
                                <Image source={require('../../../assets/picture.png')} style={{ width: '50%', height: '50%' }} />
                            </View>
                        </TouchableWithoutFeedback>}
                    </View>
                    <View style={{ ...styles.actions, width }}>
                        <Button size="lg" background={"#000"} borderRadius={20}
                            onPress={() => navigation.goBack()}
                            marginTop={10}
                            leftIcon={<Icon as={Ionicons} name="arrow-back-outline" size={'sm'} color="#fff" />}>
                            Retourner
                        </Button>
                        <Button size="lg" background={"#000"} borderRadius={20}
                            onPress={() => Enregistrer()}
                            isLoading={loading}
                            // onPress={() => navigation.navigate('AlertPlaqueQuestion')}
                            isDisabled={description == "" && selectedQuestionnaires == ""}
                            alignSelf="flex-end"
                            marginTop={10}>
                            Envoyer
                        </Button>
                    </View>
                </View>
            </ScrollView>
            <Modalize ref={photoTypeSelectRef} adjustToContentHeight handleStyle={{ display: 'none' }}>
                <View style={{ paddingVertical: 20 }}>
                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#ddd')} onPress={onTakePictureSelect}>
                        <View style={styles.option}>
                            <Text style={styles.optionName}>Prendre une photo</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#ddd')} onPress={onSelectPictureSelect}>
                        <View style={styles.option}>
                            <Text style={styles.optionName}>Séléctionner une photo</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </Modalize>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F7F7',
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
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 20
    },
    optionName: {
        fontSize: 16,
        color: '#777'
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        // position: 'absolute',
        // bottom: 50
    },
    imagesTitlte: {
        fontWeight: 'bold',
        color: '#777',
        opacity: 0.8,
        fontSize: 16,
        marginHorizontal: 20,

    },
    addImageContainer: {
        paddingHorizontal: 20,
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    addImage: {
        width: 100,
        height: 80,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#777',
        borderWidth: 1
    },
    removeFavoritesBadge: {
        position: 'absolute',
        right: -8,
        top: -8,
        backgroundColor: '#F54748',
        width: 25,
        height: 25,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        zIndex: 20
    },
    favBadgeText: {
        color: '#fff',
        fontSize: 25,
        marginTop: -13,
        fontWeight: 'bold'
    },

    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    optionName: {
        fontSize: 16
    },
})