import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const dummyJobs = [
  {
    title: 'Senior Full Stack Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco',
    salary: '$120,000 - $150,000',
    jobType: 'full-time',
    category: 'Technology',
    experienceLevel: 'senior',
    description: `We are looking for an experienced Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies.

Responsibilities:
- Design and develop scalable web applications
- Collaborate with cross-functional teams
- Write clean, maintainable code
- Participate in code reviews
- Troubleshoot and debug applications

Requirements:
- 5+ years of experience in full stack development
- Proficiency in React, Node.js, and PostgreSQL
- Strong problem-solving skills
- Excellent communication abilities`,
  },
  {
    title: 'Frontend Developer',
    company: 'DesignStudio',
    location: 'New York',
    salary: '$80,000 - $100,000',
    jobType: 'full-time',
    category: 'Technology',
    experienceLevel: 'mid',
    description: `Join our creative team as a Frontend Developer! We're building beautiful, user-friendly web applications that make a difference.

Key Responsibilities:
- Build responsive web interfaces
- Implement UI/UX designs
- Optimize application performance
- Work with modern JavaScript frameworks
- Collaborate with designers and backend developers

What We're Looking For:
- 3+ years of frontend development experience
- Strong knowledge of React, TypeScript, and CSS
- Experience with design systems
- Portfolio demonstrating your work`,
  },
  {
    title: 'Backend Engineer',
    company: 'CloudSystems',
    location: 'Remote',
    salary: '$90,000 - $130,000',
    jobType: 'full-time',
    category: 'Technology',
    experienceLevel: 'mid',
    description: `We're seeking a talented Backend Engineer to help build our cloud infrastructure and APIs.

Your Role:
- Design and implement RESTful APIs
- Develop microservices architecture
- Optimize database queries and performance
- Ensure system security and scalability
- Write comprehensive tests

Requirements:
- 3+ years of backend development experience
- Expertise in Node.js, Express, and PostgreSQL
- Knowledge of cloud platforms (AWS, Azure, or GCP)
- Understanding of Docker and Kubernetes
- Strong database design skills`,
  },
  {
    title: 'Junior Software Developer',
    company: 'StartupHub',
    location: 'London',
    salary: '$50,000 - $70,000',
    jobType: 'full-time',
    category: 'Technology',
    experienceLevel: 'entry',
    description: `Perfect opportunity for a recent graduate or junior developer to kickstart their career!

What You'll Do:
- Learn and work with cutting-edge technologies
- Contribute to product development
- Participate in agile development processes
- Receive mentorship from senior developers
- Build real-world applications

Ideal Candidate:
- Computer Science degree or equivalent
- Basic knowledge of JavaScript, Python, or Java
- Eagerness to learn and grow
- Strong problem-solving mindset
- Good communication skills`,
  },
  {
    title: 'DevOps Engineer',
    company: 'InfraTech Solutions',
    location: 'San Francisco',
    salary: '$110,000 - $140,000',
    jobType: 'full-time',
    category: 'Technology',
    experienceLevel: 'senior',
    description: `Join our DevOps team and help us build robust, scalable infrastructure.

Responsibilities:
- Manage CI/CD pipelines
- Automate deployment processes
- Monitor system performance
- Implement infrastructure as code
- Ensure high availability and reliability

Requirements:
- 5+ years of DevOps experience
- Expertise in AWS, Docker, Kubernetes
- Knowledge of Terraform or CloudFormation
- Experience with monitoring tools (Prometheus, Grafana)
- Strong scripting skills (Bash, Python)`,
  },
  {
    title: 'Product Manager',
    company: 'InnovateLabs',
    location: 'New York',
    salary: '$100,000 - $140,000',
    jobType: 'full-time',
    category: 'Technology',
    experienceLevel: 'senior',
    description: `We're looking for an experienced Product Manager to drive our product strategy.

Key Responsibilities:
- Define product roadmap and vision
- Collaborate with engineering and design teams
- Conduct market research and user interviews
- Prioritize features and manage backlog
- Analyze product metrics and KPIs

What We Need:
- 5+ years of product management experience
- Strong analytical and strategic thinking
- Excellent communication and leadership skills
- Experience with agile methodologies
- Technical background preferred`,
  },
  {
    title: 'Data Scientist',
    company: 'DataInsights Co.',
    location: 'Remote',
    salary: '$95,000 - $125,000',
    jobType: 'full-time',
    category: 'Technology',
    experienceLevel: 'mid',
    description: `Help us unlock insights from data and build machine learning models.

Your Role:
- Analyze large datasets
- Build predictive models
- Create data visualizations
- Collaborate with business stakeholders
- Present findings to leadership

Requirements:
- 3+ years of data science experience
- Proficiency in Python, R, and SQL
- Experience with machine learning frameworks
- Strong statistical knowledge
- Excellent problem-solving abilities`,
  },
  {
    title: 'UI/UX Designer',
    company: 'CreativeAgency',
    location: 'London',
    salary: '$70,000 - $90,000',
    jobType: 'full-time',
    category: 'Technology',
    experienceLevel: 'mid',
    description: `We're seeking a talented UI/UX Designer to create beautiful, intuitive user experiences.

What You'll Do:
- Design user interfaces and experiences
- Create wireframes and prototypes
- Conduct user research and testing
- Collaborate with developers
- Maintain design systems

Ideal Candidate:
- 3+ years of UI/UX design experience
- Proficiency in Figma, Sketch, or Adobe XD
- Strong portfolio showcasing your work
- Understanding of user-centered design
- Excellent visual design skills`,
  },
  {
    title: 'Marketing Manager',
    company: 'GrowthMarketing',
    location: 'San Francisco',
    salary: '$75,000 - $95,000',
    jobType: 'full-time',
    category: 'Marketing',
    experienceLevel: 'mid',
    description: `Join our marketing team and help grow our brand presence!

Responsibilities:
- Develop and execute marketing campaigns
- Manage social media channels
- Analyze marketing metrics
- Coordinate with sales team
- Create marketing content

Requirements:
- 4+ years of marketing experience
- Strong digital marketing skills
- Experience with SEO and SEM
- Excellent written and verbal communication
- Creative thinking and problem-solving`,
  },
  {
    title: 'Sales Representative',
    company: 'SalesForce Pro',
    location: 'New York',
    salary: '$60,000 - $80,000 + Commission',
    jobType: 'full-time',
    category: 'Sales',
    experienceLevel: 'entry',
    description: `Great opportunity for an ambitious sales professional!

Your Role:
- Prospect and qualify leads
- Conduct sales presentations
- Build relationships with clients
- Meet and exceed sales targets
- Maintain CRM records

What We're Looking For:
- 1+ years of sales experience (or strong internship)
- Excellent communication skills
- Self-motivated and goal-oriented
- Ability to work in a fast-paced environment
- Bachelor's degree preferred`,
  },
  {
    title: 'Financial Analyst',
    company: 'FinanceCorp',
    location: 'London',
    salary: '$65,000 - $85,000',
    jobType: 'full-time',
    category: 'Finance',
    experienceLevel: 'entry',
    description: `Start your career in finance with us!

Key Responsibilities:
- Analyze financial data and trends
- Prepare financial reports
- Assist with budgeting and forecasting
- Support decision-making processes
- Work with accounting team

Requirements:
- Bachelor's degree in Finance, Accounting, or related field
- Strong analytical skills
- Proficiency in Excel and financial software
- Attention to detail
- Good communication skills`,
  },
  {
    title: 'Healthcare Administrator',
    company: 'HealthCare Plus',
    location: 'San Francisco',
    salary: '$70,000 - $90,000',
    jobType: 'full-time',
    category: 'Healthcare',
    experienceLevel: 'mid',
    description: `Join our healthcare administration team!

Responsibilities:
- Manage daily operations
- Coordinate with medical staff
- Handle patient relations
- Ensure compliance with regulations
- Oversee administrative processes

Requirements:
- 3+ years of healthcare administration experience
- Knowledge of healthcare regulations
- Strong organizational skills
- Excellent interpersonal abilities
- Bachelor's degree in Healthcare Administration or related field`,
  },
  {
    title: 'Software Engineer (Contract)',
    company: 'TechConsulting',
    location: 'Remote',
    salary: '$80 - $120 per hour',
    jobType: 'contract',
    category: 'Technology',
    experienceLevel: 'senior',
    description: `6-month contract position for an experienced Software Engineer.

Project Details:
- Build new features for client applications
- Work with modern tech stack
- Remote work opportunity
- Flexible hours
- Potential for extension

Requirements:
- 5+ years of software development experience
- Strong full-stack development skills
- Ability to work independently
- Excellent communication
- Available for 6-month commitment`,
  },
  {
    title: 'Part-time Content Writer',
    company: 'ContentStudio',
    location: 'Remote',
    salary: '$30 - $50 per hour',
    jobType: 'part-time',
    category: 'Marketing',
    experienceLevel: 'entry',
    description: `Flexible part-time opportunity for a creative content writer!

What You'll Do:
- Write blog posts and articles
- Create social media content
- Edit and proofread content
- Research topics
- Work with content calendar

Ideal Candidate:
- Strong writing and editing skills
- Ability to meet deadlines
- Creative thinking
- Basic SEO knowledge
- Portfolio of writing samples`,
  },
  {
    title: 'Executive Assistant',
    company: 'ExecutiveSupport',
    location: 'New York',
    salary: '$55,000 - $70,000',
    jobType: 'full-time',
    category: 'Other',
    experienceLevel: 'entry',
    description: `Support our executive team in this dynamic role!

Responsibilities:
- Manage executive calendars
- Coordinate meetings and travel
- Prepare reports and presentations
- Handle confidential information
- Assist with various administrative tasks

Requirements:
- 2+ years of administrative experience
- Excellent organizational skills
- Strong communication abilities
- Proficiency in Microsoft Office
- Discretion and professionalism`,
  },
];

async function main() {
  console.log('🌱 Starting seed...');

  // Create or get admin user
  let adminUser;
  const adminEmail = 'admin@jobportal.com';
  
  adminUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!adminUser) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin User',
        role: 'admin',
      },
    });
    console.log('✅ Created admin user');
  } else {
    console.log('✅ Admin user already exists');
  }

  // Delete existing jobs (optional - comment out if you want to keep existing jobs)
  const deleteCount = await prisma.job.deleteMany({});
  console.log(`🗑️  Deleted ${deleteCount.count} existing jobs`);

  // Create jobs
  console.log('📝 Creating jobs...');
  for (const job of dummyJobs) {
    await prisma.job.create({
      data: {
        ...job,
        postedBy: adminUser.id,
      },
    });
  }

  console.log(`✅ Created ${dummyJobs.length} jobs`);
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
