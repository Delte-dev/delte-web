import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SupportCard } from '../types';
import { initialSupportCards } from '../data/initialData';

export function useSupportCards() {
  const [cards, setCards] = useState<SupportCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load cards from Supabase
  const loadCards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('support_cards')
        .select('*')
        .order('title');

      if (error) throw error;

      if (data && data.length > 0) {
        setCards(data as SupportCard[]);
      } else {
        // If no data in Supabase, use initial data locally
        setCards(initialSupportCards);
      }
    } catch (err) {
      console.error('Error loading cards:', err);
      setError('Error al cargar las publicaciones. Usando datos locales.');
      // Fallback to initial data
      setCards(initialSupportCards);
    } finally {
      setLoading(false);
    }
  };

  // Save card to Supabase
  const saveCard = async (card: SupportCard) => {
    try {
      setError(null);
      const existingCard = cards.find(c => c.id === card.id);
      
      if (existingCard) {
        // Update existing card
        const { error } = await supabase
          .from('support_cards')
          .update({
            ...card,
            updated_at: new Date().toISOString()
          })
          .eq('id', card.id);

        if (error) throw error;
      } else {
        // Insert new card
        const { error } = await supabase
          .from('support_cards')
          .insert({
            ...card,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
      }

      // Reload cards to get updated data
      await loadCards();
      return true;
    } catch (err) {
      console.error('Error saving card:', err);
      setError('Error al guardar la publicación');
      return false;
    }
  };

  // Delete card from Supabase
  const deleteCard = async (cardId: string) => {
    try {
      setError(null);
      
      const { error } = await supabase
        .from('support_cards')
        .delete()
        .eq('id', cardId);

      if (error) throw error;

      // Remove from local state immediately
      setCards(prev => prev.filter(c => c.id !== cardId));
      return true;
    } catch (err) {
      console.error('Error deleting card:', err);
      setError('Error al eliminar la publicación');
      return false;
    }
  };

  // Set up real-time subscription for live updates
  useEffect(() => {
    loadCards();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('support_cards_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_cards'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          // Reload cards when any change occurs
          loadCards();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    cards,
    loading,
    error,
    saveCard,
    deleteCard,
    reloadCards: loadCards
  };
}