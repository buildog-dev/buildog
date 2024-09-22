export const extractErrorCode = (errorMessage: string): string => {
  const match = errorMessage.match(/\(auth\/[a-zA-Z0-9\-]+\)/);
  return match ? match[0].replace(/[()]/g, "") : "unknown-error";
};
