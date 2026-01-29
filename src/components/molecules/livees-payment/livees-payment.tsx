import React, { useRef, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useEffect } from "react";
import { ArrowLeft, ArrowRight, Loader2, X } from "lucide-react";
import MakSelectInput from "@/components/atoms/inputs/mak-select-input/mak-select-input";
import { Button, TextField } from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";

// Add this interface at the top of the file
interface BillingFormData {
    document: string
    name: string;
    lastname: string;
    email: string;
    pais: string;
    ciudad: string;
    estado_lbl: string;
    direccion: string;
    zip: string;
    phone: string;
    nombre_factura: string;
    nit: string;
    param2: object[];
}


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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showIframe, setShowIframe] = useState(false);
    const [iframeUrl, setIframeUrl] = useState("");

    const [showPersonalInfoForm, setShowPersonalInfoForm] = useState(true);

    const formRef = useRef<HTMLFormElement | null>(null);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);


    // Inside the LiveesPayment component, add state for the form
    const [formData, setFormData] = useState<BillingFormData>({
        document: '',
        name: '',
        lastname: '',
        email: '',
        pais: 'BO', // Default to Bolivia
        ciudad: '',
        estado_lbl: '',
        direccion: '',
        zip: '',
        phone: '',
        nombre_factura: '',
        nit: '',
        param2: [{ "sku": "001", "name": "Servicio Prueba", "price": "80.00", "quantity": "1" },
        { "sku": "002", "name": "Servicio Prueba 2", "price": "180.00", "quantity": "1" }
        ]
    });



    const [currentStep, setCurrentStep] = useState(0)

    type Errors = Partial<Record<keyof BillingFormData, string>>
    const [errors, setErrors] = useState<Errors>({})

    const [nitAutoFilled, setNitAutoFilled] = useState(true)


    const steps = [
        {
            id: 'personal',
            fields: ['name', 'lastname', 'document', 'email', 'phone'],
            title: 'Datos personales',
        },
        {
            id: 'location',
            fields: ['pais', 'ciudad', 'estado_lbl', 'zip', 'direccion'],
            title: 'Dirección',
        },
        {
            id: 'invoice',
            fields: ['nombre_factura', 'nit'],
            title: 'Facturación',
        },
        { id: 'summary', fields: [] }, // ← IMPORTANTE
    ]
    const validateStep = () => {
        const stepFields = steps[currentStep].fields
        const newErrors: Errors = {}

        stepFields.forEach((field) => {
            const value = formData[field as keyof BillingFormData]

            if (!value || (typeof value === 'string' && !value.trim())) {
                newErrors[field as keyof BillingFormData] = 'Campo obligatorio'
            }

            if (field === 'email' && typeof value === 'string' && value && !value.includes('@')) {
                newErrors.email = 'Correo inválido'
            }
        })

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }


    const nextStep = () => {
        if (!validateStep()) return
        setCurrentStep((s) => s + 1)
    }

    const prevStep = () => {
        setCurrentStep((s) => s - 1)
    }

    const isLastStep = currentStep === steps.length - 1;




    // Inside the LiveesPayment component, add this effect
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setShowPersonalInfoForm(false);
                const { data: { user }, error } = await supabase.auth.getUser();

                if (error) {
                    console.error('Auth error:', error);
                    throw error;
                }

                if (user) {
                    const googleIdentity = user.identities?.find(x => x.provider === 'google');
                    const newData = {
                        email: user.email || googleIdentity?.identity_data?.email || '',
                        name: user.user_metadata?.full_name ||
                            googleIdentity?.identity_data?.full_name ||
                            user.user_metadata?.name ||
                            '',
                        phone: user.phone || formData.phone
                    };

                    setFormData(prev => ({
                        ...prev,
                        ...newData
                    }));

                    setLoading(false);
                }
            } catch (error) {
                console.error('Error in fetchUserData:', error);
            }
            finally {
                setShowPersonalInfoForm(true);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        return () => {
            // Cleanup form
            if (formRef.current && document.body.contains(formRef.current)) {
                document.body.removeChild(formRef.current);
            }

            // Cleanup iframe
            if (iframeRef.current && document.body.contains(iframeRef.current)) {
                document.body.removeChild(iframeRef.current);
            }
        };
    }, []);


    const inputClass = (field: keyof BillingFormData) =>
        `mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 border
   ${errors[field]
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
        }`


    useEffect(() => {
        if (!formData.nombre_factura) {
            setFormData(prev => ({
                ...prev,
                nombre_factura: `${prev.name} ${prev.lastname}`.trim(),
            }))
        }
    }, [formData.name, formData.lastname])

    useEffect(() => {
        if (nitAutoFilled && formData.document) {
            setFormData(prev => ({
                ...prev,
                nit: prev.document,
            }))
        }
    }, [formData.document, nitAutoFilled])




    const closeIframe = () => {
        if (formRef.current && document.body.contains(formRef.current)) {
            document.body.removeChild(formRef.current);
        }
        if (iframeRef.current && document.body.contains(iframeRef.current)) {
            document.body.removeChild(iframeRef.current);
        }
        setShowIframe(false);
        onCancel();
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePay = async () => {
        setLoading(true);
        setError(null);
        setShowPersonalInfoForm(true);

        try {
            const auth = await supabase.auth.getSession();

            if (!auth) {
                setError("No se pudo iniciar el pago porque no ha iniciado sesión.");
                setLoading(false);
                return;
            }

            setError(null);
            setLoading(true);

            // 1) Armar billing_info desde lo que el usuario llenó
            const billing_info = {
                name: formData.name?.trim() ?? "",
                lastname: formData.lastname?.trim() ?? "",
                email: formData.email?.trim() ?? "",
                phone: formData.phone?.trim() ?? "",

                pais: formData.pais ?? "BO",
                ciudad: formData.ciudad?.trim() ?? "",
                estado_lbl: formData.estado_lbl?.trim() ?? "",
                direccion: formData.direccion?.trim() ?? "",
                zip: formData.zip?.trim() ?? "",
            };

            // 2) Armar invoice_info (facturación)
            const invoice_info = {
                nit: formData.nit?.trim() ?? "",
                razon_social: formData.nombre_factura?.trim() ?? "",
                // si quieres guardar también ubicación fiscal:
                pais: formData.pais ?? "BO",
                ciudad: formData.ciudad?.trim() ?? "",
                direccion: formData.direccion?.trim() ?? "",
            };

            // Paso 1: Invocar la edge function
            const { data, error: fnError } = await supabase.functions.invoke(
                "create-livees-payment",
                {
                    body: {
                        product_id: productId,
                        billing_info,
                        invoice_info,
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
                console.log(data);
                setError("Respuesta inválida del servidor.");
                setLoading(false);
                return;
            }

            const { livees, payment } = data;

            // Paso 2: Crear formulario oculto para enviar a Livees
            const form = document.createElement("form");
            formRef.current = form; // Store reference

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
            appendField("postURL", livees.postURL);

            appendField("amt2", price);
            appendField("currency", 'BOB');
            appendField("invno", payment.invno);

            appendField("name", formData.name);
            appendField("lastname", formData.lastname);
            appendField("email", formData.email);
            appendField("pais", formData.pais);
            appendField("ciudad", formData.ciudad);

            appendField("estado_lbl", formData.estado_lbl);
            appendField("direccion", formData.direccion);
            appendField('zip', formData.zip);
            appendField("phone", formData.phone);

            appendField('nombre_factura', formData.nombre_factura);
            appendField('nit', formData.nit);
            appendField('param2', JSON.stringify(formData.param2));

            // Campos de facturación y/o datos extra
            Object.entries(billingInfo).forEach(([key, value]) => {
                appendField(key, value);
            });

            document.body.appendChild(form);

            // Paso 3: Crear iframe donde se cargará el checkout
            let iframe = document.getElementById("livees_iframe") as HTMLIFrameElement;

            if (!iframe) {
                iframeRef.current = iframe; // Store reference

                iframe = document.createElement("iframe");
                iframe.id = "livees_iframe";
                iframe.name = "livees_iframe";
                iframe.style.position = "fixed";
                iframe.style.top = "50%";
                iframe.style.left = "50%";
                iframe.style.transform = "translate(-50%, -50%)";
                iframe.style.width = "90%";
                iframe.style.maxWidth = "800px";
                iframe.style.height = "70vh";
                iframe.style.border = "1px solid #ccc";
                iframe.style.borderRadius = "8px";
                iframe.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
                iframe.style.zIndex = "5000";
                iframe.style.backgroundColor = "white";
                document.body.appendChild(iframe);
                iframeRef.current = iframe; // Store reference AFTER creating and appending
            }

            form.submit();
            setLoading(false);

        } catch (error) {
            console.error('Payment error:', error);
            setError("Error al procesar el pago. Por favor intente nuevamente.");
            setShowIframe(false);
        } finally {
            setLoading(false);

            setShowPersonalInfoForm(false);
        }
    };

    if (loading) {

        return <>
            <div className="flex flex-col text-center items-center text-black p-2">
                <Loader2
                    size={90}
                    color="#3B82F6" // Blue color
                    className="animate-spin" // Add spinning animation
                    style={{ marginBottom: '1rem' }}
                />
                <h1 className="mb-2 text-2xl">Cargando datos...</h1>
            </div>
        </>;
    }

    if (showIframe) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                <div className="relative w-full max-w-4xl h-[80vh] bg-white rounded-lg shadow-xl overflow-hidden">
                    <iframe
                        id="livees_iframe"
                        name="livees_iframe"
                        src={iframeUrl}
                        className="w-full h-full border-0"
                        allowFullScreen
                    />
                    <button
                        onClick={closeIframe}
                        className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>
            </div>
        );
    }


    return (
        <>
            {showPersonalInfoForm && <form className="space-y-4 p-4 flex flex-col justify-center text-black"
                key={formData.email} // This will force a re-render when email changes
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!validateStep()) return;
                    handlePay();
                }}>
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        {currentStep === 0 && (
                            <>
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name || ''}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                                        required
                                    />

                                    {errors.name && (
                                        <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                                        Apellido
                                    </label>
                                    <input
                                        type="text"
                                        id="lastname"
                                        name="lastname"
                                        value={formData.lastname}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                                        required
                                    />

                                    {errors.lastname && (
                                        <p className="text-xs text-red-600 mt-1">{errors.lastname}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="document" className="block text-sm font-medium text-gray-700">
                                        Documento de Identidad
                                    </label>
                                    <input
                                        name="document"
                                        value={formData.document}
                                        onChange={handleInputChange}
                                        className={inputClass('document')}
                                    />

                                    {errors.document && <p className="text-xs text-red-600">{errors.document}</p>}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Correo electrónico
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                        Teléfono
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                                        required
                                    />
                                </div>
                            </>
                        )}


                        {currentStep === 1 && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                    <div>
                                        <label htmlFor="pais" className="block text-sm font-medium text-gray-700">
                                            País
                                        </label>
                                        <MakSelectInput
                                            id="pais"
                                            name="pais"
                                            value={formData.pais || ''}
                                            onChange={(value) => setFormData(prev => ({ ...prev, pais: value }))}
                                            placeholder="Selecciona tu país"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                                            required
                                        />


                                        {errors.pais && (
                                            <p className="text-xs text-red-600 mt-1">{errors.pais}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700">
                                            Ciudad
                                        </label>
                                        <input
                                            type="text"
                                            id="ciudad"
                                            name="ciudad"
                                            value={formData.ciudad}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                                            required
                                        />

                                        {errors.ciudad && (
                                            <p className="text-xs text-red-600 mt-1">{errors.ciudad}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                                    <div>
                                        <label htmlFor="estado_lbl" className="block text-sm font-medium text-gray-700">
                                            Estado/Departamento
                                        </label>
                                        <input
                                            type="text"
                                            id="estado_lbl"
                                            name="estado_lbl"
                                            value={formData.estado_lbl}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                                            required
                                        />

                                        {errors.estado_lbl && (
                                            <p className="text-xs text-red-600 mt-1">{errors.estado_lbl}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                                            Código Postal
                                        </label>
                                        <input
                                            type="text"
                                            id="zip"
                                            name="zip"
                                            value={formData.zip}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                                            required
                                        />

                                        {errors.zip && (
                                            <p className="text-xs text-red-600 mt-1">{errors.zip}</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
                                        Dirección
                                    </label>
                                    <input
                                        type="text"
                                        id="direccion"
                                        name="direccion"
                                        value={formData.direccion}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                                        required
                                    />

                                    {errors.direccion && (
                                        <p className="text-xs text-red-600 mt-1">{errors.direccion}</p>
                                    )}
                                </div>
                            </>
                        )}


                        {currentStep === 2 && (
                            <>
                                <div>
                                    <label htmlFor="nombre_factura" className="block text-sm font-medium text-gray-700">
                                        Razón social
                                    </label>
                                    <input
                                        id="nombre_factura"
                                        name="nombre_factura"
                                        value={formData.nombre_factura}
                                        onChange={(e) => setFormData(prev => ({ ...prev, nombre_factura: e.target.value }))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
                                        required
                                    />

                                    {errors.nombre_factura && (
                                        <p className="text-xs text-red-600 mt-1">{errors.nombre_factura}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="nit" className="block text-sm font-medium text-gray-700">
                                        NIT / CI
                                    </label>
                                    <input
                                        id="nit"
                                        name="nit"
                                        value={formData.nit}
                                        onChange={(e) => {
                                            setNitAutoFilled(false)
                                            setFormData(prev => ({ ...prev, nit: e.target.value }))
                                        }}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                                    />

                                    {errors.nit && (
                                        <p className="text-xs text-red-600 mt-1">{errors.nit}</p>
                                    )}
                                </div>
                            </>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-2 text-sm">
                                <p><b>Nombre:</b> {formData.name} {formData.lastname}</p>
                                <p><b>Email:</b> {formData.email}</p>
                                <p><b>Documento:</b> {formData.document}</p>
                                <p><b>NIT:</b> {formData.nit}</p>
                                <p><b>Razón Social:</b> {formData.nombre_factura}</p>
                            </div>
                        )}


                    </div>

                    {/* <button
                        type="submit"
                        // onClick={handlePay}
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
                        {loading ? "Iniciando pago..." : "Ir a pagar"}
                    </button> */}
                    <div className="flex justify-between pt-6">
                        {currentStep > 0 && (
                            <Button
                                onClick={prevStep}
                                startIcon={<ArrowBackIosNew />}
                            >
                                Anterior
                            </Button>
                        )}


                        {!isLastStep ? (
                            <Button
                                variant="contained"
                                onClick={nextStep}
                                startIcon={<ArrowForwardIos />}
                            >
                                Siguiente
                            </Button>

                        ) : (
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-blue-600 text-white rounded"
                            >
                                {loading ? 'Iniciando pago...' : 'Ir a pagar'}
                            </button>
                        )}
                    </div>


                    {error && (
                        <p style={{ color: "red", marginTop: "10px" }}>
                            {error}
                        </p>
                    )}
                </div>
            </form>}
        </>
    );
};

export default LiveesPayment;
