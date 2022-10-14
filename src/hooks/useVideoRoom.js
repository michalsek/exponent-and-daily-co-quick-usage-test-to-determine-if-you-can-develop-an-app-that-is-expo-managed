import React, {
  useCallback,
  memo,
  useEffect,
  useRef,
  useMemo,
  useState,
} from 'react';
import Daily from '@daily-co/react-native-daily-js';
import { Camera } from 'expo-camera';

const DailyEvents = {
  UserJoined: 'participant-joined',
  UserUpdated: 'participant-updated',
  UserLeft: 'participant-left',
};

export default function useVideoRoom(roomUrl) {
  const call = useRef(null);
  const [currentParticipant, setCurrentParticipant] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  const [cameraPermissions, requestCameraPermissions] =
    Camera.useCameraPermissions();

  const [microphonePermissions, requestMicrophonePermissions] =
    Camera.useMicrophonePermissions();

  const onCallStateChanged = useCallback((event) => {
    if (!call.current) {
      return;
    }

    const otherParticipants = Object.entries(call.current.participants())
      .filter(([key, _p]) => key !== 'local')
      .map(([key, p]) => p);

    setParticipants(otherParticipants);
  }, []);

  const createRoom = useCallback(() => {
    call.current = Daily.createCallObject();

    call.current.on(DailyEvents.UserJoined, onCallStateChanged);
    call.current.on(DailyEvents.UserUpdated, onCallStateChanged);
    call.current.on(DailyEvents.UserLeft, onCallStateChanged);
  }, []);

  const leaveRoom = useCallback(async () => {
    if (!call.current) {
      return;
    }

    call.current.off(DailyEvents.UserJoined, onCallStateChanged);
    call.current.off(DailyEvents.UserUpdated, onCallStateChanged);
    call.current.off(DailyEvents.UserLeft, onCallStateChanged);

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

  const toggleMute = useCallback(async () => {
    if (!call.current) {
      return;
    }

    call.current.setLocalAudio(isMuted);
    setIsMuted(!isMuted);
  }, [isMuted]);

  const joinRoom = useCallback(async () => {
    const hasPermissions = await requestPermissions();

    if (!hasPermissions) {
      return;
    }

    if (call.current) {
      leaveRoom();
      call.current = null;
    }

    createRoom();
    const results = await call.current.join({ url: roomUrl });

    setCurrentParticipant(results.local);
    setIsMuted(!results.local.audio);
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
    currentParticipant,
    participants,

    toggleMute,
    isMuted,
  };
}
