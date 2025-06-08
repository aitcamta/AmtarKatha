// screens/VerifySignUpScreen.tsx
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  BackHandler,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../types';
import {
  responsiveScreenWidth as wp,
  responsiveScreenHeight as hp,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {showToast} from '../modules/Toaster';

type VerifySignUpScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'VerifySignUpScreen'
>;
type VerifySignUpScreenRouteProp = RouteProp<
  RootStackParamList,
  'VerifySignUpScreen'
>;

interface Props {
  navigation: VerifySignUpScreenNavigationProp;
  route: VerifySignUpScreenRouteProp;
}

const VerifySignUpScreen: React.FC<Props> = ({navigation, route}) => {
  const {name, mobile, email, password, village, gp} = route.params;
  const [mobileOTP, setMobileOTP] = useState<string[]>([
    '',
    '',
    '',
    '',
    '',
    '',
  ]);
  const [emailOTP, setEmailOTP] = useState<string[]>(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const mobileInputRefs = useRef<Array<TextInput | null>>([]);
  const emailInputRefs = useRef<Array<TextInput | null>>([]);
  const [showAllDetails, setShowAllDetails] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  // Initialize OTP values
  useEffect(() => {
    // In a real app, you would send OTPs to the user's mobile and email here
    console.log(`OTP sent to ${mobile}: 123456`);
    console.log(`OTP sent to ${email}: 654321`);

    const timer = setInterval(() => {
      setResendTimer(prev => {
        if (prev === 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleMobileOTPChange = (index: number, value: string) => {
    if (/^\d*$/.test(value)) {
      const newMobileOTP = [...mobileOTP];
      newMobileOTP[index] = value;
      setMobileOTP(newMobileOTP);

      // Auto-focus next input
      if (value && index < 5 && mobileInputRefs.current[index + 1]) {
        mobileInputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleEmailOTPChange = (index: number, value: string) => {
    if (/^\d*$/.test(value)) {
      const newEmailOTP = [...emailOTP];
      newEmailOTP[index] = value;
      setEmailOTP(newEmailOTP);

      // Auto-focus next input
      if (value && index < 5 && emailInputRefs.current[index + 1]) {
        emailInputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleResendOTP = () => {
    if (resendTimer === 0) {
      setResendTimer(60);
      // Resend OTPs
      console.log(`Resending OTP to ${mobile}: 123456`);
      console.log(`Resending OTP to ${email}: 654321`);
    }
  };

  const handleVerify = async () => {
    const enteredMobileOTP = mobileOTP.join('');
    const enteredEmailOTP = emailOTP.join('');

    if (enteredMobileOTP.length !== 6 || enteredEmailOTP.length !== 6) {
      showToast(
        'error',
        'Please enter complete OTPs for both mobile and email',
      );
      return;
    }

    setIsVerifying(true);

    // Simulate API call
    setTimeout(async () => {
      setIsVerifying(false);

      // In a real app, you would verify these OTPs with your backend
      if (enteredMobileOTP === '123456' && enteredEmailOTP === '654321') {
        showToast(
          'success',
          'Verification Successful, Your account has been created successfully!',
        );
        await handleSignUp();
      } else {
        showToast('error', 'Invalid OTP. Please try again.');
      }
    }, 1500);
  };

  const maskMobile = (mobile: string) => {
    return mobile.substring(0, 4) + '****' + mobile.substring(8);
  };

  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    if (name.length > 3) {
      return name.substring(0, 3) + '***@' + domain;
    }
    return '***@' + domain;
  };

  const handleSignUp = async () => {
    // Here you would typically call your API to create the user account
    // For now, we will just log the details
    console.log(name, mobile, email, village, gp, password);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast('success', 'Account created successfully!');
      navigation.navigate('LoginScreen');
    } catch (error) {
      showToast('error', 'Failed to create account. Please try again.');
    }
  };
  const handleBackPress = () => {
    navigation.navigate('SignUpScreen');
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {!otpVerified ? (
          <View>
            <Text style={styles.title}>Verify Your Account</Text>
            <Text style={styles.subtitle}>
              We've sent OTPs to your mobile and email
            </Text>
          </View>
        ) : (
          <View>
            <Text style={styles.title}>Create Your Account</Text>
            <Text style={styles.subtitle}>
              Your OTP is Verified Successfully.
            </Text>
          </View>
        )}

        {!showAllDetails ? (
          <View>
            {/* Mobile Verification */}
            <View style={styles.verificationSection}>
              <View style={styles.sectionHeader}>
                <Icon name="smartphone" size={hp(3)} color="#6366F1" />
                <Text style={styles.sectionTitle}>Mobile Verification</Text>
              </View>
              <Text style={styles.sectionSubtitle}>
                Sent to {maskMobile(mobile)}
              </Text>

              <View style={styles.otpContainer}>
                {mobileOTP.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={ref => {
                      if (ref) {
                        mobileInputRefs.current[index] = ref;
                      }
                    }}
                    style={styles.otpInput}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={value => handleMobileOTPChange(index, value)}
                    onKeyPress={({nativeEvent}) => {
                      if (
                        nativeEvent.key === 'Backspace' &&
                        !digit &&
                        index > 0 &&
                        mobileInputRefs.current[index - 1]
                      ) {
                        mobileInputRefs.current[index - 1]?.focus();
                      }
                    }}
                  />
                ))}
              </View>
            </View>

            {/* Email Verification */}
            <View style={styles.verificationSection}>
              <View style={styles.sectionHeader}>
                <Icon name="email" size={hp(3)} color="#6366F1" />
                <Text style={styles.sectionTitle}>Email Verification</Text>
              </View>
              <Text style={styles.sectionSubtitle}>
                Sent to {maskEmail(email)}
              </Text>

              <View style={styles.otpContainer}>
                {emailOTP.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={ref => {
                      if (ref) {
                        emailInputRefs.current[index] = ref;
                      }
                    }}
                    style={styles.otpInput}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={value => handleEmailOTPChange(index, value)}
                    onKeyPress={({nativeEvent}) => {
                      if (
                        nativeEvent.key === 'Backspace' &&
                        !digit &&
                        index > 0 &&
                        emailInputRefs.current[index - 1]
                      ) {
                        emailInputRefs.current[index - 1]?.focus();
                      }
                    }}
                  />
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResendOTP}
              disabled={resendTimer > 0}>
              <Text
                style={[
                  styles.resendText,
                  resendTimer > 0 && styles.disabledText,
                ]}>
                {resendTimer > 0
                  ? `Resend OTP in ${resendTimer}s`
                  : 'Resend OTP'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.verifyButton,
                isVerifying && styles.verifyingButton,
              ]}
              onPress={() => {
                setOtpVerified(true);
                setShowAllDetails(!showAllDetails);
              }}>
              <Text style={styles.buttonText}>Verify Your OTP</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{marginTop: hp(3)}}>
            <Text style={styles.sectionSubtitle}>Name: {name}</Text>
            <Text style={styles.sectionSubtitle}>Mobile: {mobile}</Text>
            <Text style={styles.sectionSubtitle}>Email: {email}</Text>
            <Text style={styles.sectionSubtitle}>Village: {village}</Text>
            <Text style={styles.sectionSubtitle}>GP: {gp}</Text>
            <TouchableOpacity
              style={[
                styles.verifyButton,
                isVerifying && styles.verifyingButton,
              ]}
              onPress={handleVerify}
              disabled={isVerifying}>
              {isVerifying ? (
                <Text style={styles.buttonText}>Verifying...</Text>
              ) : (
                <Text style={styles.buttonText}>Verify & Create Account</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.verifyButton,
                {
                  backgroundColor: 'red',
                  marginTop: hp(2),
                },
              ]}
              onPress={() => {
                navigation.goBack();
              }}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: wp(5),
  },
  title: {
    fontSize: hp(4),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: hp(1),
  },
  subtitle: {
    fontSize: hp(2),
    color: '#999',
    textAlign: 'center',
    marginBottom: hp(5),
  },
  verificationSection: {
    backgroundColor: '#1E1E1E',
    borderRadius: wp(2),
    padding: wp(4),
    marginBottom: hp(3),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  sectionTitle: {
    color: '#fff',
    fontSize: hp(2.2),
    fontWeight: 'bold',
    marginLeft: wp(2),
  },
  sectionSubtitle: {
    color: '#999',
    fontSize: hp(1.8),
    marginBottom: hp(2),
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(1),
  },
  otpInput: {
    width: wp(12),
    height: wp(12),
    backgroundColor: '#121212',
    color: '#fff',
    borderRadius: wp(2),
    fontSize: hp(2.5),
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  resendButton: {
    alignSelf: 'center',
    marginVertical: hp(2),
  },
  resendText: {
    color: '#6366F1',
    fontWeight: 'bold',
    fontSize: hp(2),
  },
  disabledText: {
    color: '#4547A9',
  },
  verifyButton: {
    backgroundColor: '#6366F1',
    borderRadius: wp(2),
    padding: hp(2),
    alignItems: 'center',
    marginTop: hp(1),
  },
  verifyingButton: {
    backgroundColor: '#4547A9',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: hp(2.2),
  },
});

export default VerifySignUpScreen;
