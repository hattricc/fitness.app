import { createTheme } from '@mui/material/styles';
import colors from './colors.json';

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: colors.primary,
        secondary: colors.secondary,
        background: colors.background,
        text: colors.text,
        action: colors.action,
        divider: colors.divider,
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        h1: {
            color: colors.text.secondary,
            fontWeight: 500,
        },
        h2: {
            color: colors.text.primary,
            fontWeight: 500,
        },
        h3: {
            color: colors.text.secondary,
            fontWeight: 500,
        },
        h4: {
            color: colors.text.secondary,
            fontWeight: 500,
        },
        h5: {
            color: colors.text.secondary,
            fontWeight: 500,
        },
        h6: {
            color: colors.text.secondary,
            fontWeight: 500,
        },
        subtitle1: {
            color: colors.text.secondary,
        },
        body1: {
            color: colors.text.primary,
        },
        body2: {
            color: colors.text.primary,
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
        },
    },
});
