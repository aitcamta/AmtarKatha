import SoundPlayer from 'react-native-sound-player';

export const playSound = (soundName: string) => {
  try {
    const soundPath = getSoundPath(soundName);
    SoundPlayer.playAsset(soundPath);
    SoundPlayer.setVolume(0.2);
    SoundPlayer.setNumberOfLoops(-1);
  } catch (error) {
    console.log(error);
  }
};

const getSoundPath = (soundName: string) => {
  switch (soundName) {
    case 'bgmusic':
      return require('../assets/audios/bgmusic.mp3');
    case 'laugh':
      return require('../assets/audios/laugh.mp3');
    case 'meditation':
      return require('../assets/audios/meditation.mp3');
    case 'motivation':
      return require('../assets/audios/motivation.mp3');
    case 'notification':
      return require('../assets/audios/notification.mp3');
    case 'ting':
      return require('../assets/audios/ting.mp3');
    case 'ting2':
      return require('../assets/audios/ting2.mp3');
    default:
      throw new Error(`Sound ${soundName} not found`);
  }
};
