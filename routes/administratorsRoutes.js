const { path } = require('@hapi/joi/lib/errors');
const { requireAuth, authorizeRole } =  require('../config/auth');
const { postArticle, updateArticle, deleteArticle } = require('../handlers/administrators/article')
const { getSelectedCounseling, updatePaymentStatus } = require('../handlers/administrators/counseling')
const { getAllUsersCounselings, getAPsychologistCounselings, getAPatientCounselings } = require('../handlers/administrators/counseling-list')
const { postPsychologist, putPsychologistInfo, getPsychologistDetails } = require('../handlers/administrators/psychologist-profile');
const { getPsychologistList, deletePsychologist } = require('../handlers/administrators/psychologists-list');
const { getPsychologistSchedules } = require('../handlers/patient/psychologist-schedules');
const { createSchedule, updateSchedule, removeSchedule } = require('../handlers/administrators/psychologists-schedules')
const { getPatientProfile } = require('../handlers/administrators/patients')


const administratorsRoutes = [
    { // tested
        method: 'POST',
        path: '/article',
        options: {
            pre: [
                { method: requireAuth},
                { method: authorizeRole (['admin'])},
            ],
            payload: {
                maxBytes: 1048576 * 2,
                output: 'stream',
                parse: true,
                multipart: true,
                allow: ['multipart/form-data']
            },
        },
        handler: postArticle
    },

    {
        method: 'PUT',
        path: '/article/{id}',
        options: {
            pre: [
                { method: requireAuth},
                { method: authorizeRole (['admin'])},
            ],
            payload: {
                maxBytes: 1048576 * 2,
                output: 'stream',
                parse: true,
                multipart: true,
                allow: ['multipart/form-data']
            },
        },
        handler: updateArticle
    },

    {   
        method: 'DELETE',
        path: '/article/{id}',
        options: {
            pre: [
                { method: requireAuth},
                { method: authorizeRole (['admin'])},
            ]
        },
        handler: deleteArticle

    },

    { // tested
        method: 'POST',
        path: '/admin/psychologist',
        options: {
            pre: [
                { method: requireAuth},
                { method: authorizeRole (['admin'])},
            ],
            payload: {
                maxBytes: 1048576 * 2,
                output: 'stream',
                parse: true,
                multipart: true,
                allow: ['multipart/form-data']
            },
        },
        handler: postPsychologist
    },

    { // tested
        method: 'GET',
        path: '/admin/psychologists',
        options: {
            pre: [
                { method: requireAuth},
                { method: authorizeRole (['admin'])},
            ]
        },
        handler: getPsychologistList
    },

    {//tested
        method: 'GET',
        path: '/admin/psychologists/{id}',
        options: {
            pre: [
                { method: requireAuth},
                { method: authorizeRole (['admin'])},
            ]
        },
        handler : getPsychologistDetails
    },

    { // tested
        method: 'GET',
        path: '/admin/psychologist/{id}/schedules',
        options: {
            pre: [
                { method: requireAuth},
                { method: authorizeRole (['admin'])},
            ]
        },
        handler: getPsychologistSchedules
    },

    { // tested
        method: 'POST',
        path: '/admin/psychologist/{id}/schedules',
        options: {
            pre: [
                { method: requireAuth},
                { method: authorizeRole (['admin'])},
            ]
        },
        handler: createSchedule
    },

    { // tested
        method: 'PUT',
        path: '/admin/schedule/{id}',
        options: {
            pre: [
                { method: requireAuth},
                { method: authorizeRole (['admin'])},
            ]
        },
        handler: updateSchedule
    },

    { // tested
        method: 'DELETE',
        path: '/admin/schedule/{id}',
        options: {
            pre: [
                { method: requireAuth},
                { method: authorizeRole (['admin'])},
            ]
        },
        handler: removeSchedule
    },

    { 
        method: 'PUT',
        path: '/admin/psychologists/{id}',
        options: {
            pre: [
                { method: requireAuth},
                { method: authorizeRole (['admin'])},
            ],
            payload: {
                output: 'stream',
                parse: true,
                multipart: true,
                allow: ['multipart/form-data']
            },
        },
        handler: putPsychologistInfo
    },

    {
        method: 'GET',
        path: '/admin/counselings',
        options: {
            pre: [
                { method: requireAuth},
                { method: authorizeRole (['admin'])},
            ]
        },
        handler: getAllUsersCounselings
    },

    {
        method: 'GET',
        path: '/admin/counselings/psychologist/{id}',
        options: {
            pre: [
                { method: requireAuth},
                { method: authorizeRole (['admin'])},
            ]
        },
        handler: getAPsychologistCounselings
    },

    {
        method: 'GET',
        path: '/admin/counselings/patient/{id}',
        options: {
            pre: [
                { method: requireAuth},
                { method: authorizeRole (['admin'])},
            ]
        },
        handler: getAPatientCounselings
    },


    {
        method: 'GET',
        path: '/admin/counseling/{id}',
        options: {
            pre: [
                { method: requireAuth},
                { method: authorizeRole (['admin'])},
            ]
        },
        handler: getSelectedCounseling
    },

    {
        method: 'PUT',
        path: '/admin/counseling/{id}',
        options: {
            pre: [
                { method: requireAuth},
                { method: authorizeRole (['admin'])},
            ]
        },
        handler: updatePaymentStatus
    },

    {
        method: 'GET',
        path: '/admin/patient/{id}',
        options: {
            pre: [
                { method: requireAuth},
                { method: authorizeRole (['admin'])},
            ]
        },

        handler: getPatientProfile
    },

    {
        method: 'DELETE',
        path: '/admin/psychologist/{id}',
        options: {
            pre: [
                { method: requireAuth},
                { method: authorizeRole (['admin'])},
            ]
        },
        handler: deletePsychologist
    }
]

module.exports = administratorsRoutes;