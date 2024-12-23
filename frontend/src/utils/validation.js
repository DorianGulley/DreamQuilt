// validation.js

export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validateSignupForm = (formData) => {
  const errors = {};

  if (!validateEmail(formData.email)) {
    errors.email = 'Invalid email address';
  }
  if (formData.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }
  if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  if (!formData.agreedToTerms) {
    errors.agreedToTerms = 'Field Required';
  }

  return errors;
};
