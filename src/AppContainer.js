import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setUserAction } from "./store/actions/userActions";
import { userSelector } from "./store/selectors/userSelector";
import RootNavigator from "./routes/RootNavigator";
import HomeNavigator from "./routes/HomeNavigator";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import { Host } from "react-native-portalize";
import RegistreScreen from "./screens/RegistreScreen";

const Stack = createStackNavigator();

export default function AppContainer() {
          const [userLoading, setUserLoading] = useState(true);
          const dispatch = useDispatch();
          useEffect(() => {
                    (async function () {
                              const user = await AsyncStorage.getItem("user");
                              // await AsyncStorage.removeItem('user')
                              dispatch(setUserAction(JSON.parse(user)));
                              setUserLoading(false);
                    })();
          }, [dispatch]);
          const user = useSelector(userSelector);
          return userLoading ? (
                    <View
                              style={{
                                        flex: 1,
                                        alignContent: "center",
                                        alignItems: "center",
                                        justifyContent: "center",
                              }}
                    >
                              <ActivityIndicator color="#007BFF" animating={userLoading} size="large" />
                    </View>
          ) : (
                    <>
                              <NavigationContainer>
                                        {user ? (
                                                  <Host>
                                                            <RootNavigator />
                                                  </Host>
                                        ) : (
                                                  // <HomeNavigator />
                                                  <>
                                                            <Stack.Navigator screenOptions={{
                                                                      cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid
                                                            }}>
                                                                      <Stack.Screen
                                                                                name="Login"
                                                                                component={LoginScreen}
                                                                                options={{ headerShown: false }}
                                                                      />
                                                                      <Stack.Screen
                                                                                name="RegistreScreen"
                                                                                component={RegistreScreen}
                                                                                options={{ headerShown: false }}
                                                                      />
                                                            </Stack.Navigator>
                                                  </>
                                        )}
                              </NavigationContainer>
                    </>
          );
}