import { StatusBar } from 'expo-status-bar';
import { Text, View, Button, StyleSheet } from 'react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';

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
