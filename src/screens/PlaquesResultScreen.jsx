import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, useWindowDimensions, ScrollView, TouchableNativeFeedback, Image, Vibration, BackHandler } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, Icon } from 'native-base';
import LottieView from 'lottie-react-native';
import { Audio } from 'expo-av';

const NotFoundAlert = () => {
          const [s, setSound] = useState();
          const navigation = useNavigation()
          useEffect(() => {
                    (async () => {
                              const { sound } = await Audio.Sound.createAsync(
                                        require('../../assets/wrong.mp3')
                              );
                              setSound(sound);
                              await sound.playAsync()
                              Vibration.vibrate(1000, true)
                    })()

                    return async () => {
                              if (s) {
                                        s.unloadAsync();
                                        Vibration.cancel()
                              }
                    }
          }, [])
          return (
                    <View style={styles.errorContainer}>
                              <LottieView style={{ width: '100%', height: 300 }} source={require('../../assets/lotties/not-found.json')} autoPlay loop />
                              <Text style={styles.errorTitle}>Voiture non trouvée</Text>
                              <Button width={"50%"} size="lg" background={"#58A0EB"} borderRadius={20}
                                        onPress={() => navigation.goBack()}
                                        marginTop={10}
                                        style={{ marginLeft: 20 }}
                                        leftIcon={<Icon as={Ionicons} name="arrow-back-outline" size={'sm'} color="#fff" />}>
                                        Retourner
                              </Button>
                    </View>
          )
}

const VoleeAlert = () => {
          const [s, setSound] = useState();
          const navigation = useNavigation()

          const onGoBack = async () => {
                    navigation.goBack()
          }

          useEffect(() => {
                    (async () => {
                              const ONE_SECOND_IN_MS = 500;
                              const PATTERN = [1, 2 * ONE_SECOND_IN_MS, 3 * ONE_SECOND_IN_MS]

                              const { sound } = await Audio.Sound.createAsync(
                                        require('../../assets/police.mp3')
                              );
                              setSound(sound);
                              await sound.setIsLoopingAsync(true)
                              await sound.replayAsync()
                              Vibration.vibrate(PATTERN, true)

                              navigation.addListener('beforeRemove', async () => {
                                        await sound.unloadAsync()
                                        Vibration.cancel()
                              })
                              navigation.addListener('blur', async () => {
                                        await sound.unloadAsync()
                                        Vibration.cancel()
                              })
                    })()

                    return async () => {
                              if (s) {
                                        s.unloadAsync();
                                        Vibration.cancel()
                              }
                    }
          }, [])
          return (
                    <View style={styles.errorContainer}>
                              <LottieView style={{ width: '100%', height: 300 }} source={require('../../assets/lotties/alert-lamp.json')} autoPlay loop />
                              <Text style={styles.errorTitle}>Voiture volée</Text>
                              <Button width={"50%"} size="lg" background={"#58A0EB"} borderRadius={20}
                                        onPress={onGoBack}
                                        marginTop={10}
                                        style={{ marginLeft: 20 }}
                                        leftIcon={<Icon as={Ionicons} name="arrow-back-outline" size={'sm'} color="#fff" />}>
                                        Retourner
                              </Button>
                    </View>
          )
}

export default function PlaquesResultScreen() {
          const { width, height } = useWindowDimensions()
          const navigation = useNavigation()
          const route = useRoute()
          const { numero } = route.params

          if (numero == 2) {
                    return <NotFoundAlert />
          }
          if (numero == 3) {
                    return <VoleeAlert />
          }
          return (
                    <ScrollView keyboardShouldPersistTaps='always'>
                              <View style={{ ...styles.container, minHeight: height - 70 }}>
                                        <Text style={styles.title}>Séléctionner l'option</Text>
                                        <View style={styles.options}>
                                                  <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#ddd')} onPress={() => navigation.navigate('ImmatriculationsResult')}>
                                                            <View style={styles.option}>
                                                                      <View style={styles.imageIcon}>
                                                                                <Image source={require('../../assets/car.png')} style={{ width: '60%', height: '60%' }} />
                                                                      </View>
                                                                      <Text style={styles.optionName}>Immatriculations</Text>
                                                            </View>
                                                  </TouchableNativeFeedback>
                                                  <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#ddd')} onPress={() => navigation.navigate('AssurancesResult', { numero })}>
                                                            <View style={styles.option}>
                                                                      <View style={styles.imageIcon}>
                                                                                <Image source={require('../../assets/building.png')} style={{ width: '60%', height: '60%' }} />
                                                                      </View>
                                                                      <Text style={styles.optionName}>Assurances</Text>
                                                            </View>
                                                  </TouchableNativeFeedback>
                                                  <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#ddd')} onPress={() => navigation.navigate('ControleResult', { numero })}>
                                                            <View style={styles.option}>
                                                                      <View style={styles.imageIcon}>
                                                                                <Image source={require('../../assets/mechanic.png')} style={{ width: '60%', height: '60%' }} />
                                                                      </View>
                                                                      <Text style={styles.optionName}>Contrôle technique</Text>
                                                            </View>
                                                  </TouchableNativeFeedback>
                                        </View>
                                        <Button width={"50%"} size="lg" background={"#58A0EB"} borderRadius={20}
                                                  onPress={() => navigation.goBack()}
                                                  marginTop={10}
                                                  style={{ marginLeft: 20 }}
                                                  leftIcon={<Icon as={Ionicons} name="arrow-back-outline" size={'sm'} color="#fff" />}>
                                                  Retourner
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
                    width: 40,
                    height: 40,
                    backgroundColor: '#fff',
                    borderRadius: 100,
                    justifyContent: 'center',
                    alignItems: 'center'
          },
          optionName: {
                    marginLeft: 15,
                    fontSize: 16
          },

          errorContainer: {
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    backgroundColor: '#F3F7F7',
          },
          errorTitle: {
                    fontSize: 25,
                    color: 'red',
                    fontWeight: 'bold',
                    opacity: 0.8
          }
})