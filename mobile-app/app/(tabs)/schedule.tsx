import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMember } from '../../src/hooks/useMember';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react-native';

export default function ScheduleScreen() {
  const { memberData } = useMember();
  if (!memberData) {
    return <View style={{flex:1, backgroundColor:'#f8fafc'}} />;
  }

  const data = memberData;
  const days = data.haftalik_ders_gunleri || [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>PROGRAM & TAKVİM</Text>
          <Text style={styles.headerSubtitle}>Ders günlerinizi buradan takip edebilirsiniz</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Calendar color="#4f46e5" size={20} />
              <Text style={styles.cardTitle}>HAFTALIK DERS GÜNLERİ</Text>
            </View>
            
            {days.length > 0 ? (
              days.map((day, idx) => (
                <View key={idx} style={styles.dayRow}>
                  <View style={styles.dayIcon}>
                    <CheckCircle2 color="#10b981" size={16} />
                  </View>
                  <Text style={styles.dayText}>{day}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Henüz ders günü planlanmamış.</Text>
            )}
          </View>

          <View style={styles.summaryCard}>
             <View style={styles.summaryRow}>
               <View>
                 <Text style={styles.summaryLabel}>TOPLAM DERS</Text>
                 <Text style={styles.summaryValue}>{data.toplam_ders_sayisi || 0}</Text>
               </View>
               <View style={styles.divider} />
               <View>
                 <Text style={styles.summaryLabel}>ALINAN DERS</Text>
                 <Text style={styles.summaryValue}>{data.alinan_ders_sayisi || 0}</Text>
               </View>
               <View style={styles.divider} />
               <View>
                 <Text style={styles.summaryLabel}>KALAN DERS</Text>
                 <Text style={[styles.summaryValue, { color: '#4f46e5' }]}>
                   {Math.max(0, (data.toplam_ders_sayisi || 0) - (data.alinan_ders_sayisi || 0))}
                 </Text>
               </View>
             </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  container: { flex: 1 },
  header: { padding: 24, paddingTop: 32 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#0f172a', marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: '#64748b', fontWeight: '500' },
  content: { padding: 16 },
  card: { backgroundColor: '#fff', padding: 24, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  cardTitle: { fontSize: 12, fontWeight: '900', color: '#4f46e5', letterSpacing: 1 },
  dayRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  dayIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#ecfdf5', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  dayText: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  emptyText: { color: '#94a3b8', fontStyle: 'italic', marginTop: 8 },
  summaryCard: { backgroundColor: '#fff', padding: 24, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 10, fontWeight: '900', color: '#94a3b8', letterSpacing: 1, marginBottom: 4 },
  summaryValue: { fontSize: 24, fontWeight: '900', color: '#0f172a' },
  divider: { width: 1, height: 40, backgroundColor: '#f1f5f9' }
});
