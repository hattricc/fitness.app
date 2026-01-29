export default function StepForm({ step, steps }: any) {
    const StepComponent = steps[step].component
    return (
        <div className="overflow-hidden">
            <div className="transition-all duration-300">
                <StepComponent />
            </div>
        </div>
    )
}
