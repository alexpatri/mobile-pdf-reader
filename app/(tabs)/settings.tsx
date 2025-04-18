import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Moon, Sun, Trash2 } from 'lucide-react-native';
import { clearDatabase } from '@/utils/database';
import React from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function SettingsScreen() {
  const { isDarkMode, toggleTheme } = useTheme();

  const handleClearData = async () => {
    await clearDatabase();
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1e1e1e' : '#f8f9fa' }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#aaa' : '#666' }]}>Appearance</Text>
        <View style={[styles.settingItem, { backgroundColor: isDarkMode ? '#2c2c2c' : '#fff' }]}>
          <View style={styles.settingLeft}>
            {isDarkMode ? (
              <Moon size={20} color="#007AFF" />
            ) : (
              <Sun size={20} color="#007AFF" />
            )}
            <Text style={[styles.settingText, { color: isDarkMode ? '#eee' : '#1a1a1a' }]}>Dark Mode</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isDarkMode ? '#007AFF' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#aaa' : '#666' }]}>Data Management</Text>
        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: isDarkMode ? '#2c2c2c' : '#fff' }]}
          onPress={handleClearData}
        >
          <View style={styles.settingLeft}>
            <Trash2 size={20} color="#FF3B30" />
            <Text style={[styles.settingText, styles.dangerText]}>
              Clear All Data
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#1a1a1a',
  },
  dangerText: {
    color: '#FF3B30',
  },
});