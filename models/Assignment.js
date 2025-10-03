const mongoose = require('mongoose');

// Оскільки в завдання не вказана аутентифікація, ми робимо цю модель
// простою, без прив'язки до owner, щоб відповідати Mongo Shell
const assignmentSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    subject: { 
        type: String, 
        required: true 
    },
    score: { 
        type: Number, 
        required: true 
    }
});

// Mongoose автоматично створює колекцію 'assignments' у базі даних
//, яку ви підключили (в docker-compose це taskmanager_db)
module.exports = mongoose.model('Assignment', assignmentSchema);