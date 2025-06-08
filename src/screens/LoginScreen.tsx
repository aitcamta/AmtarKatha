// screens/LoginScreen.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../types';
import {
  responsiveWidth as wp,
  responsiveHeight as hp,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useGlobalContext} from '../context/Store';
type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LoginScreen'
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({navigation}) => {
  const {USER, setUSER} = useGlobalContext();
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    emailOrMobile: '',
    password: '',
  });

  const validate = () => {
    let valid = true;
    const newErrors = {emailOrMobile: '', password: ''};

    if (!emailOrMobile.trim()) {
      newErrors.emailOrMobile = 'Email or mobile is required';
      valid = false;
    } else if (
      !/\S+@\S+\.\S+/.test(emailOrMobile) &&
      !/^\d{10}$/.test(emailOrMobile)
    ) {
      newErrors.emailOrMobile = 'Invalid email or mobile number';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (validate()) {
      let isEmail = false;
      let isMobile = false;
      if (/\S+@\S+\.\S+/.test(emailOrMobile)) {
        isEmail = true;
      }
      if (/^\d{10}$/.test(emailOrMobile)) {
        isMobile = true;
      }
      const obj = {
        id: 'test',
        name: 'ADMIN',
        phone: isMobile ? emailOrMobile : '',
        email: isEmail ? emailOrMobile : '',
        gp: 'TAJPUR',
        isAdmin: true,
      };
      await EncryptedStorage.setItem('nonverifieduid', JSON.stringify(obj));
      setUSER(obj);

      // Login logic here
      console.log('Login successful');
      navigation.navigate('Home');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleMain}>আমতার কথা</Text>
        </View>
        <Text style={styles.title}>User Login</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email or Mobile"
            placeholderTextColor="#999"
            value={emailOrMobile}
            onChangeText={setEmailOrMobile}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.emailOrMobile ? (
            <Text style={styles.error}>{errors.emailOrMobile}</Text>
          ) : null}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {errors.password ? (
            <Text style={styles.error}>{errors.password}</Text>
          ) : null}
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => navigation.navigate('SignUpScreen')}>
          <Text style={styles.signUpButtonText}>Create Account</Text>
        </TouchableOpacity>
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
    marginBottom: hp(3),
    textAlign: 'center',
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  titleMain: {
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {
      width: wp(0.3),
      height: hp(0.15),
    },
    textShadowRadius: wp(1),
    letterSpacing: 1,
    fontFamily: 'arafat',
    fontSize: responsiveFontSize(6),
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: hp(2),
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#fff',
    borderRadius: wp(2),
    padding: wp(4),
    fontSize: hp(2),
  },
  error: {
    color: '#FF5252',
    marginTop: hp(0.5),
    fontSize: hp(1.8),
  },
  loginButton: {
    backgroundColor: '#6366F1',
    borderRadius: wp(2),
    padding: hp(2),
    alignItems: 'center',
    marginTop: hp(1),
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: hp(2.2),
  },
  signUpButton: {
    marginTop: hp(2),
    padding: hp(1.5),
    alignItems: 'center',
  },
  signUpButtonText: {
    color: '#6366F1',
    fontWeight: 'bold',
    fontSize: hp(2),
  },
});

export default LoginScreen;
