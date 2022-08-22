import React, {useRef, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import getPermission from './perm';
import {
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngine,
  IRtcEngineEventHandler,
  RtcSurfaceView,
} from 'react-native-agora-rtc-ng';

const appId = '';

const App = () => {
  const engineRef = useRef<IRtcEngine>();
  const [users, setUsers] = useState<number[]>([]);
  const [joined, setJoined] = useState(false);

  const handlerOne: IRtcEngineEventHandler = {
    onJoinChannelSuccess: () => {
      setUsers(p => [...p, 0]);
      setJoined(true);
    },
    onUserJoined: (connection, remoteUid) => {
      console.log('join', remoteUid, connection);
      setUsers(p => [...p, remoteUid]);
    },
    onUserOffline: (_connection, remoteUid) => {
      setUsers(p => p.filter(u => u !== remoteUid));
    },
  };

  const join = async () => {
    try {
      await getPermission();
      engineRef.current = createAgoraRtcEngine();
      const engine = engineRef.current;
      engine.registerEventHandler(handlerOne);
      engine.initialize({
        appId: appId,
      });
      engine.enableVideo();
      engine.startPreview();
      engine.joinChannelWithOptions('', 'test2', 0, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const leave = () => {
    try {
      setUsers([]);
      engineRef.current?.leaveChannel();
      engineRef.current?.unregisterEventHandler(handlerOne);
      engineRef.current?.release();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.main}>
      <Text style={styles.head}>Agora NG SDK Demo</Text>
      <View style={styles.btnContainer}>
        <Text onPress={join} style={styles.button}>
          Join
        </Text>
        <Text onPress={leave} style={styles.button}>
          Leave
        </Text>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContainer}>
        {joined &&
          users.map(user => (
            <React.Fragment key={user}>
              <RtcSurfaceView canvas={{uid: user}} style={styles.videoView} />
              <Text>{user}</Text>
            </React.Fragment>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 25,
    paddingVertical: 4,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#0055cc',
    margin: 5,
  },
  main: {flex: 1, alignItems: 'center'},
  scroll: {flex: 1, backgroundColor: '#ddeeff', width: '100%'},
  scrollContainer: {alignItems: 'center'},
  videoView: {width: '80%', height: 150},
  btnContainer: {flexDirection: 'row', justifyContent: 'center'},
  head: {fontSize: 20},
});

export default App;
