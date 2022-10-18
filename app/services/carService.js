const carRepository = require('../repositories/carRepository');

module.exports = {
    create(requestBody) {
        return carRepository.create(requestBody);
    },
    update(id, requestBody) {
        return carRepository.update(id, requestBody);
    },
    delete(id) {
        return carRepository.delete(id);
    },
    getCar(id) {
        return carRepository.find(id);
    },

    async list() {
        try {
            const cars = await carRepository.findAll();
            const carCount = await carRepository.getTotalCar();

            return {
                data: cars,
                count: carCount,
            };
        } catch (err) {
            throw err;
        }
    },
}