import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';

interface MapComponentProps {
  latitude: number;
  longitude: number;
  deviceId: string;
  lastStatus?: string;
}

// Native map component - uses react-native-maps (iOS/Android only)
export const MapComponent: React.FC<MapComponentProps> = ({
  latitude,
  longitude,
  deviceId,
  lastStatus,
}) => {
  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      style={styles.map}
      region={{
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      showsUserLocation={false}
      showsMyLocationButton={false}
    >
      <Marker
        coordinate={{
          latitude,
          longitude,
        }}
        title={deviceId}
        description={lastStatus || 'Device location'}
      />
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 250,
  },
});
