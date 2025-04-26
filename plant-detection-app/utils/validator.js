// validators.js

// Name Validator
export const validateName = (name) => {
  if (!name || name.trim().length < 2) {
    return "Name must be at least 2 characters long.";
  }
  return null;
};

// Email Validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return "Invalid email address.";
  }
  return null;
};

// Password Validation
export const validatePassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,16}$/;

  if (!password) {
    return "Password is required.";
  }

  if (!passwordRegex.test(password)) {
    return "Password must be 8–16 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.";
  }

  return null;
};
