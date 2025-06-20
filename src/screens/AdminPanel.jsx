import {BackHandler, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import CustomButton from '../components/CustomButton';
import {useGlobalContext} from '../context/Store';
import AdminUsersPanel from '../components/admin/AdminUsersPanel';
import AdminUploadPhoto from '../components/admin/AdminUploadPhoto';
import AdminUploadVideo from '../components/admin/AdminUploadVideo';
import AdminUserRequests from '../components/admin/AdminUserRequests';
import AdminPostUpdate from '../components/admin/AdminPostUpdate';
import AdminUpcommingEvents from '../components/admin/AdminUpcommingEvents';
import AdminUploadSlides from '../components/admin/AdminUploadSlides';

export default function AdminPanel() {
  const {setActiveTab, adminTab, setAdminTab} = useGlobalContext();
  const [showButtons, setShowButtons] = useState(true);
  const handleBackPress = () => {
    if (showButtons) {
      setActiveTab(0);
    } else {
      setShowButtons(true);
      setAdminTab(0);
    }
    return true;
  };
  useEffect(() => {
    const backListener = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );
    return backListener.remove;
  }, [handleBackPress]);
  return (
    <ScrollView style={styles.container}>
      {showButtons && <Text style={styles.title}>Admin Panel</Text>}
      {showButtons && (
        <View
          style={{
            margin: responsiveHeight(1),
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: responsiveWidth(2),
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <CustomButton
            title={'View Users'}
            color={'blueviolet'}
            size={'medium'}
            fontSize={responsiveFontSize(1.5)}
            onClick={() => {
              setShowButtons(false);
              setAdminTab(1);
            }}
          />
          <CustomButton
            title={'Upload Photo'}
            color={'green'}
            size={'medium'}
            fontSize={responsiveFontSize(1.5)}
            onClick={() => {
              setShowButtons(false);
              setAdminTab(2);
            }}
          />
          <CustomButton
            title={'Upload Video'}
            color={'blue'}
            size={'medium'}
            fontSize={responsiveFontSize(1.5)}
            onClick={() => {
              setShowButtons(false);
              setAdminTab(3);
            }}
          />
          <CustomButton
            title={'View Requests'}
            color={'purple'}
            size={'medium'}
            fontSize={responsiveFontSize(1.5)}
            onClick={() => {
              setShowButtons(false);
              setAdminTab(4);
            }}
          />
          <CustomButton
            title={'Post/ Update'}
            color={'deeppink'}
            size={'medium'}
            fontSize={responsiveFontSize(1.5)}
            onClick={() => {
              setShowButtons(false);
              setAdminTab(5);
            }}
          />
          <CustomButton
            title={'Upcomming Events'}
            color={'deepskyblue'}
            size={'medium'}
            fontSize={responsiveFontSize(1.5)}
            onClick={() => {
              setShowButtons(false);
              setAdminTab(6);
            }}
          />
          <CustomButton
            title={'Upload Slide Photos'}
            color={'chocolate'}
            size={'medium'}
            fontSize={responsiveFontSize(1.5)}
            onClick={() => {
              setShowButtons(false);
              setAdminTab(7);
            }}
          />
        </View>
      )}
      <View>
        {adminTab === 1 ? (
          <AdminUsersPanel />
        ) : adminTab === 2 ? (
          <AdminUploadPhoto />
        ) : adminTab === 3 ? (
          <AdminUploadVideo />
        ) : adminTab === 4 ? (
          <AdminUserRequests />
        ) : adminTab === 5 ? (
          <AdminPostUpdate />
        ) : adminTab === 6 ? (
          <AdminUpcommingEvents />
        ) : adminTab === 7 ? (
          <AdminUploadSlides />
        ) : null}
      </View>
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
