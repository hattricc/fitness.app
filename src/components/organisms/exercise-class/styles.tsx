

export const ModalStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  outline: 'none',
  zIndex: 1000,
}

export const ModalBoxStyles = {
  position: 'relative',
  width: '90%',
  maxWidth: '800px',
  bgcolor: '#1B1B1B',
  borderRadius: 6,
  boxShadow: 24,
  p: 2,
  outline: 'none',
}

export const ModalVideoBoxStyles = {
    position: 'relative',
    width: '100%',
    paddingTop: '56.25%', // 16:9 aspect ratio
    borderRadius: 1,
    overflow: 'hidden',
}

export const ModalCloseButtonStyles = {
  position: 'absolute',
  right: 8,
  top: 8,
  color: 'text.primary',
  zIndex: 1000,
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
}

export const ModalVideoStyles = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  border: 'none',
}