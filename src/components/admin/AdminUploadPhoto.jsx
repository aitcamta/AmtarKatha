import {BackHandler, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useGlobalContext} from '../../context/Store';

export default function AdminUploadPhoto() {
  const {setAdminTab} = useGlobalContext();
  const handleBackPress = useCallback(() => {
    setAdminTab(0);
    return true;
  }, []);
  useEffect(() => {
    const backListener = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );
    return backListener.remove;
  }, [handleBackPress]);
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin Upload Photo</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    marginVertical: responsiveHeight(1),
  },
  title: {
    fontSize: responsiveFontSize(3),
    color: '#fff',
    flexShrink: 1,
    fontFamily: 'times',
    alignSelf: 'center',
  },
  description: {
    fontSize: responsiveFontSize(1.9),
    color: '#fff',
    lineHeight: responsiveHeight(2.8),
    fontFamily: 'sho',
  },
});
