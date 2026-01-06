import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    Box,
    List,
    ListItem,
    ListItemIcon,
    styled,
} from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PriceContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '24px 0',
    padding: '16px',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '8px',
    backgroundColor: theme.palette.background.paper,
}));

const StyledButton = styled(Button)({
    marginTop: '16px',
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'none',
    width: '100%',
    background: 'linear-gradient(45deg, #E57952 30%, #9BB9F1 90%)',
    color: '#1B1B1B',
    '&:hover': {
        background: 'linear-gradient(45deg, #D46A44 30%, #8AA9E1 90%)',
    }
});

interface MakModalProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
}

export function MakModal({ openModal, setOpenModal } : MakModalProps) {
    // const [open, setOpen] = useState(false);
    const price = 499;
    const comparePrice = 700;
    const navigate = useNavigate();

    return (
        <Box>
            {/* <Button
                variant="contained"
                onClick={() => setOpen(true)}
                sx={{
                    textTransform: 'none',
                    background: 'linear-gradient(45deg, #E57952 30%, #9BB9F1 90%)',
                    color: '#1B1B1B',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #D46A44 30%, #8AA9E1 90%)',
                    }
                }}
            >
                Obtener Acceso Premium
            </Button> */}

            <Dialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        background: '#1B1B1B',
                        color: '#FFFFFF',
                        '& .MuiDialogTitle-root': {
                            color: '#FFFFFF',
                            padding: '24px 24px 8px'
                        },
                        '& .MuiDialogContent-root': {
                            padding: '8px 24px 24px'
                        }
                    }
                }}
            >
                <DialogTitle variant="h4" align="center" sx={{ pb: 1, color: '#FFFFFF' }}>
                    Obtén acceso permanente
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" align="center" sx={{ color: '#E57952', mb: 3 }}>
                        Tu suscripción no caducará ni requerirá renovación mensual.
                    </Typography>

                    <PriceContainer>
                        <Box>
                            <Typography variant="h6" sx={{ color: '#FFFFFF' }}>Acceso de por vida</Typography>
                            <Typography variant="body2" sx={{ color: '#9BB9F1' }}>
                                Un solo pago, para siempre
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h5" sx={{ color: '#E57952' }}>
                                Bs. {price}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#9BB9F1', textDecoration: 'line-through' }}>
                                Bs {comparePrice}.00/mes
                            </Typography>
                        </Box>
                    </PriceContainer>

                    <Typography variant="caption" display="block" sx={{ color: '#9BB9F1', textAlign: 'center', mt: 1 }}>
                        El costo de un entrenador personal: Bs {comparePrice}.00/mes
                    </Typography>

                    <StyledButton
                        variant="contained"
                        size="large"
                        onClick={() => {
                            setOpenModal(false)
                            navigate('/subscription')
                        }}
                    >
                        ¡Quiero suscribirme!
                    </StyledButton>
                </DialogContent>
            </Dialog>
        </Box>
    );
}