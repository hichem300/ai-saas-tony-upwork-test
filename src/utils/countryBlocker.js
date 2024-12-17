const blockedCountryCodes = new Set(['91', '92', '880']); // Add or remove country codes as needed

const BLOCKED_MESSAGE = "Hi there, we are sorry but this service is not available in your country. However you can join our newsletter to get notified when it is available and to get smarter on AI. Subscribe here for free: https://holywords.ai/news";

function isBlockedCountry(phoneNumber) {
  const countryCode = phoneNumber.slice(0, 2); // Extract the first 2 digits
  const countryCode3 = phoneNumber.slice(0, 3); // Extract the first 3 digits
  console.log(`Extracted country code: ${countryCode}, ${countryCode3}`); // Add this line for debugging
  const isBlocked = blockedCountryCodes.has(countryCode) || blockedCountryCodes.has(countryCode3);
  console.log(`Is blocked: ${isBlocked}`); // Add this line for debugging
  return isBlocked;
}

export { isBlockedCountry, blockedCountryCodes, BLOCKED_MESSAGE };
