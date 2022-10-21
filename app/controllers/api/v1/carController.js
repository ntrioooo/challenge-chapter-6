const carService = require("../../../services/carService");
// const { Car } = require("../../../models");

module.exports = {
    async list(req, res) {
      try {
        await carService.list()
        .then(( { data, count }) => {
            res.status(200).json({
                status: "OK",
                data: data ,
                meta: count,
            });
        })
      } catch (err) {
        res.status(400).json({
            status: "FAIL",
            message: err.message,
        });
      }
    },

    async create(req, res) {
        try {
            console.log(req.user)
            const car = await carService.create({
                nama : req.body.nama,
                harga : req.body.harga,
                gambar : req.body.gambar,
                size_id : req.body.size_id,
                id_user : req.user.id
            });
            res.status(200).json({
                data: car
            }) 
        } catch (err) {
            res.status(422).json({
                status: "Mobil gagal dibikin",
                message: err.message
            })
        }
    },

    async update(req, res) {
        try {
            const car = await carService.update(req.params.id, {
                nama: req.body.nama,
                harga : req.body.harga,
                gambar : req.body.gambar,
                size_id : req.body.size_id,
                id_user : req.user.id
            });
            res.status(200).json({
                status: "Mobil Berhasil diperbaharui",
                data: car,
                nama: req.body.nama,
                harga: req.body.harga,
                gambar: req.body.gambar,
                size_id: req.body.size_id,
            })
        } catch (err) {
            res.status(422).json({
                status: "Mobil gagal diperbaharui",
                message: err.message
            })
        }
    },

    async show(req, res) {
        try {
            const car = await carService.getCar(req.params.id);
            res.status(200).json({
                data: car,
            })
        } catch (err) {
            res.status(422).json({
                status: "Tidak ada mobil dengan ID tersebut",
                message: err.message
            })
        }
    },

    async destroy(req, res) {
        try {
            const car = await carService.delete(req.params.id);
            console.log(car);
            res.status(204).end();
        } catch (err) {
            res.status(422).json({
                status: "Mobil gagal dihapus",
                message: err.message
            })
        }
    },
}