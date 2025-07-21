import * as Location from 'expo-location';

export interface CountryInfo {
  countryCode: string;
  callingCode: string;
}

/**
 * Request location permissions and get user's country
 */
export const getUserCountry = async (): Promise<CountryInfo | null> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      console.log('Location permission denied');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    const [address] = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    if (address?.isoCountryCode) {
      // Map country codes to calling codes
      const countryCallingCodes: Record<string, string> = {
        'CA': '+1',
        'US': '+1',
        'FR': '+33',
        'GB': '+44',
        'DE': '+49',
        'ES': '+34',
        'IT': '+39',
        'AU': '+61',
        'JP': '+81',
        'CN': '+86',
        'IN': '+91',
        'BR': '+55',
        'MX': '+52',
        'RU': '+7',
        'KR': '+82',
        // Add more as needed
      };

      return {
        countryCode: address.isoCountryCode,
        callingCode: countryCallingCodes[address.isoCountryCode] || '+1',
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting user location:', error);
    return null;
  }
};

/**
 * Format phone number with country code
 */
export const formatPhoneNumber = (countryCode: string, phoneNumber: string): string => {
  // Remove any existing country code or special characters
  const cleanNumber = phoneNumber.replace(/^\+\d{1,3}/, '').replace(/\D/g, '');
  return `${countryCode}${cleanNumber}`;
};