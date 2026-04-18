import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Lock } from 'lucide-react-native';
import { useMember } from '../src/hooks/useMember';

export default function LoginScreen() {
  const [inputId, setInputId] = useState('');
  const { memberId, memberData, loading, login, refreshData } = useMember();

  useFocusEffect(
    useCallback(() => {
      // Ekran her odaklandığında login durumunu kontrol et
      // Ancak SecureStore'dan veri sıfırlandıysa (çıkış yapıldıysa) yönlendirme yapma
      const checkStored = async () => {
        const id = await require('expo-secure-store').getItemAsync('YOURTRAINER_MEMBER_ID');
        if (id && memberData && !loading) {
          router.replace('/(tabs)');
        }
      };
      checkStored();
    }, [memberId, memberData, loading])
  );

  const handleLogin = async () => {
    if (!inputId.trim()) {
      Alert.alert('Hata', 'Lütfen üye kodunuzu girin');
      return;
    }
    
    const success = await login(inputId.trim());
    if (success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Hata', 'Kayıt bulunamadı. Lütfen antrenörünüzden doğru kod alın.');
    }
  };

  if (loading && !memberId) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  // Prevent flash while redirecting
  if (memberId && memberData) return null;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            <View style={styles.iconContainer}>
              <Lock color="#4f46e5" size={48} />
            </View>
            <Text style={styles.title}>YourTrainer</Text>
            <Text style={styles.subtitle}>Giriş yapmak için antrenörünüzden aldığınız Üye Kodunu girin.</Text>
            
            <View style={styles.form}>
              <Text style={styles.label}>Üye Kodu</Text>
              <TextInput
                style={styles.input}
                placeholder="Örn: 1709456782"
                value={inputId}
                onChangeText={setInputId}
                keyboardType="number-pad"
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              
              <TouchableOpacity 
                style={styles.button} 
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Giriş Yap</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  iconContainer: {
    width: 96, height: 96, borderRadius: 32, backgroundColor: '#e0e7ff',
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 24
  },
  title: { fontSize: 32, fontWeight: '900', color: '#0f172a', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#64748b', textAlign: 'center', marginBottom: 48, lineHeight: 24 },
  form: { backgroundColor: '#fff', padding: 24, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2 },
  label: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', color: '#64748b', marginBottom: 8, letterSpacing: 1 },
  input: { backgroundColor: '#f1f5f9', padding: 16, borderRadius: 12, fontSize: 16, fontWeight: '600', color: '#0f172a', marginBottom: 24 },
  button: { backgroundColor: '#4f46e5', padding: 18, borderRadius: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '800' }
});
