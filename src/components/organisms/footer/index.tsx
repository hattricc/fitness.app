import { Typography, Box, Link, Stack } from '@mui/material';
import { Instagram, EmailOutlined, WhatsApp } from '@mui/icons-material';
import React from 'react';
import IconLink from '@/components/atoms/icon-link/IconLink';

const Footer: React.FC = () => {
    const links = [
        {
            Icon: <Instagram fontSize="small" color="inherit" />,
            Link: "https://instagram.com/luissuarezf4f",
            Text: "@luissuarezf4f",
        },
        {
            Icon: <EmailOutlined fontSize="small" color="inherit" />,
            Link: "mailto:luissuarezf4f@gmail.com",
            Text: "luissuarezf4f@gmail.com",
        },
        {
            Icon: <WhatsApp fontSize="small" color="inherit" />,
            Link: "https://wa.me/59170870099",
            Text: "+591 70870099",
        }
    ]

    return (
        <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
                Contactos
            </Typography>

            <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', mt: 1, mb: 1 }}>
                {links.map((link, index) => (
                    <IconLink
                        key={index}
                        icon={link.Icon}
                        href={link.Link}
                        text={link.Text}
                    />
                ))}
            </Box>
            <hr />

            <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                Luis Suarez – Entrenamiento e Integración
            </Typography>
            <hr />

            <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                © {new Date().getFullYear()} Luis Suarez – Entrenamiento e Integración. Todos los derechos reservados.
            </Typography>

            <Typography variant="body2" sx={{ mt: 1 }}>
                Desarrollado por Raiden Makio
            </Typography>
        </Box>
    );
};

export default Footer;
