import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useGlobalContext} from '../context/Store';
import Entypo from 'react-native-vector-icons/FontAwesome5';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {THEME_COLOR} from '../utils/Colors';
import {useNavigation} from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import RNExitApp from 'react-native-exit-app';
import {socialMedia} from '../utils/Constants';
import {Linking} from 'react-native';
import SoundPlayer from 'react-native-sound-player';
import AutoHeightImage from './AutoHeightImage';
export default function MenuScreen() {
  const {USER, activeTab, setActiveTab, setOpenMenu, setAdminTab} =
    useGlobalContext();
  const isAdmin = USER.isAdmin;
  const navigation = useNavigation();
  const [isPlaying, setIsPlaying] = useState(true);
  const handlePress = tab => {
    setActiveTab(tab);
    navigation.navigate('Home');
    setOpenMenu(false);
    setAdminTab(0);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          handlePress(0);
        }}
        style={styles.navItemContainer}>
        <FontAwesome5
          name="home"
          size={30}
          color={activeTab === 0 ? 'purple' : THEME_COLOR}
        />
        <Text
          style={[
            styles.menuText,
            {
              color: activeTab === 0 ? 'purple' : THEME_COLOR,
            },
          ]}>
          Home
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          handlePress(1);
        }}
        style={styles.navItemContainer}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.menuImage}
        />
        <Text
          style={[
            styles.menuText,
            {
              color: activeTab === 1 ? 'purple' : THEME_COLOR,
            },
          ]}>
          আমতার উন্নয়নগাথা
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          handlePress(2);
        }}
        style={styles.navItemContainer}>
        <Image
          source={require('../assets/images/bblogo.png')}
          style={styles.menuImage}
        />
        <Text
          style={[
            styles.menuText,
            {
              color: activeTab === 2 ? 'purple' : THEME_COLOR,
            },
          ]}>
          সরকারি প্রকল্পসমূহ
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          handlePress(3);
        }}
        style={styles.navItemContainer}>
        <MaterialIcons
          name="contact-mail"
          size={30}
          color={activeTab === 3 ? 'purple' : THEME_COLOR}
        />
        <Text
          style={[
            styles.menuText,
            {
              color: activeTab === 3 ? 'purple' : THEME_COLOR,
            },
          ]}>
          সরাসরি বিধায়ক
        </Text>
      </TouchableOpacity>
      {isAdmin && (
        <View>
          <TouchableOpacity
            onPress={() => {
              handlePress(20);
            }}
            style={styles.navItemContainer}>
            <Image
              source={require('../assets/images/outsourcing.png')}
              style={[styles.menuImage, {tintColor: THEME_COLOR}]}
            />
            <Text
              style={[
                styles.menuText,
                {
                  color: activeTab === 20 ? 'purple' : THEME_COLOR,
                },
              ]}>
              Admin Section
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <View
        style={[
          styles.navItemContainer,
          {
            position: 'absolute',
            bottom: responsiveHeight(5.25),
            justifyContent: 'space-around',
            paddingHorizontal: responsiveWidth(2),
            zIndex: 5,
          },
        ]}>
        {socialMedia.map((item, index) => (
          <TouchableOpacity
            onPress={async () => {
              await Linking.openURL(item.link);
            }}
            key={index}>
            <Entypo
              name={item.platform}
              size={responsiveFontSize(3)}
              color={'blue'}
            />
            <Text
              style={{fontSize: responsiveFontSize(1), alignSelf: 'center'}}>
              {item.linkType}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View
        style={[
          styles.navItemContainer,
          {
            position: 'absolute',
            bottom: 0,
            justifyContent: 'space-between',
            paddingHorizontal: responsiveWidth(4),
          },
        ]}>
        <TouchableOpacity
          onPress={async () => {
            await EncryptedStorage.clear();
            navigation.navigate('LoginScreen');
            setActiveTab(0);
            setOpenMenu(false);
            setAdminTab(0);
          }}>
          <MaterialCommunityIcons
            name="logout"
            size={responsiveFontSize(2)}
            color={'red'}>
            Sign Out
          </MaterialCommunityIcons>
        </TouchableOpacity>
        {isPlaying ? (
          <TouchableOpacity
            onPress={async () => {
              SoundPlayer.pause();
              setIsPlaying(false);
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Ionicons
              name="volume-mute"
              size={responsiveFontSize(3)}
              color={'red'}
            />
            <Text
              style={{
                fontSize: responsiveFontSize(1),
                alignSelf: 'center',
                color: 'red',
              }}>
              Pause
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={async () => {
              SoundPlayer.play();
              setIsPlaying(true);
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Ionicons
              name="volume-high-sharp"
              size={responsiveFontSize(3)}
              color={'green'}
            />
            <Text
              style={{
                fontSize: responsiveFontSize(1),
                alignSelf: 'center',
                color: 'green',
              }}>
              Play
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => {
            RNExitApp.exitApp();
          }}>
          <MaterialCommunityIcons
            name="close-circle"
            size={responsiveFontSize(2)}
            color={'red'}>
            Exit App
          </MaterialCommunityIcons>
        </TouchableOpacity>
        <AutoHeightImage
          src={require('../assets/images/spblue_full_new_bibek.png')}
          style={{
            position: 'absolute',
            width: responsiveWidth(50),
            right: responsiveWidth(10),
            bottom: responsiveHeight(11),
            opacity: 0.8,
            zIndex: 1,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: responsiveWidth(70),
    height: responsiveHeight(85),
    backgroundColor: 'rgba(0, 102, 255, 0.8)',
    position: 'absolute',
    top: responsiveHeight(9),
    right: -responsiveWidth(3),
    borderTopLeftRadius: responsiveWidth(3),
    borderBottomLeftRadius: responsiveWidth(3),
    justifyContent: 'flex-start',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    paddingVertical: responsiveHeight(1),
    borderColor: 'white',
    borderWidth: 1,
  },
  navItemContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: responsiveWidth(2),
    flexDirection: 'row',
    width: responsiveWidth(68),
    borderRadius: responsiveWidth(2),
    paddingLeft: responsiveWidth(2),
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    marginBottom: responsiveHeight(0.5),
  },
  menuText: {
    fontSize: responsiveFontSize(2.5),
    fontFamily: 'kalpurush',
    textAlign: 'center',
    paddingLeft: responsiveWidth(2),
  },
  menuImage: {
    width: responsiveWidth(9),
    height: responsiveWidth(9),
    resizeMode: 'contain',
  },
});
