import { Alert, KeyboardAvoidingView, ScrollView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, InteractionManager } from 'react-native'
import React, { useState } from 'react'
import Checkbox from "expo-checkbox";
import api from '../../utils/api';



const Register = ({ navigation }) => {

    const [Checked, setChecked] = useState(false)
    const [name, setname] = useState('')
    const [phone, setphone] = useState('')
    const [email, setemail] = useState('')
    const [address, setaddress] = useState('')
    const [password, setpassword] = useState('')
    const [repassword, setrepassword] = useState('')
    const [businessName, setbusinessName] = useState('')

    const handlecheckbox = () => {
        if (Checked == false) {
            setChecked(true)
        } else {
            setChecked(false)
        }
    }

    const handleRegister = async () => {

        try {
            if (Checked != true || password.length < 8 || password != repassword || !name || !email || !phone || !address) {
                console.log("data missing or invalid")
                Alert.alert('Error', 'Data missing or invalid');
                return;
            }

            console.log("registered : ", { name, phone, email, address, password, businessName })
            const { data } = await api.post('/auth/register', { name, phone, email, address, password, businessName })
            alert(data.message)
            navigation.navigate('Login')

        } catch (error) {

            console.log(error)

        }

    }

    return (

        <KeyboardAvoidingView style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >

            <ScrollView>
                <View style={styles.container}>

                    {/* heading */}
                    <Text style={styles.heading}>Create your GLACIQ Account!</Text>

                    {/* subheading */}

                    <Text style={{ textAlign: 'center', width: 325, fontSize: 16, color: '#57575aff' }}>Join thousands of health-conscious customers enjoying premium hydration

                    </Text>



                    <View style={styles.content}>

                        {/* inputs */}
                        <View style={{ gap: 1 }}>
                            {/* name */}
                            <View>
                                <TextInput
                                    placeholder='enter your name'
                                    style={styles.input}
                                    placeholderTextColor={'#646369'}
                                    value={name}
                                    onChangeText={setname}
                                />
                            </View>

                            {/* phone number */}
                            <View>
                                <TextInput
                                    placeholder='+91 | 10-digit number'
                                    style={styles.input}
                                    placeholderTextColor={'#646369'}
                                    value={phone}
                                    onChangeText={setphone}
                                />
                                <Text style={styles.inputdescription}>Valid Indian mobile number required</Text>
                            </View>

                            {/* email */}
                            <View>
                                <TextInput
                                    placeholder='youremail@email.com'
                                    style={styles.input}
                                    placeholderTextColor={'#646369'}
                                    value={email}
                                    onChangeText={setemail}
                                />
                                <Text style={styles.inputdescription}>We'll use for order updated and reciepts</Text>
                            </View>

                            {/* address */}
                            <View>
                                <TextInput
                                    placeholder='House number, street, area, landmark'
                                    style={styles.input}
                                    placeholderTextColor={'#646369'}
                                    value={address}
                                    onChangeText={setaddress}
                                />
                                <Text style={styles.inputdescription}>Ensure delivery is available in your area</Text>
                            </View>

                            {/* password */}
                            <View>
                                <TextInput
                                    placeholder='create password'
                                    style={styles.input}
                                    placeholderTextColor={'#646369'}
                                    value={password}
                                    onChangeText={setpassword} />
                                <Text style={styles.inputdescription}>Use a mix of letters, numbers & symbols, min 8 characters</Text>
                            </View>

                            {/* business name */}
                            <View>
                                <TextInput
                                    placeholder='enter business name (optional)'
                                    style={styles.input}
                                    placeholderTextColor={'#646369'}
                                    value={businessName}
                                    onChangeText={setbusinessName}
                                />
                                <Text style={styles.inputdescription}>Add your business name if applicable</Text>
                            </View>

                            {/* confirm password */}
                            <View>
                                <TextInput
                                    placeholder='re-enter password'
                                    style={styles.input}
                                    placeholderTextColor={'#646369'}
                                    value={repassword}
                                    onChangeText={setrepassword} />
                                <Text style={styles.inputdescription}>Both passwords must match</Text>
                            </View>
                        </View>
                        {/* end of inputs */}



                        {/* checkbox agreement */}
                        <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 1 }}
                            onPress={handlecheckbox}>
                            <Checkbox
                                value={Checked}
                                onValueChange={setChecked}
                                color={Checked ? '#b0a41f' : undefined} />
                            <Text style={{ marginLeft: 8, fontSize: 12 }}>I agree to Glaciq's Terms of Service and Privacy Policy</Text>

                        </TouchableOpacity>


                        {/* register button */}
                        <TouchableOpacity
                            onPress={handleRegister}
                            style={styles.regbutton}>
                            <Text style={{ color: 'white', fontWeight: 500 }}>Create Account</Text>
                        </TouchableOpacity>



                        {/* already user? */}
                        <View style={{ flexDirection: 'row' }}>
                            <Text>Already a user? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={{ color: '#c5a330' }}>Login here...</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default Register
const styles = StyleSheet.create({

    container: {

        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 50,

    },

    content: {

        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,


    },

    input: {

        borderWidth: 0.15,
        color: 'black',
        width: 300,
        borderRadius: 20,
        padding: 12,
        margin: 10,
        backgroundColor: '#e4e3e9',
    },

    inputdescription: {
        color: '#57575aff',
        fontSize: 11,
        marginLeft: 30,
        marginBottom: 10
    },

    regbutton: {

        borderRadius: 20,
        padding: 10,
        margin: 10,
        width: 300,
        alignItems: 'center',
        backgroundColor: '#c6a32f',
        color: 'white'

    },

    heading: {
        color: '#857131ff',
        fontSize: 27,
        fontWeight: 500,
        marginVertical: 30
    }
})