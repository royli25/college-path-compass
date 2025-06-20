
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Document {
  id: string;
  title: string;
  content: string;
  file_type: string;
  created_at: string;
}

export const useDocumentManagement = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const uploadDocument = async (title: string, content: string, fileType: string = 'text') => {
    setIsLoading(true);
    try {
      const response = await fetch('/functions/v1/ingest-documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          fileType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to upload document');
      }

      const result = await response.json();
      await fetchDocuments(); // Refresh the list
      return result;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('id, title, content, file_type, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;
      await fetchDocuments(); // Refresh the list
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  };

  return {
    documents,
    isLoading,
    uploadDocument,
    fetchDocuments,
    deleteDocument,
  };
};
