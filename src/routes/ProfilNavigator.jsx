import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import React from "react";
import AlertProfilScreen from "../screens/Alert/AlertProfilDetail";
import ProfilScreen from "../screens/ProfilScreen";

const Stack = createStackNavigator()
export default function ProfilNavigator() {
    return (
        <Stack.Navigator screenOptions={{
            headerStyle: { backgroundColor: '#F3F7F7', elevation: 0 },
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerShown: false
        }}>
            <Stack.Screen name="Profil" component={ProfilScreen}/>
            <Stack.Screen name="AlertDetail" component={AlertProfilScreen}/>
        </Stack.Navigator>
    )
}