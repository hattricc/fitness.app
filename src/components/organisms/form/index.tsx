type FormData = {
    name: string
    email: string
    nit: string
    razonSocial: string
}

type Errors = Partial<Record<keyof FormData, string>>

import { useState } from 'react'
import StepPersonal from '../../molecules/steps/step-form/step-personal'
import StepNit from '../../molecules/steps/step-form/step-nit'
import StepSummary from '../../molecules/steps/step-form/step-summary'
import StepNavigation from '../../molecules/steps/step-form/step-navigation'

const steps = [
    {
        id: 'personal',
        fields: ['name', 'email'] as (keyof FormData)[],
        component: StepPersonal,
    },
    {
        id: 'nit',
        fields: ['nit', 'razonSocial'] as (keyof FormData)[],
        component: StepNit,
    },
    {
        id: 'summary',
        fields: [] as (keyof FormData)[],
        component: StepSummary,
    },
]

export default function LiveesForm() {
    const [currentStep, setCurrentStep] = useState(0)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        nit: '',
        razonSocial: '',
    })
    const [errors, setErrors] = useState<Errors>({})

    const validateStep = () => {
        const stepFields = steps[currentStep].fields
        const newErrors: Errors = {}

        stepFields.forEach((field) => {
            if (!formData[field]) {
                newErrors[field] = 'Campo obligatorio'
            }
            if (field === 'email' && !formData.email.includes('@')) {
                newErrors.email = 'Email inválido'
            }
        })

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const next = () => {
        if (currentStep === steps.length - 1) {
            console.log('SUBMIT', formData)
            return
        }

        if (!validateStep()) return
        setCurrentStep((s) => s + 1)
    }

    const back = () => {
        setCurrentStep((s) => s - 1)
    }

    const StepComponent = steps[currentStep].component

    return (
        <div className="max-w-md mx-auto p-6 border rounded">
            <StepComponent
                formData={formData}
                errors={errors}
                onChange={(e: any) =>
                    setFormData({ ...formData, [e.target.name]: e.target.value })
                }
            />

            <StepNavigation
                isFirst={currentStep === 0}
                isLast={currentStep === steps.length - 1}
                onBack={back}
                onNext={next}
            />
        </div>
    )
}
