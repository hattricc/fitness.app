// src/pages/PagoExitosoPage.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../../src/lib/supabase";
import { CheckCircle, CrossIcon, Loader2, X } from "lucide-react"; // Add this import at the top
import IconLink from "@/components/atoms/icon-link/IconLink";
import { WhatsApp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";


type ViewState = "checking" | "ok" | "failed" | "error";

interface ConfirmResponse {
    status: string;
    payment_id?: string;
    data?: any;
}

const PagoExitosoPage: React.FC = () => {
    const [state, setState] = useState<ViewState>("checking");
    const [detail, setDetail] = useState<ConfirmResponse | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(10);
    const navigate = useNavigate();
    const [hasBillingInfo, setHasBillingInfo] = useState(false);

    const whatsappContact =
    {
        Icon: <WhatsApp fontSize="small" color="inherit" />,
        Link: "https://wa.me/59170870099",
        Text: "+591 70870099",
    };

    useEffect(() => {
        const confirmPayment = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const invno = params.get("result");   // Livees suele mandar "result" con tu invno
                const orderId = params.get("order_id");

                if (!invno || !orderId) {
                    setState("error");
                    setMessage("Faltan parámetros para validar el pago.");
                    return;
                }

                const auth = await supabase.auth.getSession();
                console.log(auth.data.session?.access_token);

                const { data: liveesData, error } = await supabase.functions.invoke<ConfirmResponse>(
                    "confirm-livees-payment",
                    {
                        body: {
                            invno: invno,
                            order_id: orderId,
                        },
                    }
                );

                if (error) {
                    console.error("Error al confirmar pago:", error);
                    setState("error");
                    setMessage("No se pudo validar el pago. Intenta nuevamente o contáctanos.");
                    return;
                }

                if (!liveesData) {
                    setState("error");
                    setMessage("Respuesta vacía del servidor al validar el pago.");
                    return;
                }

                const { data } = liveesData;
                setDetail(data);

                const { data: paymentsData, error: paymentsError } = await supabase
                    .from("payments")
                    .select("id")
                    .eq("user_id", auth.data.session?.user.id)
                    .not("invoice_info->>nit", "is", null)
                    .neq("invoice_info->>nit", "")
                    .not("invoice_info->>razon_social", "is", null)
                    .neq("invoice_info->>razon_social", "")
                    .limit(1);

                console.log('paymentsData', paymentsData);

                if (paymentsError) {
                    setState("error");
                    setMessage("No se pudo obtener información de pago. Intenta nuevamente o contáctanos.");
                    return;
                }

                const hasBillingInfo = !!paymentsData?.length;
                setHasBillingInfo(hasBillingInfo);

                if (data.status === "paid") {
                    setState("ok");

                    const timer = setInterval(() => {
                        setCountdown((prev) => {
                            if (prev <= 1) {
                                clearInterval(timer);
                                navigate('/');
                                return 0;
                            }
                            return prev - 1;
                        });
                    }, 5000);

                    return () => clearInterval(timer);
                }

                setState("failed");
                setMessage("El pago no fue confirmado correctamente. Si ya se debitó el monto, contáctanos.");
            } catch (err) {
                console.error("Excepción al confirmar pago:", err);
                setState("error");
                setMessage("Ocurrió un error inesperado al validar el pago.");
            }
        };

        confirmPayment();
    }, []);

    if (state === "checking") {
        return (
            <div className="flex flex-col text-center items-center text-black p-2">
                <Loader2
                    size={90}
                    color="#3B82F6" // Blue color
                    className="animate-spin" // Add spinning animation
                    style={{ marginBottom: '1rem' }}
                />
                <h1 className="mb-2 text-2xl">Validando tu pago...</h1>

                <p>Por favor espera unos segundos.</p>
            </div>
        );
    }

    if (state === "ok") {
        return (
            <div className="flex flex-col text-center items-center text-black p-2">
                <CheckCircle
                    size={90}
                    color="#10B981" // Green color
                    style={{ marginBottom: '1rem' }}
                />
                <h1 className="mb-2 text-2xl">¡Pago confirmado!</h1>

                {hasBillingInfo ? (
                    <p className="mb-4">
                        Gracias por tu compra. En breve recibirás más detalles y tu factura en tu correo electrónico.
                    </p>
                ) : (
                    <p className="mb-4">
                        Gracias por tu compra. Tu suscripción ha sido activada correctamente.
                    </p>
                )}

                {detail?.payment_id && (
                    <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#555" }}>
                        ID interno de pago: {detail.payment_id}
                    </p>
                )}

                <Button
                    variant="contained"
                    onClick={() => navigate('/')}
                    sx={
                        {
                            marginTop: '1rem'
                        }
                    }
                >
                    Ir a la página principal
                </Button>
            </div>
        );
    }

    if (state === "failed") {
        return (
            <div className="flex flex-col text-center items-center text-black p-2">
                <X
                    size={90}
                    color="#b91010ff" // Green color
                    style={{ marginBottom: '1rem' }}
                />
                <h1 className="mb-2 text-2xl">Pago no confirmado</h1>
                <p>{message}</p>
                {detail?.data && (
                    <details style={{ marginTop: "1rem", textAlign: "left" }}>
                        <summary>Detalle técnico (Livees)</summary>
                        <pre style={{ fontSize: "0.8rem", whiteSpace: "pre-wrap" }}>
                            {JSON.stringify(detail.data, null, 2)}
                        </pre>
                    </details>
                )}

                <IconLink
                    key={0}
                    icon={whatsappContact.Icon}
                    href={whatsappContact.Link}
                    text={whatsappContact.Text}
                    sx={{
                        marginTop: "2rem",
                    }}
                />
            </div>
        );
    }

    // state === "error"
    return (
        <div className="flex flex-col text-center items-center text-black p-2">
            <X
                size={90}
                color="#b91010ff" // Green color
                style={{ marginBottom: '1rem' }}
            />
            <h1 className="mb-2 text-2xl">Ocurrió un problema al validar tu pago</h1>
            <p>{message}</p>

            <IconLink
                key={0}
                icon={whatsappContact.Icon}
                href={whatsappContact.Link}
                text={whatsappContact.Text}
                sx={{
                    marginTop: "2rem",
                }}
            />
        </div>
    );
};

export default PagoExitosoPage;
