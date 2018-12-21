var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Publicacion = require('../models/publicacion');

// =====================================
// Obtener todas las publicaciones 
// =====================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Publicacion.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario')
        .exec(
            (err, publicaciones) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando publicaciones',
                        errors: err
                    });
                }

                Publicacion.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        publicaciones: publicaciones,
                        total: conteo
                    });
                });


            });


});


// ==========================================
// Obtener Hospital por ID
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Publicacion.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, publicacion) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar publicación',
                    errors: err
                });
            }
            if (!publicacion) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'la publicación con el id ' + id + 'no existe',
                    errors: { message: 'No existe una publicación con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                publicacion: publicacion
            });
        })
})


// =====================================
// Crear una nueva publicacion
// =====================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var publicacion = new Publicacion({
        nombre: body.nombre,
        usuario: req.usuario._id,
        descripcion: body.descripcion,
        img: body.img
    });

    publicacion.save((err, publicacionGuardada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear publicacion',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            publicacion: publicacionGuardada
        });

    });
});

// =====================================
// Actualizar Publicacion
// =====================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Publicacion.findById(id, (err, publicacion) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar publicacion',
                errors: err
            });
        }

        if (!publicacion) {
            return res.status(404).json({
                ok: false,
                mensaje: 'La publicación con el id: ' + id + 'no existe',
                errors: { message: 'No existe una publicación con ese ID' }

            });
        }

        publicacion.nombre = body.nombre;
        publicacion.usuario = req.usuario._id;
        publicacion.descripcion = body.descripcion;
        publicacion.img = body.img;

        publicacion.save((err, publicacionActualizada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar publicacion',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                publicacion: publicacionActualizada
            });

        });

    });
});

// =====================================
// Eliminar publicacion por el id
// =====================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Publicacion.findByIdAndRemove(id, (err, publicacionBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar publicación',
                errors: err
            });
        }

        if (!publicacionBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una publicación con ese id',
                errors: { message: 'No existe una publicación con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            publicacion: publicacionBorrada
        });

    });

});

module.exports = app;