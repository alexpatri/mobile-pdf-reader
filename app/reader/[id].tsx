import { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Platform, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getPDFById } from '@/utils/database';

// Import PDF viewer only for non-web platforms
import React from 'react';
let PDFView: any = null;
if (Platform.OS !== 'web') {
  // We need to make sure this import is done at the module level, not conditionally
  try {
    // Using dynamic imports with require can cause issues, so we import directly
    PDFView = require('react-native-pdf').default;
  } catch (err) {
    console.error('Failed to load react-native-pdf:', err);
  }
}

export default function PDFReaderScreen() {
  const { id } = useLocalSearchParams();
  const [pdfPath, setPdfPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPDF();
  }, [id]);

  const loadPDF = async () => {
    setLoading(true);
    try {
      const pdf = await getPDFById(Number(id));
      if (pdf) {
        setPdfPath(pdf.path);
      } else {
        setError('PDF not found');
      }
    } catch (err) {
      setError(`Failed to load PDF: ${err instanceof Error ? err.message : String(err)}`);
      console.error('Error loading PDF:', err);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading PDF...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // No PDF found
  if (!pdfPath) {
    return (
      <View style={styles.container}>
        <Text>PDF not available</Text>
      </View>
    );
  }

  // Web platform uses iframe
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <iframe
          src={pdfPath}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          title="PDF Viewer"
        />
      </View>
    );
  }

  // Native platforms use react-native-pdf
  if (!PDFView) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          PDF viewer component could not be loaded. Please make sure react-native-pdf is installed correctly.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PDFView
        source={{ uri: pdfPath }}
        style={styles.pdf}
        enablePaging={true}
        horizontal={true}
        onError={(error: Error) => setError(error.message)}
        onLoadComplete={() => console.log('PDF loaded successfully')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
  }
});