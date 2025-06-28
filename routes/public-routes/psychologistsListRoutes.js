const { getPsychologists, getSearchedPsychologists, getSelectedPsychologist } = require('../../handlers/patient/listPsychologists');

const psychologistsListRoutes = [
    
    { // tested
        method: 'GET',
        path: '/psychologists/list',
        handler: getPsychologists
    },

    {
        method: 'GET',
        path: '/psychologists/search',
        handler: getSearchedPsychologists
    },

    {
        method: 'GET',
        path: '/psychologists/{id}',
        handler: getSelectedPsychologist
    }

];

module.exports = psychologistsListRoutes;