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
  responsiveWidth,
  responsiveHeight,
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
    setTimeout(() => {
      setIsVerifying(false);
      // In a real app, you would verify these OTPs with your backend
      if (enteredMobileOTP === '123456' && enteredEmailOTP === '654321') {
        showToast(
          'success',
          'Your Mobile And Email Verification is Successful!',
        );
        setOtpVerified(true);
        setShowAllDetails(!showAllDetails);
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
      showToast('success', 'Your account has been created successfully!');
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
                <Icon
                  name="smartphone"
                  size={responsiveHeight(3)}
                  color="#6366F1"
                />
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
                <Icon name="email" size={responsiveHeight(3)} color="#6366F1" />
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
              onPress={handleVerify}>
              <Text style={styles.buttonText}>Verify Your OTP</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{marginTop: responsiveHeight(3)}}>
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
              onPress={handleSignUp}
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
                  marginTop: responsiveHeight(2),
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
    padding: responsiveWidth(5),
  },
  title: {
    fontSize: responsiveHeight(4),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: responsiveHeight(1),
  },
  subtitle: {
    fontSize: responsiveHeight(2),
    color: '#999',
    textAlign: 'center',
    marginBottom: responsiveHeight(5),
  },
  verificationSection: {
    backgroundColor: '#1E1E1E',
    borderRadius: responsiveWidth(2),
    padding: responsiveWidth(4),
    marginBottom: responsiveHeight(3),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(1),
  },
  sectionTitle: {
    color: '#fff',
    fontSize: responsiveHeight(2.2),
    fontWeight: 'bold',
    marginLeft: responsiveWidth(2),
  },
  sectionSubtitle: {
    color: '#999',
    fontSize: responsiveHeight(1.8),
    marginBottom: responsiveHeight(2),
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(1),
  },
  otpInput: {
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    backgroundColor: '#121212',
    color: '#fff',
    borderRadius: responsiveWidth(2),
    fontSize: responsiveHeight(2.5),
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  resendButton: {
    alignSelf: 'center',
    marginVertical: responsiveHeight(2),
  },
  resendText: {
    color: '#6366F1',
    fontWeight: 'bold',
    fontSize: responsiveHeight(2),
  },
  disabledText: {
    color: '#4547A9',
  },
  verifyButton: {
    backgroundColor: '#6366F1',
    borderRadius: responsiveWidth(2),
    padding: responsiveHeight(2),
    alignItems: 'center',
    marginTop: responsiveHeight(1),
  },
  verifyingButton: {
    backgroundColor: '#4547A9',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: responsiveHeight(2.2),
  },
});

export default VerifySignUpScreen;
