import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Image, useWindowDimensions, TouchableNativeFeedback, ScrollView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { userSelector } from '../store/selectors/userSelector'


export default function HomeScreen() {
          const { width, height } = useWindowDimensions()
          const MARGIN = 10
          const CARD_WIDTH = (width / 2) - MARGIN * 2 * 2

          const navigation = useNavigation()
          const user = useSelector(userSelector)
          return (
                    <ScrollView style={{flex: 1, backgroundColor: '#F3F7F7'}}>
                              <View style={{ ...styles.container, minHeight: height - 110 }}>
                                        <LinearGradient
                                                  colors={['#000', '#000', '#000']}
                                                  style={{ ...styles.topContainer, minHeight: 300 }}>
                                                  <View style={{ marginTop: -90, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                                            <View style={styles.appImage}>
                                                                      <Image source={require('../../assets/favicon.png')} style={{ width: '90%', height: '90%', marginBottom: 5 }} />
                                                            </View>
                                                            <Text style={styles.appName}>Police de Sécurité Routière</Text>
                                                            <Text style={styles.appDesc} numberOfLines={2}>
                                                                      Application reservée aux polices de sécurité routière
                                                            </Text>
                                                  </View>
                                        </LinearGradient>
                                        <View style={styles.bottomContainer}>
                                                  <View style={styles.cards}>
                                                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#ddd')} useForeground={true} onPress={() => navigation.navigate('PlaquesForm')}>
                                                                      <View style={{ ...styles.card, width: CARD_WIDTH, height: CARD_WIDTH, marginRight: MARGIN }}>
                                                                                <View style={styles.cardImage}>
                                                                                          <Image source={require('../../assets/car-plaque1.png')} style={{ width: '70%', height: '70%' }} />
                                                                                </View>
                                                                                <Text style={styles.cardTitle}>Plaques</Text>
                                                                      </View>
                                                            </TouchableNativeFeedback>
                                                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#ddd')} useForeground={true} onPress={() => navigation.navigate('PermisTab')}>
                                                                      <View style={{ ...styles.card, width: CARD_WIDTH, height: CARD_WIDTH, marginLeft: MARGIN }}>
                                                                                <View style={{ ...styles.cardImage, backgroundColor: '#EBF7FE' }}>
                                                                                          <Image source={require('../../assets/badge.png')} style={{ width: '70%', height: '70%' }} />
                                                                                </View>
                                                                                <Text style={styles.cardTitle}>Permis</Text>
                                                                      </View>
                                                            </TouchableNativeFeedback>
                                                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#ddd')} useForeground={true} onPress={() => navigation.navigate('Recherche')}>
                                                                      <View style={{ ...styles.card, width: CARD_WIDTH, height: CARD_WIDTH, marginTop: width > 200 * 3 ? 0 : MARGIN * 2, marginLeft: width > 200 * 3 ? MARGIN * 2 : 0 }}>
                                                                                <View style={{ ...styles.cardImage, backgroundColor: '#F9EFFC' }}>
                                                                                          <Image source={require('../../assets/police.png')} style={{ width: '70%', height: '70%' }} />
                                                                                </View>
                                                                                <Text style={styles.cardTitle}>Contrôle</Text>
                                                                      </View>
                                                            </TouchableNativeFeedback>
                                                  </View>
                                        </View>
                              </View>
                    </ScrollView>
          )
}

const styles = StyleSheet.create({
          container: {
                    flex: 1,
          },
          topContainer: {
                    height: '60%',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
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
          appName: {
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 19,
                    opacity: 0.8,
                    marginVertical: 10
          },
          appDesc: {
                    color: '#fff',
                    opacity: 0.6,
                    textAlign: 'center',
                    width: '95%',
          },

          bottomContainer: {
                    flex: 1,
                    minHeight: 200,
                    backgroundColor: '#F3F7F7',
                    marginTop: -30,
                    zIndex: 1,
                    borderTopRightRadius: 30,
                    borderTopLeftRadius: 30,

          },
          cards: {
                    marginTop: -60,
                    paddingHorizontal: 20,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignContent: 'center',
                    flexWrap: 'wrap'
          },
          card: {
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    elevation: 5,
                    maxHeight: 200,
                    maxWidth: 200,
                    shadowColor: '#c4c4c4',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
          },
          cardImage: {
                    width: 50,
                    height: 50,
                    borderRadius: 100,
                    backgroundColor: '#E5F9FB',
                    justifyContent: 'center',
                    alignItems: 'center'
          },
          cardTitle: {
                    fontWeight: 'bold',
                    opacity: 0.8,
                    fontSize: 16,
                    marginVertical: 10
          }
})