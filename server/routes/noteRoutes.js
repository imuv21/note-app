import express from 'express';
import { noteValidator } from '../middlewares/validation.js';
import authedUser from '../middlewares/authedUser.js';
import noteCont from '../controllers/noteCont.js';

const router = express.Router();
router.use(authedUser);

// Note routes
router.post('/add-note', noteValidator, noteCont.addNote);
router.get('/get-all-notes', noteCont.getAllNotes);
router.get('/get-note/:noteId', noteCont.getNote);
router.patch('/update-note/:noteId', noteValidator, noteCont.updateNote);
router.delete('/delete-note/:noteId', noteCont.deleteNote);

export default router;