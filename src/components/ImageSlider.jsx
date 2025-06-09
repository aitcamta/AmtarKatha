import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import firestore from '@react-native-firebase/firestore';
import {
  responsiveScreenWidth as wp,
  responsiveHeight as hp,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Progress from 'react-native-progress';
import {downloadFile} from '../modules/downloadFile';
import {getCollection} from '../context/firestoreHelper';
import {showToast} from '../modules/Toaster';

const ImageSlider = () => {
  const [sliderData, setSliderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [fileName, setFileName] = useState('');
  useEffect(() => {
    const fetchSliderImages = async () => {
      try {
        const data = await getCollection('homeSliderImages');
        setSliderData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching slider images:', err);
        setError('Failed to load images. Please try again later.');
        setLoading(false);
      }
    };

    sliderData.length === 0 && fetchSliderImages();
  }, []);

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.slide}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            setFullscreenImage(item.original);
            setFileName(item.fileName);
          }}>
          <Image
            source={{uri: item.original}}
            style={styles.image}
            resizeMode="cover"
          />
        </TouchableOpacity>

        {/* Action buttons */}
        {/* <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.downloadButton]}
            onPress={() => downloadFile(item.original, item.fileName)}>
            <Icon name={'file-download'} size={wp(5)} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.fullscreenButton]}
            onPress={() => setFullscreenImage(item.original)}>
            <Icon name="fullscreen" size={wp(5)} color="white" />
          </TouchableOpacity>
        </View> */}

        {/* Description */}
        {item.description && (
          <View style={styles.descriptionContainer}>
            <Text
              style={[
                styles.descriptionText,
                {
                  fontSize:
                    item.description.length > 150
                      ? responsiveFontSize(1.8)
                      : responsiveFontSize(2),
                  lineHeight:
                    item.description.length > 150
                      ? responsiveFontSize(1.9)
                      : responsiveFontSize(2.5),
                },
              ]}
              ellipsizeMode="tail">
              {item.description}
            </Text>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.center, {height: hp(25)}]}>
        <Progress.CircleSnail
          color={['red', 'green', 'blue']}
          thickness={4}
          size={50}
        />
        <Text style={styles.loadingText}>Loading images...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, {height: hp(25)}]}>
        <Icon name="error-outline" size={wp(10)} color="#FF5252" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (sliderData.length === 0) {
    return (
      <View style={[styles.center, {height: hp(25)}]}>
        <Icon name="image-not-supported" size={wp(10)} color="#9E9E9E" />
        <Text style={styles.emptyText}>No images available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Carousel
        loop
        width={wp(100)}
        height={hp(40)} // Increased height to accommodate descriptions
        autoPlay={true}
        autoPlayInterval={5000}
        data={sliderData}
        scrollAnimationDuration={1000}
        renderItem={renderItem}
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
        }}
      />

      {/* Fullscreen Modal */}
      <Modal
        visible={!!fullscreenImage}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setFullscreenImage(null)}>
        <View style={styles.fullscreenContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setFullscreenImage(null)}>
            <Icon name="close" size={wp(7)} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.closeButton, {right: wp(15)}]}
            onPress={async () => {
              if (downloadFile(fullscreenImage, fileName)) {
                showToast('success', 'Image Downloaded Successfullty');
              } else {
                showToast('error', 'Failed to Download Image');
              }
              setFullscreenImage(null);
            }}>
            <Icon name={'file-download'} size={wp(7)} color="white" />
          </TouchableOpacity>
          <Image
            source={{uri: fullscreenImage}}
            style={styles.fullscreenImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: hp(1),
    backgroundColor: '#FFFFFF',
    borderRadius: wp(2),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: hp(30),
  },
  descriptionContainer: {
    backgroundColor: 'navy',
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    height: '100%',
  },
  descriptionText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'kalpurush',
  },
  actionButtons: {
    position: 'absolute',
    top: hp(1),
    right: wp(3),
    flexDirection: 'row',
  },
  actionButton: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(4.5),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp(2),
  },
  downloadButton: {
    backgroundColor: '#4A90E2',
  },
  fullscreenButton: {
    backgroundColor: '#FF6B6B',
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: wp(100),
    height: hp(100),
  },
  closeButton: {
    position: 'absolute',
    top: hp(5),
    right: wp(5),
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: wp(3.5),
    padding: wp(2),
  },
  progressContainer: {
    position: 'absolute',
    bottom: hp(5),
    left: wp(5),
    right: wp(5),
    backgroundColor: 'white',
    borderRadius: wp(2),
    padding: wp(3),
    alignItems: 'center',
    elevation: 5,
  },
  progressBar: {
    height: hp(1),
    width: '100%',
    backgroundColor: '#E0E0E0',
    borderRadius: wp(1),
    overflow: 'hidden',
    marginBottom: hp(1),
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    fontSize: wp(3.8),
    color: '#333',
  },
  loadingText: {
    marginTop: hp(1),
    fontSize: wp(4),
    color: '#4A90E2',
  },
  errorText: {
    marginTop: hp(1),
    fontSize: wp(4),
    color: '#FF5252',
    textAlign: 'center',
    paddingHorizontal: wp(5),
  },
  emptyText: {
    marginTop: hp(1),
    fontSize: wp(4),
    color: '#9E9E9E',
  },
  expandButton: {
    marginTop: hp(1),
    alignSelf: 'center',
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(3),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: wp(1),
  },
  expandButtonText: {
    color: '#FFD700',
    fontSize: wp(3.5),
    fontWeight: 'bold',
  },
});

export default ImageSlider;
