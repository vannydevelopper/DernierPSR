import React, { useState } from "react"
import { Input, Icon, Button } from 'native-base';
import { EvilIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableNativeFeedback, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native'

export default function RecherchePlaqueScreen() {
    // const [text, setText] = useState()
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)
    const [plaques, setPlaques] = useState([])

    const onChangeText = async (text) => {
        //setText(text)
        var url = "http://app.mediabox.bi:1997/plaques?q=" + text;
        setLoading(true);
        try {
            if (text != '') {
                const response = await fetch(url);
                const responseJson = await response.json();

                // navigation.navigate("Controle", { plaques: responseJson })

                setPlaques(responseJson);
            }
            console.log(plaques)
        } catch (e) {
            console.log(e);
        }
        setLoading(false);
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Input alignSelf={"center"} width={"90%"} borderColor="#000" mt={2} placeholder="Recherche Plaque" size='xl' py={2} InputLeftElement={
                    <Icon
                        as={<EvilIcons name="search" size={24} color="black" />}
                        size={8}
                        ml="2"
                        color="muted.400"
                    />}
                    onChangeText={(text) => onChangeText(text)}
                />

                {loading ? <ActivityIndicator
                    animating={true}
                    color="#000"
                    size={"large"}
                /> :
                    <View style={styles.lists}>
                        <FlatList
                            data={plaques}
                            keyExtractor={(no, index) => index}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity style={styles.flast} onPress={() => navigation.navigate('Controle', { ID_IMMATRICULATION: item.ID_IMMATRICULATION, NOM_PROPRIETAIRE: item.NOM_PROPRIETAIRE, PRENOM_PROPRIETAIRE: item.PRENOM_PROPRIETAIRE })}>
                                        <View style={styles.primaire}>
                                            {/* <Text>Plaque</Text> */}
                                            <Text style={styles.list_plaque}>{item.NUMERO_PLAQUE}</Text>
                                        </View>
                                        <View style={styles.primaire}>
                                            <Text style={styles.list}>{item.MODELE_VOITURE}</Text>
                                            <Text style={styles.list}>{item.NOM_PROPRIETAIRE} {item.PRENOM_PROPRIETAIRE}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
                        />
                    </View>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F7F7"
    },
    content: {
        paddingHorizontal: 15
        // alignItems: 'center'
    },
    lists: {
        marginTop: 10
    },
    principal: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingVertical: 10,
        paddingHorizontal: 10,
        margin: 10,
        borderRadius: 10,
        elevation: 5,


    },
    secondaire: {
        marginLeft: 10,
        flex: 1
    },
    list: {
        fontSize: 15,
        alignItems: "center",
        justifyContent: "center",
        borderStartColor: "red"
    },
    flast: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: "#fff",
        marginTop: 5,
        elevation: 5,
        shadowColor: "#ddd"
    },
    primaire: {
        fontSize: 15,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    list_plaque: {
        fontSize: 15,
        fontWeight: "bold",
        backgroundColor: "#ddd",
        paddingVertical: 3,
        paddingHorizontal: 7,
        borderRadius: 5
    }

})