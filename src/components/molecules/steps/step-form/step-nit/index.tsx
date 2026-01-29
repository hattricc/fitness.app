import Input from '@/components/atoms/inputs/mak-input'

export default function StepNit({ formData, errors, onChange }: any) {
    return (
        <div className="space-y-4">
            <Input
                label="NIT"
                name="nit"
                value={formData.nit}
                error={errors.nit}
                onChange={onChange}
            />
            <Input
                label="Razón Social"
                name="razonSocial"
                value={formData.razonSocial}
                error={errors.razonSocial}
                onChange={onChange}
            />
        </div>
    )
}
