import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMember } from '../../src/hooks/useMember';
import { Zap, Target, TrendingUp, CheckCircle2, Dumbbell } from 'lucide-react-native';

export default function DashboardScreen() {
  const { memberData, refreshData } = useMember();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  if (!memberData) {
    return <View style={{flex:1, backgroundColor:'#f8fafc'}} />;
  }

  const data = memberData;
  const progress = Math.min(Math.round(((data.alinan_ders_sayisi || 0) / 20) * 100), 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4f46e5" />}
      >
        <View style={styles.header}>
          <View style={styles.avatar}>
            {data.foto_url ? (
              <Image source={{ uri: data.foto_url }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{data.ad?.charAt(0)}</Text>
            )}
          </View>
          <Text style={styles.name}>{data.ad} {data.soyad}</Text>
          <Text style={styles.subtitle}>PERSONAL TRAINING HUB</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.grid}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Zap color="#4f46e5" size={16} />
                <Text style={styles.cardTitle}>DERS SAYISI</Text>
              </View>
              <Text style={styles.cardValue}>{data.alinan_ders_sayisi || 0}</Text>
              <Text style={styles.cardSubValue}>Tamamlanan Seans</Text>
            </View>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Target color="#10b981" size={16} />
                <Text style={[styles.cardTitle, {color: '#10b981'}]}>UYUM SKORU</Text>
              </View>
              <Text style={styles.cardValue}>%94</Text>
              <Text style={[styles.cardSubValue, {color: '#10b981'}]}>Harika Gidiyorsun</Text>
            </View>
          </View>

          <View style={styles.measurementCard}>
            <View style={styles.measurementHeader}>
              <Text style={styles.measurementTitle}>GÜNCEL ÖLÇÜLER</Text>
              <TrendingUp color="#4f46e5" size={20} />
            </View>
            
            <View style={styles.measurementRow}>
              <View style={styles.measurementIcon}>
                 <CheckCircle2 color="#64748b" size={20} />
              </View>
              <View style={styles.measurementInfo}>
                <Text style={styles.measurementLabel}>AĞIRLIK</Text>
                <Text style={styles.measurementVal}>{data.vucut_olculeri?.kilo || '--'} KG</Text>
              </View>
            </View>

            <View style={styles.measurementRow}>
              <View style={styles.measurementIcon}>
                 <Dumbbell color="#64748b" size={20} />
              </View>
              <View style={styles.measurementInfo}>
                <Text style={styles.measurementLabel}>BOY</Text>
                <Text style={styles.measurementVal}>{data.vucut_olculeri?.boy || '--'} CM</Text>
              </View>
            </View>
            
            {(data.vucut_olculeri?.bel || data.vucut_olculeri?.kalca) && (
              <View style={styles.measurementRow}>
                <View style={styles.measurementIcon}>
                   <Target color="#64748b" size={20} />
                </View>
                <View style={styles.measurementInfo}>
                  <Text style={styles.measurementLabel}>BEL / KALÇA</Text>
                  <Text style={styles.measurementVal}>
                    {data.vucut_olculeri?.bel || '--'} / {data.vucut_olculeri?.kalca || '--'} CM
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  container: { flex: 1 },
  header: { alignItems: 'center', padding: 32, backgroundColor: '#4f46e5', borderBottomLeftRadius: 40, borderBottomRightRadius: 40, marginBottom: -40, zIndex: 1 },
  avatar: { width: 80, height: 80, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  avatarImage: { width: 80, height: 80, borderRadius: 24 },
  avatarText: { fontSize: 32, fontWeight: '900', color: '#fff' },
  name: { fontSize: 24, fontWeight: '900', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 10, fontWeight: '900', color: 'rgba(255,255,255,0.7)', letterSpacing: 3, marginBottom: 40 },
  content: { padding: 16, zIndex: 2 },
  grid: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  card: { flex: 1, backgroundColor: '#fff', padding: 20, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  cardTitle: { fontSize: 10, fontWeight: '900', color: '#4f46e5', letterSpacing: 1 },
  cardValue: { fontSize: 32, fontWeight: '900', color: '#0f172a' },
  cardSubValue: { fontSize: 10, fontWeight: '700', color: '#64748b', marginTop: 4, textTransform: 'uppercase' },
  measurementCard: { backgroundColor: '#fff', padding: 24, borderRadius: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2 },
  measurementHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  measurementTitle: { fontSize: 12, fontWeight: '900', color: '#64748b', letterSpacing: 1 },
  measurementRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  measurementIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  measurementInfo: { flex: 1 },
  measurementLabel: { fontSize: 10, fontWeight: '900', color: '#94a3b8', letterSpacing: 1, marginBottom: 2 },
  measurementVal: { fontSize: 16, fontWeight: '900', color: '#0f172a' }
});
