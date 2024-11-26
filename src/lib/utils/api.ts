import { supabase } from '../config/supabase';

export async function fetchWithAuth(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const session = await supabase.auth.getSession();
  const headers = new Headers(init?.headers);
  
  if (session.data.session?.access_token) {
    headers.set('Authorization', `Bearer ${session.data.session.access_token}`);
  }

  return fetch(input, {
    ...init,
    headers,
  });
}

export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
}