import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import api from '../../utils/api';
import BusinessStepper from './BusinessStepper';
import BusinessProfileFooter from './BusinessProfileFooter';

const BusinessStep1 = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    businessName: '',
    password: '',
  });

  const submitStep1 = async () => {
    try {
      const { data } = await api.post(
        '/business/register-step-1',
        form
      );

      if (!data.success) {
        alert(data.message || 'Something went wrong');
        return;
      }

      // to resume step 2
      await AsyncStorage.setItem('businessId', data.businessId);

      navigation.navigate('BusinessStep2', {
        businessId: data.businessId,
      });

    } catch (error) {
      console.log(
        'Step 1 error:',
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        'Unable to continue. Please try again.'
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fefefe' }}>


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

            {/* header  */}
            <View style={styles.headerRow}>
              <Text style={styles.headingtext}>Join </Text>
              <Text style={[styles.headingtext, { color: '#b0963b' }]}>
                GLACIQ
              </Text>
              <Text style={styles.headingtext}> Partner Network</Text>
            </View>

            {/* stepper  */}
            <BusinessStepper step={1} />

            {/* inputs  */}
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
              placeholderTextColor="#646369"
            />

            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={(text) => setForm({ ...form, phone: text })}
              placeholderTextColor="#646369"
            />

            <TextInput
              style={styles.input}
              placeholder="Email Address"
              keyboardType="email-address"
              value={form.email}
              onChangeText={(text) => setForm({ ...form, email: text })}
              placeholderTextColor="#646369"
            />

            <TextInput
              style={styles.input}
              placeholder="Business Name"
              value={form.businessName}
              onChangeText={(text) =>
                setForm({ ...form, businessName: text })
              }
              placeholderTextColor="#646369"
            />

            <TextInput
              style={styles.input}
              placeholder="Create Password"
              secureTextEntry
              value={form.password}
              onChangeText={(text) =>
                setForm({ ...form, password: text })
              }
              placeholderTextColor="#646369"
            />

            <Text style={styles.inputdescription}>
              Use a mix of letters, numbers & symbols, min 8 characters
            </Text>

            {/* button  */}
            <TouchableOpacity
              onPress={submitStep1}
              style={styles.continuebutton}
            >
              <Text style={{ color: '#ffffffff', fontWeight: '500' }}>Continue</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* footer */}
      <View style={styles.fixedFooter}>
        <BusinessProfileFooter />
      </View>

    </View>
  );
};

export default BusinessStep1;

const styles = StyleSheet.create({

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },

  centerContent: {
    alignItems: 'center',
    padding: 20,
  },

  headerRow: {
    flexDirection: 'row',
    marginTop: 50,
  },

  headingtext: {
    color: '#857131ff',
    fontSize: 27,
    fontWeight: '500',
    marginVertical: 20,
  },

  input: {
    borderWidth: 0.15,
    color: 'black',
    width: 300,
    borderRadius: 20,
    padding: 12,
    marginVertical: 15,
    backgroundColor: '#e4e3e9',
  },

  inputdescription: {
    color: '#57575aff',
    fontSize: 11,
    marginBottom: 20,
    width: 300,
  },

  continuebutton: {
    borderRadius: 20,
    padding: 12,
    width: 300,
    alignItems: 'center',
    backgroundColor: '#c6a32f',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

  },

  fixedFooter: {
    position: 'absolute',
    bottom: 25,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#fefefe',
  },

});
