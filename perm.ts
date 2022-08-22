import {PermissionsAndroid, Platform} from 'react-native';

export default async function getPermission() {
  if (Platform.OS === 'android') {
    // Need granted the microphone and camera permission
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.CAMERA,
    ]);
  }
}
