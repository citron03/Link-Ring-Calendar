import React, { useState } from 'react';
import * as styles from '../styles/QuickLinkBoard.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '../lib/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// As defined in api-and-schema.md
interface QuickLink {
  id: number;
  title: string;
  url: string;
  orderIndex: number;
}

const QuickLinkBoard: React.FC = () => {
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const queryClient = useQueryClient();

  const { data } = useQuery('quicklinks', async () => {
    const res = await fetchWithAuth(`${API_URL}/quicklinks`);
    const d = await res.json();
    return d.quickLinks as QuickLink[];
  });
  const links = data || [];

  const addMutation = useMutation(async (payload: { title: string; url: string }) => {
    const res = await fetchWithAuth(`${API_URL}/quicklinks`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.json();
  }, {
    onSuccess: () => queryClient.invalidateQueries(['quicklinks'])
  });

  const deleteMutation = useMutation(async (id: number) => {
    const res = await fetchWithAuth(`${API_URL}/quicklinks/${id}`, { method: 'DELETE' });
    return res.json();
  }, {
    onSuccess: () => queryClient.invalidateQueries(['quicklinks'])
  });

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;
    addMutation.mutate({ title: newTitle, url: newUrl });
    setNewTitle('');
    setNewUrl('');
  };

  const handleDeleteLink = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <aside className={styles.quickLinkBoard}>
      <h2 className={styles.quickLinkBoardH2}>Quick Links</h2>
      
      <form onSubmit={handleAddLink} className={styles.addLinkForm}>
        <input
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          required
          className={styles.addLinkInput}
        />
        <input
          type="url"
          placeholder="URL"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          required
          className={styles.addLinkInput}
        />
        <button type="submit" className={styles.addLinkButton}>Add Link</button>
      </form>

      <ul className={styles.quickLinkList}>
        {links.map(link => (
          <li key={link.id} className={styles.quickLinkListItem}>
            <a href={link.url} target="_blank" rel="noopener noreferrer" className={styles.quickLinkListLink}>
              {link.title}
            </a>
            <button onClick={() => handleDeleteLink(link.id)} className={styles.deleteBtn}>×</button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default QuickLinkBoard;
