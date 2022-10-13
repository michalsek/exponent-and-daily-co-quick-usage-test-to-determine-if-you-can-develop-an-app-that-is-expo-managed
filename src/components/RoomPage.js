import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DailyMediaView } from '@daily-co/react-native-daily-js';

import useVideoRoom from '../hooks/useVideoRoom';

const RoomPage = ({ room, onCloseRoom }) => {
  const { permissions, videoRoom } = useVideoRoom(room.url);

  if (permissions === 'needs-camera') {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>
          This app needs camera permissions, go to settings
        </Text>
      </View>
    );
  }

  if (permissions === 'needs-microphone') {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>
          This app needs microphone permissions, go to settings
        </Text>
      </View>
    );
  }

  if (!videoRoom) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>Probably loading</Text>
      </View>
    );
  }

  console.log(Object.keys(videoRoom.local));

  console.log({
    hasV: !!videoRoom.videoTrack,
    hasA: !!videoRoom.audioTrack,
    hasL: !!videoRoom.local,
    zOrder: videoRoom.local ? 1 : 0,
  });

  return (
    <View style={styles.mediaWrapper}>
      <DailyMediaView
        videoTrack={videoRoom.videoTrack}
        audioTrack={videoRoom.audioTrack}
        mirror={videoRoom.local}
        zOrder={videoRoom.local ? 1 : 0}
        style={styles.mediaView}
      />
    </View>
  );
};

export default memo(RoomPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 100,
    paddingHorizontal: 20,
  },
  mediaWrapper: {
    flex: 1,
  },
  mediaView: {
    width: '100%',
    height: '100%',
  },
});
