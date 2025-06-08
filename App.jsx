import {View, LogBox, KeyboardAvoidingView, StatusBar} from 'react-native';
import React, {useEffect} from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {GlobalContextProvider} from './src/context/Store';
import {THEME_COLOR} from './src/utils/Colors';
import Toast from 'react-native-toast-message';
import {playSound} from './src/utils/voiceUtils';
import {SafeAreaView} from 'react-native-safe-area-context';

LogBox.ignoreAllLogs();
const App = () => {
  useEffect(() => {
    playSound('bgmusic');
  }, []);
  return (
    <GlobalContextProvider>
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1, backgroundColor: '#000'}}>
          <StatusBar backgroundColor={THEME_COLOR} barStyle={'dark-content'} />
          <GestureHandlerRootView style={{flex: 1}}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{flex: 1}}>
              <AppNavigator />
              <Toast />
            </KeyboardAvoidingView>
          </GestureHandlerRootView>
        </View>
      </SafeAreaView>
    </GlobalContextProvider>
  );
};

export default App;
