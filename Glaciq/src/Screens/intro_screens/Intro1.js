import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useState } from 'react'
import Footer_section from './Footer_section'

const Intro1 = ({ introscreen, setintroscreen, navigation }) => {


  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/images/intro1photo.png')} style={styles.photo} />

      <Text style={styles.heading}>Hydration Made Simple</Text>

      <View style={{ flexDirection: 'row', marginTop: 80 }}>
        <View style={[styles.circles, { backgroundColor: '#fbc22e' }]}></View>
        <View style={styles.circles}></View>
        <View style={styles.circles}></View>
      </View>

      <View>
        <Footer_section introscreen={introscreen} setintroscreen={setintroscreen} navigation={navigation} />

      </View>
    </View>
  )
}

export default Intro1

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  photo: {
    height: 350,
    width: 250,
    marginVertical: 70
  },

  heading: {
    fontSize: 27,
    fontWeight: 600,
  },

  circles: {
    height: 10,
    width: 10,
    borderRadius: 5,
    borderWidth: 1,
    margin: 5,
    shadowColor: 'black'
  },
})