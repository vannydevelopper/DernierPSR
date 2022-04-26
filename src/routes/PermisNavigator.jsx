import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import React from "react";
import AutrePermisControle from "../screens/AutrePermisControle";
import PermisResultScreen from "../screens/PermisResultScreen";
import PermisScanScreen from "../screens/PermisScanScreen";
import PermisScreen from "../screens/PermisScreen";

const Stack = createStackNavigator()
export default function PermisNavigator() {
    return (
        <Stack.Navigator screenOptions={{
            headerStyle: { backgroundColor: '#F3F7F7', elevation: 0 },
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}>
            <Stack.Screen name="Permis" component={PermisScreen} options={{ headerTitleAlign: 'center', title: 'Permis de conduire' }} />
            <Stack.Screen name="PermisResult" component={PermisResultScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PermisScan" component={PermisScanScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PermisControle" component={AutrePermisControle} options={{ headerShown: false }} />
            {/* <Stack.Screen name="PermisControle" component={AutrePermisControle} options={{ headerShown: false }} /> */}
        </Stack.Navigator>
    )
}