import { createStackNavigator } from '@react-navigation/stack';

import AddReviewScreen from '../screens/AddReviewScreen';
import HomeScreen from '../screens/HomeScreen.js';
import NearbyPlacesScreen from '../screens/NearbyPlacesScreen';
import PlaceDetailScreen from '../screens/PlaceDetailScreen';
import PlacesListScreen from '../screens/PlacesListScreen';
import DebugLocationScreen from '../screens/DebugLocationScreen';

const Stack = createStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: '#003087' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: 'bold' },
};

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'UDB Guía Campus' }} />
      <Stack.Screen name="PlacesList" component={PlacesListScreen} options={{ title: 'Lugares del Campus' }} />
      <Stack.Screen name="NearbyPlaces" component={NearbyPlacesScreen} options={{ title: 'Lugares Cercanos' }} />
      <Stack.Screen name="PlaceDetail" component={PlaceDetailScreen} options={{ title: 'Detalle del Lugar' }} />
      <Stack.Screen name="AddReview" component={AddReviewScreen} options={{ title: 'Agregar Reseña' }} />
      <Stack.Screen name="Debug" component={DebugLocationScreen} options={{ title: '🧪 Simular Ubicación' }} />
    </Stack.Navigator>
  );
}