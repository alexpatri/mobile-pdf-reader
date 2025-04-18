import { Tabs } from 'expo-router';
import { Library, BookMarked, Settings } from 'lucide-react-native';
import React from 'react';
import { useTheme } from '@/context/ThemeContext'; // Importa o contexto de tema

export default function TabLayout() {
  const { isDarkMode } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#121212' : '#fff',
          borderTopWidth: 1,
          borderTopColor: isDarkMode ? '#333' : '#e5e5e5',
        },
        tabBarActiveTintColor: '#007AFF',
        headerShown: true,
        headerStyle: {
          backgroundColor: isDarkMode ? '#121212' : '#fff', // muda o fundo do header
        },
        headerTitleStyle: {
          color: isDarkMode ? '#fff' : '#000', // muda a cor do título
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Library',
          tabBarIcon: ({ color, size }) => <Library size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: 'Bookmarks',
          tabBarIcon: ({ color, size }) => <BookMarked size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
