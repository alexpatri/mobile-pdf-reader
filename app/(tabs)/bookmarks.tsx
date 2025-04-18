import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { getAllBookmarks } from '@/utils/database';
import React from 'react';
import { useTheme } from '@/context/ThemeContext';

interface Bookmark {
  id: number;
  pdf_id: number;
  page: number;
  note?: string;
  created_at: string;
}

export default function BookmarksScreen() {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    const result = await getAllBookmarks();
    setBookmarks(result);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarks}
        renderItem={({ item }) => (
          <View style={styles.bookmarkItem}>
            <Text style={styles.bookmarkTitle}>Page {item.page}</Text>
            <Text style={styles.bookmarkNote}>{item.note}</Text>
            <Text style={styles.bookmarkDate}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No bookmarks yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Add bookmarks while reading to see them here
            </Text>
          </View>
        }
      />
    </View>
  );
}

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#f8f9fa',
    },
    listContent: {
      padding: 16,
    },
    bookmarkItem: {
      backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    bookmarkTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? '#f1f1f1' : '#1a1a1a',
      marginBottom: 8,
    },
    bookmarkNote: {
      fontSize: 14,
      color: isDarkMode ? '#ccc' : '#666',
      marginBottom: 8,
    },
    bookmarkDate: {
      fontSize: 12,
      color: isDarkMode ? '#888' : '#999',
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 32,
    },
    emptyStateText: {
      fontSize: 18,
      fontWeight: '600',
      color: isDarkMode ? '#f1f1f1' : '#1a1a1a',
      marginBottom: 8,
    },
    emptyStateSubtext: {
      fontSize: 14,
      color: isDarkMode ? '#aaa' : '#666',
    },
  });