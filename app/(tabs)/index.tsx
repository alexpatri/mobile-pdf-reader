import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import { CirclePlus as PlusCircle, Book } from 'lucide-react-native';
import { initDatabase, savePDF, getAllPDFs } from '@/utils/database';
import React from 'react';
import { useTheme } from '@/context/ThemeContext';

interface PDFDocument {
  id: number;
  title: string;
  path: string;
  author?: string;
  thumbnail?: string;
}

export default function LibraryScreen() {
  const { isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode);

  const [documents, setDocuments] = useState<PDFDocument[]>([]);
  const router = useRouter();

  useEffect(() => {
    initDatabase().then(() => {
      loadDocuments();
    });
  }, []);

  const loadDocuments = async () => {
    const pdfs = await getAllPDFs();
    setDocuments(pdfs);
  };

  const pickDocument = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets[0];
      const fileName = asset.name;
      const newPath = `${FileSystem.documentDirectory}pdfs/${fileName}`;

      await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}pdfs`, {
        intermediates: true,
      });

      await FileSystem.copyAsync({
        from: asset.uri,
        to: newPath,
      });

      await savePDF({
        title: fileName.replace('.pdf', ''),
        path: newPath,
      });

      loadDocuments();
    } catch (error) {
      console.error('Error picking document:', error);
    }
  }, []);

  const renderItem = ({ item }: { item: PDFDocument }) => (
    <TouchableOpacity
      style={styles.documentItem}
      onPress={() => router.push(`/reader/${item.id}`)}>
      <View style={styles.documentIcon}>
        <Book size={24} color="#007AFF" />
      </View>
      <View style={styles.documentInfo}>
        <Text style={styles.documentTitle} numberOfLines={1}>
          {item.title}
        </Text>
        {item.author && (
          <Text style={styles.documentAuthor} numberOfLines={1}>
            {item.author}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={documents}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No PDFs in your library</Text>
            <Text style={styles.emptyStateSubtext}>
              Tap the + button to add your first PDF
            </Text>
          </View>
        }
      />
      <TouchableOpacity style={styles.fab} onPress={pickDocument}>
        <PlusCircle size={24} color="#fff" />
      </TouchableOpacity>
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
      paddingBottom: 100,
    },
    documentItem: {
      flexDirection: 'row',
      alignItems: 'center',
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
    documentIcon: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: isDarkMode ? '#2a2a2a' : '#f0f9ff',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    documentInfo: {
      flex: 1,
    },
    documentTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? '#ffffff' : '#1a1a1a',
      marginBottom: 4,
    },
    documentAuthor: {
      fontSize: 14,
      color: isDarkMode ? '#aaa' : '#666',
    },
    fab: {
      position: 'absolute',
      bottom: 24,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#007AFF',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 32,
    },
    emptyStateText: {
      fontSize: 18,
      fontWeight: '600',
      color: isDarkMode ? '#fff' : '#1a1a1a',
      marginBottom: 8,
    },
    emptyStateSubtext: {
      fontSize: 14,
      color: isDarkMode ? '#aaa' : '#666',
    },
  });