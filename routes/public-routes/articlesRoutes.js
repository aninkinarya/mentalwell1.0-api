const { getArticles, getSelectedArticle, getSearchedArticles } = require('../../handlers/article')

const articleRoutes = [

    {
        method: 'GET',
        path: '/articles',
        handler: getArticles
    },

    {
        method: 'GET',
        path: '/articles/{id}',
        handler: getSelectedArticle
    },

    {
        method: 'GET',
        path: '/articles/search',
        handler: getSearchedArticles
    }
]

module.exports = articleRoutes;