import { CSSProperties } from 'react';

export const ModalStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  outline: 'none',
  zIndex: 10005,
}

export const ModalBoxStyles = {
  position: 'relative',
  // Width drives height via paddingTop aspect ratio.
  // Capping width at (85dvh × ratio) guarantees video never exceeds 85dvh.
  width: {
    xs: 'min(90dvw, calc(70dvh * 9 / 16))',  // mobile: 9:16, max ~70dvh tall
    md: 'min(90dvw, calc(70dvh * 16 / 9))',  // desktop: 16:9, max ~70dvh tall
  },
  height: 'auto',
  bgcolor: '#1B1B1B',
  boxShadow: 24,
  outline: 'none',
}

export const ModalVideoBoxStyles = {
  position: 'relative',
  width: '100%',
  paddingTop: { xs: '177.77%', md: '56.25%' }, // mobile 9:16, desktop 16:9
  borderRadius: 1,
  overflow: 'hidden',
}

export const ModalCloseButtonStyles = {
  position: 'absolute',
  top: 8,
  left: { xs: 8, md: 'auto' },
  right: { xs: 'auto', md: 8 },
  color: 'text.primary',
  zIndex: 10006,
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
}

export const ModalVideoStyles: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  border: 'none',
}