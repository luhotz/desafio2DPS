import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import StarRating from '../components/StarRating';
import { addPhotoToPlace, loadPlaces } from '../storage/storage';

const TYPE_LABELS = {
  edificio: '🏢 Edificio',
  salon: '🎓 Salón',
  laboratorio: '🔬 Laboratorio',
  oficina: '🏛️ Oficina',
};

function getAverageRating(reviews) {
  if (!reviews || reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
}

export default function PlaceDetailScreen({ route, navigation }) {
  const { placeId } = route.params;
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadPlaces().then((places) => {
        const found = places.find((p) => p.id === placeId);
        setPlace(found);
        setLoading(false);
      });
    }, [placeId])
  );

const handleAddPhoto = async () => {
  Alert.alert('Agregar Foto', 'Elige una opción', [
    {
      text: 'Cámara',
      onPress: async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') return Alert.alert('Permiso denegado');
        const result = await ImagePicker.launchCameraAsync({ 
          quality: 0.7,
          
        });
        if (!result.canceled && result.assets[0]) {
          const updated = await addPhotoToPlace(placeId, result.assets[0].uri);
          const updatedPlace = updated.find((p) => p.id === placeId);
          setPlace({ ...updatedPlace }); // forzar re-render con spread
        }
      },
    },
    {
      text: 'Galería',
      onPress: async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') return Alert.alert('Permiso denegado');
        const result = await ImagePicker.launchImageLibraryAsync({ 
          quality: 0.7,
  
        });
        if (!result.canceled && result.assets[0]) {
          const updated = await addPhotoToPlace(placeId, result.assets[0].uri);
          const updatedPlace = updated.find((p) => p.id === placeId);
          setPlace({ ...updatedPlace }); // forzar re-render con spread
        }
      },
    },
    { text: 'Cancelar', style: 'cancel' },
  ]);
};

  const handleOpenGoogleMaps = async () => {
    if (!place) return;

    const url = `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('No fue posible abrir Google Maps.');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir la ubicación en Google Maps.');
    }
  };

  if (loading || !place) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#003087" />
      </View>
    );
  }

  const avgRating = getAverageRating(place.reviews);
  const region = {
    latitude: place.latitude,
    longitude: place.longitude,
    latitudeDelta: 0.0015,
    longitudeDelta: 0.0015,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
{place.photos.length > 0 ? (
  <ScrollView 
    horizontal 
    pagingEnabled 
    showsHorizontalScrollIndicator={false}
    style={styles.photoScroll}
  >
    {place.photos.map((uri, i) => (
      <Image 
        key={`${uri}_${i}`}
        source={{ uri }} 
        style={styles.photo}
        resizeMode="cover"
        onError={() => console.log('Error cargando imagen:', uri)}
      />
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
          <View style={styles.coordsBox}>
            <Text style={styles.coordsText}>🌐 Lat: {place.latitude.toFixed(6)}</Text>
            <Text style={styles.coordsText}>🌐 Lng: {place.longitude.toFixed(6)}</Text>
          </View>
        </View>

        <View style={styles.mapSection}>
          <Text style={styles.mapTitle}>Ubicación en el mapa</Text>
          <MapView
            style={styles.map}
            initialRegion={region}
            region={region}
            scrollEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            toolbarEnabled
          >
            <Marker
              coordinate={{
                latitude: place.latitude,
                longitude: place.longitude,
              }}
              title={place.name}
              description={place.description}
            />
          </MapView>

          <TouchableOpacity style={styles.googleMapsButton} onPress={handleOpenGoogleMaps}>
            <Text style={styles.googleMapsButtonText}>📍 Ver ubicación exacta en Google Maps</Text>
          </TouchableOpacity>
        </View>

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
  photoScroll: {   height: 260, 
  backgroundColor: '#000' },
  photo: {  width: 360,
  height: 260, 
  resizeMode: 'cover'  },
  photoPlaceholder: {
   height: 260,
  backgroundColor: '#dbe8f5',
  alignItems: 'center',
  justifyContent: 'center',
  },
  photoPlaceholderText: { fontSize: 52 },
  photoPlaceholderLabel: { color: '#888', marginTop: 8 },
  addPhotoButton: {
    backgroundColor: '#1565C0',
    margin: 16,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  addPhotoText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  infoSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  name: { fontSize: 22, fontWeight: 'bold', color: '#003087' },
  type: { fontSize: 14, color: '#666', marginTop: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  ratingText: { marginLeft: 8, color: '#555', fontSize: 14 },
  description: { fontSize: 15, color: '#333', marginTop: 12, lineHeight: 22 },
  coordsBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    backgroundColor: '#f0f4f8',
    padding: 8,
    borderRadius: 8,
  },
  coordsText: { fontSize: 12, color: '#555' },
  mapSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003087',
    marginBottom: 12,
  },
  map: {
    width: '100%',
    height: 240,
    borderRadius: 12,
  },
  googleMapsButton: {
    backgroundColor: '#0F9D58',
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  googleMapsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  reviewsSection: { margin: 16, marginTop: 0 },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewsTitle: { fontSize: 18, fontWeight: 'bold', color: '#003087' },
  addReviewButton: {
    backgroundColor: '#003087',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addReviewText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  noReviews: { color: '#888', textAlign: 'center', marginTop: 10 },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
  },
  reviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewAuthor: { fontWeight: 'bold', color: '#003087', fontSize: 14 },
  reviewText: { color: '#333', marginTop: 6, fontSize: 14 },
  reviewDate: { color: '#aaa', fontSize: 11, marginTop: 4 },
});
