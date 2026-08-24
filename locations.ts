// Country and city data with coordinates for prayer time lookup
// Cities are major urban centers per country; coordinates are approximate city centers

export interface CountryCity {
  country: string;
  cities: { name: string; lat: number; lng: number }[];
}

export const COUNTRIES: CountryCity[] = [
  { country: 'Saudi Arabia', cities: [
    { name: 'Mecca', lat: 21.3891, lng: 39.8579 },
    { name: 'Medina', lat: 24.5247, lng: 39.5692 },
    { name: 'Riyadh', lat: 24.7136, lng: 46.6753 },
    { name: 'Jeddah', lat: 21.485, lng: 39.1925 },
    { name: 'Dammam', lat: 26.4207, lng: 50.0888 },
  ]},
  { country: 'Egypt', cities: [
    { name: 'Cairo', lat: 30.0444, lng: 31.2357 },
    { name: 'Alexandria', lat: 31.2001, lng: 29.9187 },
    { name: 'Giza', lat: 30.0131, lng: 31.2089 },
    { name: 'Luxor', lat: 25.6872, lng: 32.6396 },
    { name: 'Aswan', lat: 24.0889, lng: 32.8998 },
  ]},
  { country: 'Turkey', cities: [
    { name: 'Istanbul', lat: 41.0082, lng: 28.9784 },
    { name: 'Ankara', lat: 39.9334, lng: 32.8597 },
    { name: 'Izmir', lat: 38.4237, lng: 27.1428 },
    { name: 'Bursa', lat: 40.1828, lng: 29.0665 },
    { name: 'Antalya', lat: 36.8969, lng: 30.7133 },
  ]},
  { country: 'United Arab Emirates', cities: [
    { name: 'Dubai', lat: 25.2048, lng: 55.2708 },
    { name: 'Abu Dhabi', lat: 24.4539, lng: 54.3773 },
    { name: 'Sharjah', lat: 25.3463, lng: 55.4209 },
    { name: 'Al Ain', lat: 24.2075, lng: 55.6884 },
  ]},
  { country: 'Qatar', cities: [
    { name: 'Doha', lat: 25.2854, lng: 51.531 },
    { name: 'Al Rayyan', lat: 25.2919, lng: 51.4244 },
    { name: 'Al Wakrah', lat: 25.1753, lng: 51.6034 },
  ]},
  { country: 'Kuwait', cities: [
    { name: 'Kuwait City', lat: 29.3759, lng: 47.9774 },
    { name: 'Hawalli', lat: 29.3324, lng: 48.0289 },
    { name: 'Salmiya', lat: 29.3394, lng: 48.0774 },
  ]},
  { country: 'Bahrain', cities: [
    { name: 'Manama', lat: 26.2285, lng: 50.586 },
    { name: 'Riffa', lat: 26.1335, lng: 50.5524 },
    { name: 'Muharraq', lat: 26.2572, lng: 50.6117 },
  ]},
  { country: 'Oman', cities: [
    { name: 'Muscat', lat: 23.588, lng: 58.3829 },
    { name: 'Salalah', lat: 17.0151, lng: 54.0924 },
    { name: 'Sohar', lat: 24.3472, lng: 56.7083 },
  ]},
  { country: 'Jordan', cities: [
    { name: 'Amman', lat: 31.9454, lng: 35.9284 },
    { name: 'Zarqa', lat: 32.0728, lng: 36.0876 },
    { name: 'Irbid', lat: 32.5556, lng: 35.85 },
  ]},
  { country: 'Palestine', cities: [
    { name: 'Jerusalem', lat: 31.7683, lng: 35.2137 },
    { name: 'Gaza', lat: 31.5017, lng: 34.4668 },
    { name: 'Hebron', lat: 31.5325, lng: 35.0998 },
    { name: 'Nablus', lat: 32.2074, lng: 35.2879 },
  ]},
  { country: 'Lebanon', cities: [
    { name: 'Beirut', lat: 33.8938, lng: 35.5018 },
    { name: 'Tripoli', lat: 34.4367, lng: 35.8497 },
    { name: 'Sidon', lat: 33.5571, lng: 35.3729 },
  ]},
  { country: 'Syria', cities: [
    { name: 'Damascus', lat: 33.5138, lng: 36.2765 },
    { name: 'Aleppo', lat: 36.2021, lng: 37.1343 },
    { name: 'Homs', lat: 34.7304, lng: 36.7136 },
  ]},
  { country: 'Iraq', cities: [
    { name: 'Baghdad', lat: 33.3152, lng: 44.3661 },
    { name: 'Basra', lat: 30.5085, lng: 47.7804 },
    { name: 'Mosul', lat: 36.345, lng: 43.145 },
  ]},
  { country: 'Yemen', cities: [
    { name: 'Sanaa', lat: 15.3694, lng: 44.191 },
    { name: 'Aden', lat: 12.7792, lng: 45.0367 },
  ]},
  { country: 'Sudan', cities: [
    { name: 'Khartoum', lat: 15.5007, lng: 32.5599 },
    { name: 'Omdurman', lat: 15.6444, lng: 32.4778 },
  ]},
  { country: 'Libya', cities: [
    { name: 'Tripoli', lat: 32.8872, lng: 13.1913 },
    { name: 'Benghazi', lat: 32.1283, lng: 20.0683 },
  ]},
  { country: 'Tunisia', cities: [
    { name: 'Tunis', lat: 36.8065, lng: 10.1815 },
    { name: 'Sfax', lat: 34.7406, lng: 10.7604 },
    { name: 'Sousse', lat: 35.8256, lng: 10.6411 },
  ]},
  { country: 'Algeria', cities: [
    { name: 'Algiers', lat: 36.7538, lng: 3.0588 },
    { name: 'Oran', lat: 35.6976, lng: -0.6337 },
    { name: 'Constantine', lat: 36.365, lng: 6.6147 },
  ]},
  { country: 'Morocco', cities: [
    { name: 'Casablanca', lat: 33.5731, lng: -7.5898 },
    { name: 'Rabat', lat: 34.0209, lng: -6.8416 },
    { name: 'Marrakesh', lat: 31.6295, lng: -7.9811 },
    { name: 'Fes', lat: 34.0181, lng: -5.0078 },
  ]},
  { country: 'Mauritania', cities: [
    { name: 'Nouakchott', lat: 18.0735, lng: -15.9582 },
  ]},
  { country: 'Pakistan', cities: [
    { name: 'Karachi', lat: 24.8607, lng: 67.0011 },
    { name: 'Lahore', lat: 31.5204, lng: 74.3587 },
    { name: 'Islamabad', lat: 33.6844, lng: 73.0479 },
    { name: 'Faisalabad', lat: 31.4504, lng: 73.135 },
    { name: 'Peshawar', lat: 34.0151, lng: 71.5249 },
  ]},
  { country: 'India', cities: [
    { name: 'New Delhi', lat: 28.6139, lng: 77.209 },
    { name: 'Mumbai', lat: 19.076, lng: 72.8777 },
    { name: 'Hyderabad', lat: 17.385, lng: 78.4867 },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
    { name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
  ]},
  { country: 'Bangladesh', cities: [
    { name: 'Dhaka', lat: 23.8103, lng: 90.4125 },
    { name: 'Chittagong', lat: 22.3569, lng: 91.7832 },
    { name: 'Sylhet', lat: 24.8949, lng: 91.8687 },
  ]},
  { country: 'Indonesia', cities: [
    { name: 'Jakarta', lat: -6.2088, lng: 106.8456 },
    { name: 'Surabaya', lat: -7.2575, lng: 112.7521 },
    { name: 'Bandung', lat: -6.9175, lng: 107.6191 },
    { name: 'Medan', lat: 3.5952, lng: 98.6722 },
    { name: 'Makassar', lat: -5.1477, lng: 119.4327 },
  ]},
  { country: 'Malaysia', cities: [
    { name: 'Kuala Lumpur', lat: 3.139, lng: 101.6869 },
    { name: 'Penang', lat: 5.4141, lng: 100.3288 },
    { name: 'Johor Bahru', lat: 1.4927, lng: 103.7414 },
  ]},
  { country: 'Brunei', cities: [
    { name: 'Bandar Seri Begawan', lat: 4.9031, lng: 114.9398 },
  ]},
  { country: 'Afghanistan', cities: [
    { name: 'Kabul', lat: 34.5553, lng: 69.2075 },
    { name: 'Kandahar', lat: 31.61, lng: 65.7 },
    { name: 'Herat', lat: 34.343, lng: 62.1991 },
  ]},
  { country: 'Iran', cities: [
    { name: 'Tehran', lat: 35.6892, lng: 51.389 },
    { name: 'Mashhad', lat: 36.2605, lng: 59.6168 },
    { name: 'Isfahan', lat: 32.6539, lng: 51.666 },
  ]},
  { country: 'Nigeria', cities: [
    { name: 'Lagos', lat: 6.5244, lng: 3.3792 },
    { name: 'Abuja', lat: 9.0765, lng: 7.3986 },
    { name: 'Kano', lat: 12.0022, lng: 8.592 },
  ]},
  { country: 'Senegal', cities: [
    { name: 'Dakar', lat: 14.7167, lng: -17.4677 },
  ]},
  { country: 'Mali', cities: [
    { name: 'Bamako', lat: 12.6392, lng: -8.0029 },
  ]},
  { country: 'Niger', cities: [
    { name: 'Niamey', lat: 13.5117, lng: 2.1251 },
  ]},
  { country: 'Chad', cities: [
    { name: 'N\'Djamena', lat: 12.1348, lng: 15.0557 },
  ]},
  { country: 'Somalia', cities: [
    { name: 'Mogadishu', lat: 2.0469, lng: 45.3182 },
    { name: 'Hargeisa', lat: 9.5604, lng: 44.0656 },
  ]},
  { country: 'Djibouti', cities: [
    { name: 'Djibouti', lat: 11.5721, lng: 43.1456 },
  ]},
  { country: 'Comoros', cities: [
    { name: 'Moroni', lat: -11.7172, lng: 43.2473 },
  ]},
  { country: 'United States', cities: [
    { name: 'New York', lat: 40.7128, lng: -74.006 },
    { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
    { name: 'Chicago', lat: 41.8781, lng: -87.6298 },
    { name: 'Houston', lat: 29.7604, lng: -95.3698 },
    { name: 'Dearborn', lat: 42.3224, lng: -83.1763 },
  ]},
  { country: 'United Kingdom', cities: [
    { name: 'London', lat: 51.5074, lng: -0.1278 },
    { name: 'Birmingham', lat: 52.4862, lng: -1.8904 },
    { name: 'Manchester', lat: 53.4808, lng: -2.2426 },
    { name: 'Bradford', lat: 53.795, lng: -1.7591 },
  ]},
  { country: 'France', cities: [
    { name: 'Paris', lat: 48.8566, lng: 2.3522 },
    { name: 'Marseille', lat: 43.2965, lng: 5.3698 },
    { name: 'Lyon', lat: 45.764, lng: 4.8357 },
  ]},
  { country: 'Germany', cities: [
    { name: 'Berlin', lat: 52.52, lng: 13.405 },
    { name: 'Cologne', lat: 50.9375, lng: 6.9603 },
    { name: 'Hamburg', lat: 53.5511, lng: 9.9937 },
    { name: 'Frankfurt', lat: 50.1109, lng: 8.6821 },
  ]},
  { country: 'Spain', cities: [
    { name: 'Madrid', lat: 40.4168, lng: -3.7038 },
    { name: 'Barcelona', lat: 41.3851, lng: 2.1734 },
    { name: 'Granada', lat: 37.1773, lng: -3.5986 },
  ]},
  { country: 'Belgium', cities: [
    { name: 'Brussels', lat: 50.8503, lng: 4.3517 },
    { name: 'Antwerp', lat: 51.2194, lng: 4.4025 },
  ]},
  { country: 'Netherlands', cities: [
    { name: 'Amsterdam', lat: 52.3676, lng: 4.9041 },
    { name: 'Rotterdam', lat: 51.9244, lng: 4.4777 },
  ]},
  { country: 'Sweden', cities: [
    { name: 'Stockholm', lat: 59.3293, lng: 18.0686 },
    { name: 'Gothenburg', lat: 57.7089, lng: 11.9746 },
    { name: 'Malmo', lat: 55.6049, lng: 13.0038 },
  ]},
  { country: 'Norway', cities: [
    { name: 'Oslo', lat: 59.9139, lng: 10.7522 },
  ]},
  { country: 'Denmark', cities: [
    { name: 'Copenhagen', lat: 55.6761, lng: 12.5683 },
  ]},
  { country: 'Switzerland', cities: [
    { name: 'Zurich', lat: 47.3769, lng: 8.5417 },
    { name: 'Geneva', lat: 46.2044, lng: 6.1432 },
  ]},
  { country: 'Austria', cities: [
    { name: 'Vienna', lat: 48.2082, lng: 16.3738 },
    { name: 'Graz', lat: 47.0707, lng: 15.4395 },
  ]},
  { country: 'Italy', cities: [
    { name: 'Rome', lat: 41.9028, lng: 12.4964 },
    { name: 'Milan', lat: 45.4642, lng: 9.19 },
  ]},
  { country: 'Russia', cities: [
    { name: 'Moscow', lat: 55.7558, lng: 37.6173 },
    { name: 'Kazan', lat: 55.8304, lng: 49.0661 },
    { name: 'Saint Petersburg', lat: 59.9311, lng: 30.3609 },
  ]},
  { country: 'Ukraine', cities: [
    { name: 'Kyiv', lat: 50.4501, lng: 30.5234 },
  ]},
  { country: 'Bosnia and Herzegovina', cities: [
    { name: 'Sarajevo', lat: 43.8563, lng: 18.4131 },
    { name: 'Banja Luka', lat: 44.7731, lng: 17.1909 },
  ]},
  { country: 'Kosovo', cities: [
    { name: 'Pristina', lat: 42.6629, lng: 21.1655 },
  ]},
  { country: 'Albania', cities: [
    { name: 'Tirana', lat: 41.3275, lng: 19.8187 },
  ]},
  { country: 'North Macedonia', cities: [
    { name: 'Skopje', lat: 41.9981, lng: 21.4254 },
  ]},
  { country: 'Bulgaria', cities: [
    { name: 'Sofia', lat: 42.6977, lng: 23.3219 },
  ]},
  { country: 'Greece', cities: [
    { name: 'Athens', lat: 37.9838, lng: 23.7275 },
    { name: 'Thessaloniki', lat: 40.6403, lng: 22.9444 },
  ]},
  { country: 'Cyprus', cities: [
    { name: 'Nicosia', lat: 35.1856, lng: 33.3823 },
  ]},
  { country: 'Australia', cities: [
    { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
    { name: 'Melbourne', lat: -37.8136, lng: 144.9631 },
    { name: 'Perth', lat: -31.9505, lng: 115.8605 },
  ]},
  { country: 'New Zealand', cities: [
    { name: 'Auckland', lat: -36.8485, lng: 174.7633 },
  ]},
  { country: 'South Africa', cities: [
    { name: 'Cape Town', lat: -33.9249, lng: 18.4241 },
    { name: 'Johannesburg', lat: -26.2041, lng: 28.0473 },
    { name: 'Durban', lat: -29.8587, lng: 31.0218 },
  ]},
  { country: 'Kenya', cities: [
    { name: 'Nairobi', lat: -1.2921, lng: 36.8219 },
    { name: 'Mombasa', lat: -4.0435, lng: 39.6682 },
  ]},
  { country: 'Tanzania', cities: [
    { name: 'Dar es Salaam', lat: -6.7924, lng: 39.3243 },
    { name: 'Zanzibar', lat: -6.1659, lng: 39.2026 },
  ]},
  { country: 'Uganda', cities: [
    { name: 'Kampala', lat: 0.3476, lng: 32.5825 },
  ]},
  { country: 'Ethiopia', cities: [
    { name: 'Addis Ababa', lat: 9.145, lng: 40.4897 },
  ]},
  { country: 'Ghana', cities: [
    { name: 'Accra', lat: 5.6037, lng: -0.187 },
  ]},
  { country: 'Ivory Coast', cities: [
    { name: 'Abidjan', lat: 5.36, lng: -4.0083 },
  ]},
  { country: 'Cameroon', cities: [
    { name: 'Yaoundé', lat: 3.848, lng: 11.5021 },
    { name: 'Douala', lat: 4.0511, lng: 9.7679 },
  ]},
  { country: 'Turkey (Northern Cyprus)', cities: [
    { name: 'Nicosia (North)', lat: 35.1856, lng: 33.3823 },
  ]},
  { country: 'Canada', cities: [
    { name: 'Toronto', lat: 43.6532, lng: -79.3832 },
    { name: 'Vancouver', lat: 49.2827, lng: -123.1207 },
    { name: 'Montreal', lat: 45.5017, lng: -73.5673 },
    { name: 'Ottawa', lat: 45.4215, lng: -75.6972 },
  ]},
  { country: 'Argentina', cities: [
    { name: 'Buenos Aires', lat: -34.6037, lng: -58.3816 },
  ]},
  { country: 'Brazil', cities: [
    { name: 'São Paulo', lat: -23.5505, lng: -46.6333 },
    { name: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729 },
  ]},
  { country: 'Mexico', cities: [
    { name: 'Mexico City', lat: 19.4326, lng: -99.1332 },
  ]},
  { country: 'China', cities: [
    { name: 'Beijing', lat: 39.9042, lng: 116.4074 },
    { name: 'Shanghai', lat: 31.2304, lng: 121.4737 },
  ]},
  { country: 'Japan', cities: [
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
    { name: 'Osaka', lat: 34.6937, lng: 135.5023 },
  ]},
  { country: 'South Korea', cities: [
    { name: 'Seoul', lat: 37.5665, lng: 126.978 },
  ]},
  { country: 'Singapore', cities: [
    { name: 'Singapore', lat: 1.3521, lng: 103.8198 },
  ]},
  { country: 'Thailand', cities: [
    { name: 'Bangkok', lat: 13.7563, lng: 100.5018 },
  ]},
  { country: 'Philippines', cities: [
    { name: 'Manila', lat: 14.5995, lng: 120.9842 },
    { name: 'Davao', lat: 7.1907, lng: 125.4553 },
  ]},
  { country: 'Vietnam', cities: [
    { name: 'Hanoi', lat: 21.0285, lng: 105.8542 },
    { name: 'Ho Chi Minh City', lat: 10.8231, lng: 106.6297 },
  ]},
  { country: 'Maldives', cities: [
    { name: 'Malé', lat: 4.1755, lng: 73.5093 },
  ]},
];

export const COUNTRY_NAMES = COUNTRIES.map((c) => c.country).sort();
