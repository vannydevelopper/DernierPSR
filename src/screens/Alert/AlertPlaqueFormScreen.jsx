import React, { useEffect, useState } from 'react'
import { Icon, Input, Button } from 'native-base'
import { StyleSheet, Text, View, ActivityIndicator, useWindowDimensions, TouchableNativeFeedback, Image, FlatList } from 'react-native'
import { EvilIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function AlertPlaqueFormScreen() {
    const { width, height } = useWindowDimensions()
    const [numero, setNumero] = useState('')
    const [plaques, setPlaques] = useState([])
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)

    const route = useRoute()
    const { alertType } = route.params
    useEffect(() => {
        (async () => {
            
            if (numero != '') {
                const plaquesRes = await fetch(`http://app.mediabox.bi:1997/plaques?q=${numero}`)
                const plaques = await plaquesRes.json()
                setPlaques(plaques)
            }
            // console.log(plaques)
            setLoading(false)
        })()
    }, [numero])
    return (
        <View style={{ ...styles.container, minHeight: height - 70 }}>
            <Text style={styles.title}>Connaissez-vous le numéro de la plaque ?</Text>
            <Input value={numero} onChangeText={(numero) => setNumero(numero)} onChange={() => setLoading(true)} alignSelf="center" width={"90%"} borderColor="#58A0EB" mt={2} placeholder="Numéro de la plaque" size='xl' py={2} InputLeftElement={
                <Icon
                    as={<EvilIcons name="search" size={24} color="black" />}
                    size={8}
                    ml="2"
                    color="muted.400"
                />}
            />
            <View>
                {loading ? <View style={{ flexDirection: 'row', alignItems: 'center', margin: 20 }}>
                    <Text style={{ color: '#777' }}>Recherche...</Text>
                    <ActivityIndicator animating={true} color="#777" size="small" style={{ marginLeft: 5 }} />
                </View> :
                    <FlatList
                        data={plaques}
                        keyExtractor={(item, index) => index.toString()}
                        keyboardShouldPersistTaps="always"
                        style={{ marginTop: 10 }}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#ddd')} onPress={() => navigation.navigate('AlertPlaqueQuestion', { ID_IMMATRICULATION: item.ID_IMMATRICULATION, alertType })}>
                                    <View style={styles.option}>
                                        <View style={styles.imageIcon}>
                                            <Image source={require('../../../assets/car.png')} style={{ width: '60%', height: '60%' }} />
                                        </View>
                                        <View style={{ marginLeft: 15 }}>
                                            <Text style={styles.optionName}>{item.NUMERO_PLAQUE}</Text>
                                            <Text style={{ color: '#777', fontSize: 13 }}>{item.MODELE_VOITURE}</Text>
                                        </View>
                                    </View>
                                </TouchableNativeFeedback>
                            )
                        }}
                    />}
            </View>
            <View style={{ ...styles.actions, width }}>
                <Button size="lg" background={"#000"} borderRadius={20}
                    onPress={() => navigation.goBack()}
                    marginTop={10}
                    leftIcon={<Icon as={Ionicons} name="arrow-back-outline" size={'sm'} color="#fff" />}>
                    Retourner
                </Button>
                <Button size="lg" background={"#000"} borderRadius={20}
                    onPress={() => navigation.navigate('AlertPlaqueQuestion', { alertType })}
                    alignSelf="flex-end"
                    px={10}
                    marginTop={10}>
                    Non
                </Button>
            </View>
        </View>
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
        fontSize: 16
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        position: 'absolute',
        bottom: 50
    }
})