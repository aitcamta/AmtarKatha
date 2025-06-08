import React, {useState, useEffect} from 'react';
import {View, Image, StyleSheet, Dimensions} from 'react-native';

const AutoHeightImage = ({src, style, ...rest}) => {
  const [dimensions, setDimensions] = useState({width: 0, height: 0});
  const [containerStyle, setContainerStyle] = useState({});

  // Extract width and height from style prop
  const {width, height, ...otherStyles} = StyleSheet.flatten(style || {});

  useEffect(() => {
    // Use provided height if available
    if (height) {
      setDimensions({width, height});
      setContainerStyle({width, height});
      return;
    }

    // Calculate height from aspect ratio
    const calculateDimensions = () => {
      if (typeof src === 'number') {
        // Local image
        const {width: imgWidth, height: imgHeight} =
          Image.resolveAssetSource(src);
        const aspectRatio = imgWidth / imgHeight;
        const calculatedHeight = width / aspectRatio;
        setDimensions({width, height: calculatedHeight});
        setContainerStyle({width, height: calculatedHeight});
      } else if (src?.uri || typeof src === 'string') {
        // Remote image
        const uri = src.uri || src;
        Image.getSize(
          uri,
          (imgWidth, imgHeight) => {
            const aspectRatio = imgWidth / imgHeight;
            const calculatedHeight = width / aspectRatio;
            setDimensions({width, height: calculatedHeight});
            setContainerStyle({width, height: calculatedHeight});
          },
          error => console.warn('Failed to get image size:', error),
        );
      }
    };

    if (width) {
      calculateDimensions();
    }
  }, [src, width, height]);

  return (
    <View style={[styles.container, containerStyle, otherStyles]}>
      <Image
        source={typeof src === 'string' ? {uri: src} : src}
        style={[dimensions, styles.image]}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'contain',
  },
});

export default AutoHeightImage;
