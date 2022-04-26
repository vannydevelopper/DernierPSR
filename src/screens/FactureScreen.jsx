import { Button, Input, useToast } from 'native-base'
import React, { useRef, useState, useEffect } from 'react'
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import { Modalize } from 'react-native-modalize'
import { userSelector } from '../store/selectors/userSelector';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux'
import { Portal } from 'react-native-portalize'
import Facture from '../components/app/Facture'

export default function FactureScreen() {
    const payModalizeRef = useRef()
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)
    const route = useRoute()
    const user = useSelector(userSelector);
    const toast = useToast()


    const { facture, ID_HISTORIQUE, HISTORIQUE } = route.params;

    // console.log(facture)

    var total = 0
    facture.factureDetails.forEach(detail => {
        total += parseInt(detail.MONTANT, 10)
    })

    // console.log(total)

    // console.log(HISTORIQUE)

    const openPay = () => {
        payModalizeRef.current.open()
    }

    const PaymentModalize = () => {
        const [numero, setNumero] = useState('')
        const [errors, setErrors] = useState(null)

        //Unitialisation de paiyement sur un Api Ecocash et Paiement cote client
        const payerFacture = async () => {
            var url = "http://app.mediabox.bi/api_ussd_php/Api_client_ecocash";
            setLoading(true);
            try {
                const econnetResponse = await fetch(url, {
                    method: 'POST',
                    body: JSON.stringify({
                        VENDEUR_PHONE: "79839653",
                        AMOUNT: "100",
                        CLIENT_PHONE: "71500003",
                        INSTANCE_TOKEN: "1"
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const ecoData = await econnetResponse.json()
                if (ecoData.statut == "200") {
                    const response = await fetch('http://app.mediabox.bi:1997/payements/ecocash', {
                        method: 'POST',
                        body: JSON.stringify({
                            ID_HISTORIQUE: ID_HISTORIQUE || HISTORIQUE,
                            NUMERO: numero,
                            MONTANT_TOTAL: total,
                            TXNI_D: ecoData.txn_id
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                            'authorization': "bearer " + user.TOKEN
                        },
                    })
                    const paiement = await response.json()
                    navigation.navigate('Home')
                    toast.show({
                        title: "Paiement initié avec success",
                        placement: "bottom",
                        status: 'success',
                        duration: 2000,
                        width: '90%',
                        minWidth: 300
                    })
                }
                else {
                    // setLoading(false)
                    setErrors(ecoData.message || 'Erreur, réessayer plus tard')
                }
            }
            catch (error) {
                console.log(error)
                setLoading(false)
                toast.show({
                    title: "Erreur de connexion",
                    placement: "bottom",
                    status: 'error',
                    duration: 2000,
                    width: '90%',
                    minWidth: 300
                })
            }
            setLoading(false);
        }


        return (
            <View style={styles.payContainer}>
                <Image source={require('../../assets/ecocash.png')} style={{ height: 40, width: '50%' }} />
                <Input
                    value={numero}
                    onChangeText={n => setNumero(n)}
                    placeholder='Numéro ecocash'
                    width={"full"} size="lg" mt={5} keyboardType="number-pad" />
                <Text style={{ color: 'red', fontWeight: 'bold', opacity: 0.5, fontSize: 16, marginBottom: 10 }}>{errors}</Text>
                <View style={styles.actions}>
                    <Button isDisabled={numero == ''} borderRadius={10} size="lg" isLoading={loading} onPress={payerFacture} background="#000">Payer</Button>
                </View>
            </View>
        )
    }
    return (
        <>
            <ScrollView>
                <Facture openPay={openPay} facture={facture} />
            </ScrollView>
            {/* <Portal> */}
            <Modalize ref={payModalizeRef} adjustToContentHeight>
                <PaymentModalize />
            </Modalize>
            {/* </Portal> */}
        </>
    )
}

const styles = StyleSheet.create({
    payContainer: {
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actions: {
        width: '100%'
    }
})