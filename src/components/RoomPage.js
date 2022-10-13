import React, { useCallback, memo, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Daily from '@daily-co/react-native-daily-js';
import { Camera } from 'expo-camera';

import useVideoRoom from '../hooks/useVideoRoom';

const DailyEvents = {
  UserJoined: 'participant-joined',
  UserUpdated: 'participant-updated',
  UserLeft: 'participant-left',
};

const RoomPage = ({ room, onCloseRoom }) => {
  const { permissions } = useVideoRoom(room.url);

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

  return (
    <View style={styles.container}>
      <Text>Works so far</Text>
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
});
