import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    View
} from 'react-native';
import StarRating from '../components/StarRating';
import { addReviewToPlace } from '../storage/storage';

export default function AddReviewScreen({ route, navigation }) {
  const { placeId } = route.params;
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!author.trim()) return Alert.alert('Campo requerido', 'Por favor ingresa tu nombre.');
    if (!text.trim()) return Alert.alert('Campo requerido', 'Por favor escribe tu reseña.');
    if (rating === 0) return Alert.alert('Calificación requerida', 'Por favor selecciona una calificación.');

    setSaving(true);
    const review = {
      id: `r_${Date.now()}`,
      author: author.trim(),
      text: text.trim(),
      rating,
      date: new Date().toISOString().split('T')[0],
    };
    await addReviewToPlace(placeId, review);
    setSaving(false);
    Alert.alert('¡Listo!', 'Tu reseña fue agregada correctamente.', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.label}>Tu nombre *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Juan Pérez"
            value={author}
            onChangeText={setAuthor}
            maxLength={50}
          />

          <Text style={styles.label}>Calificación *</Text>
          <View style={styles.starsContainer}>
            <StarRating rating={rating} onRate={setRating} size={36} />
            <Text style={styles.ratingLabel}>
              {rating === 0 ? 'Sin calificar' : ['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'][rating]}
            </Text>
          </View>

          <Text style={styles.label}>Tu reseña *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Escribe tu opinión sobre este lugar..."
            value={text}
            onChangeText={setText}
            multiline
            numberOfLines={5}
            maxLength={300}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{text.length}/300</Text>

          <TouchableOpacity
            style={[styles.submitButton, saving && styles.submitDisabled]}
            onPress={handleSubmit}
            disabled={saving}
          >
            {saving
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.submitText}>✅ Publicar Reseña</Text>
            }
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  scroll: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 20, elevation: 2 },
  label: { fontSize: 15, fontWeight: 'bold', color: '#003087', marginTop: 16, marginBottom: 6 },
  input: {
    borderWidth: 1.5,
    borderColor: '#ccd6e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#f8fafc',
  },
  textArea: { height: 120, marginBottom: 4 },
  charCount: { textAlign: 'right', color: '#aaa', fontSize: 12, marginBottom: 8 },
  starsContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  ratingLabel: { marginLeft: 12, fontSize: 14, color: '#555' },
  submitButton: {
    backgroundColor: '#003087',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitDisabled: { backgroundColor: '#90a4ae' },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});