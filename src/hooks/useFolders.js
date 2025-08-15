import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export const useFolders = () => {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('inbox');

  const fetchFolders = async () => {
    const folders = await api.fetchFolders();
    setFolders(folders);
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  return {
    folders,
    selectedFolder,
    setSelectedFolder,
    refreshFolders: fetchFolders
  };
};
