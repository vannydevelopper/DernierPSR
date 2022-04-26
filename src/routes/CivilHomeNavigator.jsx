import { createStackNavigator, TransitionPresets, CardStyleInterpolators } from "@react-navigation/stack"
import React from "react"
import AlertCameraScreen from "../screens/Alert/AlertCameraScreen"
import AlertPlaqueFormScreen from "../screens/Alert/AlertPlaqueFormScreen"
import AlertPlaqueQuestions from "../screens/Alert/AlertPlaqueQuestions"
import AlertPlaqueTypeScreen from "../screens/Alert/AlertPlaqueTypeScreen"
import AlertTypeScreen from "../screens/Alert/AlertTypeScreen"
import Board from "../screens/Board"
import CivilHomeScreen from "../screens/CivilHomeScreen"
import PlaquesFormScreen from "../screens/PlaquesFormScreen"

const Stack = createStackNavigator()
export default function CivilHomeNavigator() {
    return (
        <Stack.Navigator screenOptions={{
            headerStyle: { backgroundColor: '#F3F7F7', elevation: 0 },
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}>
            <Stack.Screen name="Home" component={CivilHomeScreen} options={{ headerShown: false, headerMode: "float" }} />
            <Stack.Screen name="AlertType" component={AlertTypeScreen} options={{ headerShown: false, headerMode: "float" }} />
            <Stack.Screen name="AlertPlaqueForm" component={AlertPlaqueFormScreen} options={{ headerShown: false, headerMode: "float" }} />
            <Stack.Screen name="AlertPlaqueType" component={AlertPlaqueTypeScreen} options={{ headerShown: false, headerMode: "float" }} />
            <Stack.Screen name="AlertPlaqueQuestion" component={AlertPlaqueQuestions} options={{ headerShown: false, headerMode: "float" }} />
            <Stack.Screen name="AlertCamera" component={AlertCameraScreen}
                options={{
                    headerShown: false,
                    headerMode: "float",
                    cardStyleInterpolator: CardStyleInterpolators.forBottomSheetAndroid
                }} />
        </Stack.Navigator>
    )
}