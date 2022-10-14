import React, { memo } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { DailyMediaView } from '@daily-co/react-native-daily-js';

import useVideoRoom from '../hooks/useVideoRoom';

const RoomPage = ({ room, onCloseRoom }) => {
  const { permissions, toggleMute, isMuted, currentParticipant, participants } =
    useVideoRoom(room.url);

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

  if (!currentParticipant) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>Probably loading</Text>
      </View>
    );
  }

  return (
    <View style={styles.mediaWrapperWrapper}>
      <View style={styles.mediaWrapper}>
        {participants.map((participant) => (
          <View style={styles.participantWrapper}>
            <DailyMediaView
              videoTrack={participant.videoTrack}
              audioTrack={participant.audioTrack}
              mirror={participant.local}
              zOrder={participant.local ? 1 : 0}
              style={styles.mediaView}
              objectFit="cover"
            />
          </View>
        ))}
        <View style={styles.currentParticipantWrapper}>
          <DailyMediaView
            videoTrack={currentParticipant.videoTrack}
            audioTrack={currentParticipant.audioTrack}
            mirror={currentParticipant.local}
            zOrder={currentParticipant.local ? 1 : 0}
            style={styles.mediaView}
            objectFit="cover"
          />
        </View>
      </View>
      <View style={styles.toolbar}>
        <Button onPress={toggleMute} title={isMuted ? 'Unmute' : 'Mute'} />
      </View>
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
  mediaWrapperWrapper: {
    flex: 1,
  },
  mediaWrapper: {
    flex: 1,
    backgroundColor: '#222',
  },
  currentParticipantWrapper: {
    position: 'absolute',
    width: 100,
    height: 133,
    borderRadius: 10,
    bottom: 30,
    right: 15,
    overflow: 'hidden',
    backgroundColor: '#faf',
  },
  mediaView: {
    width: '100%',
    height: '100%',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingBottom: 30,
  },
});
