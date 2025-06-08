// screens/SignUpScreen.tsx
import React, {useState, useEffect} from 'react';
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
import {Picker} from '@react-native-picker/picker';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../types';
import {
  responsiveWidth as wp,
  responsiveHeight as hp,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {GPS} from '../utils/Constants';

type SignUpScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SignUpScreen'
>;

interface Props {
  navigation: SignUpScreenNavigationProp;
}

const SignUpScreen: React.FC<Props> = ({navigation}) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [village, setVillage] = useState('');
  const [selectedGP, setSelectedGP] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    village: '',
    gp: '',
  });
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);

  // Validate password match in real-time
  useEffect(() => {
    if (password && confirmPassword) {
      if (password === confirmPassword) {
        setPasswordMatch(true);
        setErrors(prev => ({...prev, confirmPassword: ''}));
      } else {
        setPasswordMatch(false);
      }
    } else {
      setPasswordMatch(null);
    }
  }, [password, confirmPassword]);
  // Handle mobile number input - only allow numbers
  const handleMobileChange = (text: string) => {
    // Remove any non-numeric characters
    const cleanedText = text.replace(/[^0-9]/g, '');
    setMobile(cleanedText);

    // Update error state
    if (cleanedText.length > 0 && !/^\d{10}$/.test(cleanedText)) {
      setErrors(prev => ({...prev, mobile: 'Must be 10 digits'}));
    } else {
      setErrors(prev => ({...prev, mobile: ''}));
    }
  };
  const validate = () => {
    let valid = true;
    const newErrors = {
      name: '',
      mobile: '',
      email: '',
      password: '',
      confirmPassword: '',
      village: '',
      gp: '',
    };

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!mobile) {
      newErrors.mobile = 'Mobile number is required';
      valid = false;
    } else if (!/^\d{10}$/.test(mobile)) {
      newErrors.mobile = 'Invalid mobile number (10 digits)';
      valid = false;
    }

    if (!email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email address';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      valid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    if (!selectedGP) {
      newErrors.gp = 'Please select a GP';
      valid = false;
    }
    if (!village.trim()) {
      newErrors.name = 'Village is required';
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSignUp = () => {
    if (validate()) {
      navigation.navigate('VerifySignUpScreen', {
        name: name.toUpperCase(),
        mobile,
        email,
        password,
        village: village.toUpperCase(),
        gp: selectedGP,
      });
    }
  };
  const handleBackPress = () => {
    navigation.navigate('LoginScreen');
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
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleMain}>আমতার কথা</Text>
        </View>
        <Text style={styles.title}>Create Account</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />
          {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            value={mobile}
            onChangeText={handleMobileChange}
            maxLength={10}
          />
          {errors.mobile ? (
            <Text style={styles.error}>{errors.mobile}</Text>
          ) : null}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          {errors.email ? (
            <Text style={styles.error}>{errors.email}</Text>
          ) : null}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Village"
            placeholderTextColor="#999"
            value={village}
            onChangeText={setVillage}
          />
          {errors.village ? (
            <Text style={styles.error}>{errors.village}</Text>
          ) : null}
        </View>
        <View style={styles.inputContainer}>
          <Picker
            selectedValue={selectedGP}
            onValueChange={itemValue => setSelectedGP(itemValue)}
            style={styles.picker}
            dropdownIconColor="#999"
            mode="dropdown">
            <Picker.Item label="Select GP" value="" />
            {GPS.map(gp => (
              <Picker.Item key={gp} label={gp} value={gp} />
            ))}
          </Picker>
          {errors.gp ? <Text style={styles.error}>{errors.gp}</Text> : null}
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}>
              <Icon
                name={showPassword ? 'visibility' : 'visibility-off'}
                size={hp(3)}
                color="#999"
              />
            </TouchableOpacity>
          </View>
          {errors.password ? (
            <Text style={styles.error}>{errors.password}</Text>
          ) : null}
          {password.length >= 6 && !errors.password && (
            <Text style={styles.success}>Password strength: Good</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
          {errors.confirmPassword ? (
            <Text style={styles.error}>{errors.confirmPassword}</Text>
          ) : passwordMatch ? (
            <Text style={styles.success}>Passwords match!</Text>
          ) : passwordMatch === false ? (
            <Text style={styles.error}>Passwords do not match</Text>
          ) : null}
        </View>

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.loginButtonText}>
            Already have an account? Login
          </Text>
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
    marginBottom: hp(2),
    textAlign: 'center',
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(1),
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
    fontSize: responsiveFontSize(5),
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: hp(2),
  },
  pickerContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: wp(2),
    overflow: 'hidden',
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#fff',
    borderRadius: wp(2),
    padding: wp(4),
    fontSize: hp(2),
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: wp(2),
  },
  passwordInput: {
    flex: 1,
    color: '#fff',
    padding: wp(4),
    fontSize: hp(2),
  },
  eyeIcon: {
    padding: wp(3),
  },
  picker: {
    color: '#fff',
    height: hp(6),
    backgroundColor: '#1E1E1E',
    borderRadius: wp(2),
  },
  error: {
    color: '#FF5252',
    marginTop: hp(0.5),
    fontSize: hp(1.8),
  },
  success: {
    color: '#4CAF50',
    marginTop: hp(0.5),
    fontSize: hp(1.8),
  },
  signUpButton: {
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
  loginButton: {
    marginTop: hp(2),
    padding: hp(1.5),
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#6366F1',
    fontWeight: 'bold',
    fontSize: hp(2),
  },
});

export default SignUpScreen;
