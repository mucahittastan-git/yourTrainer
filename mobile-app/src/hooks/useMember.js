import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../config';

const MEMBER_KEY = 'YOURTRAINER_MEMBER_ID';
const CACHE_KEY = 'YOURTRAINER_MEMBER_DATA';

export const useMember = () => {
  const [memberId, setMemberId] = useState(null);
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStoredMember = async () => {
    try {
      const id = await SecureStore.getItemAsync(MEMBER_KEY);
      const cached = await SecureStore.getItemAsync(CACHE_KEY);
      
      if (id) setMemberId(id);
      if (cached) setMemberData(JSON.parse(cached));
      
      if (id) await refreshData(id);
    } catch (err) {
      console.error('Error loading stored member:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStoredMember();
  }, []);

  const refreshData = useCallback(async (idToFetch = memberId) => {
    if (!idToFetch) return;
    
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/musteriler/${idToFetch}`);
      
      if (!res.ok) {
        throw new Error('Üye bulunamadı veya sunucu hatası');
      }
      
      const data = await res.json();
      setMemberData(data);
      const cacheData = { ...data };
      delete cacheData.foto_url;
      await SecureStore.setItemAsync(CACHE_KEY, JSON.stringify(cacheData));
      
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
      // Fallback to cache is already handled by state
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  const login = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/musteriler/${id}`);
      if (!res.ok) throw new Error('Geçersiz Üye ID');
      
      const data = await res.json();
      const cacheData = { ...data };
      delete cacheData.foto_url;
      await SecureStore.setItemAsync(MEMBER_KEY, id.toString());
      await SecureStore.setItemAsync(CACHE_KEY, JSON.stringify(cacheData));
      
      setMemberId(id.toString());
      setMemberData(data);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(MEMBER_KEY);
    await SecureStore.deleteItemAsync(CACHE_KEY);
    setMemberId(null);
    setMemberData(null);
  };

  const updatePhoto = async (base64String) => {
    try {
      const payload = { foto_url: base64String };
      const res = await fetch(`${API_BASE_URL}/musteriler/${memberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Fotoğraf güncellenemedi');
      
      const updatedData = { ...memberData, foto_url: base64String };
      setMemberData(updatedData);

      // Cache'e kaydederken limiti aşmamak için resmi hariç tut
      const cacheData = { ...updatedData };
      delete cacheData.foto_url;
      await SecureStore.setItemAsync(CACHE_KEY, JSON.stringify(cacheData));

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return { memberId, memberData, loading, error, login, logout, refreshData, updatePhoto };
};
