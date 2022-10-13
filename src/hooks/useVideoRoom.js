import React, { useCallback, memo, useEffect, useRef, useMemo } from 'react';
import Daily from '@daily-co/react-native-daily-js';
import { Camera } from 'expo-camera';

export default function useVideoRoom(roomUrl) {
  const call = useRef(null);

  const [cameraPermissions, requestCameraPermissions] =
    Camera.useCameraPermissions();

  const [microphonePermissions, requestMicrophonePermissions] =
    Camera.useMicrophonePermissions();

  const onUserJoined = useCallback((event) => {}, []);

  const onUserUpdated = useCallback((event) => {}, []);

  const onUserLeft = useCallback((event) => {}, []);

  const createRoom = useCallback(() => {
    call.current = Daily.createCallObject();

    call.current.on(DailyEvents.UserJoined, onUserJoined);
    call.current.on(DailyEvents.UserUpdated, onUserUpdated);
    call.current.on(DailyEvents.UserLeft, onUserLeft);
  }, []);

  const leaveRoom = useCallback(async () => {
    if (!call.current) {
      return;
    }

    call.current.off(DailyEvents.UserJoined, onUserJoined);
    call.current.off(DailyEvents.UserUpdated, onUserUpdated);
    call.current.off(DailyEvents.UserLeft, onUserLeft);

    console.log('Leaving the room');
    await call.current.leave();
  }, []);

  const requestPermissions = useCallback(async () => {
    const cameraResults = await requestCameraPermissions();
    const microphoneResults = await requestMicrophonePermissions();

    if (
      cameraResults.status !== 'granted' ||
      microphoneResults.status !== 'granted'
    ) {
      return false;
    }

    return true;
  }, [joinRoom]);

  const joinRoom = useCallback(async () => {
    const hasPermissions = await requestPermissions();

    if (hasPermissions) {
      return;
    }

    await call.current.join({ url: roomUrl });
  }, [roomUrl]);

  useEffect(() => {
    joinRoom();

    return () => {
      leaveRoom();
    };
  }, [joinRoom]);

  const permissions = useMemo(() => {
    if (!cameraPermissions || cameraPermissions.status !== 'granted') {
      return 'needs-camera';
    }

    if (!microphonePermissions || microphonePermissions.status !== 'granted') {
      return 'needs-microphone';
    }

    return 'granted';
  }, [cameraPermissions, microphonePermissions]);

  return {
    permissions,
  };
}
