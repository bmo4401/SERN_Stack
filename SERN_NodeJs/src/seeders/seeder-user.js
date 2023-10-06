'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Users', [
            {
                email: 'haiminh612a@gmail.com',
                password: '123456',
                firstname: 'Phan',
                lastname: 'Hai',
                address: 'Vung Tau',
                phonenumber: '0792377063',
                gender: 1,
                image: '',
                roleid: 'ROLE',
                positionId: 'R1',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    },
};
