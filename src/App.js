import { StatusBar } from 'expo-status-bar';
import { Text, View, Button, StyleSheet } from 'react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Updates from 'expo-updates';

import RoomList from './components/RoomList';
import RoomPage from './components/RoomPage';
import { makeID } from './utils';
import DailyAPI from './api';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [currentRoomId, setCurrentRoomId] = useState('');

  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    const results = await DailyAPI.getRooms();

    setRooms(results.data);
    setIsLoading(false);
  }, []);

  const onCreateNewRoom = useCallback(async () => {
    const name = makeID(36);

    await DailyAPI.createNewRoom(name);
    await fetchRooms();
  }, []);

  const onOpenRoom = useCallback(async (room) => {
    setCurrentRoomId(room.id);
  }, []);

  const onCloseRoom = useCallback(async () => {
    setCurrentRoomId(null);
  }, []);

  const onFetchUpdates = useCallback(async () => {
    await Updates.fetchUpdateAsync();
  }, []);

  const onReloadUpdates = useCallback(async () => {
    await Updates.reloadAsync();
  }, []);

  useEffect(() => {
    fetchRooms();
  }, []);

  const currentRoom = useMemo(() => {
    if (!currentRoomId) {
      return null;
    }

    return rooms.find((room) => room.id === currentRoomId);
  }, [rooms, currentRoomId]);

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={{ textAlign: 'center' }}>Loading</Text>
      </View>
    );
  }

  if (currentRoom) {
    return <RoomPage room={currentRoom} onCloseRoom={onCloseRoom} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <RoomList rooms={rooms} onOpenRoom={onOpenRoom} />
      <Button onPress={onCreateNewRoom} title="Create New Room" />
      <View>
        <Text>Dummy text no. 1</Text>
        <Text>{`ReleaseChannel: ${Updates.releaseChannel}`}</Text>
        <Text>{`AppEnv: ${process.env.APP_ENV ?? 'production'}`}</Text>
        <Text>{`BuildEnv: ${process.env.BUILD_ENV ?? ''}`}</Text>
        <Text>{`UpdateEnv: ${process.env.UPDATE_ENV ?? ''}`}</Text>
        <Text>{`BuildAndUpdateEnv: ${
          process.env.BUILD_AND_UPDATE_ENV ?? ''
        }`}</Text>
        <Button onPress={onFetchUpdates} title="Fetch Update" />
        <Button onPress={onReloadUpdates} title="Install Update" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 100,
    paddingHorizontal: 20,
  },
});
