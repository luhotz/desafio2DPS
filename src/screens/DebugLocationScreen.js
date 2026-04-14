import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import {
  Alert, SafeAreaView, ScrollView,
  StyleSheet, Text, TextInput,
  TouchableOpacity, View
} from 'react-native';

const PRESETS = [
  { name: 'Edifico 2 laboratorios', lat: '13.715735348273668', lng: ' -89.1547807257247' },
  { name: 'Edificio 6',          lat: '13.714763221875561', lng: '-89.15530497878191' },
  { name: 'Cafetería UDB',           lat: '13.715138100326055', lng: '-89.15283626933622' },
  { name: 'Entrada por calle de oro',       lat: '13.714616425136573', lng: '-89.15372514503707' },
];

export default function DebugLocationScreen() {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [saved, setSaved] = useState(false);

  const saveLocation = async (latitude, longitude) => {
    await AsyncStorage.setItem('@debug_location', JSON.stringify({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    }));
    setSaved(true);
    Alert.alert('✅ Listo', `Ubicación simulada guardada:\nLat: ${latitude}\nLng: ${longitude}`);
  };

  const clearDebug = async () => {
    await AsyncStorage.removeItem('@debug_location');
    setSaved(false);
    Alert.alert('✅ Eliminado', 'Ya usará GPS real del dispositivo.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>⚠️ SOLO PARA PRUEBAS — Eliminar antes de entregar</Text>
        </View>

        <Text style={styles.sectionTitle}>Presets de ubicación</Text>
        {PRESETS.map((p, i) => (
          <TouchableOpacity
            key={i}
            style={styles.presetButton}
            onPress={() => { setLat(p.lat); setLng(p.lng); saveLocation(p.lat, p.lng); }}
          >
            <Text style={styles.presetName}>{p.name}</Text>
            <Text style={styles.presetCoords}>{p.lat}, {p.lng}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>Coordenadas manuales</Text>
        <Text style={styles.label}>Latitud</Text>
        <TextInput
          style={styles.input}
          value={lat}
          onChangeText={setLat}
          placeholder="Ej: 13.69890"
          keyboardType="numeric"
        />
        <Text style={styles.label}>Longitud</Text>
        <TextInput
          style={styles.input}
          value={lng}
          onChangeText={setLng}
          placeholder="Ej: -89.21340"
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => saveLocation(lat, lng)}
        >
          <Text style={styles.saveText}>💾 Guardar ubicación simulada</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearButton} onPress={clearDebug}>
          <Text style={styles.clearText}>🗑️ Eliminar simulación — usar GPS real</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  scroll: { padding: 16 },
  warningBox: { backgroundColor: '#FFD600', padding: 12, borderRadius: 8, marginBottom: 16 },
  warningText: { color: '#333', fontWeight: 'bold', fontSize: 13, textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#003087', marginBottom: 10, marginTop: 8 },
  presetButton: {
    backgroundColor: '#fff', borderRadius: 10, padding: 14,
    marginBottom: 8, elevation: 1,
    borderLeftWidth: 4, borderLeftColor: '#003087',
  },
  presetName: { fontSize: 14, fontWeight: 'bold', color: '#003087' },
  presetCoords: { fontSize: 12, color: '#888', marginTop: 2 },
  label: { fontSize: 13, color: '#555', marginBottom: 4 },
  input: {
    backgroundColor: '#fff', borderRadius: 8, padding: 12,
    fontSize: 15, marginBottom: 12, borderWidth: 1.5, borderColor: '#ccd6e0',
  },
  saveButton: {
    backgroundColor: '#003087', padding: 14, borderRadius: 10,
    alignItems: 'center', marginBottom: 10,
  },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  clearButton: {
    backgroundColor: '#c62828', padding: 14, borderRadius: 10, alignItems: 'center',
  },
  clearText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});