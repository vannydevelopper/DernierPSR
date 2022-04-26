import React, { useRef, useState } from 'react'
import { View, Text, StyleSheet, Image, TouchableNativeFeedback, ScrollView, Modal, TouchableOpacity } from 'react-native'
import { Button, Icon, useToast } from 'native-base'
import { Feather, Ionicons } from '@expo/vector-icons';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment'
import { useSelector } from 'react-redux';
import { userSelector } from '../../store/selectors/userSelector';
import ImageViewer from 'react-native-image-zoom-viewer';
moment.updateLocale('fr', {
    calendar: {
        sameDay: "[Aujourd'hui]",
        lastDay: "[Hier]",
        nextDay: 'DD-M-YYYY',
        lastWeek: 'DD-M-YYYY',
        sameElse: 'DD-M-YYYY',
    }
})

export default function AlertProfilScreen() {
    const confirmRef = useRef()
    const route = useRoute()
    const { alert } = route.params
    const navigation = useNavigation()
    const [deleting, setDeleting] = useState(false)
    const toast = useToast()
    const user = useSelector(userSelector)
    const [showImageModal, setShowImageModal] = useState(false)
    const [imageIndex, setImageIndex] = useState(0)

    const onDelete = async () => {
        confirmRef.current.close()
        setDeleting(true)
        try {
            const res = await fetch(`http://app.mediabox.bi:1997/alerts/${alert.ID_ALERT}`, {
                method: 'DELETE',
                headers: {
                    'authorization': "bearer " + user.TOKEN
                }
            })
            const data = await res.json()
            if (res.ok && data.deleted) {
                navigation.navigate('Profil', { deleteAlert: alert.ID_ALERT })
            } else {
                toast.show({
                    title: "Incident non supprimé",
                    placement: "bottom",
                    status: 'error',
                    duration: 2000,
                    width: '90%',
                    minWidth: 300
                })
            }
        } catch (error) {
            console.log(error)
            toast.show({
                title: "Incident non supprimé",
                placement: "bottom",
                status: 'error',
                duration: 2000,
                width: '90%',
                minWidth: 300
            })
        }
        setDeleting(false)
    }

    var imageUrls = []
    if (alert.IMAGE_1) imageUrls.push(`http://app.mediabox.bi:1997/images/alerts/${alert.IMAGE_1}`)
    if (alert.IMAGE_2) imageUrls.push(`http://app.mediabox.bi:1997/images/alerts/${alert.IMAGE_2}`)
    if (alert.IMAGE_3) imageUrls.push(`http://app.mediabox.bi:1997/images/alerts/${alert.IMAGE_3}`)
    return (
        <>
            <ScrollView style={styles.container}>
                <Text style={styles.title}>
                    {moment(alert.DATE_INSERTION).calendar()}, à {moment(alert.DATE_INSERTION).format('HH:m')}
                </Text>
                <View style={styles.detail}>
                    <Text style={styles.detailTitle}>
                        Type d'incident
                    </Text>
                    <Text style={styles.detailValue}>
                        {alert.ID_ALERT_TYPE == 1 ? 'Véhicule' : 'Agent de la police'}
                    </Text>
                </View>
                <View style={styles.detail}>
                    <Text style={styles.detailTitle}>
                        Incidents declarés
                    </Text>
                    {alert.details.length == 0 && <Text style={{ color: '#777' }}>Pas d'incidents</Text>}
                    {alert.details.map(detail => <Text style={{ ...styles.detailValue, width: '90%' }} numberOfLines={1} key={detail.ID_CONTROLES_QUESTIONNAIRES}>
                        - {detail.INFRACTIONS}
                    </Text>)}
                </View>
                <View style={styles.detail}>
                    <Text style={styles.detailTitle}>
                        Description
                    </Text>
                    <Text style={styles.detailValue}>
                        {!alert.CIVIL_DESCRIPTION && <Text style={{ color: '#777' }}>Pas de description</Text>}
                        {alert.CIVIL_DESCRIPTION}
                    </Text>
                </View>
                <View style={styles.detail}>
                    <Text style={styles.detailTitle}>
                        Images
                    </Text>
                    {!alert.IMAGE_1 && !alert.IMAGE_2 && !alert.IMAGE_3 && <Text style={{ color: '#777' }}>Pas d'images</Text>}
                    <View style={styles.images}>
                        {alert.IMAGE_1 && <TouchableOpacity style={styles.image} onPress={() => {
                            setImageIndex(0)
                            setShowImageModal(true)
                        }
                        }>
                            <Image source={{ uri: `http://app.mediabox.bi:1997/images/alerts/${alert.IMAGE_1}` }} style={{ width: '100%', height: '100%', borderRadius: 5 }} />
                        </TouchableOpacity>}
                        {alert.IMAGE_2 && <TouchableOpacity style={{ ...styles.image, marginLeft: 10 }} onPress={() => {
                            setImageIndex(1)
                            setShowImageModal(true)
                        }
                        }>
                            <Image source={{ uri: `http://app.mediabox.bi:1997/images/alerts/${alert.IMAGE_2}` }} style={{ width: '100%', height: '100%', borderRadius: 5 }} />
                        </TouchableOpacity>}
                        {alert.IMAGE_3 && <TouchableOpacity style={{ ...styles.image, marginLeft: 10 }} onPress={() => {
                            setImageIndex(2)
                            setShowImageModal(true)
                        }
                        }>
                            <Image source={{ uri: `http://app.mediabox.bi:1997/images/alerts/${alert.IMAGE_3}` }} style={{ width: '100%', height: '100%', borderRadius: 5 }} />
                        </TouchableOpacity>}
                    </View>
                </View>
                <Button size="lg" borderRadius={10} background={"#fff"} _text={{ color: '#000', fontSize: 15 }} borderColor={"#000"} borderWidth={1}
                    marginTop={10}
                    isLoading={deleting}
                    onPress={() => confirmRef.current.open()}
                    leftIcon={<Icon as={Feather} name="trash-2" size={'sm'} color="#000" />}>
                    Supprimer l'incident
                </Button>
            </ScrollView>
            <Modal visible={showImageModal} transparent={true} onRequestClose={() => setShowImageModal(false)}>
                <ImageViewer
                    renderHeader={() => {
                        return (
                            <View style={{ padding: 20, width: '100%', position: 'absolute', zIndex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                <TouchableOpacity onPress={() => setShowImageModal(false)}>
                                    <View style={styles.tBtn}>
                                        <Ionicons name="arrow-back-outline" size={24} color="#fff" />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )
                    }}
                    index={imageIndex}
                    renderIndicator={() => <Text></Text>}
                    loadingRender={() => <Text>loading image</Text>}
                    imageUrls={imageUrls.map(image => ({ url: image }))}
                    enableSwipeDown={true}
                    onSwipeDown={() => setShowImageModal(false)}
                    onCancel={() => setShowImageModal(false)}
                    saveToLocalByLongPress={false}
                    enablePreload={true}
                    swipeDownThreshold={100}
                />
            </Modal>
            {/* <Portal> */}
            <Modalize ref={confirmRef} adjustToContentHeight handleStyle={{ display: 'none' }} modalStyle={{ borderTopRightRadius: 20, borderTopLeftRadius: 20 }}>
                <View style={{ paddingVertical: 20 }}>
                    <Text style={{ padding: 10, textAlign: 'center', fontSize: 16 }}>Supprimer cet incident ?</Text>
                    <View style={{ paddingHorizontal: 30 }}>
                        <Button size="lg" borderRadius={10} background={"#fff"} _text={{ color: '#000', fontSize: 15 }} borderColor={"#000"} borderWidth={1}
                            marginTop={5}
                            onPress={onDelete}>
                            Supprimer
                        </Button>
                    </View>
                    {/* <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#ddd')} onPress={onDelete}>
                                                            <View style={styles.option}>
                                                                      <Text style={{...styles.optionName, color: 'red'}}>Supprimer</Text>
                                                            </View>
                                                  </TouchableNativeFeedback> */}
                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#ddd')} onPress={() => confirmRef.current.close()}>
                        <View style={styles.option}>
                            <Text style={{ ...styles.optionName, color: '#000' }}>Annuler</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </Modalize>
            {/* </Portal> */}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#F3F7F7'
    },
    title: {
        fontSize: 20,
        marginVertical: 30,
        opacity: 0.8,
    },
    detail: {
        marginTop: 10
    },
    detailTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        opacity: 0.8,
    },
    detailValue: {
        color: '#777',
        fontSize: 16
    },
    images: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    image: {
        width: 100,
        height: 100
    },

    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 20
    },
    optionName: {
        fontSize: 16,
        width: '100%',
        textAlign: 'center'
    },
})