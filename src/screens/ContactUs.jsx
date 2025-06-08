import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  BackHandler,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useGlobalContext} from '../context/Store';
import {
  responsiveWidth as wp,
  responsiveHeight as hp,
  responsiveFontSize as fp,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DocumentPicker from '@react-native-documents/picker';
import {launchImageLibrary} from 'react-native-image-picker';
import {showToast} from '../modules/Toaster';
import Clipboard from '@react-native-clipboard/clipboard';

// Mock database simulation
let mockDB = {};
export default function ContactUs() {
  const {USER, setActiveTab} = useGlobalContext();
  const [formTab, setFormtab] = useState('submit');
  const [formData, setFormData] = useState({
    id: '',
    name: USER.name || '',
    address: '',
    email: USER.email || '',
    phone: USER.phone || '',
    message: '',
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [otpStep, setOtpStep] = useState(null);
  const [otpCode, setOtpCode] = useState('');
  const [submittedId, setSubmittedId] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [searchedData, setSearchedData] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }

    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle phone number input
  const handlePhoneChange = text => {
    // Remove non-digit characters
    const cleanedText = text.replace(/[^\d]/g, '');

    // Limit to 10 characters
    if (cleanedText.length <= 10) {
      setFormData({...formData, phone: cleanedText});
    }
  };

  // Select image from gallery
  const selectImage = async () => {
    try {
      setUploading(true);

      // For iOS/Android
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 800,
      });

      if (result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setFormData({
          ...formData,
          image: {
            uri: selectedImage.uri,
            name: selectedImage.fileName || `image_${Date.now()}`,
            type: selectedImage.type || 'image/jpeg',
          },
        });
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User cancelled image picker');
      } else {
        console.error('Image picker error:', error);
        showToast('error', 'Error', 'Failed to select image');
      }
    } finally {
      setUploading(false);
    }
  };

  // Simulate OTP sending
  const sendOtp = type => {
    showToast(
      'success',
      `OTP Sent, Check your ${type} for verification code (use 123456 for demo)`,
    );
    setOtpStep(type);
  };

  // Verify OTP
  const verifyOtp = () => {
    if (otpCode === '123456') {
      setOtpStep(null);
      setOtpCode('');
      return true;
    } else {
      showToast('error', 'Invalid OTP, Please enter correct OTP');
      return false;
    }
  };

  // Simulate image upload
  const uploadImage = async docId => {
    if (!formData.image) return '';

    // In a real app, you would upload to your server here
    // This is a mock implementation
    return new Promise(resolve => {
      setTimeout(() => {
        const fileName = `${docId}-${formData.image.name}`;
        resolve(`https://example.com/uploads/${fileName}`);
      }, 1500);
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (otpStep === 'email') {
      if (!verifyOtp()) return;
      sendOtp('phone');
      return;
    }

    if (otpStep === 'phone') {
      if (!verifyOtp()) return;
    }

    if (!otpStep) {
      sendOtp('email');
      return;
    }

    // Create document
    const docId = Date.now().toString();

    try {
      // Upload image if exists
      const url = await uploadImage(docId);

      const requestData = {
        id: docId,
        name: formData.name,
        address: formData.address,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        imageName: formData.image ? `${docId}-${formData.image.name}` : '',
        url: url,
        date: Date.now(),
        reply: null,
        replyDate: null,
      };

      // Save to mock DB
      mockDB[docId] = requestData;
      setSubmittedId(docId);
      showToast('success', 'Your request submitted to me successfully!');
      // Reset form
      setFormData({
        name: '',
        address: '',
        email: '',
        phone: '',
        message: '',
        image: null,
      });
    } catch (error) {
      showToast(
        'error',
        'Upload Error, Failed to upload image. Please try again.',
      );
    }
  };

  // Search for request
  const handleSearch = () => {
    if (!searchId.trim()) {
      showToast('error', 'Error, Please enter a request ID');
      return;
    }

    const result = mockDB[searchId];
    if (result) {
      setSearchedData(result);
    } else {
      showToast('error', 'Not Found, No request found with this ID');
      setSearchedData(null);
    }
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
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../assets/images/spaul2025.png')}
        style={styles.image}
      />
      <Text style={styles.title}>সরাসরি বিধায়ক</Text>
      <Text style={styles.description}>
        আপনাদের যেকোনো সমস্যা, অভাব, অভিযোগ, মতামত, অনুরোধ সমস্ত কিছু শুনতে আমি
        অত্যন্ত আগ্রহী। আপনাদের যেকোনো সমস্যার সুরাহা করতে পারলে নিজেকে ধন্য মনে
        করবো। স্পশকাতর বিষয়ে আপনার সমস্ত পরিচয় গোপন রাখার নিশ্চয়তা আমি দিচ্ছি।
        তাই আপনারা নিঃসংকোচে আপনাদের জবাব দিতে পারেন। ৪৮ ঘন্টার মধ্যে আপানাকে
        আমি যথাযত প্রত্যুত্তর দেবার চেষ্টা করবো।
      </Text>
      <View style={styles.container}>
        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, formTab === 'submit' && styles.formTab]}
            onPress={() => setFormtab('submit')}>
            <Text style={styles.tabText}>Submit Request</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, formTab === 'search' && styles.formTab]}
            onPress={() => setFormtab('search')}>
            <Text style={styles.tabText}>Search Request</Text>
          </TouchableOpacity>
        </View>

        {formTab === 'submit' ? (
          <ScrollView contentContainerStyle={styles.formContainer}>
            {submittedId ? (
              <View style={styles.successContainer}>
                <Icon name="check-circle" size={wp(20)} color="#4CAF50" />
                <Text style={styles.successText}>
                  Request Submitted Successfully!
                </Text>
                <Text style={styles.infoText}>
                  We will get back to you within 48 hours
                </Text>

                <View style={styles.docIdContainer}>
                  <Text style={styles.docIdText}>
                    Request ID: {submittedId}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      Clipboard.setString(submittedId);
                      showToast(
                        'success',
                        'Copied!, Request ID copied to clipboard',
                      );
                    }}>
                    <Icon name="content-copy" size={wp(6)} color="#BB86FC" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.newRequestButton}
                  onPress={() => setSubmittedId(null)}>
                  <Text style={styles.buttonText}>New Request</Text>
                </TouchableOpacity>
              </View>
            ) : otpStep ? (
              <View style={styles.otpContainer}>
                <Icon
                  name={otpStep === 'email' ? 'email' : 'phone'}
                  size={wp(20)}
                  color="#BB86FC"
                />
                <Text style={styles.otpTitle}>
                  Verify {otpStep === 'email' ? 'Email' : 'Phone'}
                </Text>
                <Text style={styles.otpText}>
                  Enter the OTP sent to your {otpStep}
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Enter OTP"
                  placeholderTextColor="#888"
                  value={otpCode}
                  onChangeText={setOtpCode}
                  keyboardType="number-pad"
                  maxLength={6}
                  autoFocus
                />

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSubmit}
                  disabled={otpCode.length < 6}>
                  <Text style={styles.buttonText}>Verify OTP</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setOtpStep(null)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.sectionTitle}>
                  Your Contact Information
                </Text>

                <TextInput
                  style={[styles.input, errors.name && styles.errorInput]}
                  placeholder="Full Name"
                  placeholderTextColor="#888"
                  value={formData.name}
                  onChangeText={text => setFormData({...formData, name: text})}
                />
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}

                <TextInput
                  style={[styles.input, errors.email && styles.errorInput]}
                  placeholder="Email Address"
                  placeholderTextColor="#888"
                  value={formData.email}
                  onChangeText={text => setFormData({...formData, email: text})}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                <TextInput
                  style={[styles.input, errors.phone && styles.errorInput]}
                  placeholder="Phone Number (10 digits)"
                  placeholderTextColor="#888"
                  value={formData.phone}
                  onChangeText={handlePhoneChange}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
                {errors.phone && (
                  <Text style={styles.errorText}>{errors.phone}</Text>
                )}

                <TextInput
                  style={[styles.input, errors.address && styles.errorInput]}
                  placeholder="Address"
                  placeholderTextColor="#888"
                  value={formData.address}
                  onChangeText={text =>
                    setFormData({...formData, address: text})
                  }
                />
                {errors.address && (
                  <Text style={styles.errorText}>{errors.address}</Text>
                )}

                <TextInput
                  style={[
                    styles.input,
                    styles.messageInput,
                    errors.message && styles.errorInput,
                  ]}
                  placeholder="Your Message"
                  placeholderTextColor="#888"
                  value={formData.message}
                  onChangeText={text =>
                    setFormData({...formData, message: text})
                  }
                  multiline
                />
                {errors.message && (
                  <Text style={styles.errorText}>{errors.message}</Text>
                )}

                <TouchableOpacity
                  style={styles.imageButton}
                  onPress={selectImage}
                  disabled={uploading}>
                  {uploading ? (
                    <Text style={styles.imageButtonText}>Uploading...</Text>
                  ) : (
                    <>
                      <Icon name="add-a-photo" size={wp(5)} color="#FFF" />
                      <Text style={styles.imageButtonText}>
                        {formData.image
                          ? 'Change Image'
                          : 'Add Image (Optional)'}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                {formData.image && (
                  <View style={styles.imagePreview}>
                    <Image
                      source={{uri: formData.image.uri}}
                      style={styles.previewImage}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => setFormData({...formData, image: null})}>
                      <Icon name="close" size={wp(4)} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSubmit}
                  disabled={uploading}>
                  <Text style={styles.buttonText}>
                    {uploading ? 'Processing...' : 'Submit Request'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        ) : (
          <View style={styles.searchContainer}>
            <Text style={styles.sectionTitle}>Find Your Request</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter Request ID"
              placeholderTextColor="#888"
              value={searchId}
              onChangeText={setSearchId}
            />

            <TouchableOpacity style={styles.button} onPress={handleSearch}>
              <Text style={styles.buttonText}>Search Request</Text>
            </TouchableOpacity>

            {searchedData && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>Request Details</Text>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>ID:</Text>
                  <Text style={styles.detailValue}>{searchedData.id}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Name:</Text>
                  <Text style={styles.detailValue}>{searchedData.name}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Email:</Text>
                  <Text style={styles.detailValue}>{searchedData.email}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Phone:</Text>
                  <Text style={styles.detailValue}>{searchedData.phone}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(searchedData.date).toLocaleString()}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <View style={styles.statusContainer}>
                    <Text
                      style={[
                        styles.statusText,
                        searchedData.reply ? styles.resolved : styles.progress,
                      ]}>
                      {searchedData.reply ? 'Resolved' : 'In Progress'}
                    </Text>
                  </View>
                </View>

                {searchedData.url && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Image:</Text>
                    <Image
                      source={{uri: searchedData.url}}
                      style={styles.resultImage}
                    />
                  </View>
                )}

                {searchedData.reply && (
                  <>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Reply:</Text>
                      <Text style={[styles.detailValue, styles.replyText]}>
                        {searchedData.reply}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Reply Date:</Text>
                      <Text style={styles.detailValue}>
                        {new Date(searchedData.replyDate).toLocaleString()}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    marginVertical: responsiveHeight(1),
    padding: responsiveWidth(2),
  },
  title: {
    fontSize: responsiveFontSize(3),
    color: '#fff',
    flexShrink: 1,
    fontFamily: 'sho',
    alignSelf: 'center',
  },
  description: {
    fontSize: responsiveFontSize(1.9),
    color: '#fff',
    lineHeight: responsiveHeight(2.8),
    fontFamily: 'kalpurush',
    textAlign: 'justify',
  },
  image: {
    width: responsiveWidth(60),
    height: responsiveWidth(45),
    marginBottom: responsiveWidth(2),
    alignSelf: 'center',
    resizeMode: 'cover',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1F1F1F',
    borderRadius: wp(2),
    marginBottom: hp(2),
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    paddingVertical: hp(1.5),
    alignItems: 'center',
  },
  formTab: {
    backgroundColor: '#BB86FC',
    borderRadius: wp(2),
  },
  tabText: {
    color: '#FFF',
    fontSize: fp(2),
    fontWeight: 'bold',
  },
  formContainer: {
    paddingBottom: hp(4),
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: fp(2.5),
    fontWeight: 'bold',
    marginBottom: hp(2),
    marginTop: hp(1),
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#1F1F1F',
    color: '#FFF',
    borderRadius: wp(2),
    padding: wp(4),
    marginBottom: hp(1),
    fontSize: fp(2),
  },
  messageInput: {
    minHeight: hp(15),
    textAlignVertical: 'top',
  },
  errorInput: {
    borderColor: '#CF6679',
    borderWidth: 1,
  },
  errorText: {
    color: '#CF6679',
    marginBottom: hp(1),
    fontSize: fp(1.8),
  },
  imageButton: {
    flexDirection: 'row',
    backgroundColor: '#3700B3',
    padding: wp(4),
    borderRadius: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(2),
  },
  imageButtonText: {
    color: '#FFF',
    marginLeft: wp(2),
    fontSize: fp(2),
  },
  imagePreview: {
    marginBottom: hp(2),
    position: 'relative',
    alignItems: 'center',
  },
  previewImage: {
    width: wp(60),
    height: wp(60),
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: '#333',
  },
  removeImageButton: {
    position: 'absolute',
    top: wp(1),
    right: wp(1),
    backgroundColor: '#CF6679',
    borderRadius: wp(3),
    width: wp(6),
    height: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#BB86FC',
    padding: wp(4),
    borderRadius: wp(2),
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: fp(2.2),
  },
  cancelButton: {
    padding: wp(4),
    alignItems: 'center',
    marginTop: hp(1),
  },
  cancelText: {
    color: '#BB86FC',
    fontSize: fp(2),
  },
  otpContainer: {
    alignItems: 'center',
    padding: wp(5),
  },
  otpTitle: {
    color: '#FFF',
    fontSize: fp(3),
    fontWeight: 'bold',
    marginVertical: hp(1),
  },
  otpText: {
    color: '#E0E0E0',
    fontSize: fp(2),
    marginBottom: hp(3),
    textAlign: 'center',
  },
  successContainer: {
    alignItems: 'center',
    padding: wp(5),
  },
  successText: {
    color: '#FFF',
    fontSize: fp(3),
    fontWeight: 'bold',
    marginVertical: hp(2),
    textAlign: 'center',
  },
  infoText: {
    color: '#E0E0E0',
    fontSize: fp(2.2),
    marginBottom: hp(3),
    textAlign: 'center',
  },
  docIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F1F',
    padding: wp(4),
    borderRadius: wp(2),
    marginBottom: hp(3),
  },
  docIdText: {
    color: '#BB86FC',
    fontSize: fp(2),
    marginRight: wp(3),
  },
  newRequestButton: {
    backgroundColor: '#3700B3',
    padding: wp(4),
    borderRadius: wp(2),
    width: '100%',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
  },
  resultContainer: {
    backgroundColor: '#1F1F1F',
    borderRadius: wp(2),
    padding: wp(4),
    marginTop: hp(3),
  },
  resultTitle: {
    color: '#BB86FC',
    fontSize: fp(2.5),
    fontWeight: 'bold',
    marginBottom: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: hp(1),
  },
  detailRow: {
    marginBottom: hp(1.5),
  },
  detailLabel: {
    color: '#BB86FC',
    fontSize: fp(2),
    marginBottom: hp(0.5),
  },
  detailValue: {
    color: '#FFF',
    fontSize: fp(2),
    marginBottom: hp(1),
  },
  statusContainer: {
    backgroundColor: '#333',
    borderRadius: wp(1),
    padding: wp(1),
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: fp(1.8),
    fontWeight: 'bold',
  },
  progress: {
    color: '#FFA000',
  },
  resolved: {
    color: '#4CAF50',
  },
  resultImage: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(1),
    marginTop: hp(1),
  },
  replyText: {
    backgroundColor: '#333',
    padding: wp(2),
    borderRadius: wp(1),
  },
});
