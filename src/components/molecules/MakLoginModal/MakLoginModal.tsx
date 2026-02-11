import {
    Dialog,
    DialogContent,
} from '@mui/material';
import LoginForm from '@/components/organisms/login/index.tsx';

interface MakLoginModalProps {
    showAuthModal: boolean;
    setShowAuthModal: (value: boolean) => void;
}

export function MakLoginModal({ showAuthModal, setShowAuthModal }: MakLoginModalProps) {
    return (
        <Dialog
            open={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    overflow: 'visible',
                    borderRadius: 6,
                }
            }}
        >
            <DialogContent sx={{ p: 0, '&.MuiDialogContent-root': { p: 0 } }}>
                <LoginForm
                    title="Para suscribirte, primero debes iniciar sesión"
                    subtitle="Una vez registrado, serás dirigido al formulario de pago para completar el proceso."
                    inSubscriptionPage={true}
                    onSuccess={() => {
                        setShowAuthModal(false);
                        // setShowPaymentModal(true);
                    }}
                    onClose={() => setShowAuthModal(false)}
                />
            </DialogContent>
        </Dialog>
    );
}

export default MakLoginModal;
