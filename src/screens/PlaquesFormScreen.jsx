import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, useWindowDimensions, ScrollView } from 'react-native'
import LottieView from 'lottie-react-native';
import { Input, Icon, Button, KeyboardAvoidingView } from 'native-base';
import { EvilIcons } from '@expo/vector-icons';
import { userSelector } from '../store/selectors/userSelector';
import { useDispatch, useSelector } from 'react-redux'
import wait from '../helpers/wait';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

export default function PlaquesFormScreen() {
    const [numero, setNumero] = useState('')
    const [location, setLocation] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(false)
    const { width, height } = useWindowDimensions()
    const user = useSelector(userSelector);
    const navigation = useNavigation()

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


    const getItem = async (NUMERO_PLAQUE) => {
        // setLoadingPlaque(true);
        if (NUMERO_PLAQUE == "") {
            // alert("numero plaque obligatoire")
        } else {
            // var url = "http://app.mediabox.bi:1997/plaques/check_plaques";
            var url = "http://app.mediabox.bi:1997/plaques/check_plaques";
            setLoading(true);
            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': "bearer " + user.TOKEN
                    },
                    body: JSON.stringify({
                        numeroPlaque: NUMERO_PLAQUE,
                        lat: location.latitude,
                        long: location.longitude
                    })
                });
                const responseJson = await response.json();
                // if(responseJson.ok){
                navigation.navigate("Board", { plaques: responseJson })
                // setFilteredDataSource(responseJson);
                console.log(responseJson);
                // }else{
                //   console.log(responseJson);  
                // }
            } catch (e) {
                console.log(e);
            }
            // setLoadingPlaque(false);
            setLoading(false);
        }
    }
    return (
        <ScrollView keyboardShouldPersistTaps='always'>
            <View style={{ ...styles.container, minHeight: height - 150 }}>
                <LottieView style={{ width: '100%', height: 300 }} source={require('../../assets/lotties/car-number-plate.json')} autoPlay loop />

                <Input value={numero} onChangeText={(numero) => setNumero(numero)} width={"90%"} borderColor="#000" mt={2} placeholder="Entrez le numéro du plaque" size='xl' py={2} InputLeftElement={
                    <Icon
                        as={<EvilIcons name="search" size={24} color="black" />}
                        size={8}
                        ml="2"
                        color="muted.400"
                    />}
                />
                <Button isDisabled={numero == ''} isLoading={loading} onPress={() => getItem(numero)} marginTop={10} width={"50%"} size="lg" background={"#000"} borderRadius={10}>Vérifier</Button>
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
})