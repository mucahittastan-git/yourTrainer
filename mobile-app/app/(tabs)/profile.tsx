import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMember } from '../../src/hooks/useMember';
import { router } from 'expo-router';
import { User, LogOut, Info, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export default function ProfileScreen() {
  const { memberData, logout, updatePhoto } = useMember();
  
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Hata', 'Fotoğraf yüklemek için galeri erişimine izin vermelisiniz.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      Alert.alert('Fotoğraf Güncelleniyor', 'Lütfen bekleyin...');
      try {
        const manipResult = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 400, height: 400 } }],
          { compress: 0.3, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );
        
        if (manipResult.base64) {
          const success = await updatePhoto(`data:image/jpeg;base64,${manipResult.base64}`);
          if (success) {
            Alert.alert('Başarılı', 'Profil fotoğrafınız güncellendi.');
          } else {
            Alert.alert('Hata', 'Fotoğraf güncellenirken sunucuya ulaşılamadı.');
          }
        }
      } catch(err) {
        Alert.alert('Hata', 'Resim işlenirken hata oluştu.');
      }
    }
  };

  const handleRemoveImage = () => {
    if (!data?.foto_url) return;
    Alert.alert("Fotoğrafı Sil", "Profil fotoğrafınızı kaldırmak istediğinize emin misiniz?", [
      { text: "İptal", style: "cancel" },
      { text: "Sil", style: "destructive", onPress: () => updatePhoto(null) }
    ]);
  };

  const handleAvatarPress = () => {
    if (data?.foto_url) {
      Alert.alert("Profil Fotoğrafı", "Ne yapmak istersiniz?", [
        { text: "İptal", style: "cancel" },
        { text: "Yeni Ekle", onPress: handlePickImage },
        { text: "Fotoğrafı Sil", style: "destructive", onPress: handleRemoveImage }
      ]);
    } else {
      handlePickImage();
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Çıkış Yap",
      "Uygulamadan çıkmak istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        { 
          text: "Çıkış Yap", 
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace('/');
          }
        }
      ]
    );
  };

  if (!memberData) {
    return <View style={{flex:1, backgroundColor:'#f8fafc'}} />;
  }
  const data = memberData;

  const formatDate = (dateStr) => {
    if (!dateStr) return '--';
    try {
      const date = new Date(dateStr);
      return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>HESABIM</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.profileHeader}>
            <TouchableOpacity onPress={handleAvatarPress} style={styles.avatar}>
              {data.foto_url ? (
                <Image source={{ uri: data.foto_url }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{data.ad?.charAt(0)}</Text>
              )}
              <View style={styles.cameraBadge}>
                <Camera color="#fff" size={12} />
              </View>
            </TouchableOpacity>
            <View>
              <Text style={styles.name}>{data.ad} {data.soyad}</Text>
              <Text style={styles.subtitle}>ID: {data.id}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoCol}>
              <Text style={styles.label}>TELEFON</Text>
              <Text style={styles.value}>{data.telefon || 'Belirtilmemiş'}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.label}>YAŞ</Text>
              <Text style={styles.value}>{data.yas || '--'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoCol}>
              <Text style={styles.label}>BAŞLANGIÇ TARİHİ</Text>
              <Text style={styles.value}>{formatDate(data.ders_baslangic_tarihi)}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut color="#ef4444" size={20} />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Elite Powered by YourTrainer</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  container: { flex: 1, padding: 16 },
  header: { paddingVertical: 24, paddingHorizontal: 8 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#0f172a' },
  card: { backgroundColor: '#fff', padding: 24, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2, marginBottom: 24 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  avatar: { width: 64, height: 64, borderRadius: 20, backgroundColor: '#e0e7ff', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', marginRight: 16 },
  avatarImage: { width: 64, height: 64, borderRadius: 20 },
  avatarText: { fontSize: 24, fontWeight: '900', color: '#4f46e5' },
  cameraBadge: { position: 'absolute', bottom: -6, right: -6, backgroundColor: '#4f46e5', width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  name: { fontSize: 20, fontWeight: '900', color: '#0f172a', marginBottom: 4 },
  subtitle: { fontSize: 12, fontWeight: '700', color: '#94a3b8' },
  infoRow: { flexDirection: 'row', marginBottom: 24 },
  infoCol: { flex: 1 },
  label: { fontSize: 10, fontWeight: '900', color: '#94a3b8', letterSpacing: 1, marginBottom: 4 },
  value: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, backgroundColor: '#fef2f2', borderRadius: 16, gap: 8 },
  logoutText: { color: '#ef4444', fontSize: 16, fontWeight: '800' },
  footer: { marginTop: 40, alignItems: 'center' },
  footerText: { fontSize: 10, fontWeight: '900', color: '#cbd5e1', letterSpacing: 1, textTransform: 'uppercase' }
});
