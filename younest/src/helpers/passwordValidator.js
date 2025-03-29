// helpers/passwordValidators.js
const MIN_LENGTH = 8;
const commonPasswords = [
  'password', '12345678', 'qwerty', 'letmein' // You can extend this list
];

export function validatePassword(password, userAttributes = {}) {
  const errors = [];

  // Minimum Length Check
  if (password.length < MIN_LENGTH) {
    errors.push(`Password must be at least ${MIN_LENGTH} characters long.`);
  }

  // Numeric Check: disallow fully numeric passwords
  if (/^\d+$/.test(password)) {
    errors.push("Password cannot be entirely numeric.");
  }

  // Common Password Check
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push("This password is too common.");
  }

  // Similarity Check (example using a username attribute if provided)
  if (userAttributes.username) {
    const lowerPassword = password.toLowerCase();
    const lowerUsername = userAttributes.username.toLowerCase();
    if (lowerPassword.includes(lowerUsername)) {
      errors.push("Password is too similar to the username.");
    }
  }

  return errors;
}
