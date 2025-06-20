import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  BackHandler,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import storage from '@react-native-firebase/storage';
import {THEME_COLOR} from '../../utils/Colors';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Toast from 'react-native-toast-message';
import uuid from 'react-native-uuid';
import CustomTextInput from '../CustomTextInput';
import ImagePicker from 'react-native-image-crop-picker';
import Feather from 'react-native-vector-icons/Feather';
import Header from '../Header';
import {deleteFile, uploadFile} from '../../firebase/firebaseStorageHelper';
import {
  deleteDocument,
  setDocument,
  updateDocument,
} from '../../firebase/firestoreHelper';
import {useGlobalContext} from '../../context/Store';
import {downloadFile} from '../../modules/downloadFile';
import Loader from '../Loader';
import CustomButton from '../CustomButton';
const UpdateSlides = () => {
  const isFocused = useIsFocused();

  const navigation = useNavigation();
  const docId = uuid.v4().split('-')[0];
  const [showLoader, setShowLoader] = useState(false);
  const {slideState, setSlideState, USER} = useGlobalContext();
  const [addFile, setAddFile] = useState(true);
  const [filteredData, setFilteredData] = useState(slideState);
  const [firstData, setFirstData] = useState(0);
  const [visibleItems, setVisibleItems] = useState(10);
  const [description, setDescription] = useState('');
  const [photoName, setPhotoName] = useState('');
  const [uri, setUri] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [originalDescription, setOriginalDescription] = useState('');
  const [editPhotoName, setEditPhotoName] = useState('');
  const [originalPhotoName, setOriginalPhotoName] = useState('');
  const [editUri, setEditUri] = useState('');
  const [originalUri, setOriginalUri] = useState('');
  const [editPhotoID, setEditPhotoID] = useState('');
  const [showEditView, setShowEditView] = useState(false);
  const [disable, setDisable] = useState(true);
  const loadPrev = () => {
    setVisibleItems(prevVisibleItems => prevVisibleItems - 10);
    setFirstData(firstData - 10);
  };
  const loadMore = () => {
    setVisibleItems(prevVisibleItems => prevVisibleItems + 10);
    setFirstData(firstData + 10);
  };

  const uploadFileToSlide = async () => {
    setShowLoader(true);
    const reference = storage().ref(`/homeSliderImages/${photoName}`);

    // uploads file
    await reference
      .putFile(uri)
      .then(task => console.log(task))
      .catch(e => console.log(e));
    let url = await storage()
      .ref(`/homeSliderImages/${photoName}`)
      .getDownloadURL();
    await setDocument('homeSliderImages', docId, {
      id: docId,
      date: Date.now(),
      addedBy: USER.name,
      original: url,
      fileName: photoName,
      description: description,
    })
      .then(async () => {
        setShowLoader(false);
        showToast('success', 'Image Uploaded Successfully!');
        let x = slideState;
        x = [
          ...x,
          {
            id: docId,
            date: Date.now(),
            addedBy: USER.name,
            original: url,
            fileName: photoName,
            description: description,
          },
        ];
        const sorted = x.sort((a, b) => {
          if (a.date > b.date) return -1;
          if (a.date < b.date) return 1;
          return 0;
        });
        setSlideState(sorted);
        setFilteredData(sorted);
        setUri('');
        setPhotoName('');
        setAddFile(true);
        setDescription('');
      })
      .catch(e => {
        setShowLoader(false);
        showToast('error', 'Image Addition Failed!');
        console.log(e);
      });
  };
  const showConfirmDialog = el => {
    return Alert.alert('Hold On!', 'Are You Sure To Delete This Image?', [
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: 'No',
        onPress: () => showToast('success', 'Image Not Deleted!'),
      },
      // The "Yes" button
      {
        text: 'Yes',
        onPress: () => {
          delImage(el);
        },
      },
    ]);
  };
  const delImage = async item => {
    setShowLoader(true);
    console.log('/homeSliderImages/' + item.fileName);
    try {
      await deleteFile('/homeSliderImages/' + item.fileName)
        .then(async () => {
          await deleteDocument('homeSliderImages', item.id)
            .then(() => {
              let y = slideState.filter(el => el.id !== item.id);
              setSlideState(y);
              setFilteredData(y);
              setShowLoader(false);
              showToast('success', 'File Deleted Successfully!');
            })
            .catch(e => console.log(e));
        })
        .catch(e => {
          setShowLoader(false);
          showToast('error', 'File Deletation Failed!');
          console.log(e);
        });
    } catch (error) {
      setShowLoader(false);
      showToast('error', 'File Deletation Failed!');
      console.log(error);
    }
  };

  const updateEditPhoto = async () => {
    if (originalDescription === editDescription && originalUri === editUri) {
      showToast('error', 'Nothing to Change!');
    } else {
      setShowLoader(true);
      if (originalUri === editUri) {
        await updateDocument('homeSliderImages', editPhotoID, {
          description: editDescription,
        })
          .then(async () => {
            showToast('success', 'Details Updated Successfully!');
            setShowLoader(false);
            let x = slideState.filter(el => el.id === editPhotoID)[0];
            let y = slideState.filter(el => el.id !== editPhotoID);
            y = [...y, x];
            setSlideState(y);
            setFilteredData(y);
            setEditUri('');
            setEditPhotoName('');
            setAddFile(true);
            setShowEditView(false);
            setDisable(true);
          })
          .catch(e => {
            setShowLoader(false);
            showToast('error', 'Updation Failed!');
            console.log(e);
          });
      } else {
        try {
          await storage()
            .ref('/homeSliderImages/' + originalPhotoName)
            .delete()
            .then(async () => {
              const reference = storage().ref(
                `/homeSliderImages/${editPhotoName}`,
              );

              // uploads file
              await reference
                .putFile(editUri)
                .then(task => console.log(task))
                .catch(e => console.log(e));
              let url = await storage()
                .ref(`/homeSliderImages/${editPhotoName}`)
                .getDownloadURL();
              await updateDocument('homeSliderImages', editPhotoID, {
                addedBy: USER.name,
                original: url,
                fileName: editPhotoName,
                description: editDescription,
              })
                .then(async () => {
                  setShowLoader(false);
                  showToast('success', 'Details Updated Successfully!');
                  let y = slideState.filter(el => el.id !== editPhotoID);
                  y = [
                    ...y,
                    {
                      addedBy: USER.name,
                      original: url,
                      fileName: editPhotoName,
                      description: editDescription,
                      id: editPhotoID,
                    },
                  ];
                  const sorted = y.sort((a, b) => {
                    if (a.date > b.date) return -1;
                    if (a.date < b.date) return 1;
                    return 0;
                  });
                  setSlideState(sorted);
                  setFilteredData(sorted);
                  setEditUri('');
                  setEditPhotoName('');
                  setAddFile(true);
                  setShowEditView(false);
                  setDisable(true);
                })
                .catch(e => {
                  setShowLoader(false);
                  showToast('error', 'Updation Failed!');
                  console.log(e);
                });
            })
            .catch(e => {
              setShowLoader(false);
              showToast('error', 'Updation Failed!');
              console.log(e);
            });
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const handleBackPress = useCallback(() => {
    setAdminTab(0);
    return true;
  }, []);
  useEffect(() => {
    const backListener = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );
    return backListener.remove;
  }, [handleBackPress]);

  const showToast = (type, text) => {
    Toast.show({
      type: type,
      text1: text,
      visibilityTime: 1500,
      position: 'top',
      topOffset: 500,
    });
  };
  return (
    <View style={{flex: 1}}>
      <ScrollView>
        {USER.isAdmin ? (
          <TouchableOpacity
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              alignSelf: 'center',
              justifyContent: 'center',

              marginBottom: responsiveHeight(1.5),
            }}
            onPress={() => {
              setAddFile(!addFile);
            }}>
            <Feather
              name={!addFile ? 'minus-circle' : 'plus-circle'}
              size={20}
              color={'white'}
            />
            <Text selectable style={[styles.label, {paddingLeft: 5}]}>
              {!addFile ? 'Hide Upload Image' : 'Upload New Image'}
            </Text>
          </TouchableOpacity>
        ) : null}

        {!showEditView ? (
          addFile ? (
            <View>
              <Text
                selectable
                style={[styles.title, {marginBottom: responsiveHeight(1)}]}>
                Slide Photos
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 5,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {firstData >= 10 && (
                  <View style={{marginBottom: 10}}>
                    <CustomButton
                      color={'orange'}
                      title={'Previous'}
                      onClick={loadPrev}
                      size={'small'}
                      fontSize={14}
                    />
                  </View>
                )}
                {visibleItems < filteredData.length && (
                  <View style={{marginBottom: 10}}>
                    <CustomButton
                      title={'Next'}
                      onClick={loadMore}
                      size={'small'}
                      fontSize={14}
                    />
                  </View>
                )}
              </View>
              {filteredData.length > 0 ? (
                filteredData.slice(firstData, visibleItems).map((el, ind) => {
                  return (
                    <ScrollView key={ind}>
                      <View
                        style={[
                          styles.itemView,
                          {
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                          },
                        ]}>
                        <Image
                          source={{uri: el.original}}
                          style={{
                            width: responsiveWidth(30),
                            height: responsiveHeight(10),
                            alignSelf: 'center',
                            borderRadius: responsiveWidth(1),
                            marginBottom: responsiveHeight(2),
                          }}
                        />
                        <Text
                          selectable
                          style={[
                            styles.label,
                            {marginVertical: responsiveHeight(2)},
                          ]}>
                          Description: {el.description}
                        </Text>

                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            flexDirection: 'row',
                          }}>
                          <TouchableOpacity
                            onPress={() =>
                              downloadFile(el.original, el.fileName)
                            }>
                            <Text
                              selectable
                              style={[styles.label, {color: 'yellow'}]}>
                              Download
                            </Text>
                          </TouchableOpacity>
                          {USER.isAdmin && (
                            <TouchableOpacity
                              style={{paddingLeft: responsiveWidth(5)}}
                              onPress={() => showConfirmDialog(el)}>
                              <Text
                                selectable
                                style={[styles.label, {color: 'red'}]}>
                                Delete
                              </Text>
                            </TouchableOpacity>
                          )}
                          {USER.isAdmin && (
                            <TouchableOpacity
                              style={{paddingLeft: responsiveWidth(5)}}
                              onPress={() => {
                                setEditDescription(el.description);
                                setOriginalDescription(el.description);
                                setEditUri(el.original);
                                setOriginalUri(el.original);
                                setEditPhotoID(el.id);
                                setShowEditView(true);
                                setDisable(true);
                                setOriginalPhotoName(el.photoName);
                              }}>
                              <Text
                                selectable
                                style={[styles.label, {color: 'orange'}]}>
                                Edit
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </ScrollView>
                  );
                })
              ) : (
                <Text selectable style={styles.label}>
                  File Not Found
                </Text>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 5,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {firstData >= 10 && (
                  <View style={{marginBottom: 10}}>
                    <CustomButton
                      color={'orange'}
                      title={'Previous'}
                      onClick={loadPrev}
                      size={'small'}
                      fontSize={14}
                    />
                  </View>
                )}
                {visibleItems < filteredData.length && (
                  <View style={{marginBottom: 10}}>
                    <CustomButton
                      title={'Next'}
                      onClick={loadMore}
                      size={'small'}
                      fontSize={14}
                    />
                  </View>
                )}
              </View>
            </View>
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              <CustomTextInput
                placeholder={'Enter Description'}
                title={'Enter Description'}
                size={'large'}
                value={description}
                onChangeText={txt => setDescription(txt)}
              />

              {uri == '' ? (
                <TouchableOpacity
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: responsiveHeight(1),
                    flexDirection: 'row',
                  }}
                  onPress={async () => {
                    await ImagePicker.openPicker({
                      width: 1000,
                      height: 600,
                      cropping: true,
                      mediaType: 'photo',
                    })
                      .then(image => {
                        setUri(image.path);
                        setPhotoName(
                          image.path.substring(image.path.lastIndexOf('/') + 1),
                        );
                      })
                      .catch(async e => {
                        console.log(e);

                        await ImagePicker.clean()
                          .then(() => {
                            console.log(
                              'removed all tmp images from tmp directory',
                            );
                            setUri('');
                            setPhotoName('');
                          })
                          .catch(e => {
                            console.log(e);
                          });
                      });
                  }}>
                  <View
                    style={{
                      width: responsiveWidth(12),
                      height: responsiveWidth(12),
                      borderRadius: responsiveWidth(6),
                      backgroundColor: 'deeppink',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={require('../../assets/images/gallery.png')}
                      style={{
                        width: responsiveWidth(8),
                        height: responsiveWidth(8),
                        borderRadius: responsiveWidth(4),
                        tintColor: 'white',
                      }}
                    />
                  </View>
                  <Text
                    selectable
                    style={[styles.title, {paddingLeft: responsiveWidth(2)}]}>
                    Select Photo
                  </Text>
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginTop: responsiveHeight(1),
                  }}>
                  <TouchableOpacity
                    onPress={async () => {
                      await ImagePicker.openPicker({
                        width: 1000,
                        height: 600,
                        cropping: true,
                        mediaType: 'photo',
                      })
                        .then(image => {
                          setUri(image.path);
                          setPhotoName(
                            image.path.substring(
                              image.path.lastIndexOf('/') + 1,
                            ),
                          );
                        })
                        .catch(async e => {
                          console.log(e);

                          await ImagePicker.clean()
                            .then(() => {
                              console.log(
                                'removed all tmp images from tmp directory',
                              );
                              setUri('');
                              setPhotoName('');
                            })
                            .catch(e => {
                              console.log(e);
                            });
                        });
                    }}>
                    <Image
                      source={{uri: uri}}
                      style={{
                        width: responsiveWidth(30),
                        height: responsiveHeight(10),
                        borderRadius: responsiveWidth(4),
                      }}
                    />
                  </TouchableOpacity>
                  <CustomButton
                    title={'Upload File'}
                    onClick={uploadFileToSlide}
                  />
                  <CustomButton
                    title={'Cancel'}
                    color={'red'}
                    onClick={() => {
                      setUri('');
                      setPhotoName('');
                      setAddFile(true);
                      setDescription('');
                    }}
                  />
                </View>
              )}
            </View>
          )
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginTop: responsiveHeight(1),
            }}>
            <Text
              selectable
              style={[styles.label, {paddingLeft: responsiveWidth(2)}]}>
              Edit Description
            </Text>
            <CustomTextInput
              placeholder={'Edit Description'}
              value={editDescription}
              size={'large'}
              fontFamily={'kalpurush'}
              onChangeText={text => {
                setEditDescription(text);
                setDisable(false);
              }}
            />
            <Text
              selectable
              style={[styles.label, {paddingLeft: responsiveWidth(2)}]}>
              Edit Photo
            </Text>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                marginTop: responsiveHeight(1),
              }}
              onPress={async () => {
                await ImagePicker.openPicker({
                  width: 1000,
                  height: 600,
                  cropping: true,
                  mediaType: 'photo',
                })
                  .then(image => {
                    setEditUri(image.path);
                    setEditPhotoName(
                      image.path.substring(image.path.lastIndexOf('/') + 1),
                    );
                    setDisable(false);
                  })
                  .catch(async e => {
                    console.log(e);

                    await ImagePicker.clean()
                      .then(() => {
                        console.log(
                          'removed all tmp images from tmp directory',
                        );
                        setShowEditView(false);
                        setEditUri(originalUri);
                        setEditPhotoName('');
                        setAddFile(true);
                        setDisable(true);
                      })
                      .catch(e => {
                        console.log(e);
                      });
                  });
              }}>
              <Image
                source={{uri: editUri}}
                style={{
                  width: responsiveWidth(30),
                  height: responsiveHeight(10),
                  borderRadius: responsiveWidth(4),
                }}
              />
            </TouchableOpacity>
            <CustomButton
              title={'Update File'}
              onClick={() => {
                updateEditPhoto();
              }}
              btnDisable={disable}
            />
            <CustomButton
              title={'Cancel'}
              color={'red'}
              onClick={() => {
                setEditUri(originalUri);
                setEditPhotoName('');
                setAddFile(true);
                setShowEditView(false);
                setDisable(true);
              }}
            />
          </View>
        )}
      </ScrollView>
      <Loader visible={showLoader} />
      <Toast />
    </View>
  );
};

export default UpdateSlides;

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    width: responsiveWidth(100),
    height: responsiveHeight(8.5),
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: 'black',
    borderBottomLeftRadius: responsiveWidth(3),
    borderBottomRightRadius: responsiveWidth(3),
    padding: 3,
    marginBottom: responsiveHeight(2),
  },
  title: {
    textAlign: 'center',
    fontSize: responsiveFontSize(3),
    fontWeight: '700',
    color: 'white',
  },
  itemView: {
    width: responsiveWidth(92),

    alignSelf: 'center',
    borderRadius: responsiveWidth(2),
    marginTop: responsiveHeight(0.5),
    marginBottom: responsiveHeight(0.5),
    padding: responsiveWidth(4),
    shadowColor: 'black',
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'darkslategrey',
  },
  label: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(2),
    fontFamily: 'kalpurush',
    marginTop: responsiveHeight(0.2),
    color: 'white',
    textAlign: 'center',
    lineHeight: responsiveHeight(2),
  },
  btnText: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(1),
    fontWeight: '500',
    marginTop: responsiveHeight(0.2),
    color: 'white',
    textAlign: 'center',
  },
  text: {
    fontSize: responsiveFontSize(2),
    textAlign: 'center',
    color: 'white',
  },
});
