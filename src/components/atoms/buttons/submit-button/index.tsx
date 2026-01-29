type Props = {
    label: string
    onClick?: () => void
    type?: 'button' | 'submit'
}

export default function SubmitButton({ label, onClick, type = 'button' }: Props) {
    return (
        <button
            type={type}
            onClick={onClick}
            className="px-6 py-2 rounded bg-black text-white hover:bg-gray-800"
        >
            {label}
        </button>
    )
}
