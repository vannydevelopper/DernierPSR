import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import BottomTabBar from '../components/app/BottomTabBar';
import HomeNavigator from './HomeNavigator';
import { Host } from 'react-native-portalize';
import PermisNavigator from './PermisNavigator';
import ProfilScreen from '../screens/ProfilScreen';
import { useSelector } from 'react-redux';
import { userSelector } from '../store/selectors/userSelector';
import CivilHomeNavigator from './CivilHomeNavigator';
import ProfilNavigator from './ProfilNavigator';

export default function RootNavigator() {

    const BottomTab = createBottomTabNavigator()
    const user = useSelector(userSelector)
    return (
          <View style={styles.container}>
                    <BottomTab.Navigator initialRouteName="Home" tabBar={props => <BottomTabBar {...props} />} screenOptions={{ headerShown: false }}>
                              <BottomTab.Screen name="HomeTab" component={user.PSR_ELEMENT_ID ? HomeNavigator : CivilHomeNavigator} />
                              <BottomTab.Screen name="PermisTab" component={PermisNavigator} />
                              <BottomTab.Screen name="ProfilTab" component={ProfilNavigator} />
                    </BottomTab.Navigator>
          </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})
