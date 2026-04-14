import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_PLACES } from '../data/InitialPlaces';

const PLACES_KEY = '@udb_places';

export async function loadPlaces() {
  try {
    const json = await AsyncStorage.getItem(PLACES_KEY);
    if (json !== null) {
      return JSON.parse(json);
    }
    // Primera vez: guardar datos iniciales
    await AsyncStorage.setItem(PLACES_KEY, JSON.stringify(INITIAL_PLACES));
    return INITIAL_PLACES;
  } catch (e) {
    console.error('Error cargando lugares:', e);
    return INITIAL_PLACES;
  }
}

export async function savePlaces(places) {
  try {
    await AsyncStorage.setItem(PLACES_KEY, JSON.stringify(places));
  } catch (e) {
    console.error('Error guardando lugares:', e);
  }
}

export async function addReviewToPlace(placeId, review) {
  try {
    const places = await loadPlaces();
    const updated = places.map(p => {
      if (p.id === placeId) {
        return { ...p, reviews: [...p.reviews, review] };
      }
      return p;
    });
    await savePlaces(updated);
    return updated;
  } catch (e) {
    console.error('Error agregando reseña:', e);
  }
}

export async function addPhotoToPlace(placeId, photoUri) {
  try {
    const places = await loadPlaces();
    const updated = places.map(p => {
      if (p.id === placeId) {
        return { ...p, photos: [...p.photos, photoUri] };
      }
      return p;
    });
    await savePlaces(updated);
    return updated;
  } catch (e) {
    console.error('Error agregando foto:', e);
  }
}