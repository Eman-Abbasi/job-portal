import prisma from '../config/database.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if email is being changed and if it's already taken
    if (email && email !== req.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(email && { email })
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const resume = await prisma.resume.create({
      data: {
        userId: req.user.id,
        filename: req.file.originalname,
        filepath: req.file.path
      }
    });

    res.status(201).json({
      message: 'Resume uploaded successfully',
      resume: {
        id: resume.id,
        filename: resume.filename,
        uploadedAt: resume.uploadedAt
      }
    });
  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getResumes = async (req, res) => {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: req.user.id },
      orderBy: { uploadedAt: 'desc' },
      select: {
        id: true,
        filename: true,
        uploadedAt: true
      }
    });

    res.json({ resumes });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;

    const resume = await prisma.resume.findUnique({
      where: { id }
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    if (resume.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Delete file from filesystem
    if (fs.existsSync(resume.filepath)) {
      fs.unlinkSync(resume.filepath);
    }

    // Delete from database
    await prisma.resume.delete({
      where: { id }
    });

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const downloadResume = async (req, res) => {
  try {
    const { id } = req.params;

    const resume = await prisma.resume.findUnique({
      where: { id }
    });

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    if (resume.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (!fs.existsSync(resume.filepath)) {
      return res.status(404).json({ error: 'Resume file not found' });
    }

    res.download(resume.filepath, resume.filename);
  } catch (error) {
    console.error('Download resume error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
