import { style } from '@vanilla-extract/css';
import { vars } from './global.css';

export const calendarContainer = style({
  flexGrow: 1,
  padding: '2rem',
  overflowY: 'auto',
});

export const calendarHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem',
});

export const calendarHeaderButton = style({
  background: 'none',
  border: `1px solid ${vars.color.gray}`,
  borderRadius: '4px',
  padding: '0.2rem 0.8rem',
  cursor: 'pointer',
  fontSize: '1.2rem',
});

export const calendarGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '1px',
  backgroundColor: vars.color.gray,
  border: `1px solid ${vars.color.gray}`,
});

export const calendarDayHeader = style({
  textAlign: 'center',
  padding: '0.5rem',
  backgroundColor: vars.color.lightGray,
  fontWeight: 'bold',
});

export const calendarDay = style({
  backgroundColor: vars.color.white,
  padding: '0.5rem',
  minHeight: '100px',
  position: 'relative',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: vars.color.lightGray,
  },
});

export const emptyDay = style({
  backgroundColor: vars.color.coolGray,
  cursor: 'default',
  ':hover': {
    backgroundColor: vars.color.coolGray,
  },
});

export const dayNumber = style({
  fontWeight: 'bold',
});

export const schedulesList = style({
  marginTop: '0.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
});

export const scheduleItem = style({
  fontSize: '0.8rem',
  padding: '0.2rem 0.4rem',
  backgroundColor: vars.color.lightBlue,
  borderRadius: '4px',
  textDecoration: 'none',
  color: vars.color.text,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  ':hover': {
    backgroundColor: vars.color.lightBlueHover,
  },
});

// Modal Styles
export const modalOverlay = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const modalContent = style({
  background: vars.color.white,
  padding: '2rem',
  borderRadius: '8px',
  width: '400px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
});

export const modalContentH3 = style({
  marginTop: 0,
});

export const modalForm = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
});

export const modalInput = style({
  padding: '0.75rem',
  border: `1px solid ${vars.color.gray}`,
  borderRadius: '4px',
});

export const modalActions = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '0.5rem',
});

export const modalButton = style({
  padding: '0.6rem 1rem',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
});

export const modalSubmitButton = style([modalButton, {
  backgroundColor: vars.color.blue,
  color: vars.color.white,
}]);

export const modalCancelButton = style([modalButton, {
  backgroundColor: vars.color.grayBlue,
  color: vars.color.white,
}]);
