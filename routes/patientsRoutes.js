const { requireAuth, authorizeRole } = require('../config/auth');
const { updateProfile, getUserProfile } = require('../handlers/patient/profile');
const { getDetailedPsychologists } = require('../handlers/listPsychologists');
const { getAutoFill, postChatNowCounseling, postBookScheduleCounseling, getAllCounselings, getSelectedCounseling } = require('../handlers/patient/counseling');
const { getPsychologistSchedules, getScheduleAvailability } = require('../handlers/patient/psychologist-schedules');
const { postReview } = require('../handlers/patient/review');
const { path } = require('@hapi/joi/lib/errors');



const patientRoutes = [
    {
        method: 'GET',
        path: '/profile',
        options: {
            pre: [
                { method: requireAuth },
                { method: authorizeRole(['patient', 'admin']) }],
            },
        handler: getUserProfile
    },

    {
        method: 'PUT',
        path: '/profile',
        options: {
            pre: [
                { method: requireAuth },
                { method: authorizeRole(['patient', 'admin']) }
            ],
            payload: {
                maxBytes: 1048576 * 2,
                output: 'stream',
                parse: true,
                multipart: true,
                allow: ['multipart/form-data'],
            },
        },
        handler: updateProfile,
    },

    { // tested
        method: 'GET',
        path: '/psychologists',
        handler: getDetailedPsychologists
    },
    
    {
        method: 'GET',
        path: '/psychologists/{id}/schedules',
        options: {
          pre: [
            { method: requireAuth },
            { method: authorizeRole(['patient']) }
          ]
        },
        handler: getPsychologistSchedules
    },

    { // tested
        method: 'GET',
        path: '/psychologists/{id}/schedules/availability',
        options: {
            pre: [
                { method: requireAuth },
                { method: authorizeRole(['patient'])}
            ]
        },
        handler: getScheduleAvailability
    },


    { // tested
        method: 'GET',
        path: '/my-data',
        options: {
            pre: [
                { method: requireAuth },
                { method: authorizeRole(['patient'])}
            ]
        },
        handler: getAutoFill
    },

    { // tested
        method: 'POST',
        path: '/counselings/{id}', // psychologist id
        options: {
            pre: [
                { method: requireAuth },
                { method: authorizeRole(['patient'])}
            ],
            payload: {
                maxBytes: 1048576 * 2,
                output: 'stream',
                parse: true,
                multipart: true,
                allow: ['multipart/form-data'],
            }
        },
        handler: postBookScheduleCounseling
    },


    { // tested
        method: 'POST',
        path: '/realtime/counseling/{id}',
        options: {
            pre: [
                { method: requireAuth },
                { method: authorizeRole(['patient'])}
            ],
            payload: {
                maxBytes: 1048576 * 2,
                output: 'stream',
                parse: true,
                multipart: true,
                allow: ['multipart/form-data'],
            }
        },
        handler: postChatNowCounseling
    },


    { // tested
        method: 'GET',
        path: '/counselings',
        options: {
            pre: [
                { method: requireAuth },
                { method: authorizeRole(['patient'])}
            ]
        },
        handler: getAllCounselings
    },

    { // tested
        method: 'GET',
        path: '/counseling/{id}',
        options: {
            pre: [
                { method: requireAuth },
                { method: authorizeRole(['patient'])}
            ]
        },
        handler: getSelectedCounseling
    },

    {
        method: 'POST',
        path: '/counseling/{id}/review',
        options: {
            pre: [
                { method: requireAuth },
                { method: authorizeRole(['patient']) }
            ]
        },
        handler: postReview
    }

];

module.exports = patientRoutes;
