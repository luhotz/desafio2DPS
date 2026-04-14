import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import StarRating from './StarRating';

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

export default function PlaceCard({ place, onPress, distance }) {
  const avgRating = getAverageRating(place.reviews);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {place.photos && place.photos.length > 0 ? (
        <Image source={{ uri: place.photos[0] }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>📍</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{place.name}</Text>
        <Text style={styles.type}>{TYPE_LABELS[place.type] || place.type}</Text>
        <Text style={styles.description} numberOfLines={2}>{place.description}</Text>
        <View style={styles.footer}>
          <StarRating rating={Math.round(avgRating)} size={16} />
          <Text style={styles.reviews}>({place.reviews.length} reseñas)</Text>
          {distance !== undefined && (
            <Text style={styles.distance}>📍 {distance < 1000
              ? `${Math.round(distance)} m`
              : `${(distance / 1000).toFixed(1)} km`}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  image: { width: 100, height: 100 },
  imagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#e8eef7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: { fontSize: 36 },
  info: { flex: 1, padding: 12 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#003087' },
  type: { fontSize: 12, color: '#666', marginTop: 2 },
  description: { fontSize: 13, color: '#444', marginTop: 4 },
  footer: { flexDirection: 'row', alignItems: 'center', marginTop: 6, flexWrap: 'wrap' },
  reviews: { fontSize: 12, color: '#888', marginLeft: 4 },
  distance: { fontSize: 12, color: '#003087', fontWeight: 'bold', marginLeft: 8 },
});