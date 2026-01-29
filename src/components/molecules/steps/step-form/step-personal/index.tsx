import Input from '@/components/atoms/inputs/mak-input'

export default function StepPersonal({ formData, errors, onChange }: any) {
    return (
        <div className="space-y-4">
            <Input
                label="Nombre"
                name="name"
                value={formData.name}
                error={errors.name}
                onChange={onChange}
            />
            <Input
                label="Email"
                name="email"
                value={formData.email}
                error={errors.email}
                onChange={onChange}
            />
        </div>
    )
}
