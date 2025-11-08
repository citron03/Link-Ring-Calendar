import React, { useState } from 'react';
import * as styles from '../styles/QuickLinkBoard.css';
import { trpc } from '../trpc';

const QuickLinkBoard: React.FC = () => {
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const { data: links = [] } = trpc.quicklinks.list.useQuery();

  const addMutation = trpc.quicklinks.create.useMutation({
    onSuccess: () => {
      setNewTitle('');
      setNewUrl('');
    },
  });

  const deleteMutation = trpc.quicklinks.delete.useMutation();

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;
    addMutation.mutate({ title: newTitle, url: newUrl });
  };

  const handleDeleteLink = (id: number) => {
    deleteMutation.mutate({ id });
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
