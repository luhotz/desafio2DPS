import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function StarRating({ rating, onRate, size = 24 }) {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map(star => (
        <TouchableOpacity
          key={star}
          onPress={() => onRate && onRate(star)}
          disabled={!onRate}
        >
          <Text style={[styles.star, { fontSize: size, color: star <= rating ? '#FFD700' : '#ccc' }]}>
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row' },
  star: { marginHorizontal: 2 },
});