import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, TouchableNativeFeedback, ActivityIndicator } from 'react-native'
import { Portal } from 'react-native-portalize';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { userSelector } from '../store/selectors/userSelector';
import { useDispatch, useSelector } from 'react-redux'
import { useToast } from 'native-base'


export default function PermisScanScreen() {
          const [hasPermission, setHasPermission] = useState(null);
          const [scanned, setScanned] = useState(false);
          const [loading, setLoading] = useState(false)
          const user = useSelector(userSelector);
          const [location, setLocation] = useState("null")
          const navigation = useNavigation()
          const toast = useToast()

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


          const askCameraPermission = async () => {
                    const { status } = await BarCodeScanner.requestPermissionsAsync();
                    setHasPermission(status === "granted");
          }
          useEffect(() => {
                    askCameraPermission()
          }, []);


          const handleBarCodeScanned = async ({ type, data }) => {

                    setScanned(true);


                    setScanned(true);
                    clearTimeout(timer) // j'ai mis un timer pour que ça ne vibre pas tout le temps

                    // changer ces condintions en se basant sur les donnees que vous recevez lorsque vous scanner un permis
                    // ici j'un mis un exmple pour autorise seulement un QR code avec les donnes correspondant à celles que j'attendait sinon je ne fais rien
                    // Haptics c'est pour faire vibrer le telephone

                    if (type == 256) {
                              var filtre;
                              for (var i = 0; i < data.length; i++) {
                                        filtre = data.split(';');
                              }
                              var numroPermit = filtre[1].split("=")[1]
                              // var numroPermit = "5345874"
                              setLoading(true)
                              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

                              var url = "http://app.mediabox.bi:1997/permis/check_permis/";
                              setLoading(true);

                              try {
                                        const response = await fetch(url, {
                                                  method: "POST",
                                                  headers: {
                                                            'Content-Type': 'application/json',
                                                            'authorization': "bearer " + user.TOKEN
                                                  },
                                                  body: JSON.stringify({
                                                            numeroPermis: numroPermit,
                                                            lat: location.latitude,
                                                            long: location.longitude
                                                  })
                                        });
                                        const responseJson = await response.json();
                                        navigation.goBack()
                                        navigation.navigate("PermisResult", { permis: responseJson })
                              } catch (e) {
                                        console.log(e);
                              }
                              setLoading(false);
                    } else {
                              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
                              var timer = setTimeout(() => {
                                        setScanned(false)
                              }, 2000)
                    }
          };

          /* if (hasPermission === null) {
                    return <Text>Requesting for camera permission</Text>;
          } */
          if (hasPermission === false) {
                    return <View style={{ alignContent: 'center', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                              <Text>Pas d'accès à la caméra</Text>
                              <TouchableNativeFeedback
                                        background={TouchableNativeFeedback.Ripple('#fff')}
                                        useForeground={true}
                                        onPress={() => askCameraPermission()}
                              >
                                        <View style={{ backgroundColor: '#ddd', borderRadius: 10, padding: 10, marginTop: 50 }}>
                                                  <Text>Autoriser l'accès</Text>
                                        </View>
                              </TouchableNativeFeedback>
                    </View>
          }

          return (
                    <Portal>
                              <View style={styles.container}>
                                        <BarCodeScanner
                                                  onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                                                  style={StyleSheet.absoluteFillObject}
                                                  barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                                        />
                                        <View style={styles.mask}>
                                                  <Text style={styles.scanTitle}>
                                                            Scanner un permis de conduire
                                                  </Text>
                                                  <View style={styles.maskScan} />
                                                  <View style={styles.scanActions}>
                                                            {/* {location && <Text style={{color: 'red'}}>{ calcCrow(qrCodeCoords.lat, qrCodeCoords.long, location.coords.latitude, location.coords.longitude) }</Text>} */}
                                                            <TouchableNativeFeedback
                                                                      background={TouchableNativeFeedback.Ripple('#ddd')}
                                                                      useForeground={true}
                                                                      onPress={() => navigation.goBack()}
                                                            >
                                                                      <View style={styles.actionBtn}>
                                                                                <Ionicons name="close" size={40} color="#fff" />
                                                                      </View>
                                                            </TouchableNativeFeedback>
                                                  </View>
                                        </View>
                                        {loading && <View style={{ flex: 1, height: '100%', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.8)', justifyContent: 'center', alignItems: 'center', position: 'absolute' }}>
                                                  <View style={{ width: 100, height: 100, backgroundColor: '#fff', borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                                                            <ActivityIndicator animating={true} color={'#000'} size='large' />
                                                  </View>
                                        </View>}
                              </View>
                    </Portal>
          );
}
const styles = StyleSheet.create({
          container: {
                    flex: 1,
                    paddingVertical: 30,
                    borderStartColor: '#fff'
          },
          mask: {
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'space-around'
          },
          scanTitle: {
                    color: '#fff',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    fontSize: 16,
                    padding: 15,
                    borderRadius: 10
          },
          scanActions: {
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignContent: 'center',
                    alignItems: 'center',
                    width: '100%'
          },
          maskScan: {
                    width: '70%',
                    height: 250,
                    borderColor: '#fff',
                    borderRadius: 20,
                    borderWidth: 2,
                    backgroundColor: 'transparent'
          },
          actionBtn: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: 10,
                    borderRadius: 100,
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden'
          }
})