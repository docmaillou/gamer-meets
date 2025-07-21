import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { PixelIcon } from '@/components/icons/PixelIcon';
import { countries, CountryData, getCountryByDialCode } from '@/utils/countryData';

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  countryCode: string;
  onCountryChange: (dialCode: string) => void;
  placeholder?: string;
  error?: string;
  label?: string;
  required?: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChangeText,
  countryCode,
  onCountryChange,
  placeholder = '514 123 4567',
  error,
  label,
  required,
}) => {
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);
  const { colors } = useTheme();
  const selectedCountry = getCountryByDialCode(countryCode) || countries[0];
  const styles = createStyles(colors);

  const handleCountrySelect = (country: CountryData) => {
    onCountryChange(country.dial_code);
    setCountryPickerVisible(false);
  };

  const formatPhoneNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    
    // Format based on country
    if ((selectedCountry.code === 'US' || selectedCountry.code === 'CA') && cleaned.length <= 10) {
      // North American format: (514) 123-4567 or 514 123 4567
      const match = cleaned.match(/^(\d{3})?(\d{3})?(\d{4})?$/);
      if (match) {
        const parts = [match[1], match[2], match[3]].filter(Boolean);
        return parts.join(' ');
      }
    } else if (selectedCountry.code === 'FR' && cleaned.length <= 9) {
      // French format: 6 12 34 56 78
      const match = cleaned.match(/^(\d{1})(\d{2})?(\d{2})?(\d{2})?(\d{2})?$/);
      if (match) {
        const parts = [match[1], match[2], match[3], match[4], match[5]].filter(Boolean);
        return parts.join(' ');
      }
    }
    
    return cleaned;
  };

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}>*</Text>}
        </View>
      )}
      
      <View style={[styles.inputContainer, error ? styles.inputError : null]}>
        <TouchableOpacity
          style={styles.countryButton}
          onPress={() => setCountryPickerVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.flag}>{selectedCountry.flag}</Text>
          <Text style={styles.countryCode}>{selectedCountry.dial_code}</Text>
          <PixelIcon type="arrow" size={16} />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TextInput
          style={styles.input}
          value={formatPhoneNumber(value)}
          onChangeText={(text) => onChangeText(text.replace(/\D/g, ''))}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          keyboardType="phone-pad"
          maxLength={15}
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={countryPickerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCountryPickerVisible(false)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sélectionnez un pays</Text>
              <TouchableOpacity
                onPress={() => setCountryPickerVisible(false)}
                style={styles.closeButton}
              >
                <PixelIcon type="arrow" size={24} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={countries}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryItem}
                  onPress={() => handleCountrySelect(item)}
                >
                  <Text style={styles.countryFlag}>{item.flag}</Text>
                  <Text style={styles.countryName}>{item.name}</Text>
                  <Text style={styles.countryDialCode}>{item.dial_code}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  required: {
    color: colors.error,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 2,
    borderColor: colors.border,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: colors.error + '20',
  },
  countryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },
  flag: {
    fontSize: 20,
    marginRight: 8,
  },
  countryCode: {
    fontSize: 14,
    color: colors.text,
    marginRight: 8,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  divider: {
    width: 2,
    height: 24,
    backgroundColor: colors.border,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 10,
    color: colors.error,
    marginTop: 4,
    marginLeft: 16,
    fontFamily: 'monospace',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%',
    borderWidth: 2,
    borderColor: colors.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  closeButton: {
    padding: 4,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  countryFlag: {
    fontSize: 20,
    marginRight: 12,
  },
  countryName: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontFamily: 'monospace',
  },
  countryDialCode: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
    fontFamily: 'monospace',
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 56,
  },
});