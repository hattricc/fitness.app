// src/app/pages/SubscriptionPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, Paper, Alert } from '@mui/material';
import { LiveesPayment } from '../../components/molecules/livees-payment/livees-payment';

const SubscriptionPage: React.FC = () => {
    const [plan, setPlan] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Mock product ID - replace with your actual product ID from Livees
    const productId = '20aed83a-e811-42b2-948f-a8d1a22d1bbf';

    const handlePaymentSuccess = (data: any) => {
        console.log('Payment successful:', data);
        navigate('/pago-exitoso');
    };

    const handlePaymentError = (error: any) => {
        console.error('Payment error:', error);
        setError('Ocurrió un error al procesar el pago. Por favor, inténtalo de nuevo.');
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
                    Suscripción Premium
                </Typography>

                <Typography variant="body1" paragraph>
                    Desbloquea todas las funciones premium con nuestra suscripción mensual.
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <LiveesPayment
                        productId={productId}
                        billingInfo={{
                            customer_name: 'Nombre del Cliente', // Get from user input or auth
                            customer_email: 'cliente@ejemplo.com', // Get from user input or auth
                            customer_phone: '1234567890' // Get from user input
                        }}
                        invoiceInfo={{
                            description: 'Suscripción Mensual Premium',
                            amount: '29.99' // Should match your Livees product price
                        }}
                    />
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Beneficios de la suscripción:
                    </Typography>
                    <ul>
                        <li>Acceso completo a todos los entrenamientos</li>
                        <li>Planes de entrenamiento personalizados</li>
                        <li>Soporte prioritario</li>
                        <li>Sin anuncios</li>
                    </ul>
                </Box>
            </Paper>
        </Container>
    );
};

export default SubscriptionPage;


// TODO: 1. Add loading state while payment is being processed
// TODO: 2. Add form validation for billing information
// TODO: 3. Fetch subscription plans from an API instead of hardcoding
// TODO: 4. Add user authentication check and pre-fill user data
// TODO: 5. Implement different subscription tiers (monthly/yearly)
// TODO: 6. Add success/error modals instead of just console logs
// TODO: 7. Add loading skeletons for better UX
// TODO: 8. Implement i18n for multi-language support
// TODO: 9. Add terms and conditions checkbox
// TODO: 10. Add payment method selection if multiple are available
// TODO: 11. Implement retry logic for failed payments
// TODO: 12. Add analytics tracking for subscription events
// TODO: 13. Add test IDs for better testing
// TODO: 14. Implement responsive design improvements
// TODO: 15. Add success animation after payment
// TODO: 16. Add subscription management section for existing subscribers
// TODO: 17. Implement coupon code functionality
// TODO: 18. Add FAQ section about billing and subscriptions
// TODO: 19. Add currency selection if international payments are supported
// TODO: 20. Implement proper error boundaries