import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons';

const ComingSoon = ({ navigation }) => {


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fefefe' }}>
            <Image source={require('../../../assets/images/coming_soon.png')} style={{ width: 300, height: 300, left: 10 }} />

            <TouchableOpacity onPress={() => navigation.replace('Login')} style={{ marginTop: 20, alignItems: 'center', flexDirection: 'row' }}>
                <MaterialIcons name="arrow-back" size={24} color="black" />
                <Text> Go Back</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ComingSoon

const styles = StyleSheet.create({})