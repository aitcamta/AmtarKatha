import React, {useCallback, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Linking,
  BackHandler,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import RenderHtml from 'react-native-render-html';
import {GovtSchemesData} from '../utils/Constants';
import {useGlobalContext} from '../context/Store';

const GovtSchemes = () => {
  const {setActiveTab} = useGlobalContext();
  const openLink = url => {
    if (url) Linking.openURL(url);
  };

  const renderSchemeCard = ({item}) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image
          source={{uri: item.imageSrc}}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>{item.title}</Text>
      </View>

      <RenderHtml
        contentWidth={responsiveWidth(85)}
        source={{html: item.description}}
        baseStyle={styles.description}
        tagsStyles={{
          b: {color: 'greenyellow', fontFamily: 'kalpurush'},
          i: {fontStyle: 'italic'},
          br: {marginVertical: responsiveHeight(0.5)},
        }}
      />

      {item.link && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => openLink(item.link)}>
          <Text style={styles.buttonText}>Learn More</Text>
        </TouchableOpacity>
      )}
    </View>
  );
  const FlatList_Header = () => {
    return (
      <View
        style={{
          height: 45,
          width: '100%',
          backgroundColor: '#00B8D4',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: responsiveWidth(2),
        }}>
        <Text style={{fontSize: 24, color: 'white', fontFamily: 'sho'}}>
          পশ্চিমবঙ্গ সরকারের প্রকল্পসমূহ
        </Text>
      </View>
    );
  };
  const handleBackPress = useCallback(() => {
    setActiveTab(0);
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
    <FlatList
      data={GovtSchemesData}
      renderItem={renderSchemeCard}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={FlatList_Header}
      ListHeaderComponentStyle={{
        marginBottom: responsiveHeight(2),
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(4),
    backgroundColor: '#000',
  },
  card: {
    backgroundColor: 'dodgerblue',
    borderRadius: responsiveWidth(3),
    padding: responsiveWidth(4),
    marginBottom: responsiveHeight(2.5),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(1.5),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: responsiveHeight(1.5),
  },
  image: {
    width: responsiveWidth(15),
    height: responsiveWidth(15),
    marginRight: responsiveWidth(4),
  },
  title: {
    fontSize: responsiveFontSize(2.3),
    color: '#fff',
    flexShrink: 1,
    fontFamily: 'sho',
  },
  description: {
    fontSize: responsiveFontSize(1.9),
    color: '#fff',
    lineHeight: responsiveHeight(2.8),
    fontFamily: 'sho',
  },
  button: {
    backgroundColor: 'chartreuse',
    borderRadius: responsiveWidth(2),
    paddingVertical: responsiveHeight(1.2),
    marginTop: responsiveHeight(2),
    alignItems: 'center',
  },
  buttonText: {
    color: 'navy',
    fontSize: responsiveFontSize(1.9),
    fontWeight: '600',
  },
});

export default GovtSchemes;
