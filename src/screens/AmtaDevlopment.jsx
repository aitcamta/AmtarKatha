import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {DevlopmentCateories} from '../utils/Constants';
import {TouchableOpacity} from 'react-native';
import {useGlobalContext} from '../context/Store';

export default function AmtaDevlopment() {
  const {setActiveTab} = useGlobalContext();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../assets/images/spauth.jpg')}
        style={styles.img}
      />
      <Text style={styles.descriptionText}>
        {'       '} তারিখটা ৬ মে ২০২১, আমি যেদিন বিধায়ক হিসাবে শপথ নিলাম, সেদিন
        আরেকটি শপথ নিয়েছিলাম, ধর্ম, বর্ণ, মতবাদ ব্যাতি রেখে আমতা বিধানসভা আসনের
        প্রতিটি মানুষকে নিজের পরিবার হিসাবে গন্য করে ওনাদের জন্য নিরলস পরিশ্রম
        করার। এই শপথের পর থেকে আমার প্রতিটি দিন কাটে আমতা বিধানসভা আসনের মানুষের
        জন্য। আমি জানি, আমতা বিধানসভা আসনের মানুষদের অনেক কষ্টের মধ্যে দিন
        কাটাতে হয়। এই কষ্টের মধ্যে রয়েছে, বেকারত্ব, শিক্ষার অভাব, স্বাস্থ্য
        সেবার অভাব, কৃষি ও কৃষকের উন্নয়নের অভাব, শিল্পের অভাব, অবকাঠামোর অভাব,
        যোগাযোগ ব্যবস্থার অভাব, বিদ্যুৎ ও পানীয় জলের অভাব, সামাজিক নিরাপত্তা ও
        সুরক্ষার অভাব, এবং সর্বোপরি, রাজনৈতিক নেতৃত্বের অভাব। এই অভাবগুলো পূরণ
        করতে আমি আমার সাধ্য অনুযায়ী চেষ্টা করে যাচ্ছি। আমি জানি, এই কাজগুলো সহজ
        নয়, কিন্তু আমি বিশ্বাস করি, যদি আমরা সবাই একসাথে কাজ করি, তাহলে আমরা এই
        অভাবগুলো পূরণ করতে পারব। আমি আপনাদের সাথে প্রতিশ্রুতি দিচ্ছি, আমি আমার
        সাধ্য অনুযায়ী চেষ্টা করে যাব, এবং আমি আপনাদের সাথে প্রতিশ্রুতি দিচ্ছি,
        আমি আমতা বিধানসভা আসনের মানুষের উন্নয়নের জন্য কাজ করে যাব। আমি জানি, এই
        কাজগুলো সহজ নয়, কিন্তু আমি বিশ্বাস করি, যদি আমরা সবাই একসাথে কাজ করি,
        তাহলে আমরা এই কাজগুলো করতে পারব। নীচে আমার কিছু কাজের বিবরণ দেওয়া হলোঃ{' '}
      </Text>
      <Text style={styles.title}>বিভাগসমূহ</Text>
      <View
        style={{
          marginVertical: responsiveHeight(2),
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
        {DevlopmentCateories.map((item, index) => (
          <TouchableOpacity
            style={styles.card}
            key={index}
            onPress={() => {
              setActiveTab(item.tab);
            }}>
            <View style={styles.cardHeader}>
              <Text style={styles.catTitle}>{item.cat}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: responsiveHeight(1),
  },
  descriptionText: {
    fontSize: responsiveFontSize(1.3),
    color: 'white',
    fontFamily: 'kalpurush',
    padding: responsiveWidth(4),
    textAlign: 'justify',
  },
  title: {
    fontSize: responsiveFontSize(3),
    fontFamily: 'sho',
    textAlign: 'center',
    paddingLeft: responsiveWidth(2),
    color: 'white',
  },

  img: {
    width: responsiveWidth(30),
    height: responsiveWidth(40),
    resizeMode: 'contain',
    alignSelf: 'center',
    borderRadius: 5,
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
    flexWrap: 'wrap',
    width: responsiveWidth(40),
  },
  cardHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    // marginBottom: responsiveHeight(1.5),
    // borderBottomWidth: 1,
    // borderBottomColor: '#e0e0e0',
    // paddingBottom: responsiveHeight(1.5),
  },
  catTitle: {
    fontSize: responsiveFontSize(2.5),
    fontFamily: 'sho',
    alignSelf: 'center',
    textAlign: 'center',
    color: 'white',
  },
  image: {
    width: responsiveWidth(15),
    height: responsiveWidth(15),
    marginRight: responsiveWidth(4),
  },
});
