import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const BusinessStepper = ({ step }) => {
  // step = 1 | 2 | 3

  const renderCircle = (index) => {
    const isActive = step >= index;

    return (
      <View
        style={[
          styles.circle,
          isActive ? styles.activeCircle : styles.inactiveCircle,
        ]}
      />
    );
  };

  const renderLine = (index) => {
    const isActive = step > index;

    return (
      <View
        style={[
          styles.line,
          isActive ? styles.activeLine : styles.inactiveLine,
        ]}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.stepRow}>
        {renderCircle(1)}
        {renderLine(1)}
        {renderCircle(2)}
        {renderLine(2)}
        {renderCircle(3)}
      </View>

      <View style={styles.labelRow}>
        <Text style={styles.label}>Details</Text>
        <Text style={styles.label}>Business</Text>
        <Text style={styles.label}>Verify</Text>
      </View>
    </View>
  );
};

export default BusinessStepper;

const GOLD = '#b0963b';
const LIGHT = '#e6e2d3';

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    width: '100%',
    alignItems: 'center',
  },

  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 300,
  },

  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },

  activeCircle: {
    backgroundColor: GOLD,
  },

  inactiveCircle: {
    borderWidth: 2,
    borderColor: GOLD,
    backgroundColor: '#fff',
  },

  line: {
    flex: 1,
    height: 2,
  },

  activeLine: {
    backgroundColor: GOLD,
  },

  inactiveLine: {
    backgroundColor: LIGHT,
  },

  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 300,
    marginTop: 8,
  },

  label: {
    fontSize: 12,
    color: '#555',
  },
});
