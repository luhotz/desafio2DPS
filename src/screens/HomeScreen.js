import {
    SafeAreaView, ScrollView,
    StyleSheet,
    Text, TouchableOpacity,
    View
} from 'react-native';

const MENU_ITEMS = [
  { label: 'Ver Todos los Lugares', icon: '🏛️', screen: 'PlacesList', color: '#1565C0' },
  { label: 'Lugares Cercanos (GPS)', icon: '📍', screen: 'NearbyPlaces', color: '#2E7D32' },
  // Al final del MENU_ITEMS array:
];

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🎓</Text>
          <Text style={styles.title}>UDB Guía Campus</Text>
          <Text style={styles.subtitle}>Universidad Don Bosco</Text>
          <Text style={styles.tagline}>Tu guía interactiva del campus universitario</Text>
        </View>

        {/* Menú */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>¿Qué deseas hacer?</Text>
          {MENU_ITEMS.map(item => (
            <TouchableOpacity
              key={item.screen}
              style={[styles.menuButton, { backgroundColor: item.color }]}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.85}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>ℹ️ ¿Cómo usar la app?</Text>
          <Text style={styles.infoText}>• Explora distintos lugares del campus.</Text>
          <Text style={styles.infoText}>• Usa el GPS para ver los lugares más cercanos a ti.</Text>
          <Text style={styles.infoText}>• Agrega fotos y reseñas de los lugares.</Text>
          <Text style={styles.infoText}>• Todo funciona sin conexión a internet.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  scroll: { paddingBottom: 30 },
  header: {
    backgroundColor: '#003087',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  logo: { fontSize: 60 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginTop: 10 },
  subtitle: { fontSize: 16, color: '#90CAF9', marginTop: 4 },
  tagline: { fontSize: 13, color: '#BBDEFB', marginTop: 8, textAlign: 'center' },
  menuContainer: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#003087', marginBottom: 12 },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  menuIcon: { fontSize: 28, marginRight: 14 },
  menuLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: '#fff' },
  menuArrow: { fontSize: 24, color: '#fff', opacity: 0.7 },
  infoBox: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  infoTitle: { fontSize: 15, fontWeight: 'bold', color: '#003087', marginBottom: 8 },
  infoText: { fontSize: 13, color: '#555', marginBottom: 4 },
});