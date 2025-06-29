import { validationResult } from "express-validator";
import { noteModel } from '../models/Note.js';
import sendError from '../utils/sendError.js';


class noteCont {

    //note conts
    static addNote = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, errors: errors.array() });
        }
        try {
            const { title, description } = req.body;
            const userId = req.user._id;
            if (!title || !description) {
                return res.status(400).json({ status: false, message: "Both title and description are required!" });
            }

            const newNote = new noteModel({ title, description, user: userId });
            await newNote.save();

            const responseNote = {
                _id: newNote._id,
                title: newNote.title,
                description: newNote.description,
                createdAt: newNote.createdAt,
                updatedAt: newNote.updatedAt
            };

            return res.status(201).json({ status: true, message: "Note created successfully.", note: responseNote });

        } catch (error) {
            sendError(res);
        }
    };

    static updateNote = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, errors: errors.array() });
        }
        try {
            const { title, description } = req.body;
            const { noteId } = req.params;
            const userId = req.user._id;

            const updatedNote = await noteModel.findOneAndUpdate(
                { _id: noteId, user: userId },
                { ...(title && { title }), ...(description && { description }) },
                { new: true, runValidators: true, select: '-user -__v' });

            if (!updatedNote) {
                return res.status(404).json({ status: false, message: "Note not found!" });
            }

            return res.status(200).json({ status: true, message: "Note updated successfully.", note: updatedNote });

        } catch (error) {
            sendError(res);
        }
    };

    static getAllNotes = async (req, res) => {
        try {
            let { page = 1, size = 10, search = "", sortBy = "createdAt", order = "asc" } = req.query;
            const userId = req.user._id;
            page = Math.max(1, parseInt(page));
            size = Math.max(1, Math.min(parseInt(size), 100));
            const query = { user: userId };

            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } }
                ];
            }
            const sortOptions = {
                "title": { title: order === "asc" ? 1 : -1 },
                "createdAt": { createdAt: order === "asc" ? 1 : -1 },
                "updatedAt": { updatedAt: order === "asc" ? 1 : -1 }
            };
            const sortCriteria = sortOptions[sortBy] || { createdAt: 1 };

            const totalNotes = await noteModel.countDocuments(query);
            const notes = await noteModel.find(query).select('_id title description createdAt updatedAt').skip((page - 1) * size).limit(size).sort(sortCriteria).lean().exec();

            const totalPages = Math.ceil(totalNotes / size);
            const pageNotes = notes.length;
            const isFirst = page === 1;
            const isLast = page === totalPages || totalPages === 0;
            const hasNext = page < totalPages;
            const hasPrevious = page > 1;

            return res.status(200).json({ status: true, notes, totalNotes, totalPages, pageNotes, isFirst, isLast, hasNext, hasPrevious });

        } catch (error) {
            sendError(res);
        }
    };

    static getNote = async (req, res) => {
        try {
            const { noteId } = req.params;
            const userId = req.user._id;

            const note = await noteModel.findOne({ _id: noteId, user: userId }).select('-user -__v');
            if (!note) {
                return res.status(404).json({ status: false, message: "Note not found!" });
            }
            return res.status(200).json({ status: true, note });
        } catch (error) {
            sendError(res);
        }
    };

    static deleteNote = async (req, res) => {
        try {
            const { noteId } = req.params;
            const userId = req.user._id;

            const deletedNote = await noteModel.findOneAndDelete({ _id: noteId, user: userId });
            if (!deletedNote) {
                return res.status(404).json({ status: false, message: "Note not found!" });
            }
            return res.status(200).json({ status: true, message: "Note deleted successfully." });
        } catch (error) {
            sendError(res);
        }
    };
};

export default noteCont;