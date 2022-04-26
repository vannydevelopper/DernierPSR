import { useNavigation } from '@react-navigation/native'
import React, { useState, useEffect, useRef } from 'react'

import {
          View,
          StyleSheet,
          Image,
          Text,
          SafeAreaView,
          Alert,
          TouchableNativeFeedback,
          ScrollView,
          ActivityIndicator,
          TouchableOpacity,
          Vibration
} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { Audio } from 'expo-av';
import { Button, Icon } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { Transition, Transitioning } from 'react-native-reanimated'
import moment from 'moment'
moment.updateLocale('fr', {
          calendar: {
                    sameDay: "[Aujourd'hui]",
                    lastDay: "[Hier]",
                    nextDay: 'DD-M-YYYY',
                    lastWeek: 'DD-M-YYYY',
                    sameElse: 'DD-M-YYYY',
          }
})

import { useDispatch, useSelector } from 'react-redux'
import { unsetUserAction } from '../../store/actions/userActions';
import { userSelector } from '../../store/selectors/userSelector';

const transition = (
          <Transition.Together>
                    <Transition.In type="fade" durationMs={200} />
                    <Transition.Change />
                    <Transition.Out type="fade" durationMs={200} />
          </Transition.Together>
)

const NotFoundAlert = ({ INFRACTIONS, STATUS_MESSAGE }) => {
          const [s, setSound] = useState();
          const navigation = useNavigation()
          useEffect(() => {
                    (async () => {
                              const { sound } = await Audio.Sound.createAsync(
                                        require('../../../assets/wrong.mp3')
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
                              <LottieView style={{ width: '100%', height: 300 }} source={require('../../../assets/lotties/alert-lamp.json')} autoPlay loop />
                              <Text style={styles.errorTitle}>{STATUS_MESSAGE}</Text>
                              <Button width={"50%"} size="lg" background={"#000"} borderRadius={20}
                                        onPress={() => navigation.goBack()}
                                        marginTop={10}
                                        style={{ marginLeft: 20 }}
                                        leftIcon={<Icon as={Ionicons} name="arrow-back-outline" size={'sm'} color="#fff" />}>
                                        Retourner
                              </Button>
                    </View>
          )
}


const VoleeAlert = ({ INFRACTIONS, STATUS_MESSAGE }) => {
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
                                        require('../../../assets/police.mp3')
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
                              <LottieView style={{ width: '100%', height: 300 }} source={require('../../../assets/lotties/alert-lamp.json')} autoPlay loop />
                              <Text style={styles.errorTitle}>{STATUS_MESSAGE}</Text>

                              <View>
                                        <View style={styles.amandes}>
                                                  {/* <AntDesign name="creditcard" size={24} color={'red'} /> */}
                                                  {/* <Text style={styles.itemTitle}>Amandes</Text> */}
                                        </View>
                                        <View style={styles.infra}>
                                                  <Text style={styles.infra}>
                                                            {INFRACTIONS?.AMENDES}
                                                  </Text>
                                        </View>
                              </View>
                              <Button width={"50%"} size="lg" background={"#000"} borderRadius={20}
                                        onPress={onGoBack}
                                        marginTop={10}
                                        style={{ marginLeft: 20 }}
                                        leftIcon={<Icon as={Ionicons} name="arrow-back-outline" size={'sm'} color="#fff" />}>
                                        Retourner
                              </Button>
                    </View>
          )
}



export default function Dash({ item }) {

          const [selected, setSelected] = useState()
          const user = useSelector(userSelector);
          const [showProfil, setShowProfil] = useState(false)
          const [showActivities, setShowActivities] = useState(true)
          const profilTransitionRef = useRef()
          const activitiesTransitionRef = useRef()

          const [activites, setActivites] = useState([])

          const navigation = useNavigation()
          const assurance = item.assurance
          const controle = item.controle
          const immatriculation = item.immatriculation
          const declartionVol = item.declartionVol

          // console.log(item.ID_HISTORIQUE)

          const factureDetails = []
          if (assurance.INFRACTIONS) {
                    factureDetails.push({ ...assurance.INFRACTIONS, STATUS_MESSAGE: assurance.STATUS_MESSAGE })
          }
          if (controle.INFRACTIONS) {
                    factureDetails.push({ ...controle.INFRACTIONS, STATUS_MESSAGE: controle.STATUS_MESSAGE })
          }
          if (immatriculation.INFRACTIONS) {
                    factureDetails.push({ ...immatriculation.INFRACTIONS, STATUS_MESSAGE: immatriculation.STATUS_MESSAGE })
          }
          if (immatriculation.INFRACTIONS) {
                    factureDetails.push(immatriculation.INFRACTIONS)
          }
          const facture = {
                    payeur: `${immatriculation.NOM_PROPRIETAIRE} ${immatriculation.PRENOM_PROPRIETAIRE}`,
                    factureDetails
          }


          if (declartionVol.INFRACTIONS) {
                    return (
                              <VoleeAlert declartionVol={declartionVol?.INFRACTIONS} STATUS_MESSAGE={declartionVol.STATUS_MESSAGE} />
                    )
          }

          if (!immatriculation.NOM_PROPRIETAIRE) {
                    return (
                              <VoleeAlert INFRACTIONS={immatriculation.INFRACTIONS} STATUS_MESSAGE={immatriculation.STATUS_MESSAGE} />
                    )
          }

          useEffect(() => {
                    // console.log('NUMERO_PLAQUE', NUMERO_PLAQUE)
                    const fetchPosts = async () => {
                              try {
                                        const response = await fetch('http://app.mediabox.bi:1997/historiques/plaques', {
                                                  method: 'POST',
                                                  body: JSON.stringify({
                                                            numeroPlaque: immatriculation.NUMERO_PLAQUE,
                                                  }),
                                                  headers: {
                                                            'Content-Type': 'application/json',
                                                            'authorization': "bearer " + user.TOKEN
                                                  },
                                        })
                                        const posts = await response.json()
                                        setActivites(posts)
                              } catch (error) {
                                        console.log(error)
                                        // setLoadingPosts(false)
                              }
                    }
                    fetchPosts()
          }, [])


          const Activite = ({ activite, index }) => {
                    var imageSource = ''
                    var title = ''
                    var detailUrl
                    const [detail, setDetail] = useState({})
                    const [loadingDetail, setLoadingDetail] = useState(true)

                    switch (activite.ID_HISTORIQUE_CATEGORIE) {
                              case 1:
                                        title = "Contrôle plaque"
                                        imageSource = require('../../../assets/car-plaque1.png')
                                        // detailUrl = `http://app.mediabox.bi:1997/plaques?q=${activite.NUMERO_PLAQUE}`
                                        detailUrl = `http://app.mediabox.bi:1997/plaques?q=${activite.NUMERO_PLAQUE}`
                                        break;
                              case 3:
                                        title = 'Controle techniques'
                                        imageSource = require('../../../assets/mechanic.png')
                                        // detailUrl = `http://app.mediabox.bi:1997/plaques?q=${activite.NUMERO_PLAQUE}`
                                        detailUrl = `http://app.mediabox.bi:1997/plaques?q=${activite.NUMERO_PLAQUE}`
                                        break;
                              default:
                                        imageSource = require('../../../assets/car.png')
                    }
                    const showDate = index == 0 ? true : moment(activites[index - 1].DATE_INSERTION).date() != moment(activite.DATE_INSERTION).date()
                    const ActivityDate = () => {
                              return <Text style={styles.activityDate}>{moment(activite.DATE_INSERTION).calendar()}</Text>
                    }

                    useEffect(() => {
                              (async () => {
                                        try {
                                                  const detailRes = await fetch(detailUrl)
                                                  const detailResponse = await detailRes.json()
                                                  setDetail({
                                                            ...detailResponse[0],
                                                            model: detailResponse[0]?.MARQUE_VOITURE || detailResponse[0]?.CATEGORIES,
                                                            numero: detailResponse[0]?.NUMERO_PLAQUE || detailResponse[0]?.NUMERO_PERMIS,
                                                            proprietaire: detailResponse[0]?.NOM_PROPRIETAIRE || detailResponse[0]?.NOM_PROPRIETAIRE,
                                                  })
                                        } catch (error) {
                                                  console.log(error, detailUrl)
                                        }
                                        setLoadingDetail(false)
                              })()
                    }, [])

                    return (
                              <View key={index.toString()}>
                                        {showDate && <ActivityDate />}
                                        <View style={styles.activity}>
                                                  <View style={styles.activityImage}>
                                                            <Image source={imageSource} style={{ width: '80%', height: '80%' }} />
                                                  </View>
                                                  {loadingDetail ? <View style={{ flex: 1, justifyContent: 'center' }}>
                                                            <ActivityIndicator animating={true} size="small" color={"black"} />
                                                  </View> :
                                                            <View style={styles.activityRightSide}>
                                                                      <Text style={styles.activityTitle} numberOfLines={1} >{title}</Text>
                                                                      {activite.MONTANT ? <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                                                <Text style={{ color: !activite.IS_PAID ? 'red' : 'green'}} numberOfLines={1} >
                                                                                          { activite.MONTANT } Fbu
                                                                                </Text>
                                                                                <View style={{flexDirection: 'row', alignItems: 'center', marginRight: -10}}>
                                                                                          <Text style={{ color: '#777'}}>{ !activite.IS_PAID ? 'Non payé' : 'payé'} </Text>
                                                                                          {!activite.IS_PAID ? <AntDesign name="closecircleo" size={20} color="red" style={{marginLeft: 5}} /> :
                                                                                          <AntDesign name="checkcircleo" size={20} color="green" />}
                                                                                </View>
                                                                      </View> :
                                                                      detail.model && <Text style={styles.carModel} numberOfLines={1} >{detail.model} | {detail.numero}</Text>}
                                                                      <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 10 }}>
                                                                                <Text style={styles.carOwner} numberOfLines={1} >{detail.proprietaire}</Text>
                                                                                <Text style={{ color: '#777', alignSelf: 'flex-end' }}>{moment(activite.DATE_INSERTION).format('H:m')}</Text>
                                                                      </View>
                                                            </View>}
                                        </View>
                              </View>
                    )
          }




          return (
                    <>
                              <View style={{
                                        width: '100%', height: '40%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', borderBottomEndRadius: 15, borderBottomStartRadius: 15
                              }}>
                                        <View style={styles.appImage}>
                                                  <Image
                                                            source={require("../../../assets/icon.png")}
                                                            style={{ width: "90%", height: "90%", marginBottom: 5 }}
                                                  />
                                        </View>
                                        <Text
                                                  style={{
                                                            color: "#fff",
                                                            fontWeight: "bold",
                                                            fontSize: 18,
                                                            marginVertical: 10,
                                                            opacity: 0.8,
                                                  }}
                                        >Police de Securité Routière </Text>

                                        <Text style={{
                                                  color: "#000",
                                                  fontWeight: "bold",
                                                  backgroundColor: "#ddd",
                                                  borderRadius: 20,
                                                  padding: 8,
                                                  paddingHorizontal: 15,
                                        }}>N° {immatriculation.NUMERO_PLAQUE}</Text>
                              </View>


                              <ScrollView style={{ backgroundColor: '#F0F4F5a' }}>
                                        {immatriculation.NOM_PROPRIETAIRE &&
                                                  <>
                                                            <ScrollView style={{ backgroundColor: '#F0F4F5a' }}>
                                                                      <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("#4775CA")}
                                                                                onPress={() => navigation.navigate('ImmatriculationsResult', { immatriculation: immatriculation })}>
                                                                                <View style={styles.principal}>
                                                                                          <Image
                                                                                                    style={{ width: 50, height: 50 }}
                                                                                                    source={require('../../../assets/plaque.png')}
                                                                                          />
                                                                                          <View style={styles.secondaire}>
                                                                                                    <View style={styles.icon}>
                                                                                                              <Text style={{ ...styles.title, color: immatriculation.INFRACTIONS ? 'red' : '#000' }}>OBR</Text>
                                                                                                              {immatriculation.INFRACTIONS ? <Ionicons name="md-warning-outline" size={24} color="red" /> :
                                                                                                                        <AntDesign name="checkcircleo" size={24} color="green" />}
                                                                                                    </View>
                                                                                                    <Text style={{ ...styles.statusTitle, color: immatriculation.INFRACTIONS ? 'red' : 'green' }}>{immatriculation.STATUS_MESSAGE}</Text>
                                                                                                    {immatriculation.INFRACTIONS && <View style={styles.principalfooter}>
                                                                                                              <Text style={styles.amande}>Saisie de la voiture</Text>
                                                                                                              <TouchableOpacity>
                                                                                                                        <Text style={styles.bouton}>Payer</Text>
                                                                                                              </TouchableOpacity>
                                                                                                    </View>}
                                                                                          </View>
                                                                                </View>
                                                                      </TouchableNativeFeedback>

                                                                      {immatriculation.NOM_PROPRIETAIRE &&
                                                                                <>
                                                                                          <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("#4775CA")}
                                                                                                    onPress={() => navigation.navigate('AssurancesResult', { assurance: assurance })}>
                                                                                                    <View style={styles.principal}>
                                                                                                              <Image
                                                                                                                        style={{ width: 50, height: 50 }}
                                                                                                                        source={require('../../../assets/assurant.png')}
                                                                                                              />
                                                                                                              <View style={styles.secondaire}>
                                                                                                                        <View style={styles.icon}>
                                                                                                                                  <Text style={{ ...styles.title, color: assurance.INFRACTIONS ? 'red' : '#000' }}>Assurances</Text>
                                                                                                                                  {assurance.INFRACTIONS ? <Ionicons name="md-warning-outline" size={24} color="red" /> :
                                                                                                                                            <AntDesign name="checkcircleo" size={24} color="green" />}
                                                                                                                        </View>
                                                                                                                        <Text style={{ ...styles.statusTitle, color: assurance.INFRACTIONS ? "red" : "green" }}>{assurance.STATUS_MESSAGE}</Text>
                                                                                                                        {assurance.INFRACTIONS && <View style={styles.principalfooter}>
                                                                                                                                  <Text style={styles.amande}>{assurance.INFRACTIONS.MONTANT} Fbu</Text>
                                                                                                                                  {/* <TouchableOpacity>
                                            <Text style={styles.bouton}>Payer</Text>
                                        </TouchableOpacity> */}
                                                                                                                        </View>}
                                                                                                              </View>
                                                                                                    </View>
                                                                                          </TouchableNativeFeedback>

                                                                                          <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("#4775CA")}
                                                                                                    onPress={() => navigation.navigate('ControleResult', { controle: controle })}>
                                                                                                    <View style={styles.principal}>
                                                                                                              <Image
                                                                                                                        style={{ width: 50, height: 50 }}
                                                                                                                        source={require('../../../assets/controle.png')}
                                                                                                              />
                                                                                                              <View style={styles.secondaire}>
                                                                                                                        <View style={styles.icon}>
                                                                                                                                  <Text style={{ ...styles.title, color: controle.INFRACTIONS ? 'red' : '#000' }}>Contrôle Technique</Text>
                                                                                                                                  {controle.INFRACTIONS ? <Ionicons name="md-warning-outline" size={24} color="red" /> :
                                                                                                                                            <AntDesign name="checkcircleo" size={24} color="green" />}
                                                                                                                        </View>
                                                                                                                        <View style={styles.icon}>
                                                                                                                                  <Text style={{ ...styles.statusTitle, color: controle.INFRACTIONS ? 'red' : 'green' }}>{controle.STATUS_MESSAGE}</Text>
                                                                                                                        </View>
                                                                                                                        {controle.INFRACTIONS && <View style={styles.principalfooter}>
                                                                                                                                  <Text style={styles.amande}>{controle.INFRACTIONS.MONTANT} Fbu</Text>
                                                                                                                                  {/* <TouchableOpacity>
                                            <Text style={styles.bouton}>Payer</Text>
                                        </TouchableOpacity> */}
                                                                                                                        </View>}
                                                                                                              </View>
                                                                                                    </View>
                                                                                          </TouchableNativeFeedback>

                                                                                          {declartionVol.INFRACTIONS ? <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("#4775CA")}
                                                                                                    onPress={() => navigation.navigate('PjResultatScreen', { declartionVol: declartionVol })}>
                                                                                                    <View style={styles.principal}>
                                                                                                              <Image
                                                                                                                        style={{ width: 50, height: 50 }}
                                                                                                                        source={require('../../../assets/PNC.png')}
                                                                                                              />
                                                                                                              <View style={styles.secondaire}>
                                                                                                                        <View style={styles.icon}>
                                                                                                                                  <Text style={{ ...styles.title, color: declartionVol.INFRACTIONS ? 'red' : '#000' }}>Police Judiciaire</Text>
                                                                                                                                  {declartionVol.INFRACTIONS ? <Ionicons name="md-warning-outline" size={24} color="red" /> :
                                                                                                                                            <AntDesign name="checkcircleo" size={24} color="green" />}
                                                                                                                        </View>
                                                                                                                        <View>
                                                                                                                                  <Text style={{ ...styles.statusTitle, color: declartionVol.INFRACTIONS ? 'red' : 'green' }}>{declartionVol.STATUS_MESSAGE}</Text>
                                                                                                                        </View>
                                                                                                                        {declartionVol.INFRACTIONS && <View style={styles.principalfooter}>
                                                                                                                                  <Text style={styles.amande}>{declartionVol.INFRACTIONS.AMENDES}</Text>
                                                                                                                                  {/* <TouchableOpacity>
                                <Text style={styles.bouton}>Payer</Text>
                          </TouchableOpacity> */}
                                                                                                                        </View>}
                                                                                                              </View>
                                                                                                    </View>
                                                                                          </TouchableNativeFeedback> :

                                                                                                    <View style={styles.principal}>
                                                                                                              <Image
                                                                                                                        style={{ width: 50, height: 50 }}
                                                                                                                        source={require('../../../assets/PNC.png')}
                                                                                                              />
                                                                                                              <View style={styles.secondaire}>
                                                                                                                        <View style={styles.icon}>
                                                                                                                                  <Text style={{ ...styles.title, color: declartionVol.INFRACTIONS ? 'red' : '#000' }}>Police Judiciaire</Text>
                                                                                                                                  {declartionVol.INFRACTIONS ? <Ionicons name="md-warning-outline" size={24} color="red" /> :
                                                                                                                                            <AntDesign name="checkcircleo" size={24} color="green" />}
                                                                                                                        </View>
                                                                                                                        <View>
                                                                                                                                  <Text style={{ ...styles.statusTitle, color: declartionVol.INFRACTIONS ? 'red' : 'green' }}>{declartionVol.STATUS_MESSAGE}</Text>
                                                                                                                        </View>
                                                                                                                        {declartionVol.INFRACTIONS && <View style={styles.principalfooter}>
                                                                                                                                  <Text style={styles.amande}>{declartionVol.INFRACTIONS.AMENDES}</Text>
                                                                                                                                  {/* <TouchableOpacity>
                                             <Text style={styles.bouton}>Payer</Text>
                                        </TouchableOpacity> */}
                                                                                                                        </View>}
                                                                                                              </View>
                                                                                                    </View>
                                                                                          }


                                                                                          <View style={styles.bouton}>
                                                                                                    <Button width={"50%"} size="lg" background={"#000"} borderRadius={20}
                                                                                                              onPress={() => navigation.goBack()}
                                                                                                              marginTop={10}
                                                                                                              leftIcon={<Icon as={Ionicons} name="arrow-back-outline" size={'sm'} color="#fff" />}>
                                                                                                              Retourner
                                                                                                    </Button>

                                                                                                    <Button width={"40%"} size="lg" background={"#000"} borderRadius={20}
                                                                                                              onPress={() => navigation.navigate('FactureScreen', { facture, ID_HISTORIQUE: item.ID_HISTORIQUE })}
                                                                                                              marginTop={10}>
                                                                                                              Payer
                                                                                                    </Button>
                                                                                          </View>

                                                                                          <View
                                                                                                    ref={activitiesTransitionRef}
                                                                                                    transition={transition}
                                                                                                    style={{ paddingHorizontal: 10 }}>
                                                                                                    <View onPress={() => {
                                                                                                              activitiesTransitionRef.current.animateNextTransition()
                                                                                                              setShowActivities(t => !t)
                                                                                                              setShowProfil(false)
                                                                                                    }}>
                                                                                                              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                                                                        <Text style={styles.profileTitle}>Historiques</Text>
                                                                                                                        {/* <FontAwesome5 name="angle-down" size={24} color="#777" /> */}
                                                                                                              </View>
                                                                                                    </View>
                                                                                                    {/* <Text>{JSON.stringify(activites)}</Text> */}
                                                                                                    {<View style={styles.activities}>
                                                                                                              {activites.map((activity, index) => {
                                                                                                                        return <Activite activite={activity} index={index} key={index} />
                                                                                                              })}
                                                                                                    </View>}
                                                                                          </View>
                                                                                </>}

                                                            </ScrollView>
                                                  </>
                                        }
                              </ScrollView>
                    </>
          )
}


const styles = StyleSheet.create({

          principal: {
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    margin: 10,
                    borderRadius: 10,
                    elevation: 5
          },
          principal1: {
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    margin: 10,
                    elevation: 5
          },
          profileTitle: {
                    fontSize: 25,
                    fontWeight: 'bold',
                    paddingVertical: 10
          },
          resultItem: {
                    paddingVertical: 10,
                    paddingHorizontal: 10
                    /* borderBottomColor: '#ddd',
                    borderBottomWidth: 1 */
          },
          itemLeft: {
                    flexDirection: 'row',
                    alignItems: 'center'
          },
          itemValue: {
                    color: '#777',
                    fontSize: 16
          },
          secondaire: {
                    marginLeft: 10,
                    flex: 1
          },
          title: {
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "#333",
                    opacity: 0.8
          },

          principalfooter: {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 5
          },
          statusTitle: {
                    fontSize: 14,
                    color: "red"
          },
          amande: {
                    fontWeight: "bold",
                    fontSize: 17,
                    color: "#000"
          },
          // bouton: {
          //     backgroundColor: "#ddd",
          //     paddingVertical: 5,
          //     paddingHorizontal: 15,
          //     borderRadius: 8,
          //     fontWeight: "bold",
          //     opacity: 0.8
          // },
          icon: {
                    flexDirection: "row",
                    justifyContent: "space-between"
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
          },
          amandes: {
                    marginTop: 15,
          },
          infra: {
                    // borderBottomColor: "#ddd",
                    // borderBottomWidth: 2,
                    alignContent: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    fontWeight: "bold"
          },
          bouton: {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: 10,
                    marginBottom: 10
          },
          activity: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 10
          },
          activityImage: {
                    width: 100,
                    height: 100,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#E8F5FE',
                    borderRadius: 15
          },
          activityRightSide: {
                    marginLeft: 20,
                    flex: 1
          },
          activityTitle: {
                    fontSize: 18,
                    fontWeight: 'bold',
                    letterSpacing: 0.5,
                    marginBottom: 2,
                    width: '90%'
          },
          carModel: {
                    color: '#777',
                    width: '90%'
          },
          carOwner: {
                    color: '#777',
                    width: '90%'
          },

          appImage: {
                    width: 100,
                    height: 100,
                    borderRadius: 100,
                    borderWidth: 2,
                    borderColor: "#fff",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 20,
          },

})
