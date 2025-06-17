import {BackHandler, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import HomeScreen from './HomeScreen';
import Header from '../components/Header';
import MenuScreen from '../components/MenuScreen';
import {useGlobalContext} from '../context/Store';
import RNExitApp from 'react-native-exit-app';
import Modal from 'react-native-modal';
export default function Home() {
  const [backPressCount, setBackPressCount] = useState(0);
  const {openMenu, setOpenMenu} = useGlobalContext();
  const handleBackPress = useCallback(() => {
    if (backPressCount === 0) {
      setBackPressCount(prevCount => prevCount + 1);
      setTimeout(() => setBackPressCount(0), 2000);
    } else if (backPressCount === 1) {
      RNExitApp.exitApp();
    }
    return true;
  }, [backPressCount]);

  useEffect(() => {
    const backListener = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );
    return backListener.remove;
  }, [handleBackPress]);
  return (
    <View style={styles.container}>
      <Header />
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          elevation: 5,
          zIndex: 5,
        }}>
        {openMenu && (
          <Modal
            animationType="slide"
            swipeDirection="right"
            visible={openMenu}
            transparent
            onBackdropPress={() => setOpenMenu(false)}
            onBackButtonPress={() => setOpenMenu(false)}
            onSwipeCancel={() => setOpenMenu(false)}
            onSwipeStart={() => setOpenMenu(true)}
            animationIn={'slideInLeft'}
            animationOut={'slideOutRight'}
            animationInTiming={500}
            animationOutTiming={500}
            statusBarTranslucent={true}>
            <MenuScreen />
          </Modal>
        )}
      </View>
      <HomeScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
