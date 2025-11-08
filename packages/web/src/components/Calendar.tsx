import React, { useState } from 'react';
import * as styles from '../styles/Calendar.css';
import { trpc } from '../trpc';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newLink, setNewLink] = useState('');

  const { data: schedules = [] } = trpc.schedules.list.useQuery({});

  const addMutation = trpc.schedules.create.useMutation({
    onSuccess: () => {
      setNewTitle('');
      setNewLink('');
      setIsModalOpen(false);
      setSelectedDate(null);
    },
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
