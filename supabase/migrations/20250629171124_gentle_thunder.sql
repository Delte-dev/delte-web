-- Update the reservation URL in site settings
UPDATE public.site_settings 
SET reservation_url = 'https://chachaguayasdriver-reserva.netlify.app/',
    updated_at = now()
WHERE id = 'settings-1';