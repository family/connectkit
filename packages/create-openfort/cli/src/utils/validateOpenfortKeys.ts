// Validation patterns for Openfort and Shield API keys

const uuidV4Pattern =
  "[\\da-f]{8}-[\\da-f]{4}-[\\da-f]{4}-[\\da-f]{4}-[\\da-f]{12}";
const keyPattern = `(test|live)_${uuidV4Pattern}`;
const skRegex = new RegExp(`^sk_${keyPattern}$`);
const pkRegex = new RegExp(`^pk_${keyPattern}$`);
const uuidV4Regex = new RegExp(`^${uuidV4Pattern}$`);
const length44Regex = /^.{44}$/;

export const validateOpenfortPublishableKey = (
  value: string,
): string | undefined => {
  if (!value) {
    return "Openfort Publishable Key is required";
  }
  if (!pkRegex.test(value)) {
    return "Openfort Publishable Key is invalid (expected format: pk_test_... or pk_live_...)";
  }
  return undefined;
};

export const validateOpenfortSecretKey = (
  value: string,
): string | undefined => {
  if (!value) {
    return "Openfort Secret Key is required";
  }
  if (!skRegex.test(value)) {
    return "Openfort Secret Key is invalid (expected format: sk_test_... or sk_live_...)";
  }
  return undefined;
};

export const validateShieldPublishableKey = (
  value: string,
): string | undefined => {
  if (!value) {
    return "Shield Publishable Key is required";
  }
  if (!uuidV4Regex.test(value)) {
    return "Shield Publishable Key is invalid (expected UUID format)";
  }
  return undefined;
};

export const validateShieldSecret = (value: string): string | undefined => {
  if (!value) {
    return "Shield Secret is required";
  }
  // Shield secret doesn't have a specific format, so just check it's not empty
  return undefined;
};

export const validateShieldEncryptionShare = (
  value: string,
): string | undefined => {
  if (!value) {
    return "Shield Encryption Share is required";
  }
  if (!length44Regex.test(value)) {
    return "Shield Encryption Share is invalid (expected 44 characters)";
  }
  return undefined;
};

export const validateApiEndpoint = (value: string): string | undefined => {
  if (!value) {
    return "API endpoint is required";
  }
  try {
    new URL(value);
  } catch {
    return "API endpoint must be a valid URL";
  }
  return undefined;
};

// Validate API endpoint by making a request
export const testApiEndpoint = async (endpoint: string): Promise<boolean> => {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const body = (await response.json()) as { session?: string };
    return !!body.session;
  } catch {
    return false;
  }
};
