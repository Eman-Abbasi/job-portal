import prisma from '../config/database.js';

export const getJobs = async (req, res) => {
  try {
    const {
      search,
      jobType,
      location,
      category,
      experienceLevel,
      sortBy = 'newest',
      page = 1,
      limit = 10
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (jobType) {
      where.jobType = jobType;
    }

    if (location && location !== 'all') {
      if (location === 'global') {
        // Global means all locations, so no filter
      } else {
        where.location = { contains: location, mode: 'insensitive' };
      }
    }

    if (category) {
      where.category = category;
    }

    if (experienceLevel) {
      where.experienceLevel = experienceLevel;
    }

    // Build orderBy clause
    let orderBy = {};
    if (sortBy === 'newest') {
      orderBy = { createdAt: 'desc' };
    } else if (sortBy === 'salary') {
      // Extract numeric value from salary string for sorting
      // This is a simplified approach - in production, you might want to store salary as number
      orderBy = { createdAt: 'desc' }; // Fallback to newest if salary parsing is complex
    }

    // Get jobs with pagination
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: {
          poster: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.job.count({ where })
    ]);

    res.json({
      jobs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        poster: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if user has bookmarked/applied/marked not interested
    let userStatus = null;
    if (req.user) {
      const [bookmark, application, notInterested] = await Promise.all([
        prisma.bookmark.findUnique({
          where: {
            userId_jobId: {
              userId: req.user.id,
              jobId: id
            }
          }
        }),
        prisma.application.findUnique({
          where: {
            userId_jobId: {
              userId: req.user.id,
              jobId: id
            }
          }
        }),
        prisma.notInterested.findUnique({
          where: {
            userId_jobId: {
              userId: req.user.id,
              jobId: id
            }
          }
        })
      ]);

      userStatus = {
        bookmarked: !!bookmark,
        applied: !!application,
        notInterested: !!notInterested,
        applicationStatus: application?.status || null
      };
    }

    res.json({ job, userStatus });
  } catch (error) {
    console.error('Get job by id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const applyToJob = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;

    // Check if job exists
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await prisma.application.findUnique({
      where: {
        userId_jobId: {
          userId: req.user.id,
          jobId: id
        }
      }
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied to this job' });
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        userId: req.user.id,
        jobId: id,
        status: 'pending'
      }
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Apply to job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const bookmarkJob = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;

    // Check if job exists
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if already bookmarked
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_jobId: {
          userId: req.user.id,
          jobId: id
        }
      }
    });

    if (existingBookmark) {
      // Remove bookmark
      await prisma.bookmark.delete({
        where: {
          userId_jobId: {
            userId: req.user.id,
            jobId: id
          }
        }
      });
      return res.json({ message: 'Bookmark removed', bookmarked: false });
    }

    // Create bookmark
    await prisma.bookmark.create({
      data: {
        userId: req.user.id,
        jobId: id
      }
    });

    res.json({ message: 'Job bookmarked', bookmarked: true });
  } catch (error) {
    console.error('Bookmark job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const markNotInterested = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;

    // Check if job exists
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if already marked
    const existing = await prisma.notInterested.findUnique({
      where: {
        userId_jobId: {
          userId: req.user.id,
          jobId: id
        }
      }
    });

    if (existing) {
      return res.json({ message: 'Already marked as not interested' });
    }

    // Create not interested record
    await prisma.notInterested.create({
      data: {
        userId: req.user.id,
        jobId: id
      }
    });

    res.json({ message: 'Marked as not interested' });
  } catch (error) {
    console.error('Mark not interested error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBookmarkedJobs = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: req.user.id },
      include: {
        job: {
          include: {
            poster: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const jobs = bookmarks.map(bookmark => bookmark.job);

    res.json({ jobs });
  } catch (error) {
    console.error('Get bookmarked jobs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const applications = await prisma.application.findMany({
      where: { userId: req.user.id },
      include: {
        job: {
          include: {
            poster: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { appliedAt: 'desc' }
    });

    const jobs = applications.map(app => ({
      ...app.job,
      applicationStatus: app.status,
      appliedAt: app.appliedAt
    }));

    res.json({ jobs });
  } catch (error) {
    console.error('Get applied jobs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getNotInterestedJobs = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const notInterested = await prisma.notInterested.findMany({
      where: { userId: req.user.id },
      include: {
        job: {
          include: {
            poster: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const jobs = notInterested.map(item => item.job);

    res.json({ jobs });
  } catch (error) {
    console.error('Get not interested jobs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
