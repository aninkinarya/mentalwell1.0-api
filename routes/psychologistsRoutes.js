const { requireAuth, authorizeRole } = require('../config/auth');
const { getPsychologistProfile, updatePsychologist, updateAvailability } = require('../handlers/psychologists/profile');
const { getPatientsCounselings, getSelectedCounseling } = require('../handlers/psychologists/counseling')

const psychologistRoutes = [
    { // tested
        method: 'GET',
        path: '/psychologist/profile',
        options: {
          pre: [
            { method: requireAuth },
            { method: authorizeRole(['psychologist']) }]
        },
        handler: getPsychologistProfile,
    },

    { 
        method: 'PUT',
        path: '/psychologist/profile',
        options: {
            pre: [
                { method: requireAuth },
                { method: authorizeRole(['psychologist']) }
            ],
            payload: {
                maxBytes: 1048576 * 5,
                output: 'stream',
                parse: true,
                multipart: true,
                allow: ['multipart/form-data'],
            },
        },
        handler: updatePsychologist,
    },

    { // tested
        method: 'PUT',
        path: '/psychologist/availability',
        options: {
            pre: [
                { method: requireAuth },
                { method: authorizeRole(['psychologist']) }
            ]
        },
        handler: updateAvailability,
    },

    { // tested
        method: 'GET',
        path: '/psychologist/counselings',
        options: {
          pre: [
            { method: requireAuth },
            { method: authorizeRole(['psychologist']) }]
        },
        handler: getPatientsCounselings
    },

    { 
        method: 'GET',
        path: '/psychologist/counseling/{id}',
        options: {
          pre: [
            { method: requireAuth },
            { method: authorizeRole(['psychologist']) }]
        },
        handler: getSelectedCounseling
    }
];

module.exports = psychologistRoutes;
