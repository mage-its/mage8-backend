const express = require('express');
const validate = require('../../middlewares/validate');
const olimValidation = require('../../validations/olim.validation');
const olimController = require('../../controllers/olim.controller');
const auth = require('../../middlewares/auth');
const removeEmpty = require('../../middlewares/removeEmpty');
const registerBarrier = require('../../middlewares/registerBarrier');

const router = express.Router();

// User route

router.post('/daftar-olim', registerBarrier('olim'), auth(), validate(olimValidation.daftarOlim), olimController.daftarOlim);

router.patch('/update-profile', auth(), validate(olimValidation.updateProfile), removeEmpty, olimController.updateProfile);

router.post('/check-namaTim', auth(), validate(olimValidation.checkTeamName), olimController.checkTeamName);

// Admin route

router.get('/', auth('getUsers'), validate(olimValidation.getOlims), olimController.getOlims);

router.post('/:userId', auth('manageUsers'), validate(olimValidation.createOlim), olimController.createOlim);

router
  .route('/:olimId')
  .get(auth('getUsers'), validate(olimValidation.getOlim), olimController.getOlim)
  .patch(auth('manageUsers'), validate(olimValidation.updateOlim), olimController.updateOlim)
  .delete(auth('manageUsers'), validate(olimValidation.deleteOlim), olimController.deleteOlim);

router.post('/toggle-verif/:olimId', auth('manageUsers'), validate(olimValidation.toggleVerif), olimController.toggleVerif);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Olim
 *   description: API Olimpiade
 */

/**
 * @swagger
 * /olim/daftar-olim:
 *   post:
 *     summary: Daftar olimpiade
 *     tags: [Olim]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - namaTim
 *               - namaKetua
 *               - waKetua
 *               - lineKetua
 *               - hpKetua
 *               - asalInstansi
 *               - alamatInstansi
 *               - asalInfo
 *               - asalKota
 *               - identitasKetua
 *             properties:
 *               namaTim:
 *                 type: string
 *               namaKetua:
 *                 type: string
 *               waKetua:
 *                 type: string
 *                 description: valid indonesian phone number
 *               lineKetua:
 *                 type: string
 *                 description: id line
 *               hpKetua:
 *                 type: string
 *                 description: valid indonesian phone number
 *               namaAnggota1:
 *                 type: string
 *               namaAnggota2:
 *                 type: string
 *               asalInstansi:
 *                 type: string
 *               alamatInstansi:
 *                 type: string
 *               asalInfo:
 *                 type: string
 *               asalKota:
 *                 type: string
 *               identitasKetua:
 *                 type: file
 *               identitasAnggota1:
 *                 type: file
 *               identitasAnggota2:
 *                 type: file
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 olim:
 *                   $ref: '#/components/schemas/Olim'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */
