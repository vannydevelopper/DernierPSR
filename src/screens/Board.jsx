import { useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import { useState, useEffect } from 'react'
import { View, BackHandler } from 'react-native'



import Dash from '../components/vehicule/Dash'

const Board = () => {
    const navigation = useNavigation()
    const route = useRoute();
    const { plaques } = route.params;
    // const data = JSON.stringify(plaques);
    // const h = JSON.stringify(data);
    //const d = JSON.parse(data);

    // console.log(plaques);

    return (

        <Dash item={plaques} />

    )
}
export default Board;