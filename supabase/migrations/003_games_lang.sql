-- Migration 003: adiciona preferência de idioma do criador ao jogo
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS lang TEXT;
