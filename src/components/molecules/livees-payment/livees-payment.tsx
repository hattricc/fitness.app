import React, { useState } from "react";
import { supabase } from "../../../lib/supabase";

interface LiveesPaymentProps {
    productId: string;
    onSuccess: () => void;
    onCancel: () => void;
    price: number;
    billingInfo?: Record<string, any>;
    invoiceInfo?: Record<string, any>;
}

export const LiveesPayment: React.FC<LiveesPaymentProps> = ({
    productId,
    price,
    onSuccess,
    onCancel,
    billingInfo = {},
    invoiceInfo = {},
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePay = async () => {
        setError(null);
        setLoading(true);

        // Paso 1: Invocar la edge function
        const { data, error: fnError } = await supabase.functions.invoke(
            "create-livees-payment",
            {
                body: {
                    product_id: productId,
                    billing_info: billingInfo,
                    invoice_info: invoiceInfo,
                },
            }
        );

        if (fnError) {
            console.error("Function error:", fnError);
            setError("No se pudo iniciar el pago.");
            setLoading(false);
            return;
        }

        if (!data?.livees || !data?.payment) {
            console.error("Invalid response:", data);
            setError("Respuesta inválida del servidor.");
            setLoading(false);
            return;
        }

        const { livees, payment } = data;

        // Paso 2: Crear formulario oculto para enviar a Livees
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://www.livees.net/Checkout/api4";
        form.target = "livees_iframe";

        const appendField = (name: string, value: string | number) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = name;
            input.value = String(value);
            form.appendChild(input);
        };

        // Campos obligatorios para Livees
        appendField("_", livees.token_comercio);
        appendField("__", livees.llave_recurso);
        // appendField("MontoTotal", payment.amount);
        appendField("MontoTotal", price);
        appendField("invno", payment.invno);
        appendField("postURL", livees.postURL);

        // Campos de facturación y/o datos extra
        Object.entries(billingInfo).forEach(([key, value]) => {
            appendField(key, value);
        });

        document.body.appendChild(form);

        // Paso 3: Crear iframe donde se cargará el checkout
        let iframe = document.getElementById("livees_iframe") as HTMLIFrameElement;

        if (!iframe) {
            iframe = document.createElement("iframe");
            iframe.id = "livees_iframe";
            iframe.name = "livees_iframe";
            iframe.style.width = "100%";
            iframe.style.height = "700px";
            iframe.style.border = "none";
            document.body.appendChild(iframe);
        }

        // Enviar formulario
        form.submit();
        setLoading(false);
    };

    return (
        <div>
            <button
                onClick={handlePay}
                disabled={loading}
                style={{
                    padding: "12px 20px",
                    backgroundColor: "#1A73E8",
                    color: "white",
                    borderRadius: "8px",
                    fontSize: "16px",
                    cursor: "pointer",
                    opacity: loading ? 0.6 : 1,
                }}
            >
                {loading ? "Iniciando pago..." : "Pagar con Livees"}
            </button>

            {error && (
                <p style={{ color: "red", marginTop: "10px" }}>
                    {error}
                </p>
            )}
        </div>
    );
};

export default LiveesPayment;
