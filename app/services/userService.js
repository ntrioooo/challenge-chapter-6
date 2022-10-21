const userRepository = require('../repositories/userRepository');

module.exports = {
    create(requestBody) {
        return userRepository.create(requestBody);
    },
    update(id, requestBody) {
        return userRepository.update(id, requestBody);
    },
    delete(id) {
        return userRepository.delete(id);
    },
    getUser(id) {
        return userRepository.find(id);
    },

    async list() {
        try {
            const user = await userRepository.findAll();
            const userCount = await userRepository.getTotalUser();

            return {
                data: user,
                count: userCount,
            };
        } catch (err) {
            throw err;
        }
    },
}