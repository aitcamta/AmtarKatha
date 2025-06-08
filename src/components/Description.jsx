import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {THEME_COLOR} from '../utils/Colors';

export default function Description() {
  return (
    <View style={styles.container}>
      <Text style={styles.descriptionText}>
        {'      '}সম্মাননীয়া মুখ্যমন্ত্রী শ্রীমতি মমতা বন্দ্যোপাধ্যায়ের
        অনুপ্রেরণায় ও আদর্শে এবং সম্মাননীয় সাংসদ শ্রী অভিষেক বন্দ্যোপাধ্যায়ের
        পরামর্শে আমতা বিধানসভা কেন্দ্রের সার্বিক উন্নয়ন, সেবা ও কর্মসূচি নিয়ে
        আমি এবং আমার সুযোগ্য সহকর্মীরা নিরলস পরিশ্রম করে চলেছি। আমার ওয়েবসাইটে
        আপনারা আমার কাজকর্ম, বিভিন্ন প্রকল্পের তথ্য, সরকারি পরিষেবার সুবিধা, এবং
        আরও অনেক কিছু সম্পর্কে জানতে পারবেন। আমি আশা করি, এই ওয়েবসাইটটি আপনাদের
        জন্য উপকারী হবে। আপনারা আমার সঙ্গে যোগাযোগ করতে পারেন যেকোনো সময়। আমি
        আপনাদের সেবা করতে পারলে গর্বিত হব। আমি আপনাদের সকলের সহযোগিতা কামনা
        করছি। আসুন, আমরা একসঙ্গে আমতা কেন্দ্রের উন্নয়নে কাজ করি। ধন্যবাদ।
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  descriptionText: {
    fontSize: responsiveFontSize(2),
    color: 'white',
    fontFamily: 'kalpurush',
    padding: responsiveWidth(4),
    textAlign: 'justify',
    lineHeight: responsiveHeight(2.5),
  },
});
