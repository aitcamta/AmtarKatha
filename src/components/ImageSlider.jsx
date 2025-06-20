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
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Progress from 'react-native-progress';
import {downloadFile} from '../modules/downloadFile';
import {getCollection} from '../firebase/firestoreHelper';
import {showToast} from '../modules/Toaster';
import {useGlobalContext} from '../context/Store';

const ImageSlider = () => {
  const {slideState, setSlideState} = useGlobalContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [fileName, setFileName] = useState('');
  useEffect(() => {
    const fetchSliderImages = async () => {
      try {
        const data = await getCollection('homeSliderImages');
        const sorted = data.sort((a, b) => {
          if (a.date > b.date) return -1;
          if (a.date < b.date) return 1;
          return 0;
        });
        setSlideState(sorted);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching slider images:', err);
        setError('Failed to load images. Please try again later.');
        setLoading(false);
      }
    };

    slideState.length === 0 ? fetchSliderImages() : setLoading(false);
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
      <View style={[styles.center, {height: responsiveHeight(25)}]}>
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
      <View style={[styles.center, {height: responsiveHeight(25)}]}>
        <Icon name="error-outline" size={responsiveWidth(10)} color="#FF5252" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (slideState.length === 0) {
    return (
      <View style={[styles.center, {height: responsiveHeight(25)}]}>
        <Icon
          name="image-not-supported"
          size={responsiveWidth(10)}
          color="#9E9E9E"
        />
        <Text style={styles.emptyText}>No images available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Carousel
        loop
        width={responsiveWidth(100)}
        height={responsiveHeight(40)}
        autoPlay={true}
        autoPlayInterval={5000}
        data={slideState}
        scrollAnimationDuration={1000}
        renderItem={renderItem}
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
        }}
      />

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: responsiveHeight(1),
    backgroundColor: '#FFFFFF',
    borderRadius: responsiveWidth(2),
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
    height: responsiveHeight(30),
  },
  descriptionContainer: {
    backgroundColor: 'navy',
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(4),
    height: '100%',
  },
  descriptionText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'kalpurush',
  },
  actionButtons: {
    position: 'absolute',
    top: responsiveHeight(1),
    right: responsiveWidth(3),
    flexDirection: 'row',
  },
  actionButton: {
    width: responsiveWidth(9),
    height: responsiveWidth(9),
    borderRadius: responsiveWidth(4.5),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: responsiveWidth(2),
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
  progressContainer: {
    position: 'absolute',
    bottom: responsiveHeight(5),
    left: responsiveWidth(5),
    right: responsiveWidth(5),
    backgroundColor: 'white',
    borderRadius: responsiveWidth(2),
    padding: responsiveWidth(3),
    alignItems: 'center',
    elevation: 5,
  },
  progressBar: {
    height: responsiveHeight(1),
    width: '100%',
    backgroundColor: '#E0E0E0',
    borderRadius: responsiveWidth(1),
    overflow: 'hidden',
    marginBottom: responsiveHeight(1),
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    fontSize: responsiveWidth(3.8),
    color: '#333',
  },
  loadingText: {
    marginTop: responsiveHeight(1),
    fontSize: responsiveWidth(4),
    color: '#4A90E2',
  },
  errorText: {
    marginTop: responsiveHeight(1),
    fontSize: responsiveWidth(4),
    color: '#FF5252',
    textAlign: 'center',
    paddingHorizontal: responsiveWidth(5),
  },
  emptyText: {
    marginTop: responsiveHeight(1),
    fontSize: responsiveWidth(4),
    color: '#9E9E9E',
  },
  expandButton: {
    marginTop: responsiveHeight(1),
    alignSelf: 'center',
    paddingVertical: responsiveHeight(0.5),
    paddingHorizontal: responsiveWidth(3),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: responsiveWidth(1),
  },
  expandButtonText: {
    color: '#FFD700',
    fontSize: responsiveWidth(3.5),
    fontWeight: 'bold',
  },
});

export default ImageSlider;
