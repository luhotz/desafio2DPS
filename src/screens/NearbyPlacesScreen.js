import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  SafeAreaView, ActivityIndicator, TouchableOpacity
} from 'react-native';
import * as Location from 'expo-location';
import PlaceCard from '../components/PlaceCard';
import { loadPlaces } from '../storage/storage';

// Función para calcular distancia (Haversine)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; 
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function NearbyPlacesScreen({ navigation }) {
  const [places, setPlaces] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tracking, setTracking] = useState(true);
  const subscriptionRef = useRef(null);

  const startTracking = async () => {
    setLoading(true);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permiso de ubicación denegado.');
        setLoading(false);
        return;
      }

      const data = await loadPlaces();

      // Obtener ubicación inicial real
      const initial = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      
      updatePlacesList(initial.coords, data);
      setLoading(false);

      // Iniciar seguimiento en vivo
      subscriptionRef.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 3000, distanceInterval: 2 },
        (newLocation) => { 
          updatePlacesList(newLocation.coords, data); 
        }
      );

    } catch (e) {
      setError('No se pudo obtener tu ubicación.');
      setLoading(false);
    }
  };

  const updatePlacesList = (coords, data) => {
    setLocation(coords);
    const withDistance = data
      .map(p => ({
        ...p,
        distance: getDistance(
          coords.latitude, coords.longitude,
          p.latitude, p.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance);
    setPlaces(withDistance);
  };

  const stopTracking = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
    setTracking(false);
  };

  const resumeTracking = () => {
    setTracking(true);
    startTracking();
  };

  useEffect(() => {
    startTracking();
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
      }
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#003087" />
        <Text style={styles.loadingText}>Obteniendo tu ubicación GPS...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorIcon}>📍</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={startTracking}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const closest = places[0];

  return (
    <SafeAreaView style={styles.container}>

      {/* Banner de ubicación real */}
      {location && (
        <View style={styles.locationBanner}>
          <View style={styles.locationRow}>
            <Text style={styles.locationText}>
              📍 {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
            </Text>
            <View style={[styles.trackingBadge, !tracking && styles.trackingOff]}>
              <Text style={styles.trackingText}>
                {tracking ? '🟢 En vivo' : '🔴 Pausado'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Lugar más cercano destacado */}
      {closest && (
        <View style={styles.closestBanner}>
          <Text style={styles.closestLabel}> Lugar más cercano ahora</Text>
          <Text style={styles.closestName}>{closest.name}</Text>
          <Text style={styles.closestDistance}>
            {closest.distance < 1000
              ? `A ${Math.round(closest.distance)} metros de ti`
              : `A ${(closest.distance / 1000).toFixed(1)} km de ti`}
          </Text>
        </View>
      )}

      {/* Botón de control de rastreo */}
      <TouchableOpacity
        style={[styles.trackingButton, !tracking && styles.trackingButtonOff]}
        onPress={tracking ? stopTracking : resumeTracking}
      >
        <Text style={styles.trackingButtonText}>
          {tracking ? '⏸ Pausar rastreo' : '▶ Reanudar rastreo'}
        </Text>
      </TouchableOpacity>

      {/* Lista de lugares ordenada por cercanía */}
      <FlatList
        data={places}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <PlaceCard
            place={item}
            distance={item.distance}
            onPress={() => navigation.navigate('PlaceDetail', { placeId: item.id })}
          />
        )}
        contentContainerStyle={{ paddingVertical: 8 }}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  loadingText: { marginTop: 12, color: '#003087', fontSize: 15 },
  locationBanner: { backgroundColor: '#003087', padding: 10 },
  locationRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  locationText: { color: '#fff', fontSize: 11 },
  trackingBadge: { backgroundColor: '#1B5E20', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  trackingOff: { backgroundColor: '#B71C1C' },
  trackingText: { color: '#fff', fontSize: 11, fontWeight: '500' },
  closestBanner: {
    backgroundColor: '#1565C0',
    padding: 14,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
  },
  closestLabel: { color: '#90CAF9', fontSize: 12 },
  closestName: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 2 },
  closestDistance: { color: '#BBDEFB', fontSize: 13, marginTop: 4 },
  trackingButton: {
    backgroundColor: '#2E7D32',
    margin: 12,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  trackingButtonOff: { backgroundColor: '#c62828' },
  trackingButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  errorIcon: { fontSize: 48, marginBottom: 12 },
  errorText: { color: '#c62828', fontSize: 15, textAlign: 'center', marginBottom: 16 },
  retryButton: { backgroundColor: '#003087', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});