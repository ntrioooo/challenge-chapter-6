/**
 * @file contains authentication request handler and its business logic
 * @author Kelompok 4 FSW 2
 */

 const bcrypt = require("bcryptjs");
 const jwt = require("jsonwebtoken");
 const { User } = require("../../../models");
 const userService = require("../../../services/userService");
 const SALT = 10;
 
 function encryptPassword(password) {
   return new Promise((resolve, reject) => {
     bcrypt.hash(password, SALT, (err, encryptedPassword) => {
       if (!!err) {
         reject(err);
         return;
       }
 
       resolve(encryptedPassword);
     });
   });
 }
 
 function checkPassword(encryptedPassword, password) {
   return new Promise((resolve, reject) => {
     bcrypt.compare(password, encryptedPassword, (err, isPasswordCorrect) => {
       if (!!err) {
         reject(err);
         return;
       }
 
       resolve(isPasswordCorrect);
     });
   });
 }
 
 function createToken(payload) {
   return jwt.sign(payload, process.env.JWT_SIGNATURE_KEY || "Rahasia");
 }
 
 module.exports = {
   async register(req, res) {
     const email = req.body.email;
     const role = 'member';
     const encryptedPassword = await encryptPassword(req.body.password);
     const user = await User.create({ email, encryptedPassword, role });
     res.status(201).json({
       id: user.id,
       email: user.email,
       role: user.role,
       createdAt: user.createdAt,
       updatedAt: user.updatedAt,
     });
   },
 
   async login(req, res) {
     const email = req.body.email.toLowerCase(); // Biar case insensitive
     const password = req.body.password;
 
     const user = await User.findOne({
       where: { email },
     });
 
     if (!user) {
       res.status(404).json({ message: "Email tidak ditemukan" });
       return;
     }
 
     const isPasswordCorrect = await checkPassword(
       user.encryptedPassword,
       password
     );
 
     if (!isPasswordCorrect) {
       res.status(401).json({ message: "Password salah!" });
       return;
     }
 
     const token = createToken({
       id: user.id,
       email: user.email,
       createdAt: user.createdAt,
       updatedAt: user.updatedAt,
     });
 
     res.status(201).json({
       id: user.id,
       email: user.email,
       token,
       createdAt: user.createdAt,
       updatedAt: user.updatedAt,
     });
   },
 
   async whoAmI(req, res) {
     res.status(200).json(req.user);
   },
 
   async authorize(req, res, next) {
     try {
       const bearerToken = req.headers.authorization;
       const token = bearerToken.split("Bearer ")[1];
       const tokenPayload = jwt.verify(
         token,
         process.env.JWT_SIGNATURE_KEY || "Rahasia"
       );
       
       const user = await User.findByPk(tokenPayload.id);
       req.user = user
 
       next();
     } catch (err) {
       console.error(err);
       res.status(401).json({
         message: "Unauthorized",
       });
     }
   },
 
   async validationSuperAdmin(req, res, next) {
     try {
       const bearerToken = req.headers.authorization;
       const token = bearerToken.split("Bearer ")[1];
       const tokenPayload = jwt.verify(
         token,
         process.env.JWT_SIGNATURE_KEY || "Rahasia"
       );
 
       const user = await User.findByPk(tokenPayload.id);
       if(user.role !== "superadmin"){
         res.status(401).json({
           message: "Forbidden"
         })
       }else{
         req.user = user
   
         next();
       }
       
     } catch (err) {
       console.error(err);
       res.status(401).json({
         message: "Unauthorized",
       });
     }
   },
 
   async validationCRUD(req, res, next) {
     try {
       const bearerToken = req.headers.authorization;
       const token = bearerToken.split("Bearer ")[1];
       const tokenPayload = jwt.verify(
         token,
         process.env.JWT_SIGNATURE_KEY || "Rahasia"
       );
 
       const user = await User.findByPk(tokenPayload.id);
       console.log(user.role)
       if(user.role === "member"){
         res.status(401).json({
           message: "Forbidden"
         })
       }else{
         req.user = user
   
         next();
       }
       
     } catch (err) {
       console.error(err);
       res.status(401).json({
         message: "Unauthorized",
       });
     }
   },
 
   async listUser(req, res) {
       try {
         await userService.list()
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
 
   async createUser(req, res) {
     try {
       const email = req.body.email;
       const role = req.body.role;
       const encryptedPassword = await encryptPassword(req.body.password);
       const user = await userService.create({ email, encryptedPassword, role });
       res.status(201).json({
         id: user.id,
         email: user.email,
         role: user.role,
         createdAt: user.createdAt,
         updatedAt: user.updatedAt,
       });
     } catch (err) {
       res.status(422).json({
         status: "User gagal dibuat",
         message: err.message
       })
     }
   },
 
   async updateUser(req, res) {
     try {
       const encryptedPassword = await encryptPassword(req.body.password);
       const user = await userService.update(req.params.id, req.body);
       res.status(200).json({
         status: "Data User Berhasil Diperbaharui",
         data: user,
         email: req.body.email,
         password: encryptedPassword,
         role: req.body.role
       })
     } catch (err) {
       res.status(422).json({
         status: "Data User Gagal Diperbaharui",
         message: err.message
       })
     }
   },
 
   async show(req, res) {
     try {
       const user = await userService.getUser(req.params.id);
       res.status(200).json({
         data: user,
       })
     } catch (err) {
       res.status(422).json({
         status: "Tidak ada user dengan ID tersebut",
         message: err.message
       })
     }
   },
 
   async destroy(req, res) {
     try {
       const user = await userService.delete(req.params.id);
       console.log(user);
       res.status(204).end();
     } catch (err) {
       res.status(422).json({
         status: "User gagal dihapus",
         message: err.message
       })
     }
   },
 
 };
 