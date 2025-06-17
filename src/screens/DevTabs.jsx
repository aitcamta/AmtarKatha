import {
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useGlobalContext} from '../context/Store';
import {
  DevlopmentCateories,
  generateDevelopmentArray,
} from '../utils/Constants';
import {useIsFocused} from '@react-navigation/native';
import AutoHeightImage from '../components/AutoHeightImage';
import {Modal} from 'react-native';
import {downloadFile} from '../modules/downloadFile';
import {showToast} from '../modules/Toaster';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../components/CustomButton';
export default function DevTabs() {
  const year = new Date().getFullYear();
  const isFoucused = useIsFocused();
  const {activeTab, setActiveTab} = useGlobalContext();
  const [yearArray, setYearArray] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [yearSelected, setYearSelected] = useState(false);
  const tabName = DevlopmentCateories.filter(item => item.tab === activeTab)[0]
    .cat;
  const devArray = generateDevelopmentArray().filter(
    item => item.category == tabName,
  );
  const [filteredData, setFilteredData] = useState(devArray);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [fileName, setFileName] = useState('');
  const populateYear = () => {
    let arr = [];
    for (let index = 2021; index <= year; index++) {
      arr = [...arr, index];
    }
    setYearArray(arr);
  };
  useEffect(() => {
    populateYear();
  }, [isFoucused]);
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
          {DevlopmentCateories.filter(item => item.tab === activeTab)[0].cat}{' '}
          ক্ষেত্র
        </Text>
        <View
          style={{
            marginVertical: responsiveHeight(2),
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            flexWrap: 'wrap',
          }}>
          {yearArray.map((item, index) => (
            <TouchableOpacity
              style={styles.card}
              key={index}
              onPress={() => {
                setSelectedYear(item);
                setYearSelected(true);
                setFilteredData(devArray.filter(el => el.year == item));
              }}>
              <View style={styles.cardHeader}>
                <Text style={styles.catTitle}>{item}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {yearSelected && (
            <CustomButton
              title={'Clear'}
              size={'xsmall'}
              color={'darkred'}
              fontColor={'white'}
              onClick={() => {
                setFilteredData(devArray);
                setSelectedYear('');
                setYearSelected(false);
              }}
            />
          )}
        </View>

        <View style={{marginVertical: responsiveHeight(1)}}>
          {yearSelected && (
            <Text style={styles.title}>Year:- {selectedYear}</Text>
          )}
          <View style={{marginVertical: responsiveHeight(1)}}>
            {filteredData.map((item, index) => (
              <View
                style={{
                  marginVertical: responsiveHeight(2),
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}
                key={index}>
                <TouchableOpacity
                  onPress={() => {
                    setFullscreenImage(item.imageUrl);
                    setFileName(`${item.id}.jpg`);
                  }}>
                  <AutoHeightImage
                    src={item.imageUrl}
                    style={styles.subImage}
                  />
                </TouchableOpacity>
                {!yearSelected && (
                  <Text style={styles.subTitle}>Year:- {item.year}</Text>
                )}
                <Text style={styles.descriptionText}>{item.description}</Text>
              </View>
            ))}
          </View>
        </View>
        <Modal
          visible={!!fullscreenImage}
          transparent={false}
          animationType="fade"
          onRequestClose={() => setFullscreenImage(null)}>
          <View style={styles.fullscreenContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setFullscreenImage(null)}>
              <Icon name="close" size={responsiveWidth(7)} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.closeButton, {right: responsiveWidth(15)}]}
              onPress={async () => {
                if (downloadFile(fullscreenImage, fileName)) {
                  showToast('success', 'Image Downloaded Successfullty');
                } else {
                  showToast('error', 'Failed to Download Image');
                }
                setFullscreenImage(null);
              }}>
              <Icon
                name={'file-download'}
                size={responsiveWidth(7)}
                color="white"
              />
            </TouchableOpacity>
            <Image
              source={{uri: fullscreenImage}}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: responsiveHeight(1),
  },
  descriptionText: {
    fontSize: responsiveFontSize(2),
    color: 'white',
    fontFamily: 'kalpurush',
    padding: responsiveWidth(3),
    textAlign: 'justify',
    textIndent: responsiveWidth(10),
  },
  title: {
    fontSize: responsiveFontSize(3),
    fontFamily: 'timesbd',
    textAlign: 'center',
    color: 'white',
    marginBottom: responsiveHeight(1),
  },
  subTitle: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'timesbd',
    textAlign: 'center',
    color: 'white',
    marginBottom: responsiveHeight(1),
  },
  card: {
    backgroundColor: 'dodgerblue',
    borderRadius: responsiveWidth(2),
    padding: responsiveWidth(2),
    margin: responsiveHeight(1),
    shadowColor: '#fff',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  catTitle: {
    fontSize: responsiveFontSize(2.5),
    fontFamily: 'timesbd',
    alignSelf: 'center',
    textAlign: 'center',
    color: 'white',
  },
  subImage: {
    width: responsiveWidth(80),
    borderRadius: responsiveWidth(1),
    shadowColor: '#fff',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginVertical: responsiveHeight(2),
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: responsiveWidth(100),
    height: responsiveHeight(100),
  },
  closeButton: {
    position: 'absolute',
    top: responsiveHeight(5),
    right: responsiveWidth(5),
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: responsiveWidth(3.5),
    padding: responsiveWidth(2),
  },
});
