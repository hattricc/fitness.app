import { Button, Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, useTheme } from '@mui/material';
import { AccountCircle, Facebook, Google, Login, Payment, Person } from '@mui/icons-material';
import { Theme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGoogleAvatarUrl, UserSession } from '@/lib/userSession';
import { UserImage } from '@/components/atoms/user-image/UserImage';

interface UserMenuProps {
    user: UserSession | null;
}

const UserMenu: React.FC<UserMenuProps> = ({
    user,
}) => {
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);


    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        handleClose();
    };
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    
    const [image, setImage] = useState('');
    useEffect(() => {
        setImage(getGoogleAvatarUrl(user));
    }, [user]);

    return (
        <>
            <IconButton
                size="large"
                color="inherit"
                aria-label="account"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
            >
                <UserImage user={user} imageUrl={image} />
            </IconButton>


            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                        mt: 1.5,
                        bgcolor: '#1B1B1B',
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: '#1B1B1B',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
            >
                {!user && (
                    <>
                        <MenuItem
                            onClick={() => handleNavigation('/login')}
                            sx={{
                                color: '#ffffff',
                                '&:hover': {
                                    backgroundColor: '#333333',
                                }
                            }}
                        >
                            <ListItemIcon>
                                <Login fontSize="small" sx={{ color: '#ffffff' }} />
                            </ListItemIcon>
                            <ListItemText>Iniciar sesión</ListItemText>
                        </MenuItem>

                        <Divider sx={{ backgroundColor: '#333333' }} />

                        <MenuItem
                            onClick={() => handleNavigation('/subscription')}
                            sx={{
                                color: '#ffffff',
                                '&:hover': {
                                    backgroundColor: '#333333',
                                }
                            }}
                        >
                            <ListItemIcon>
                                <Payment fontSize="small" sx={{ color: '#ffffff' }} />
                            </ListItemIcon>
                            <ListItemText>Inscribirse</ListItemText>
                        </MenuItem>

                        {/* <Divider sx={{ backgroundColor: '#333333' }} />

                        <MenuItem
                            onClick={() => handleNavigation('/signup')}
                            sx={{
                                color: '#ffffff',
                                '&:hover': {
                                    backgroundColor: '#333333',
                                }
                            }}
                        >
                            <ListItemIcon>
                                <Person fontSize="small" sx={{ color: '#ffffff' }} />
                            </ListItemIcon>
                            <ListItemText>Crear cuenta</ListItemText>
                        </MenuItem> */}
                    </>
                )}

                {user && (
                    <>
                        <MenuItem
                            onClick={() => handleNavigation('/signout')}
                            sx={{
                                color: '#ffffff',
                                '&:hover': {
                                    backgroundColor: '#333333',
                                }
                            }}
                        >
                            <ListItemIcon>
                                <Person fontSize="small" sx={{ color: '#ffffff' }} />
                            </ListItemIcon>
                            <ListItemText>Cerrar sesión</ListItemText>
                        </MenuItem>
                    </>
                )}
            </Menu>
        </>
    );
}

export default UserMenu;
