// src/app/pages/SubscriptionPage.tsx
import React from 'react';
import { Box, Typography, Container, List, ListItem, ListItemIcon } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import { LiveesPayment } from '../../components/molecules/livees-payment/livees-payment';
import { styled } from '@mui/material/styles';

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

const SubscriptionPage: React.FC = () => {
  const price = 300;
  const comparePrice = 400;

  return (
    <Box sx={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      <Container maxWidth="sm" sx={{ py: 4 }}>
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

        <Box sx={{ mt: 4 }}>
          <LiveesPayment
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
          />
        </Box>
      </Container>
    </Box>
  );
};

export default SubscriptionPage;