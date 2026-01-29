import SubmitButton from '@/components/atoms/buttons/submit-button'

export default function StepNavigation({
    isFirst,
    isLast,
    onBack,
    onNext,
}: any) {
    return (
        <div className="flex justify-between mt-6">
            {!isFirst && <SubmitButton label="Atrás" onClick={onBack} />}
            <SubmitButton
                label={isLast ? 'Enviar' : 'Siguiente'}
                onClick={onNext}
            />
        </div>
    )
}
