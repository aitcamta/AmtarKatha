import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  ImageBackground,
  Image,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {THEME_COLOR} from '../utils/Colors';
import Loader from '../components/Loader';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useGlobalContext} from '../context/Store';
// Import your GIF file (adjust the path as needed)
const achakraGif = require('../assets/images/achakra.gif');
const SpaulImage = require('../assets/images/spblue_new_nama.png');

const Splash = () => {
  const {setUSER} = useGlobalContext();
  const AnimatedImageBg = Animated.createAnimatedComponent(ImageBackground);
  const {width, height} = Dimensions.get('window');
  const [loader, setLoader] = useState(false);
  const navigation = useNavigation();
  // Animation values
  const titleScale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const starOpacity = useSharedValue(0);
  const starSize = useSharedValue(0);

  const chakraSize = width * 0.3;
  const titleFontSize = width * 0.2;
  const subtitleFontSize = width * 0.06;
  const bgImage = useSharedValue(0);
  const spImage = useSharedValue(0);
  useEffect(() => {
    // Main animation sequence
    opacity.value = withTiming(1, {duration: 500});
    bgImage.value = withTiming(1, {duration: 500});
    spImage.value = withTiming(1, {duration: 1200});
    starOpacity.value = withRepeat(
      withSequence(
        withTiming(1, {duration: 500, easing: Easing.inOut(Easing.ease)}),
        withTiming(0, {duration: 500, easing: Easing.inOut(Easing.ease)}),
      ),
      -1,
      true,
    );
    starSize.value = withRepeat(
      withSequence(
        withTiming(3, {duration: 500, easing: Easing.inOut(Easing.ease)}),
        withTiming(1, {duration: 500, easing: Easing.inOut(Easing.ease)}),
      ),
      -1,
      true,
    );

    // Title pulse animation
    titleScale.value = withRepeat(
      withSequence(
        withTiming(1.05, {duration: 1000}),
        withTiming(1, {duration: 1000}),
      ),
      -1,
      true,
    );

    // Complete animation after 5 seconds
    setTimeout(() => {
      // setLoader(true);
      setTimeout(() => {
        chekLogin();
      }, 3000);
    }, 4000);
  }, []);

  // Title animation style
  const titleStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: titleScale.value}],
      opacity: opacity.value,
    };
  });
  const bgStyle = useAnimatedStyle(() => {
    return {
      opacity: bgImage.value,
    };
  });
  const spStyle = useAnimatedStyle(() => {
    return {
      opacity: spImage.value,
    };
  });
  const starStyle = useAnimatedStyle(() => {
    return {
      opacity: starOpacity.value,
      transform: [{scale: starSize.value}],
    };
  });
  const chekLogin = async () => {
    const nonverifieduid = await EncryptedStorage.getItem('nonverifieduid');
    if (nonverifieduid) {
      const user = JSON.parse(nonverifieduid);
      setUSER(user);
      navigation.navigate('Home');
    } else {
      navigation.navigate('LoginScreen');
    }
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: THEME_COLOR,
      }}>
      <AnimatedImageBg
        source={require('../assets/images/spbg.jpg')}
        style={[styles.bgStyle, bgStyle]}>
        {/* Sky background with stars */}
        <View style={styles.starsContainer}>
          {Array.from({length: 60}).map((_, i) => (
            <View
              key={i}
              style={[
                styles.star,
                {
                  top: Math.random() * height,
                  left: Math.random() * width,
                  width: 1 + Math.random() * 3,
                  height: 1 + Math.random() * 3,
                },
                starStyle,
              ]}
            />
          ))}
        </View>
        {/* Animated title */}
        <Animated.View style={[styles.titleContainer, titleStyle]}>
          <Text style={[styles.title, {fontSize: titleFontSize}]}>
            {`আমতার`}
          </Text>
          <Text
            style={[styles.title2, {fontSize: titleFontSize}]}>{`কথা`}</Text>
          <Text style={[styles.subtitle, {fontSize: subtitleFontSize}]}>
            {`উন্নয়নের পথে নিরবচ্ছিন্ন\n এগিয়ে চলার খতিয়ান`}
          </Text>
        </Animated.View>
        {/* Waving flag animation */}

        {/* Use Image component for the GIF */}
        <Image
          source={achakraGif}
          style={{
            width: chakraSize,
            height: chakraSize,
            marginTop: -responsiveHeight(8),
          }}
        />
        <Animated.Image
          source={SpaulImage}
          style={[
            {
              width: responsiveWidth(200),
              position: 'absolute',
              bottom: -responsiveHeight(23),
              transform: [{scale: 0.5}],
            },
            spStyle,
          ]}
        />
      </AnimatedImageBg>
      <Loader visible={loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgStyle: {
    alignSelf: 'center',
    width: responsiveWidth(100),
    height: responsiveHeight(100),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -responsiveHeight(5),
  },
  starsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  star: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 50,
  },
  titleContainer: {
    position: 'absolute',
    top: responsiveWidth(2), // 15% of screen height
    alignItems: 'center',
    zIndex: 10,
  },
  title: {
    // fontWeight: '800',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {
      width: responsiveWidth(0.3),
      height: responsiveHeight(0.15),
    },
    textShadowRadius: responsiveWidth(1),
    letterSpacing: 1,
    marginTop: responsiveHeight(1.5),
    fontFamily: 'arafat',
    textAlign: 'center',
  },
  title2: {
    // fontWeight: '800',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {
      width: responsiveWidth(0.3),
      height: responsiveHeight(0.15),
    },
    textShadowRadius: responsiveWidth(1),
    letterSpacing: 1,
    marginTop: -responsiveHeight(6),
    fontFamily: 'arafat',
    textAlign: 'center',
  },
  subtitle: {
    fontWeight: '500',
    color: 'rgba(4, 0, 255, 0.9)',
    // marginTop: responsiveHeight(1), // Matches 10px on 800px height device
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {
      width: responsiveWidth(0.15),
      height: responsiveHeight(0.075),
    },
    textShadowRadius: responsiveWidth(0.3),
    fontFamily: 'kalpurush',
    textAlign: 'center',
    marginTop: -responsiveHeight(2),
  },
  flagContainer: {
    width: responsiveHeight(70), // 70% of screen width
    height: responsiveWidth(30), // 30% of screen height
    borderRadius: responsiveWidth(2.78), // Matches 10px on 360px width device
    overflow: 'hidden',
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: responsiveHeight(0.625), // Matches 5px on 800px height device
    },
    shadowOpacity: 0.3,
    shadowRadius: responsiveWidth(2.78), // Matches 10px on 360px width device
    marginTop: responsiveHeight(4),
  },
  stripe: {
    width: '100%',
  },
  chakraContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chakra: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spoke: {
    position: 'absolute',
    backgroundColor: '#000080',
    borderRadius: responsiveWidth(0.56), // Matches 2px on 360px width device
  },
  centerCircle: {
    backgroundColor: '#000080',
  },
  topWaveContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    transform: [{rotateY: '180deg'}, {rotateY: '180deg'}], // Flip the wave vertically
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default Splash;
