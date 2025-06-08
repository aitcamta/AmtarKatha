import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import ImageSlider from '../components/ImageSlider';
import Description from '../components/Description';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useGlobalContext} from '../context/Store';
import {useNavigation} from '@react-navigation/native';
import GovtSchemes from './GovtSchemes';
import AmtaDevlopment from './AmtaDevlopment';
import DevTabs from './DevTabs';
import ContactUs from './ContactUs';
import AdminPanel from './AdminPanel';
export default function HomeScreen() {
  const {USER, setUSER, activeTab, setActiveTab} = useGlobalContext();
  const navigation = useNavigation();
  useEffect(() => {
    async () => {
      const nonverifieduid = await EncryptedStorage.getItem('nonverifieduid');
      if (nonverifieduid) {
        const user = JSON.parse(nonverifieduid);
        setUSER(user);
      } else {
        navigation.navigate('LoginScreen');
      }
    };
  }, [activeTab]);
  return (
    <View style={styles.container}>
      <ScrollView style={{padding: 5}}>
        {activeTab === 0 ? (
          <View>
            <ImageSlider />
            <Description />
          </View>
        ) : activeTab === 1 ? (
          <AmtaDevlopment />
        ) : activeTab === 2 ? (
          <GovtSchemes />
        ) : activeTab === 3 ? (
          <ContactUs />
        ) : typeof activeTab === 'string' &&
          activeTab?.split('-')[0] === 'dev' ? (
          <DevTabs />
        ) : activeTab === 20 ? (
          <AdminPanel />
        ) : (
          <Text style={{color: 'white'}}>Comming Soon</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
