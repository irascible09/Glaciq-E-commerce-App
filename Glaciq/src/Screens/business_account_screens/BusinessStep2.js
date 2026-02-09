import { StyleSheet, Text, View, TextInput, ScrollView, Button, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react'
import BusinessStepper from './BusinessStepper';
import BusinessProfileFooter from './BusinessProfileFooter';

const BusinessStep2 = ({ route, navigation }) => {

    const { businessId } = route.params;
    const [form, setForm] = useState({
        businessType: '',
        gstNumber: '',
        businessAddress: '',
        cityPincode: '',
        expectedMonthlyOrders: '',
        heardFrom: '',
    });

    const submitStep2 = async () => {
        // const { data } = await axios.post('http://172.20.10.8:8080/api/v1/business/register-step-2',
        //     { ...form, businessId }
        // );

        // if (!data.deliveryAvailable) {
        //     Alert.alert('Service not available in your area');
        //     return;
        // }

        navigation.navigate('BusinessStep3', { businessId });
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fefefe', padding: 20 }}>

            {/* CONTENT THAT RESPONDS TO KEYBOARD */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.centerContent}>
                        {/* HEADER */}
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.headingtext}>Join </Text>
                            <Text style={[styles.headingtext, { color: '#b0963b' }]}>
                                GLACIQ
                            </Text>
                            <Text style={styles.headingtext}> Partner Network</Text>
                        </View>

                        {/* STEPPER */}
                        <BusinessStepper step={2} />

                        {/* BUSINESS TYPE */}
                        <View style={styles.dropdownContainer}>
                            <Picker
                                selectedValue={form.businessType}
                                onValueChange={(value) =>
                                    setForm({ ...form, businessType: value })
                                }
                                style={[styles.picker, { color: '#646369' }]}

                                dropdownIconColor="#646369"
                            >
                                <Picker.Item label="Business Type" value="" />
                                <Picker.Item label="Restaurant" value="restaurant" />
                                <Picker.Item label="Cafe" value="cafe" />
                                <Picker.Item label="Cloud Kitchen" value="cloud_kitchen" />
                                <Picker.Item label="Bakery" value="bakery" />
                                <Picker.Item label="Food Truck" value="food_truck" />
                            </Picker>
                        </View>

                        {/* GST NUMBER */}
                        <TextInput
                            style={styles.input}
                            placeholder="GST Registration Number"
                            value={form.gstNumber}
                            onChangeText={(text) =>
                                setForm({ ...form, gstNumber: text })
                            }
                            placeholderTextColor="#646369"
                        />

                        {/* BUSINESS ADDRESS */}
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Business Address"
                            value={form.businessAddress}
                            onChangeText={(text) =>
                                setForm({ ...form, businessAddress: text })
                            }
                            placeholderTextColor="#646369"
                            multiline
                        />

                        {/* CITY / PINCODE */}
                        <TextInput
                            style={styles.input}
                            placeholder="City / Pincode"
                            value={form.cityPincode}
                            onChangeText={(text) =>
                                setForm({ ...form, cityPincode: text })
                            }
                            placeholderTextColor="#646369"
                        />

                        {/* EXPECTED MONTHLY ORDERS */}
                        <View style={styles.dropdownContainer}>
                            <Picker
                                selectedValue={form.expectedMonthlyOrders}
                                onValueChange={(value) =>
                                    setForm({ ...form, expectedMonthlyOrders: value })
                                }
                                style={[styles.picker, { color: '#646369' }]}
                                dropdownIconColor="#646369"
                            >
                                <Picker.Item label="Expected Monthly Order Quantity" value="" />
                                <Picker.Item label="0 – 500" value="0-500" />
                                <Picker.Item label="500 – 2000" value="500-2000" />
                                <Picker.Item label="2000 – 5000" value="2000-5000" />
                                <Picker.Item label="5000+" value="5000+" />
                            </Picker>
                        </View>

                        {/* HEARD FROM */}
                        <View style={styles.dropdownContainer}>
                            <Picker
                                selectedValue={form.heardFrom}
                                onValueChange={(value) =>
                                    setForm({ ...form, heardFrom: value })
                                }
                                style={[styles.picker, { color: '#646369' }]}
                                dropdownIconColor="#646369"
                            >
                                <Picker.Item label="How Did You Hear About Us?" value="" />
                                <Picker.Item label="Google" value="google" />
                                <Picker.Item label="Instagram" value="instagram" />
                                <Picker.Item label="Friend / Referral" value="referral" />
                                <Picker.Item label="Sales Team" value="sales" />
                            </Picker>
                        </View>

                        {/* CONTINUE */}
                        <TouchableOpacity
                            style={styles.continuebutton}
                            onPress={submitStep2}
                        >
                            <Text style={{ color: '#fff', fontWeight: '600' }}>
                                Continue to Verification
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* FOOTER — FIXED TO SCREEN, IGNORING KEYBOARD */}
            <View style={styles.fixedFooter}>
                <BusinessProfileFooter />
            </View>

        </View>
    );
}

export default BusinessStep2

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 140,
    },

    centerContent: {
        alignItems: 'center',
        padding: 20,
        gap:5,
    },

    headingtext: {
        color: '#857131ff',
        fontSize: 27,
        fontWeight: '500',
        marginTop: 40,
        marginBottom: 20,
    },

    dropdownContainer: {
        width: 300,
        height: 45,
        backgroundColor: '#e4e3e9',
        borderRadius: 20,
        marginVertical: 10,
        justifyContent: 'center',
        overflow: 'hidden',
        borderWidth: 0.15,
    },

    picker: {
        height: 48,
        width: '100%',
        color: '#646369',
        fontSize: 2,
    },

    input: {
        width: 300,
        borderRadius: 20,
        padding: 10,
        marginVertical: 10,
        backgroundColor: '#e4e3e9',
        color: '#000',
        borderWidth: 0.15,
    },

    textArea: {
        height: 60,
        textAlignVertical: 'top',
    },

    continuebutton: {
        borderRadius: 20,
        padding: 14,
        width: 300,
        alignItems: 'center',
        backgroundColor: '#c6a32f',
        marginTop: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    fixedFooter: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fefefe',
        alignSelf: 'center',
        paddingBottom: 23,
    },
});