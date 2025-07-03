-- Update the reservation URL in site settings to the correct link
UPDATE public.site_settings 
SET reservation_url = 'https://cutt.ly/Chacha-Guayas-Driver-Reserva',
    updated_at = now()
WHERE id = 'settings-1';