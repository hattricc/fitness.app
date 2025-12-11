// src/pages/PagoExitosoPage.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../../src/lib/supabase";

type ViewState = "checking" | "ok" | "failed" | "error";

interface ConfirmResponse {
    status: string;
    payment_id?: string;
    livees_response?: any;
}

const PagoExitosoPage: React.FC = () => {
    const [state, setState] = useState<ViewState>("checking");
    const [detail, setDetail] = useState<ConfirmResponse | null>(null);
    const [message, setMessage] = useState<string | null>(null);

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

                const { data, error } = await supabase.functions.invoke<ConfirmResponse>(
                    "confirm-livees-payment",
                    {
                        body: {
                            invno,
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

                if (!data) {
                    setState("error");
                    setMessage("Respuesta vacía del servidor al validar el pago.");
                    return;
                }

                setDetail(data);

                if (data.status === "paid") {
                    setState("ok");
                } else {
                    setState("failed");
                    setMessage("El pago no fue confirmado correctamente. Si ya se debitó el monto, contáctanos.");
                }
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
            <div style={{ padding: "2rem", textAlign: "center" }}>
                <h1>Validando tu pago...</h1>
                <p>Por favor espera unos segundos.</p>
            </div>
        );
    }

    if (state === "ok") {
        return (
            <div style={{ padding: "2rem", textAlign: "center" }}>
                <h1>¡Pago confirmado!</h1>
                <p>Gracias por tu compra. En breve recibirás más detalles en tu correo.</p>
                {detail?.payment_id && (
                    <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#555" }}>
                        ID interno de pago: {detail.payment_id}
                    </p>
                )}
            </div>
        );
    }

    if (state === "failed") {
        return (
            <div style={{ padding: "2rem", textAlign: "center" }}>
                <h1>Pago no confirmado</h1>
                <p>{message}</p>
                {detail?.livees_response && (
                    <details style={{ marginTop: "1rem", textAlign: "left" }}>
                        <summary>Detalle técnico (Livees)</summary>
                        <pre style={{ fontSize: "0.8rem", whiteSpace: "pre-wrap" }}>
                            {JSON.stringify(detail.livees_response, null, 2)}
                        </pre>
                    </details>
                )}
            </div>
        );
    }

    // state === "error"
    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
            <h1>Ocurrió un problema al validar tu pago</h1>
            <p>{message}</p>
        </div>
    );
};

export default PagoExitosoPage;
