import React, { useState } from 'react';
import * as styles from '../styles/Calendar.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '../lib/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// As defined in api-and-schema.md
interface Schedule {
  id: number;
  title: string;
  date: string; // ISO 8601 format: YYYY-MM-DD
  hyperlinkUrl: string;
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newLink, setNewLink] = useState('');
  const queryClient = useQueryClient();

  const { data } = useQuery('schedules', async () => {
    const res = await fetchWithAuth(`${API_URL}/schedules`);
    const d = await res.json();
    return d.schedules as Schedule[];
  });
  const schedules = data || [];

  const addMutation = useMutation(async (payload: { title: string; date: string; hyperlinkUrl: string }) => {
    const res = await fetchWithAuth(`${API_URL}/schedules`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.json();
  }, {
    onSuccess: () => queryClient.invalidateQueries(['schedules'])
  });

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDayClick = (day: number) => {
    const date = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newLink || !selectedDate) return;
    addMutation.mutate({ title: newTitle, date: selectedDate, hyperlinkUrl: newLink });
    setNewTitle('');
    setNewLink('');
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  return (
    <main className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <button onClick={goToPreviousMonth} className={styles.calendarHeaderButton}>&lt;</button>
        <h2>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h2>
        <button onClick={goToNextMonth} className={styles.calendarHeaderButton}>&gt;</button>
      </div>
      <div className={styles.calendarGrid}>
        {daysOfWeek.map(day => (
          <div key={day} className={styles.calendarDayHeader}>{day}</div>
        ))}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className={`${styles.calendarDay} ${styles.emptyDay}`}></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, day) => {
          const dayNumber = day + 1;
          const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
          const daySchedules = schedules.filter(s => s.date === dateStr);

          return (
            <div key={dayNumber} className={styles.calendarDay} onClick={() => handleDayClick(dayNumber)}>
              <span className={styles.dayNumber}>{dayNumber}</span>
              <div className={styles.schedulesList}>
                {daySchedules.map(schedule => (
                  <a key={schedule.id} href={schedule.hyperlinkUrl} target="_blank" rel="noopener noreferrer" className={styles.scheduleItem}>
                    {schedule.title}
                  </a>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalContentH3}>Add Schedule for {selectedDate}</h3>
            <form onSubmit={handleAddSchedule} className={styles.modalForm}>
              <input
                type="text"
                placeholder="Schedule Title"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                required
                className={styles.modalInput}
              />
              <input
                type="url"
                placeholder="Hyperlink URL"
                value={newLink}
                onChange={e => setNewLink(e.target.value)}
                required
                className={styles.modalInput}
              />
              <div className={styles.modalActions}>
                <button type="submit" className={styles.modalSubmitButton}>Save</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.modalCancelButton}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Calendar;
import React, { useState, useEffect } from 'react';
import * as styles from '../styles/Calendar.css';

const API_URL = 'http://localhost:4000/api';

// As defined in api-and-schema.md
interface Schedule {
  id: number;
  title: string;
  date: string; // ISO 8601 format: YYYY-MM-DD
  hyperlinkUrl: string;
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newLink, setNewLink] = useState('');

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const response = await fetch(`${API_URL}/schedules`, { headers });
        const data = await response.json();
        setSchedules(data.schedules);
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    };

    fetchSchedules();
  }, []);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDayClick = (day: number) => {
    const date = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newLink || !selectedDate) return;

    try {
      const token = localStorage.getItem('accessToken');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const response = await fetch(`${API_URL}/schedules`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ title: newTitle, date: selectedDate, hyperlinkUrl: newLink }),
      });

      if (response.ok) {
        const { schedule } = await response.json();
        setSchedules([...schedules, schedule]);
        setNewTitle('');
        setNewLink('');
        setIsModalOpen(false);
        setSelectedDate(null);
      }
    } catch (error) {
      console.error('Error adding schedule:', error);
    }
  };

  return (
    <main className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <button onClick={goToPreviousMonth} className={styles.calendarHeaderButton}>&lt;</button>
        <h2>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h2>
        <button onClick={goToNextMonth} className={styles.calendarHeaderButton}>&gt;</button>
      </div>
      <div className={styles.calendarGrid}>
        {daysOfWeek.map(day => (
          <div key={day} className={styles.calendarDayHeader}>{day}</div>
        ))}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className={`${styles.calendarDay} ${styles.emptyDay}`}></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, day) => {
          const dayNumber = day + 1;
          const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
          const daySchedules = schedules.filter(s => s.date === dateStr);

          return (
            <div key={dayNumber} className={styles.calendarDay} onClick={() => handleDayClick(dayNumber)}>
              <span className={styles.dayNumber}>{dayNumber}</span>
              <div className={styles.schedulesList}>
                {daySchedules.map(schedule => (
                  <a key={schedule.id} href={schedule.hyperlinkUrl} target="_blank" rel="noopener noreferrer" className={styles.scheduleItem}>
                    {schedule.title}
                  </a>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalContentH3}>Add Schedule for {selectedDate}</h3>
            <form onSubmit={handleAddSchedule} className={styles.modalForm}>
              <input
                type="text"
                placeholder="Schedule Title"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                required
                className={styles.modalInput}
              />
              <input
                type="url"
                placeholder="Hyperlink URL"
                value={newLink}
                onChange={e => setNewLink(e.target.value)}
                required
                className={styles.modalInput}
              />
              <div className={styles.modalActions}>
                <button type="submit" className={styles.modalSubmitButton}>Save</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.modalCancelButton}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Calendar;
