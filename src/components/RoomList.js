import React, { useCallback, memo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const RoomList = ({ rooms, onOpenRoom }) => {
  const keyExtractor = useCallback((item) => item.id);

  const renderRoom = useCallback(({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onOpenRoom(item);
        }}
      >
        <View style={styles.room}>
          <Text style={styles.roomId}>{item.id}</Text>
        </View>
      </TouchableOpacity>
    );
  }, []);

  return (
    <View style={styles.container}>
      {rooms.length ? (
        <FlatList
          data={rooms}
          renderItem={renderRoom}
          keyExtractor={keyExtractor}
        />
      ) : (
        <Text style={styles.placeholder}>No chat rooms yet</Text>
      )}
    </View>
  );
};

export default memo(RoomList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  placeholder: {
    textAlign: 'center',
  },
  room: {
    borderWidth: 1,
    borderColor: '#abcdef',
    padding: 8,
    borderRadius: 6,
    marginBottom: 15,
  },
  roomId: {
    fontWeight: 'bold',
    color: '#abcdef',
  },
});
