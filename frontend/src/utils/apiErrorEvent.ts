export const API_ERROR_EVENT = 'credentix-api-error';

export function dispatchApiError(message: string): void {
  window.dispatchEvent(new CustomEvent(API_ERROR_EVENT, { detail: { message } }));
}
