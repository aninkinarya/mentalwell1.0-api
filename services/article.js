const { supabase } = require('../config/database');
const { NotFoundError } = require('../utils/errors');

const allArticles = async () => {
  const { data, error } = await supabase
    .from('articles')
    .select('*');

  if (error) {
    throw new Error(`Supabase error (allArticles): ${error.message}`);
  }

  return data;
};

const selectArticle = async (id) => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new NotFoundError('Artikel tidak ditemukan.');
  }

  return data;
};

const searchArticle = async (keyword) => {
  const { data, error } = await supabase
    .from('articles')
    .select('*');

  if (error) {
    throw new Error(`Supabase error (searchArticle): ${error.message}`);
  }

  if (!keyword) return [];

  const keywords = keyword.toLowerCase().split(/\s+/).filter(k => k.length > 2);
  const filtered = data.filter((d) =>
    keywords.some(k => d.title.toLowerCase().includes(k))
  );

  return filtered;
};

module.exports = { allArticles, selectArticle, searchArticle };
