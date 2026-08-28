import { useState, useEffect, useCallback, useRef } from 'react';

export const useDeviceLocation = (options = {}) => {
  const {
    enableHighAccuracy = true,
    timeout = 15000,
    maximumAge = 2000,
    autoWatch = true,
  } = options;

  const [location, setLocation] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [heading, setHeading] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [status, setStatus] = useState('INITIALIZING'); // INITIALIZING, ACTIVE, LOW_ACCURACY, DENIED, UNAVAILABLE
  const [errorMessage, setErrorMessage] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const watchIdRef = useRef(null);

  const handleSuccess = useCallback((pos) => {
    const coords = pos.coords;
    const currentLoc = {
      latitude: coords.latitude,
      longitude: coords.longitude,
    };

    setLocation(currentLoc);
    setAccuracy(coords.accuracy);
    setHeading(coords.heading);
    setSpeed(coords.speed);
    setErrorMessage('');
    setLastUpdated(new Date().toLocaleTimeString());

    if (coords.accuracy <= 50) {
      setStatus('ACTIVE');
    } else {
      setStatus('LOW_ACCURACY');
    }
  }, []);

  const handleError = useCallback((err) => {
    switch (err.code) {
      case err.PERMISSION_DENIED:
        setStatus('DENIED');
        setErrorMessage('Location permission denied by user.');
        break;
      case err.POSITION_UNAVAILABLE:
        setStatus('UNAVAILABLE');
        setErrorMessage('GPS position unavailable on this device.');
        break;
      case err.TIMEOUT:
        setStatus('UNAVAILABLE');
        setErrorMessage('GPS request timed out. Retrying...');
        break;
      default:
        setStatus('UNAVAILABLE');
        setErrorMessage(err.message || 'Error acquiring device location.');
        break;
    }
  }, []);

  const reacquireGPS = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('UNAVAILABLE');
      setErrorMessage('Geolocation API not supported by browser.');
      return;
    }

    setStatus('INITIALIZING');
    setErrorMessage('');

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [handleSuccess, handleError]);

  useEffect(() => {
    if (!autoWatch) return;

    if (!('geolocation' in navigator)) {
      setStatus('UNAVAILABLE');
      setErrorMessage('Geolocation API not supported by browser.');
      return;
    }

    // Acquire instant single fix first
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      { enableHighAccuracy, timeout, maximumAge }
    );

    // Start continuous watch Position
    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      { enableHighAccuracy, timeout, maximumAge }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [autoWatch, enableHighAccuracy, timeout, maximumAge, handleSuccess, handleError]);

  return {
    location,
    latitude: location?.latitude,
    longitude: location?.longitude,
    accuracy,
    heading,
    speed,
    status,
    errorMessage,
    lastUpdated,
    reacquireGPS,
  };
};

export default useDeviceLocation;
