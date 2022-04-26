import React, { useState } from 'react'
import { StyleSheet, useWindowDimensions, View, Text, TouchableNativeFeedback, TouchableWithoutFeedback, Image, ScrollView } from 'react-native'
import { Entypo, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, Icon, Input } from 'native-base';
import { useNavigation } from '@react-navigation/native';


export default function AlertPlaqueTypeScreen() {
    const { width, height } = useWindowDimensions()
    const [description, setDescription] = useState('')
    const navigation = useNavigation()
    return (
        <ScrollView>
            <View style={{ ...styles.container, minHeight: height - 70 }}>
                <Text style={styles.title}>Quel type d'immatriculation</Text>
                <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#ddd')}>
                    <View style={styles.option}>
                        <Text style={styles.optionName}>Public</Text>
                        {true ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#58A0EB" /> :
                            <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#ddd')}>
                    <View style={styles.option}>
                        <Text style={styles.optionName}>Privé</Text>
                        {false ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#58A0EB" /> :
                            <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#ddd')}>
                    <View style={styles.option}>
                        <Text style={styles.optionName}>Temporaire</Text>
                        {false ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#58A0EB" /> :
                            <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                    </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#ddd')}>
                    <View style={styles.option}>
                        <Text style={styles.optionName}>Aucune dans les réponse</Text>
                        {false ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#58A0EB" /> :
                            <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                    </View>
                </TouchableNativeFeedback>
                <View style={{ ...styles.actions, width }}>
                    <Button size="lg" background={"#58A0EB"} borderRadius={20}
                        onPress={() => navigation.goBack()}
                        marginTop={10}
                        leftIcon={<Icon as={Ionicons} name="arrow-back-outline" size={'sm'} color="#fff" />}>
                        Retourner
                    </Button>
                    <Button size="lg" background={"#58A0EB"} borderRadius={20}
                        onPress={() => navigation.navigate('AlertPlaqueQuestion')}
                        alignSelf="flex-end"
                        marginTop={10}>
                        Continuer
                    </Button>
                </View>
            </View>
        </ScrollView>
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
        position: 'absolute',
        bottom: 50
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
        marginTop: 5
    },
    addImage: {
        width: 100,
        height: 80,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#777',
        borderWidth: 1
    }
})