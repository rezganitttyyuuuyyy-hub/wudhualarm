import { Platform } from 'react-native';
import * as Location from 'expo-location';
import type { UserLocation } from './types';

interface IpGeoResult {
  lat: number;
  lng: number;
  city: string;
  country: string;
}

async function ipGeolocate(): Promise<IpGeoResult | null> {
  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(8000) });
    if (res.ok) {
      const d = await res.json();
      if (d.latitude && d.longitude) {
        return { lat: d.latitude, lng: d.longitude, city: d.city || 'Unknown', country: d.country_name || 'Unknown' };
      }
    }
  } catch {}

  try {
    const res = await fetch('https://ip-api.com/json/?fields=lat,lon,city,country,status', { signal: AbortSignal.timeout(8000) });
    if (res.ok) {
      const d = await res.json();
      if (d.status === 'success' && d.lat && d.lon) {
        return { lat: d.lat, lng: d.lon, city: d.city || 'Unknown', country: d.country || 'Unknown' };
      }
    }
  } catch {}

  return null;
}

async function browserGeolocate(): Promise<{ lat: number; lng: number } | null> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) return null;
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
}

async function reverseGeocodeWeb(lat: number, lng: number): Promise<{ city: string; country: string }> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&accept-language=en`,
      { headers: { 'User-Agent': 'WudhuAlarm/1.0' } }
    );
    if (!res.ok) return { city: 'Unknown', country: 'Unknown' };
    const data = await res.json();
    const addr = data.address ?? {};
    return {
      city: addr.city || addr.town || addr.village || addr.county || addr.state || 'Unknown',
      country: addr.country || 'Unknown',
    };
  } catch {
    return { city: 'Unknown', country: 'Unknown' };
  }
}

export async function detectUserLocation(): Promise<UserLocation | null> {
  if (Platform.OS === 'web') {
    // IP geolocation works everywhere including sandboxed iframes
    const ipResult = await ipGeolocate();
    if (ipResult) {
      return { lat: ipResult.lat, lng: ipResult.lng, city: ipResult.city, country: ipResult.country };
    }

    // Fallback: browser geolocation + reverse geocode
    const coords = await browserGeolocate();
    if (coords) {
      const place = await reverseGeocodeWeb(coords.lat, coords.lng);
      return { lat: coords.lat, lng: coords.lng, city: place.city, country: place.country };
    }

    return null;
  }

  // Native: use expo-location
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return null;
    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    const results = await Location.reverseGeocodeAsync({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
    const r = results[0];
    return {
      lat: loc.coords.latitude,
      lng: loc.coords.longitude,
      city: r?.city || r?.subregion || r?.region || 'Unknown',
      country: r?.country || 'Unknown',
    };
  } catch {
    return null;
  }
}
