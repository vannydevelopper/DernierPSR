import { createStackNavigator, TransitionPresets, CardStyleInterpolators } from "@react-navigation/stack"
import React from "react"
import AssuranceResultScreen from "../screens/AssuranceResultScreen"
import AutrePermisControle from "../screens/AutrePermisControle"
import Board from "../screens/Board"
import ControleResultScreen from "../screens/ControleResultScreen"
import ControleScreen from "../screens/ControleScreen"
import FactureScreen from "../screens/FactureScreen"
import HomeScreen from "../screens/HomeScreen"
import ImmatriculationsResultScreen from "../screens/ImmatriculationsResultScreen"
import LoginScreen from "../screens/LoginScreen"
import PermisResultScreen from "../screens/PermisResultScreen"
import PjResultatScreen from "../screens/PjResultatScreen"
import PlaquesFormScreen from "../screens/PlaquesFormScreen"
import PlaquesResultScreen from "../screens/PlaquesResultScreen"
import RecherchePlaqueScreen from "../screens/RecherchePlaqueScreen"
import RegistreScreen from "../screens/RegistreScreen"

const Stack = createStackNavigator()
export default function HomeNavigator() {
    return (
        <Stack.Navigator screenOptions={{
            headerStyle: { backgroundColor: '#F3F7F7', elevation: 0 },
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false, headerMode: "float" }} />
            <Stack.Screen name="PlaquesForm" component={PlaquesFormScreen} options={{ title: 'Plaques', }} />
            <Stack.Screen name="Board" component={Board} options={{ headerShown: false }} />
            <Stack.Screen name="PlaquesResult" component={PlaquesResultScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AssurancesResult" component={AssuranceResultScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ImmatriculationsResult" component={ImmatriculationsResultScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PjResultatScreen" component={PjResultatScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ControleResult" component={ControleResultScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Recherche" component={RecherchePlaqueScreen} options={{ title: "Controle" }} />
            <Stack.Screen name="Controle" component={ControleScreen} />
            <Stack.Screen name="PermisResultScreen" component={PermisResultScreen} />
            <Stack.Screen name="FactureScreen" component={FactureScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}