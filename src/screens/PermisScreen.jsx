import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, useWindowDimensions, ScrollView } from 'react-native'
import LottieView from 'lottie-react-native';
import { Input, Icon, Button } from 'native-base';
import { EvilIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { userSelector } from '../store/selectors/userSelector';
import { useDispatch, useSelector } from 'react-redux'
import * as Location from 'expo-location';
import wait from '../helpers/wait';

export default function PermisScreen() {
    const [numero, setNumero] = useState('')
    const { width, height } = useWindowDimensions()
    const navigation = useNavigation()
    const user = useSelector(userSelector);
    const [loading, setLoading] = useState(false)
    const [location, setLocation] = useState("null")
    const [errorMsg, setErrorMsg] = useState(null);

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


    const getItem = async (numeroPermis) => {
        if (numeroPermis == "") {

        } else {
            // var url = "http://app.mediabox.bi:1997/permis/check_permis";
            var url = "http://app.mediabox.bi:1997/permis/check_permis";
            setLoading(true);

            try {

                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': "bearer " + user.TOKEN
                    },
                    body: JSON.stringify({
                        numeroPermis: numeroPermis,
                        lat: location.latitude,
                        long: location.longitude
                    })
                });
                const responseJson = await response.json();
                navigation.navigate("PermisResult", { permis: responseJson })
            } catch (e) {
                console.log(e)
            }
            setLoading(false);
        }
    }

    return (
        <ScrollView keyboardShouldPersistTaps='always'>
            <View style={{ ...styles.container, minHeight: height - 150 }}>
                <LottieView speed={2} style={{ width: '100%', height: 300 }} source={require('../../assets/lotties/identity-card.json')} autoPlay loop />

                {user.PSR_ELEMENT_ID != 0 &&
                    <>
                        <Input value={numero} onChangeText={(numero) => setNumero(numero)} width={"90%"} borderColor="#000" mt={2} placeholder="Entrez le numéro du permis" size='xl' py={2} InputLeftElement={
                            <Icon
                                as={<EvilIcons name="search" size={24} color="black" />}
                                size={8}
                                ml="2"
                                color="muted.400"
                            />}
                        />
                        <Button
                            isDisabled={numero == ''}
                            isLoading={loading}
                            onPress={() => getItem(numero)}
                            marginTop={10} width={"50%"} size="lg" background={"#000"} color="#fff" borderRadius={10}>
                            Vérifier
                        </Button>
                        <View style={styles.separator}>
                            <View style={styles.separatorLine} />
                            <Text style={styles.separatorText}>OU</Text>
                            <View style={styles.separatorLine} />
                        </View>
                    </>
                }
                <Button style={{ flexDirection: 'row' }} width={"50%"} size="lg" background={"#000"} borderRadius={10}
                    onPress={() => navigation.navigate('PermisScan')}
                    leftIcon={<Icon as={AntDesign} name="scan1" size={'sm'} color="#fff" />}>
                    Scanner
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
        alignItems: 'center'
    },
    separator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 50,
        marginVertical: 20
    },
    separatorLine: {
        height: 1,
        flex: 1,
        backgroundColor: '#ddd'
    },
    separatorText: {
        marginHorizontal: 10
    }
})