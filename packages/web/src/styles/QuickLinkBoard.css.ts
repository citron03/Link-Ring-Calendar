import { style } from '@vanilla-extract/css';
import { vars } from './global.css';

export const quickLinkBoard = style({
  width: '280px',
  padding: '1.5rem',
  backgroundColor: vars.color.coolGray,
  borderRight: `1px solid ${vars.color.gray}`,
  overflowY: 'auto',
});

export const quickLinkBoardH2 = style({
  marginTop: 0,
  fontSize: '1.2rem',
  borderBottom: `1px solid ${vars.color.gray}`,
  paddingBottom: '0.5rem',
});

export const addLinkForm = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  margin: '1rem 0',
});

export const addLinkInput = style({
  padding: '0.5rem',
  border: `1px solid ${vars.color.gray}`,
  borderRadius: '4px',
});

export const addLinkButton = style({
  padding: '0.6rem',
  border: 'none',
  borderRadius: '4px',
  backgroundColor: vars.color.blue,
  color: vars.color.white,
  cursor: 'pointer',
  fontWeight: 'bold',
  ':hover': {
    backgroundColor: vars.color.darkBlue,
  },
});

export const quickLinkList = style({
  listStyle: 'none',
  padding: 0,
  margin: 0,
});

export const quickLinkListItem = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.5rem 0',
  borderBottom: `1px solid ${vars.color.gray}`,
});

export const quickLinkListLink = style({
  color: vars.color.black,
  textDecoration: 'none',
  flexGrow: 1,
  ':hover': {
    textDecoration: 'underline',
  },
});

export const deleteBtn = style({
  background: 'none',
  border: 'none',
  color: vars.color.red,
  cursor: 'pointer',
  fontSize: '1.2rem',
  padding: '0 0.5rem',
});
