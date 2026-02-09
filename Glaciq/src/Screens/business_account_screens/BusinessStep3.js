import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import React, { useState } from 'react';
import BusinessStepper from './BusinessStepper';
import BusinessProfileFooter from './BusinessProfileFooter';

const UploadBox = ({ title, subtitle }) => (
    <TouchableOpacity style={styles.uploadBox}>
        <View>
            <Text style={styles.uploadTitle}>{title}</Text>
            <Text style={styles.uploadSub}>{subtitle}</Text>
        </View>
        <Text style={styles.uploadIcon}>⬆</Text>
    </TouchableOpacity>
);

const BusinessStep3 = ({ route }) => {
    const { businessId } = route.params;
    const [accepted, setAccepted] = useState(false);

    const submitForVerification = () => {
        console.log('Submitted', businessId);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fefefe', paddingTop: 20 }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
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
                        <BusinessStepper step={3} />

                        {/* TITLE */}
                        <Text style={styles.sectionTitle}>
                            Business Verification
                        </Text>
                        <Text style={styles.sectionSub}>
                            Upload documents for quick partner approval (24–48 hours)
                        </Text>

                        {/* UPLOAD BLOCKS */}
                        <UploadBox
                            title="GST Certificate"
                            subtitle="PDF / JPG • Max 12 MB"
                        />

                        <UploadBox
                            title="Business Registration / Proprietorship Proof"
                            subtitle="PDF / JPG • Max 12 MB"
                        />

                        <UploadBox
                            title="Valid ID Proof (Partner / Owner)"
                            subtitle="PDF / JPG • Max 10 MB"
                        />

                        <UploadBox
                            title="Store / Business Photo"
                            subtitle="JPG / PNG • Max 10 MB"
                        />

                        {/* INFO BOX */}
                        <View style={styles.infoBox}>
                            <Text style={styles.infoText}>
                                Why we need this: FSSAI compliance and partner
                                authenticity verification. Your documents are
                                encrypted and stored securely.
                            </Text>
                        </View>

                        {/* DECLARATION */}
                        <TouchableOpacity
                            style={styles.checkboxRow}
                            onPress={() => setAccepted(!accepted)}
                        >
                            <View
                                style={[
                                    styles.checkbox,
                                    accepted && styles.checkboxChecked,
                                ]}
                            />
                            <Text style={styles.checkboxText}>
                                I certify that all provided information is accurate
                                and authentic.
                            </Text>
                        </TouchableOpacity>

                        {/* SUBMIT */}
                        <TouchableOpacity
                            style={styles.continuebutton}
                            onPress={submitForVerification}
                        >
                            <Text style={{ color: '#fff', fontWeight: '600' }}>
                                Submit for Verification
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.footerNote}>
                            Typically approved within 24–48 hours. We’ll notify
                            you via email and phone.
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* FOOTER */}
            <View style={styles.fixedFooter}>
                <BusinessProfileFooter />
            </View>
        </View>
    );
};

export default BusinessStep3;

// const styles = StyleSheet.create({
//     scrollContent: {
//         alignItems: 'center',
//         paddingBottom: 100,
//     },

//     centerContent: {
//         alignItems: 'center',
//         padding: 20,
//     },

//     headingtext: {
//         fontSize: 24,
//         fontWeight: '600',
//         color: '#000',
//         fontFamily: 'Poppins-SemiBold',
//     },

//     sectionTitle: {
//         fontSize: 20,
//         fontWeight: '600',
//         color: '#000',
//         marginTop: 20,
//         fontFamily: 'Poppins-SemiBold',
//     },

//     sectionSub: {
//         fontSize: 13,
//         color: '#646369',
//         textAlign: 'center',
//         marginTop: 8,
//         fontFamily: 'Poppins-Regular',
//     },

//     uploadBox: {
//         width: 300,
//         height: 80,
//         backgroundColor: '#f0f0f0',
//         borderRadius: 12,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: 16,
//         marginTop: 16,
//     },

//     uploadTitle: {
//         fontSize: 14,
//         fontWeight: '500',
//         color: '#000',
//         fontFamily: 'Poppins-Medium',
//     },

//     uploadSub: {
//         fontSize: 12,
//         color: '#646369',
//         marginTop: 4,
//         fontFamily: 'Poppins-Regular',
//     },

//     uploadIcon: {
//         fontSize: 24,
//         color: '#b0963b',
//     },

//     infoBox: {
//         width: 300,
//         backgroundColor: '#f0f0f0',
//         borderRadius: 12,
//         padding: 16,
//         marginTop: 16,
//     },

//     infoText: {
//         fontSize: 12,
//         color: '#646369',
//         textAlign: 'center',
//         fontFamily: 'Poppins-Regular',
//     },

//     checkboxRow: {
//         flexDirection: 'row',
//         alignItems: 'flex-start',
//         width: 300,
//         marginTop: 20,
//     },

//     checkbox: {
//         width: 18,
//         height: 18,
//         borderRadius: 4,
//         borderWidth: 2,
//         borderColor: '#b0963b',
//         marginRight: 10,
//         marginTop: 2,
//     },

//     checkboxChecked: {
//         backgroundColor: '#b0963b',
//     },

//     checkboxText: {
//         fontSize: 12,
//         color: '#646369',
//         flex: 1,
//         fontFamily: 'Poppins-Regular',
//     },

//     continuebutton: {
//         width: 300,
//         height: 45,
//         borderRadius: 20,
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: '#c6a32f',
//         marginTop: 30,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//         elevation: 5,
//     },

//     footerNote: {
//         fontSize: 11,
//         color: '#646369',
//         textAlign: 'center',
//         marginTop: 12,
//         fontFamily: 'Poppins-Regular',
//     },

//     fixedFooter: {
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         right: 0,
//     },
// });

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
    },


    centerContent: {
        alignItems: 'center',
        padding: 20,

    },

    headingtext: {
        color: '#857131ff',
        fontSize: 27,
        fontWeight: '500',
        marginTop: 40,
        marginBottom: 20,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 10,
    },

    sectionSub: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        width: 260,
        marginBottom: 15,
    },

    uploadBox: {
        width: 300,
        height: 55,
        backgroundColor: '#e4e3e9',
        borderRadius: 20,
        marginVertical: 8,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 0.15,
    },

    uploadTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#000',
    },

    uploadSub: {
        fontSize: 11,
        color: '#646369',
        marginTop: 2,
    },

    uploadIcon: {
        fontSize: 16,
        color: '#857131ff',
    },

    infoBox: {
        width: 300,
        backgroundColor: '#e8f1ff',
        borderRadius: 15,
        padding: 10,
        marginTop: 10,
    },

    infoText: {
        fontSize: 11,
        color: '#333',
    },

    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: 300,
        marginTop: 12,
    },

    checkbox: {
        width: 16,
        height: 16,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#999',
        marginRight: 10,
        marginTop: 2,
    },

    checkboxChecked: {
        backgroundColor: '#c6a32f',
        borderColor: '#c6a32f',
    },

    checkboxText: {
        fontSize: 11,
        color: '#333',
        flex: 1,
    },

    continuebutton: {
        borderRadius: 20,
        padding: 14,
        width: 300,
        alignItems: 'center',
        backgroundColor: '#c6a32f',
        marginTop: 10,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },

    footerNote: {
        fontSize: 11,
        color: '#666',
        marginTop: 8,
        textAlign: 'center',
        width: 260,
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
