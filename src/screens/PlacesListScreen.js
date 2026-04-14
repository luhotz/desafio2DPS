import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import PlaceCard from '../components/PlaceCard';
import { loadPlaces } from '../storage/storage';

const TYPE_FILTERS = ['todos', 'edificio', 'salon', 'laboratorio', 'oficina', 'otros'];

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

export default function PlacesListScreen({ navigation }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('todos');
  const [userLocation, setUserLocation] = useState(null);

  // Obtener ubicación del usuario (o debug)
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const debugJson = await AsyncStorage.getItem('@debug_location');
        if (debugJson) {
          setUserLocation(JSON.parse(debugJson));
          return;
        }
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setUserLocation(loc.coords);
      } catch (e) {
        console.log('No se pudo obtener ubicación:', e);
      }
    };
    fetchLocation();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadPlaces().then(data => {
        setPlaces(data);
        setLoading(false);
      });
    }, [])
  );

  // Agregar distancia a cada lugar si hay ubicación
  const placesWithDistance = places.map(p => ({
    ...p,
    distance: userLocation
      ? getDistance(userLocation.latitude, userLocation.longitude, p.latitude, p.longitude)
      : undefined,
  }));

  const filtered = placesWithDistance.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'todos' || p.type === filter;
    return matchSearch && matchFilter;
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#003087" />
        <Text style={styles.loadingText}>Cargando lugares...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="🔍 Buscar lugar..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#999"
      />
      <View style={styles.filterRow}>
        {TYPE_FILTERS.map(t => (
          <Text
            key={t}
            onPress={() => setFilter(t)}
            style={[styles.filterChip, filter === t && styles.filterChipActive]}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </Text>
        ))}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <PlaceCard
            place={item}
            distance={item.distance}
            onPress={() => navigation.navigate('PlaceDetail', { placeId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No se encontraron lugares.</Text>
          </View>
        }
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  loadingText: { marginTop: 10, color: '#003087' },
  searchInput: {
    backgroundColor: '#fff',
    margin: 12,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  filterChip: {
    backgroundColor: '#e0e8f0',
    color: '#003087',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 13,
  },
  filterChipActive: {
    backgroundColor: '#003087',
    color: '#fff',
  },
  emptyText: { color: '#888', fontSize: 16 },
});