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
  width: '90dvw',
  maxWidth: '800px',
  height: '90dvh',
  bgcolor: '#1B1B1B',
  boxShadow: 24,
  // p: 2,
  outline: 'none',
}

export const ModalVideoBoxStyles = {
  position: 'relative',
  width: '100%',
  paddingTop: '177.77%', // 16:9 = 56.25%, 9:16 = 177.77%
  borderRadius: 1,
  overflow: 'hidden',
}

export const ModalCloseButtonStyles = {
  position: 'absolute',
  right: 8,
  top: 8,
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