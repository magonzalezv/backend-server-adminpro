var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var publicacionSchema = new Schema({
    nombre: { type: String, required: [true, 'El	nombre	es	necesario'] },
    descripcion: { type: String, required: [true, 'La descripción es	necesaria'] },
    comentarios: { type: String, required: false },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'Publicaciones' });
module.exports = mongoose.model('Publicacion', publicacionSchema);