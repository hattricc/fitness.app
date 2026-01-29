type Props = {
    label: string
    name: string
    value: string
    error?: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function Input({ label, name, value, error, onChange }: Props) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">{label}</label>
            <input
                name={name}
                value={value}
                onChange={onChange}
                className={`border rounded px-3 py-2 focus:outline-none ${error ? 'border-red-500' : 'border-gray-300'
                    }`}
            />
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    )
}
