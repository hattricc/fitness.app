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
  maxWidth: { xs: 'none', md: 'min(90dvw, calc(90dvh * 16 / 9))' },
  height: { xs: '90dvh', md: 'auto' },
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
  // mobile: bottom-left (away from YouTube controls at top-right and bottom-right)
  // desktop: top-right (standard overlay)
  top: { xs: 'auto', md: 8 },
  bottom: { xs: 8, md: 'auto' },
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