import { Button } from 'native-base'
import { useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { userSelector } from '../../store/selectors/userSelector'

export default function Facture({ openPay, item, facture }) {

          const route = useRoute();
          const user = useSelector(userSelector)
          var total = 0
          facture.factureDetails.forEach(detail => {
                    total += parseInt(detail.MONTANT, 10)
          })
          return (
                    <View style={styles.container}>
                              <View style={styles.facture}>
                                        <View style={styles.header}>
                                                  <Image source={require('../../../assets/favicon.png')} style={{ width: 80, height: 80 }} />
                                                  <Text style={styles.title}>FACTURE</Text>
                                        </View>
                                        <View style={styles.factureDetail}>
                                                  <View style={styles.factureDetailItem}>
                                                            <Text style={styles.factureDetailItemTitle}>Date:</Text>
                                                            <Text style={styles.factureDetailItemTitle}>{moment().format("DD/MM/Y")}</Text>
                                                  </View>
                                                  <View style={styles.factureDetailItem}>
                                                            <Text style={styles.factureDetailItemTitle}>Accusé</Text>
                                                            <Text style={styles.factureDetailItemTitle}>{facture.payeur && facture.payeur != 'undefined' ? facture.payeur : 'N/A'}</Text>
                                                  </View>
                                                  <View style={styles.factureDetailItem}>
                                                            <Text style={styles.factureDetailItemTitle}>Policier</Text>
                                                            <Text style={styles.factureDetailItemTitle}>{user.NOM} {user.PRENOM}</Text>
                                                  </View>
                                        </View>
                                        <View style={styles.factureDesc}>
                                                  {facture.factureDetails.map((detail, index) => {
                                                            return (
                                                                      <View style={styles.factureDetailItem} key={index}>
                                                                                <Text style={{ ...styles.factureDetailItemTitle, width: '50%' }} numberOfLines={1}>{detail.STATUS_MESSAGE}</Text>
                                                                                <Text style={styles.factureDetailItemTitle}>{detail.MONTANT} Fbu</Text>
                                                                      </View>
                                                            )
                                                  })}
                                        </View>
                                        <View style={styles.factureFooter}>
                                                  <View style={styles.factureFooterSide}>
                                                            <View style={styles.factureFooterRigtSide}>
                                                                      <Text style={styles.factureDetailItemTitle}>VAT </Text>
                                                                      <Text style={{ ...styles.factureDetailItemTitle, marginLeft: 20 }}>5.5%</Text>
                                                            </View>
                                                            <Text style={styles.factureDetailItemTitle}>1 200Fbu</Text>
                                                  </View>
                                                  <View style={{ ...styles.factureFooterSide, marginTop: 20 }}>
                                                            <View style={styles.factureFooterRigtSide}>
                                                                      <Text style={styles.factureDetailItemTitle}>TOTAL </Text>
                                                                      <Text style={{ ...styles.factureDetailItemTitle, marginLeft: 20 }}>TTC</Text>
                                                            </View>
                                                            <Text style={styles.factureDetailItemTitle}>11 000Fbu</Text>
                                                  </View>
                                        </View>
                                        <Text style={styles.totalTitle}>TOTAL HT {total}Fbu</Text>
                              </View>
                              <View style={styles.actions}>
                                        <Button background={"#000"} borderRadius={10} size="lg" onPress={openPay}>Payer</Button>
                              </View>
                    </View>
          )
}

const styles = StyleSheet.create({
          container: {
                    flex: 1,
                    backgroundColor: '#F3F7F7'
          },
          facture: {
                    backgroundColor: '#fff',
                    marginHorizontal: 20,
                    marginTop: 10,
                    elevation: 10,
                    shadowColor: '#c4c4c4',
                    borderRadius: 10,
                    paddingVertical: 20,
                    paddingHorizontal: 20
          },
          header: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 1,
                    borderBottomColor: '#ddd',
                    borderBottomWidth: 2,
                    borderStyle: 'dashed',
                    paddingBottom: 20,
          },
          title: {
                    color: '#66657B',
                    marginTop: 10,
                    fontWeight: 'bold'
          },
          factureDetail: {
                    marginTop: 20,
                    paddingBottom: 20,
                    borderBottomColor: '#ddd',
                    borderBottomWidth: 2,
          },
          factureDetailItem: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 20
          },
          factureDetailItemTitle: {
                    color: '#777',
                    fontWeight: 'bold',
                    fontSize: 16,
          },
          factureDesc: {
          },
          factureFooter: {
                    marginTop: 30,
                    paddingBottom: 20,
                    borderBottomColor: '#ddd',
                    borderBottomWidth: 2,
          },
          factureFooterSide: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
          },
          factureFooterRigtSide: {
                    flexDirection: 'row',
                    alignItems: 'center',
          },
          totalTitle: {
                    marginVertical: 10,
                    fontWeight: 'bold',
                    textAlign: 'right',
                    fontSize: 18,
                    opacity: 0.8
          },
          actions: {
                    marginVertical: 20,
                    paddingHorizontal: 20
          }
})