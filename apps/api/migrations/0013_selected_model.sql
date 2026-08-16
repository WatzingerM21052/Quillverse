-- B25-28 Model Discovery / Selector UI: the user's chosen model per
-- connected provider, so generateStory() stops silently auto-picking one
-- with zero visibility (findTextModel() etc. stay as the fallback when this
-- is unset).
ALTER TABLE ai_provider_credentials ADD COLUMN selected_model TEXT;
