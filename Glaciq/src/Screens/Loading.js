import { StyleSheet, Text, View, ActivityIndicator, Image } from 'react-native'
import React, { useEffect } from 'react'



const Loading = ({ navigation }) => {

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         navigation.navigate('RootNavigator')
    //     }, 2000)

    //     return () => clearTimeout(timer)
    // }, [])

    return (

        <View style={styles.container}>


            <Image source={require('../../assets/images/loadingimage.png')} style={styles.image} />

            <View style={{ alignItems: 'center', marginBottom: 80 }}>
                <Text style={{ color: 'white', fontSize: 35, fontWeight: 600, color: '#fbc22e', fontStyle: 'italic' }}>FAST</Text>
                <Text style={{ color: 'white', fontSize: 35, fontWeight: 600, fontStyle: 'italic' }}>DELIVERY</Text>
            </View>

            <View style={{
                alignItems: 'center',
                marginBottom: 50
            }}>
                <ActivityIndicator size="large" color="#fbc22e" style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }} />
            </View>

            <View style={{ alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 45, fontWeight: 900, color: '#ffffff', fontStyle: 'italic' }}>GLACIQ</Text>
            </View>


        </View>

    )
}

export default Loading

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: '#2f3844',
    },

    image: {
        height: 200,
        width: 250,
        marginTop: 170,
    },
})