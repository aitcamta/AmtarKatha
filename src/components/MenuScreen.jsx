import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useGlobalContext} from '../context/Store';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {THEME_COLOR} from '../utils/Colors';
import {useNavigation} from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import RNExitApp from 'react-native-exit-app';
export default function MenuScreen() {
  const {USER, activeTab, setActiveTab, setOpenMenu, setAdminTab} =
    useGlobalContext();
  const isAdmin = USER.isAdmin;
  const navigation = useNavigation();
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
          source={require('../assets/images/bblogo.png')}
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
            <FontAwesome5
              name="user-secret"
              size={30}
              color={activeTab === 20 ? 'purple' : THEME_COLOR}
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
    width: responsiveWidth(8.5),
    height: responsiveWidth(8.5),
    resizeMode: 'contain',
  },
});
