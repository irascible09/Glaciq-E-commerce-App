import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import Footer_section from './Footer_section'

const Intro3 = ({ navigation, introscreen, setintroscreen }) => {


  return (
    <View style={styles.container}>

      <Image source={require('../../../assets/images/intro3photo.png')} style={styles.photo} />

      <View style={{ alignItems: 'center', marginTop: 40 }}>
        <Text style={{ fontSize: 27, fontWeight: 600, marginBottom: 20, }}>So You Can Enjoy</Text>
        {/* <Text style={{ fontSize: 27, fontWeight: 600 }}> Delivered.</Text> */}
      </View>

      <View style={{ flexDirection: 'row', marginTop: 80 }}>
        <View style={styles.circles}></View>
        <View style={styles.circles}></View>
        <View style={[styles.circles, { backgroundColor: '#fbc22e' }]}></View>
      </View>

      <View style={{ marginBottom: 70, justifyContent: 'center' }}>
        <Footer_section introscreen={introscreen} setintroscreen={setintroscreen} navigation={navigation} />
      </View>
    </View>
  )
}

export default Intro3

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },

  photo: {
    height: 350,
    width: 350,
    marginVertical: 70,

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