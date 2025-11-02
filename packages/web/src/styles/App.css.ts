import { style } from '@vanilla-extract/css';
import { vars } from './global.css';

export const appContainer = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
});

export const appHeader = style({
  padding: '1rem 2rem',
  backgroundColor: vars.color.lightGray,
  borderBottom: `1px solid ${vars.color.gray}`,
  textAlign: 'center',
});

export const appHeaderH1 = style({
  margin: 0,
  fontSize: '1.5rem',
});

export const appBody = style({
  display: 'flex',
  flexGrow: 1,
  overflow: 'hidden',
});
