// Password validation
const validatePassword = (password) => {
  // Check if password is a string
  if (typeof password !== 'string') return false;
  password = password.trim();

  // At least 8 characters long
  if (password.length < 8) return false;

  // Must contain at least one uppercase letter
  if (!/[A-Z]/.test(password)) return false;

  // Must contain at least one lowercase letter
  if (!/[a-z]/.test(password)) return false;

  // Must contain at least one number
  if (!/[0-9]/.test(password)) return false;

  // Must contain at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;

  return true;
};

// Email validation
const validateEmail = (email) => {
  if (typeof email !== 'string') return false;
  email = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Name validation
const validateName = (name) => {
  if (typeof name !== 'string') return false;
  name = name.trim();
  // Allow alphabets, spaces, apostrophes and hyphens
  return name.length >= 2 && /^[a-zA-Z\s'-]+$/.test(name);
};

module.exports = {
  validatePassword,
  validateEmail,
  validateName
};
