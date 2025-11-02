import { createGlobalTheme, globalStyle } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  color: {
    white: '#ffffff',
    black: '#333333',
    gray: '#dddddd',
    lightGray: '#f8f9fa',
    coolGray: '#f1f3f5',
    blue: '#007bff',
    darkBlue: '#0056b3',
    red: '#dc3545',
    darkRed: '#c82333',
    grayBlue: '#6c757d',
    lightBlue: '#e9ecef',
    lightBlueHover: '#ced4da',
    text: '#212529',
  },
  font: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
});

globalStyle('body', {
  margin: 0,
  fontFamily: vars.font.body,
  backgroundColor: vars.color.white,
  color: vars.color.black,
});
