import { JoinFullSharp } from "@mui/icons-material";



// Hover animation variants
export const hoverAnimations = {
    smoothGlow: {
        opacity: 0.9,
        transition: 'opacity 0.3s ease',
    },
    lift: {
        transform: 'translateY(-4px)',
        boxShadow: 8,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    },
    scale: {
        transform: 'scale(1.02)',
        boxShadow: 6,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    },
    pulse: {
        animation: 'pulse 2s infinite',
        '@keyframes pulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.02)' },
            '100%': { transform: 'scale(1)' }
        }
    },
    glow: {
        '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 'inherit',
            boxShadow: '0 0 15px rgba(255,255,255,0.3)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
        },
        '&:hover::after': {
            opacity: 1,
        }
    }
};

interface CardStyleOptions {
    borderRadius: number;
    mb?: number;
    hoverEffect?: keyof typeof hoverAnimations;
}

const createCardStyles = ({ borderRadius, mb = 2, hoverEffect = 'smoothGlow' }: CardStyleOptions) => ({
    borderRadius,
    boxShadow: 3,
    overflow: 'hidden',
    cursor: 'pointer',
    position: 'relative',
    backgroundColor: '#1B1B1B',
    display: 'flex',
    alignItems: 'center',
    px: 3,
    py: 1,
    mb,
    '&:hover': {
        ...hoverAnimations[hoverEffect],
    },
    ...(hoverEffect === 'glow' && hoverAnimations.glow)
});

// Create style variants
export const CardStyles = createCardStyles({ borderRadius: 6 });
export const CardStylesSquared = createCardStyles({ borderRadius: 0, mb: 0 });
export const CardStylesRounded = createCardStyles({ borderRadius: 18 });



interface PlayArrowBoxStyleOptions {
    borderRadius: number;
}

const createPlayArrowBoxStyles = ({ borderRadius }: PlayArrowBoxStyleOptions) => ({
    transition: 'all 0.3s',
    '& .MuiSvgIcon-root': {
        backgroundColor: 'white',
        borderRadius,
        padding: 1,
        // boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }
});

export const PlayArrowBoxStyles = createPlayArrowBoxStyles({ borderRadius: 6 });
export const PlayArrowBoxStylesRounded = createPlayArrowBoxStyles({ borderRadius: 50 });



export const TextContainerStyles = {
    width: '100%',
    py: 2,
    display: 'flex',
    flexDirection: 'column',
}

export const ChipContainerStyles = {
    display: 'flex',
    gap: 1,
    flexWrap: 'wrap',
    width: '60%'
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
