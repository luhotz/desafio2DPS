import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import StarRating from '../components/StarRating';
import { addPhotoToPlace, loadPlaces } from '../storage/storage';

const TYPE_LABELS = {
  edificio: 'Edificio',
  salon: 'Salón',
  laboratorio: 'Laboratorio',
  oficina: 'Oficina',
};

function getAverageRating(reviews) {
  if (!reviews || reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
}

// Función auxiliar para calcular distancia offline (Haversine)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Radio de la tierra en metros
  const phi1 = lat1 * Math.PI / 180;
  const phi2 = lat2 * Math.PI / 180;
  const dPhi = (lat2 - lat1) * Math.PI / 180;
  const dLambda = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(dPhi / 2) * Math.sin(dPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(dLambda / 2) * Math.sin(dLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distancia en metros
}

export default function PlaceDetailScreen({ route, navigation }) {
  const { placeId } = route.params;
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [magnetometer, setMagnetometer] = useState(0);
  const [userLocation, setUserLocation] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadPlaces().then((places) => {
        const found = places.find((p) => p.id === placeId);
        setPlace(found);
        setLoading(false);
      });
    }, [placeId])
  );

  useEffect(() => {
    let subscription;
    const subscribe = async () => {
      subscription = Magnetometer.addListener(data => {
        let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
        if (angle < 0) angle += 360;
        setMagnetometer(Math.round(angle));
      });
      Magnetometer.setUpdateInterval(100);
    };
    subscribe();
    return () => subscription && subscription.remove();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      
      // Suscribirse a cambios de ubicación para que la distancia sea fluida
      const locationSub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 1 },
        (loc) => setUserLocation(loc.coords)
      );
      
      return () => locationSub.remove();
    })();
  }, []);

  const handleAddPhoto = async () => {
    Alert.alert('Agregar Foto', 'Elige una opción', [
      {
        text: 'Cámara',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') return Alert.alert('Permiso denegado');
          const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
          if (!result.canceled && result.assets[0]) {
            const updated = await addPhotoToPlace(placeId, result.assets[0].uri);
            const updatedPlace = updated.find((p) => p.id === placeId);
            setPlace({ ...updatedPlace });
          }
        },
      },
      {
        text: 'Galería',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') return Alert.alert('Permiso denegado');
          const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
          if (!result.canceled && result.assets[0]) {
            const updated = await addPhotoToPlace(placeId, result.assets[0].uri);
            const updatedPlace = updated.find((p) => p.id === placeId);
            setPlace({ ...updatedPlace });
          }
        },
      },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const getNavigationData = () => {
    if (!userLocation || !place) return { direction: "Esperando GPS...", distance: "--" };

    // 1. Cálculo de Rumbo (Bearing)
    const lat1 = userLocation.latitude * Math.PI / 180;
    const lon1 = userLocation.longitude * Math.PI / 180;
    const lat2 = place.latitude * Math.PI / 180;
    const lon2 = place.longitude * Math.PI / 180;

    const dLon = lon2 - lon1;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    let bearing = (Math.atan2(y, x) * (180 / Math.PI) + 360) % 360;

    // 2. Cálculo de Distancia
    const distance = calculateDistance(userLocation.latitude, userLocation.longitude, place.latitude, place.longitude);

    // 3. Dirección relativa
    let relativeAngle = (bearing - magnetometer + 360) % 360;
    let arrow = "";
    if (relativeAngle > 337.5 || relativeAngle <= 22.5) arrow = "⬆️ Sigue recto";
    else if (relativeAngle > 22.5 && relativeAngle <= 67.5) arrow = "↗️ Leve a la derecha";
    else if (relativeAngle > 67.5 && relativeAngle <= 112.5) arrow = "➡️ Gira a la derecha";
    else if (relativeAngle > 112.5 && relativeAngle <= 247.5) arrow = "⬇️ Está detrás de ti";
    else if (relativeAngle > 247.5 && relativeAngle <= 292.5) arrow = "⬅️ Gira a la izquierda";
    else if (relativeAngle > 292.5 && relativeAngle <= 337.5) arrow = "↖️ Leve a la izquierda";

    return { 
      direction: arrow, 
      distance: distance < 1000 ? `${Math.round(distance)} m` : `${(distance/1000).toFixed(2)} km` 
    };
  };

  if (loading || !place) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#003087" />
      </View>
    );
  }

  const nav = getNavigationData();
  const avgRating = getAverageRating(place.reviews);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Fotos */}
        {place.photos.length > 0 ? (
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.photoScroll}>
            {place.photos.map((uri, i) => (
              <Image key={`${uri}_${i}`} source={{ uri }} style={styles.photo} resizeMode="cover" />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoPlaceholderText}>📷</Text>
            <Text style={styles.photoPlaceholderLabel}>Sin fotos aún</Text>
          </View>
        )}

        <TouchableOpacity style={styles.addPhotoButton} onPress={handleAddPhoto}>
          <Text style={styles.addPhotoText}>📷 Agregar Foto</Text>
        </TouchableOpacity>

        {/* Info */}
        <View style={styles.infoSection}>
          <Text style={styles.name}>{place.name}</Text>
          <Text style={styles.type}>{TYPE_LABELS[place.type] || place.type}</Text>
          <View style={styles.ratingRow}>
            <StarRating rating={Math.round(avgRating)} size={22} />
            <Text style={styles.ratingText}>
              {avgRating.toFixed(1)} ({place.reviews.length} reseñas)
            </Text>
          </View>
          <Text style={styles.description}>{place.description}</Text>
        </View>

        {/* BRÚJULA CON DISTANCIA */}
        <View style={styles.compassSection}>
          <Text style={styles.sectionTitle}>🧭 Navegación Offline</Text>
          <View style={styles.compassCard}>
            <Text style={styles.distanceBadge}>{nav.distance}</Text>
            <Text style={styles.directionText}>{nav.direction}</Text>
            <Text style={styles.compassSubtext}>Apunta con tu teléfono para orientarte</Text>
          </View>
          <Text style={styles.offlineTag}>GPS SATELITAL ACTIVO • SIN CONEXIÓN</Text>
        </View>

        {/* Reseñas */}
        <View style={styles.reviewsSection}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.reviewsTitle}>Reseñas</Text>
            <TouchableOpacity
              style={styles.addReviewButton}
              onPress={() => navigation.navigate('AddReview', { placeId: place.id })}
            >
              <Text style={styles.addReviewText}>+ Agregar</Text>
            </TouchableOpacity>
          </View>
          {place.reviews.length === 0 ? (
            <Text style={styles.noReviews}>Sé el primero en dejar una reseña.</Text>
          ) : (
            place.reviews.map((r) => (
              <View key={r.id} style={styles.reviewCard}>
                <View style={styles.reviewTop}>
                  <Text style={styles.reviewAuthor}>{r.author}</Text>
                  <StarRating rating={r.rating || 0} size={14} />
                </View>
                <Text style={styles.reviewText}>{r.text}</Text>
                <Text style={styles.reviewDate}>{r.date}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  photoScroll: { height: 260, backgroundColor: '#000' },
  photo: { width: 400, height: 260 },
  photoPlaceholder: { height: 260, backgroundColor: '#dbe8f5', alignItems: 'center', justifyContent: 'center' },
  photoPlaceholderText: { fontSize: 52 },
  photoPlaceholderLabel: { color: '#888', marginTop: 8 },
  addPhotoButton: { backgroundColor: '#1565C0', margin: 16, padding: 12, borderRadius: 10, alignItems: 'center' },
  addPhotoText: { color: '#fff', fontWeight: 'bold' },
  infoSection: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 16, borderRadius: 12, padding: 16, elevation: 2 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#003087' },
  type: { fontSize: 14, color: '#666', marginTop: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  ratingText: { marginLeft: 8, color: '#555', fontSize: 14 },
  description: { fontSize: 15, color: '#333', marginTop: 12, lineHeight: 22 },
  compassSection: { marginHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#003087', marginBottom: 10 },
  compassCard: { backgroundColor: '#003087', borderRadius: 15, padding: 20, alignItems: 'center', elevation: 4 },
  distanceBadge: { backgroundColor: '#FFD700', color: '#003087', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, fontWeight: 'bold', fontSize: 16, marginBottom: 10 },
  directionText: { fontSize: 22, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  compassSubtext: { color: '#bcd0f5', fontSize: 11, marginTop: 10, textAlign: 'center' },
  offlineTag: { fontSize: 9, color: '#aaa', marginTop: 8, textAlign: 'center', fontWeight: 'bold', letterSpacing: 1 },
  reviewsSection: { margin: 16, marginTop: 0 },
  reviewsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  reviewsTitle: { fontSize: 18, fontWeight: 'bold', color: '#003087' },
  addReviewButton: { backgroundColor: '#003087', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  addReviewText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  reviewCard: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 10, elevation: 1 },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewAuthor: { fontWeight: 'bold', color: '#003087' },
  reviewText: { color: '#333', marginTop: 6 },
  reviewDate: { color: '#aaa', fontSize: 11, marginTop: 4 },
  noReviews: { color: '#888', textAlign: 'center', marginTop: 10 },
});