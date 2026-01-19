// src/components/molecules/icon-link/IconLink.tsx
import { Stack, Link, SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';

interface IconLinkProps {
    icon: ReactNode;
    href: string;
    text: string;
    color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
    underline?: 'always' | 'hover' | 'none';
    target?: '_blank' | '_self' | '_parent' | '_top';
    rel?: string;
    spacing?: number;
    sx?: SxProps<Theme>;
}

const IconLink: React.FC<IconLinkProps> = ({
    icon,
    href,
    text,
    color = 'inherit',
    underline = 'always',
    target = '_blank',
    rel = 'noopener noreferrer',
    spacing = 1,
    sx = {}
}) => {
    return (
        <Stack
            direction="row"
            alignItems="center"
            spacing={spacing}
            color="text.secondary"
            sx={sx}
        >
            {icon}
            <Link
                href={href}
                target={target}
                rel={rel}
                underline={underline}
                color={color}
                sx={{ whiteSpace: 'pre' }}
            >
                {text}      ↗
            </Link>
        </Stack>
    );
};

export default IconLink;