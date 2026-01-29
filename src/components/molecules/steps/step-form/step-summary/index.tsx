export default function StepSummary({ formData }: any) {
    return (
        <div className="space-y-2 text-sm">
            <p><strong>Nombre:</strong> {formData.name}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>NIT:</strong> {formData.nit}</p>
            <p><strong>Razón Social:</strong> {formData.razonSocial}</p>
        </div>
    )
}
