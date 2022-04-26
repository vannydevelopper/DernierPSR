import React, { useState } from "react";
import {
    View,
    StyleSheet,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    TouchableWithoutFeedback,
    ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from "react-redux";
import { Button, useToast } from "native-base";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUserAction } from "../store/actions/userActions";
import { IOS_FULLSCREEN_UPDATE_PLAYER_DID_PRESENT } from "expo-av/build/Video";

export default function RegistreScreen() {
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [Nom, setNom] = useState("");
    const [Prenom, setPrenom] = useState("");
    const [Telephone, setTelephone] = useState("");
    const [Cni, SetCni] = useState("");
    const [loading, setLoading] = useState(false);
    const [ConfirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(true);
    const [errors, setErrors] = useState(null);
    const navigation = useNavigation()
    const toast = useToast()
    const dispatch = useDispatch()
    const [sexe, setSexe] = useState(null)

    const handleRegistre = async () => {
        setErrors(null)
        if(Telephone.length != 8) {
                    setErrors(t => {
                    return {
                              ...t,
                              numero: ['Numéro incorrect']
                              }
                    })
                    return false
        }
        if (Password != ConfirmPassword) {
            setErrors(t => {
                return {
                    ...t,
                    ConfirmPassword: ['Les mots de passe ne correspondent pas']
                }
            })
            return false
        }

        setLoading(true)
        try {
            const userResponse = await fetch("http://app.mediabox.bi:1997/users", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: Password,
                    nom: Nom,
                    prenom: Prenom,
                    numero: Telephone,
                    cni: Cni,
                    sexe: sexe
                })

            })
            const newUser = await userResponse.json()
            if (userResponse.ok) {
                await AsyncStorage.setItem("user", JSON.stringify(newUser));
                dispatch(setUserAction(newUser));
                toast.show({
                    title: "Enregistrement faite avec succes",
                    type: "success",
                    duration: 2000
                })
            } else {
                setErrors(newUser.errors)
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
            setErrors(error.errors)
            setLoading(false)
        }
    }
    return (
        <View style={styles.container}>
            {/* <StatusBar backgroundColor="#fff" barStyle="dark-content" /> */}

            <LinearGradient
                colors={['#000', '#000', '#000']}
                style={styles.header}>
                <View style={styles.appImage}>
                    <Image
                        source={require("../../assets/icon.png")}
                        style={{ width: '90%', height: '90%', marginBottom: 5 }}
                    />
                </View>
                <Text
                    style={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: 20,
                        marginTop: 5,
                        opacity: 0.8
                    }}
                >
                    PSR BURUNDI
                </Text>
            </LinearGradient>
            <ScrollView style={styles.footer} keyboardShouldPersistTaps='always'>
                <View >
                    {/* <Text>{JSON.stringify(errors)}</Text> */}
                    <View style={styles.action}>
                        <TextInput
                            placeholder="Nom"
                            style={styles.textInput}
                            autoCapitalize="none"
                            value={Nom}
                            onChangeText={(em) => setNom(em)}
                        />
                    </View>
                    {errors && errors.nom && (<Text style={styles.error}>{errors.nom[0]}</Text>)}

                    <View style={styles.action}>
                        <TextInput
                            placeholder="Prenom"
                            style={styles.textInput}
                            autoCapitalize="none"
                            value={Prenom}
                            onChangeText={(em) => setPrenom(em)}
                        />
                    </View>
                    {errors && errors.prenom && (<Text style={styles.error}>{errors.prenom[0]}</Text>)}

                    <View style={styles.action}>
                        <TextInput
                            placeholder="Telephone"
                            style={styles.textInput}
                            autoCapitalize="none"
                            keyboardType="number-pad"
                            value={Telephone}
                            onChangeText={(em) => setTelephone(em)}
                        />
                    </View>
                    {errors && errors.numero && (<Text style={styles.error}>{errors.numero[0]}</Text>)}

                    <View style={styles.action}>
                        <TextInput
                            placeholder="CNI"
                            style={styles.textInput}
                            autoCapitalize="none"
                            value={Cni}
                            onChangeText={(em) => SetCni(em)}
                        />
                    </View>
                    {errors && errors.cni && (<Text style={styles.error}>{errors.cni}</Text>)}
                    <View style={styles.action}>
                        <TextInput
                            placeholder="Mot de passe"
                            secureTextEntry={showPassword}
                            style={styles.textInput}
                            autoCapitalize="none"
                            value={Password}
                            onChangeText={(em) => setPassword(em)}
                        />
                        <TouchableOpacity onPress={() => setShowPassword((t) => !t)} >
                            {!showPassword ? (
                                <Ionicons name="eye-outline" size={24} color="black" />
                            ) : (
                                <Feather name="eye-off" size={20} color="grey" />
                            )}
                        </TouchableOpacity>
                    </View>
                    {errors && errors.password && (<Text style={styles.error}>{errors.password[0]}</Text>)}
                    <View style={styles.action}>
                        <TextInput
                            placeholder="Confirmer le mot de passe"
                            secureTextEntry={showPassword}
                            style={styles.textInput}
                            autoCapitalize="none"
                            value={ConfirmPassword}
                            onChangeText={(em) => setConfirmPassword(em)}
                        />

                        <TouchableOpacity onPress={() => setShowPassword((t) => !t)} >
                            {!showPassword ? (
                                <Ionicons name="eye-outline" size={24} color="black" />
                            ) : (
                                <Feather name="eye-off" size={20} color="grey" />
                            )}
                        </TouchableOpacity>
                    </View>
                    {errors && errors.ConfirmPassword && (<Text style={styles.error}>{errors.ConfirmPassword[0]}</Text>)}
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: 10}}>
                              <Text style={{color: '#9e9b9b'}}>Sexe</Text>
                              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <TouchableWithoutFeedback onPress={() => setSexe(0)}>
                                                  <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 15}} >
                                                  <Text>Masculin</Text>
                                                  {sexe == 0 ? <MaterialCommunityIcons name="radiobox-marked" size={20} color="#007bff" style={{marginLeft: 5}} /> :
                                                  <MaterialCommunityIcons name="radiobox-blank" size={20} color="#777" style={{marginLeft: 5}} />}
                                                  </View>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback s onPress={() => setSexe(1)}>
                                                  <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 15}}>
                                                            <Text>Féminin</Text>
                                                            {sexe == 1 ? <MaterialCommunityIcons name="radiobox-marked" size={20} color="#007bff" style={{marginLeft: 5}} /> :
                                                            <MaterialCommunityIcons name="radiobox-blank" size={20} color="#777" style={{marginLeft: 5}} />}
                                                  </View>
                                        </TouchableWithoutFeedback>
                              </View>
                    </View>
                    {/* <Button
                        background={"#000"}
                        // onPress={() => navigation.navigate("Login")}
                        onPress={() => handleRegistre()}
                        isDisabled={Nom == "" || Prenom == "" || Telephone == "" || Cni == "" || Password == ""}
                        isLoading={loading}
                        marginBottom={20}
                        // variant={"outline"}
                        size="lg"
                        w="full"
                        mt={10}
                        py={2}
                        _text={{ fontSize: 18 }}
                        borderRadius={10}
                    >
                        S'inscrire
                    </Button> */}

                    <Button width={"50%"} size="lg" borderRadius={10}
                        onPress={() => handleRegistre()}
                        // marginTop={10}
                        isDisabled={Nom == "" || Prenom == "" || Telephone == "" || Cni == "" || Password == "" || ConfirmPassword == "" || sexe == null}
                        isLoading={loading}
                        marginBottom={20}
                        mt={10}
                        py={2}
                        w="full"
                        borderColor={"dark.200"}
                        background={"dark.200"}
                    >
                        S'inscrire
                    </Button>


                </View>
            </ScrollView>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    header: {
        height: "30%",
        marginTop: 10,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingBottom: 50,
    },


    appImage: {
        width: 100,
        height: 100,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    footer: {
        height: "80%",
        backgroundColor: "#fff",
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30,
        // margin: 10,
        elevation: 5

    },
    action: {
        flexDirection: "row",
        marginTop: 35,
        borderBottomWidth: 1,
        borderBottomColor: "#f2f2f2",
        paddingBottom: 5,
    },
    textInput: {
        flex: 1,
        paddingLeft: 10,
        color: "#05375a",
    },
    error: {
        color: "#F90505",
    },

})