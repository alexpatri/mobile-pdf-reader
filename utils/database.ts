import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interface for PDF objects
interface PDF {
  id: number;
  title: string;
  path: string;
  author?: string;
  thumbnail?: string;
  created_at: string;
}

// Interface for Bookmark objects
interface Bookmark {
  id: number;
  pdf_id: number;
  page: number;
  note?: string;
  created_at: string;
}

// Keys for AsyncStorage
const STORAGE_KEYS = {
  PDFS: 'pdfs_storage',
  BOOKMARKS: 'bookmarks_storage',
};

// Generate a unique ID based on timestamp and random number
const generateId = (): number => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

// Initialize database - check if storage is accessible
export const initDatabase = async (): Promise<boolean> => {
  try {
    // Test AsyncStorage accessibility
    await AsyncStorage.getItem(STORAGE_KEYS.PDFS);
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return false;
  }
};

// Save a PDF to storage
export const savePDF = async (pdf: { title: string; path: string; author?: string; thumbnail?: string }): Promise<number | null> => {
  try {
    // Get existing PDFs
    const existingPDFs = await getAllPDFs();
    
    // Create new PDF object with ID and timestamp
    const newPDF: PDF = {
      id: generateId(),
      title: pdf.title,
      path: pdf.path,
      author: pdf.author,
      thumbnail: pdf.thumbnail,
      created_at: new Date().toISOString(),
    };
    
    // Add new PDF to the array
    const updatedPDFs = [...existingPDFs, newPDF];
    
    // Save back to AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEYS.PDFS, JSON.stringify(updatedPDFs));
    
    return newPDF.id;
  } catch (error) {
    console.error('Failed to save PDF:', error);
    return null;
  }
};

// Get all PDFs sorted by creation date (newest first)
export const getAllPDFs = async (): Promise<PDF[]> => {
  try {
    const pdfsJson = await AsyncStorage.getItem(STORAGE_KEYS.PDFS);
    const pdfs: PDF[] = pdfsJson ? JSON.parse(pdfsJson) : [];
    
    // Sort by date, newest first
    return pdfs.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (error) {
    console.error('Failed to get PDFs:', error);
    return [];
  }
};

// Get a specific PDF by ID
export const getPDFById = async (id: number): Promise<PDF | null> => {
  try {
    const pdfs = await getAllPDFs();
    const pdf = pdfs.find(p => p.id === id);
    return pdf || null;
  } catch (error) {
    console.error('Failed to get PDF:', error);
    return null;
  }
};

// Update an existing PDF
export const updatePDF = async (id: number, updates: Partial<Omit<PDF, 'id' | 'created_at'>>): Promise<boolean> => {
  try {
    const pdfs = await getAllPDFs();
    const pdfIndex = pdfs.findIndex(p => p.id === id);
    
    if (pdfIndex === -1) return false;
    
    // Update the PDF with new values
    pdfs[pdfIndex] = {
      ...pdfs[pdfIndex],
      ...updates
    };
    
    await AsyncStorage.setItem(STORAGE_KEYS.PDFS, JSON.stringify(pdfs));
    return true;
  } catch (error) {
    console.error('Failed to update PDF:', error);
    return false;
  }
};

// Delete a PDF by ID
export const deletePDF = async (id: number): Promise<boolean> => {
  try {
    const pdfs = await getAllPDFs();
    const updatedPDFs = pdfs.filter(pdf => pdf.id !== id);
    
    await AsyncStorage.setItem(STORAGE_KEYS.PDFS, JSON.stringify(updatedPDFs));
    
    // Also delete any bookmarks associated with this PDF
    const bookmarks = await getAllBookmarks();
    const updatedBookmarks = bookmarks.filter(bookmark => bookmark.pdf_id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updatedBookmarks));
    
    return true;
  } catch (error) {
    console.error('Failed to delete PDF:', error);
    return false;
  }
};

// Save a bookmark
export const saveBookmark = async (bookmark: { pdf_id: number; page: number; note?: string }): Promise<number | null> => {
  try {
    const existingBookmarks = await getAllBookmarks();
    
    const newBookmark: Bookmark = {
      id: generateId(),
      pdf_id: bookmark.pdf_id,
      page: bookmark.page,
      note: bookmark.note,
      created_at: new Date().toISOString(),
    };
    
    const updatedBookmarks = [...existingBookmarks, newBookmark];
    await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updatedBookmarks));
    
    return newBookmark.id;
  } catch (error) {
    console.error('Failed to save bookmark:', error);
    return null;
  }
};

// Get all bookmarks
export const getAllBookmarks = async (): Promise<Bookmark[]> => {
  try {
    const bookmarksJson = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return bookmarksJson ? JSON.parse(bookmarksJson) : [];
  } catch (error) {
    console.error('Failed to get bookmarks:', error);
    return [];
  }
};

// Get bookmarks for a specific PDF
export const getBookmarksByPdfId = async (pdf_id: number): Promise<Bookmark[]> => {
  try {
    const bookmarks = await getAllBookmarks();
    return bookmarks.filter(bookmark => bookmark.pdf_id === pdf_id);
  } catch (error) {
    console.error('Failed to get bookmarks for PDF:', error);
    return [];
  }
};

// Delete a bookmark by ID
export const deleteBookmark = async (id: number): Promise<boolean> => {
  try {
    const bookmarks = await getAllBookmarks();
    const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
    
    await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updatedBookmarks));
    return true;
  } catch (error) {
    console.error('Failed to delete bookmark:', error);
    return false;
  }
};

// Clear all database data
export const clearDatabase = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.PDFS);
    await AsyncStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
    return true;
  } catch (error) {
    console.error('Failed to clear database:', error);
    return false;
  }
};