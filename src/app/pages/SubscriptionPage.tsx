// src/app/pages/SubscriptionPage.tsx
import React, { useState } from 'react';
import { Box, Typography, Container, List, ListItem, ListItemIcon, Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import { LiveesPayment } from '../../components/molecules/livees-payment/livees-payment';
import { styled } from '@mui/material/styles';

import { useAuth } from '../../contexts/auth/AuthContext';
import LoginForm from '../../components/organisms/login';

const PriceContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: '24px 0',
  padding: '16px',
  border: '1px solid #E0E0E0',
  borderRadius: '8px',
  backgroundColor: '#FAFAFA',
});


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

const SubscriptionPage: React.FC = () => {
  const price = 499;
  const comparePrice = 700;


  const auth = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleSuccessfulLogin = () => {
    setShowAuthModal(false);
    setShowPaymentModal(true);
  };
  const subscribe = () => {
    // alert('subscribe');
    // TODO RECONOCER SI HA INICIADO SESION
    // if (!user) {
    //   console.log('Loading...');
    //   console.log('user, ', user);
    //   return; // Wait for auth state to load
    // }

    console.log(auth)

    if (auth.user) {
      // User is logged in, show payment modal
      setShowPaymentModal(true);
      console.log('User is logged in');
    } else {
      // User is not logged in, show auth modal
      setShowAuthModal(true);
      console.log('User is not logged in');
    }
    // TODO SI HA INICIADO SESION, MOSTRAR MODAL DE PAGO DE LIVEES CHECKOUT
    // TODO SI NO HA INICIADO SESION, MOSTRAR EL LOGIN Y EXPLICAR QUE PARA SUSCRIBIRSE DEBE INICIAR SESION
  }

  return (
    <Box sx={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      <Container maxWidth="sm" sx={{ pb: 4 }}>
        <Typography variant="h4" component="h1" align="left" sx={{
          color: '#1B1B1B',
          mb: 2,
          fontWeight: 700
        }}>
          Acceso Permanente
        </Typography>

        <Typography variant="h5" align="left" sx={{
          color: '#363B5F',
          mb: 2,
          fontWeight: 600
        }}>
          Por solo el valor de un mes en el gimnasio
        </Typography>

        <Typography variant="body2" sx={{
          color: '#E57952',
          mb: 3,
          fontWeight: 500
        }}>
          Tu suscripción no caducará ni requerirá renovación mensual.
        </Typography>

        <Box sx={{ my: 3 }}>
          <Typography variant="h6" sx={{
            color: '#1B1B1B',
            mb: 2,
            fontWeight: 600
          }}>
            Beneficios de la suscripción
          </Typography>
          <List sx={{ p: 0 }}>
            {[
              "Todas las rutinas de entrenamiento.",
              "Cursos didácticos con explicaciones sencillas.",
              "Actualizaciones periódicas del material."
            ].map((item, index) => (
              <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32, color: '#E57952' }}>
                  <CheckIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="body1" sx={{ color: '#1B1B1B' }}>{item}</Typography>
              </ListItem>
            ))}
          </List>
        </Box>

        <PriceContainer>
          <Box>
            <Typography variant="h6" sx={{ color: '#1B1B1B', fontWeight: 600 }}>Acceso de por vida</Typography>
            <Typography variant="body2" sx={{ color: '#9BB9F1' }}>
              Un solo pago, para siempre
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h5" sx={{ color: '#E57952', fontWeight: 700 }}>
              Bs. {price}
            </Typography>
            <Typography variant="body2" sx={{ color: '#9BB9F1', textDecoration: 'line-through' }}>
              Bs {comparePrice}.00/mes
            </Typography>
          </Box>
        </PriceContainer>

        <Typography variant="caption" display="block" sx={{
          color: '#9BB9F1',
          textAlign: 'left',
          mt: 1,
          mb: 2
        }}>
          El costo de un entrenador personal: Bs {comparePrice}.00/mes
        </Typography>

        {/* <Box sx={{ mt: 4 }}> */}
        {/* <button onClick={subscribe}>Suscribirse</button> */}
        <StyledButton
          variant="contained"
          size="large"
          onClick={subscribe}
        >
          ¡Quiero suscribirme!
        </StyledButton>
        {/* <LiveesPayment
            productId="20aed83a-e811-42b2-948f-a8d1a22d1bbf"
            billingInfo={{
              customer_name: 'Nombre del Cliente',
              customer_email: 'cliente@ejemplo.com',
              customer_phone: '1234567890'
            }}
            invoiceInfo={{
              description: 'Suscripción de Acceso Permanente',
              amount: price.toString()
            }}
          /> */}
        {/* </Box> */}
      </Container>



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
            title="Iniciar sesión requerido"
            subtitle="Para suscribirte, primero debes iniciar sesión o crear una cuenta."
            onSuccess={handleSuccessfulLogin}
            onClose={() => setShowAuthModal(false)}
          />
        </DialogContent>
      </Dialog>
      {/* Payment Modal */}
      <Dialog
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Completa tu suscripción</DialogTitle>
        <DialogContent>
          <LiveesPayment
            productId="20aed83a-e811-42b2-948f-a8d1a22d1bbf"
            price={price}
            onSuccess={() => {
              setShowPaymentModal(false);
              // Handle successful payment
            }}
            onCancel={() => setShowPaymentModal(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SubscriptionPage;