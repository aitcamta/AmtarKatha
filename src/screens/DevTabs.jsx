import {BackHandler, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import {useGlobalContext} from '../context/Store';
import {DevlopmentCateories} from '../utils/Constants';

export default function DevTabs() {
  const {activeTab, setActiveTab} = useGlobalContext();
  const handleBackPress = useCallback(() => {
    setActiveTab(1);
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
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text
          style={{
            color: 'white',
            fontFamily: 'sho',
            fontSize: responsiveFontSize(3),
            alignSelf: 'center',
          }}>
          {DevlopmentCateories.filter(item => item.tab === activeTab)[0].cat}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: responsiveHeight(1),
  },
});
