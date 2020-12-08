'use strict';

const bcrypt = require('bcrypt')

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
        */

        await queryInterface.bulkInsert('Users', [
            {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@gmail.com',
                password: bcrypt.hashSync('secret', 10),
                gender: 'male'
            },
            {
                firstName: 'Sam',
                lastName: 'Smith',
                email: 'sam.smith@gmail.com',
                password: bcrypt.hashSync('secret', 10),
                gender: 'male'
            },
            {
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane.doe@gmail.com',
                password: bcrypt.hashSync('secret', 10),
                gender: 'female'
            },
        ])
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */

        await queryInterface.bulkDelete('Users', null, {});
    }
};
