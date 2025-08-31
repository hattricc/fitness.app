import { useState } from 'react';

type FormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export const useAuthForm = (initialValues: FormValues) => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
    
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!values.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!values.password) {
      newErrors.password = 'Password is required';
    } else if (values.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!values.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (values.confirmPassword !== values.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    setErrors,
    setIsSubmitting,
    validate,
  };
};
