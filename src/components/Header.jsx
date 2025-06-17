import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useGlobalContext} from '../context/Store';
import Icon from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
export default function Header() {
  const {openMenu, setOpenMenu, setActiveTab} = useGlobalContext();
  const navigation = useNavigation();
  return (
    <View style={styles.headerContainer}>
      {/* Left Icon Container */}
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => {
          setActiveTab(0);
          navigation.navigate('Home');
        }}>
        <Image
          source={require('../assets/images/logo_main.png')}
          style={styles.iconImage}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Title */}
      <TouchableOpacity
        style={styles.titleContainer}
        onPress={() => {
          setActiveTab(0);
          navigation.navigate('Home');
        }}>
        <Text style={styles.title}>আমতার কথা</Text>
      </TouchableOpacity>

      {/* Menu Button */}
      <TouchableOpacity style={styles.menuButton}>
        <Icon
          name={openMenu ? 'menu-fold' : 'menu-unfold'}
          size={responsiveFontSize(4)}
          color="white"
          onPress={() => setOpenMenu(!openMenu)}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    height: responsiveHeight(6),
    backgroundColor: 'navy',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(2),
  },
  iconContainer: {
    width: '20%', // Reduced width to prevent overflow
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  iconImage: {
    height: '90%', // Relative to container height
    aspectRatio: 1, // Maintain original aspect ratio
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -responsiveHeight(0.5),
  },
  title: {
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {
      width: responsiveWidth(0.3),
      height: responsiveHeight(0.15),
    },
    textShadowRadius: responsiveWidth(1),
    letterSpacing: 1,
    fontFamily: 'arafat',
    fontSize: responsiveFontSize(4),
    textAlign: 'center',
  },
  menuButton: {
    width: '20%', // Reduced width to prevent overflow
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: responsiveWidth(1),
  },
});
