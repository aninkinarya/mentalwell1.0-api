const { allArticles, selectArticle, searchArticle } = require('../services/article');
const { ClientError } = require('../utils/errors');

const getArticles = async (request, h) => {
  try {
    const articles = await allArticles();
    return h.response({
      status: 'success',
      message: 'Artikel berhasil dimuat',
      articles
    }).code(200);
  } catch (err) {
    console.error('❌ getArticles error:', err);
    const statusCode = err instanceof ClientError ? err.statusCode : 500;
    const message = err instanceof ClientError ? err.message : 'Terjadi kesalahan pada server.';
    return h.response({
      status: 'fail',
      message
    }).code(statusCode);
  }
};

const getSelectedArticle = async (request, h) => {
  try {
    const { id } = request.params;
    const article = await selectArticle(id);
    return h.response({
      status: 'success',
      message: 'Artikel berhasil dimuat',
      article
    }).code(200);
  } catch (err) {
    console.error('❌ getSelectedArticle error:', err);
    const statusCode = err instanceof ClientError ? err.statusCode : 500;
    const message = err instanceof ClientError ? err.message : 'Terjadi kesalahan pada server.';
    return h.response({
      status: 'fail',
      message
    }).code(statusCode);
  }
};

const getSearchedArticles = async (request, h) => {
  try {
    const { title } = request.query;
    const articles = await searchArticle(title);
    return h.response({
      status: 'success',
      message: 'Berhasil memuat hasil pencarian',
      articles
    }).code(200);
  } catch (err) {
    console.error('❌ getSearchedArticles error:', err);
    const statusCode = err instanceof ClientError ? err.statusCode : 500;
    const message = err instanceof ClientError ? err.message : 'Terjadi kesalahan pada server.';
    return h.response({
      status: 'fail',
      message
    }).code(statusCode);
  }
};

module.exports = { getArticles, getSelectedArticle, getSearchedArticles };
