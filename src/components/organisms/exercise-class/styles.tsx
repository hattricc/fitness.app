
export const CardStyles = {
    borderRadius: 18,
    boxShadow: 3,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: 6,
    },
    position: 'relative',
    backgroundColor: '#1B1B1B',
    display: 'flex',
    alignItems: 'center',
    px: 3,
    py: 1,
}

export const PlayArrowBoxStyles = {
    transition: 'all 0.3s',
    '& .MuiSvgIcon-root': {
        backgroundColor: 'white',
        borderRadius: '50%',
        padding: 1,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }
}

export const TextContainerStyles = {
    width: '60%',
    p: 3,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
}

export const ExerciseNameStyles = {
    color: 'text.primary',
    mb: 0.5,
    lineHeight: 1.2,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxHeight: '2.8em'
}

export const ExerciseDurationStyles = {
    borderRadius: 2,
    bgcolor: 'background.default',
    borderColor: 'divider',
    height: 24,
    '& .MuiChip-label': {
        px: 1,
        color: 'text.secondary',
    },
    '& .MuiSvgIcon-root': {
        fontSize: '0.9rem',
        color: 'text.secondary',
    },
    mr: 2,
    flexWrap: 'wrap',
}

export const ExerciseRepetitionsStyles = {
    textOverflow: 'ellipsis',
}

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
    borderRadius: 2,
    boxShadow: 24,
    p: 2,
    outline: 'none',
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