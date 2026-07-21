import type { JobDescription, Resume } from '../types';

export const SAMPLE_JOB_DESCRIPTIONS: JobDescription[] = [
  {
    id: 'jd_senior_ai_fullstack',
    title: 'Senior AI & Full-Stack Engineer',
    department: 'Core Product & AI Innovation',
    company: 'NexusTech Solutions',
    roleCategory: 'Full Stack / AI',
    minExperienceYears: 5,
    minEducation: "Bachelor's Degree",
    requiredSkills: ['TypeScript', 'React', 'Node.js', 'Python', 'PyTorch', 'AWS', 'PostgreSQL', 'Docker'],
    preferredSkills: ['Next.js', 'Tailwind CSS', 'GraphQL', 'Pinecone', 'Kubernetes', 'CI/CD'],
    rawText: `Job Title: Senior AI & Full-Stack Engineer
Company: NexusTech Solutions
Location: San Francisco, CA (Hybrid / Remote)

About the Role:
NexusTech is seeking an experienced Senior AI & Full-Stack Engineer to build scalable web applications powered by modern artificial intelligence, LLM pipelines, and high-performance microservices.

Responsibilities:
- Architect, build, and deploy web applications using React, TypeScript, Node.js, and Python.
- Integrate NLP models, PyTorch embeddings, vector stores (Pinecone/Weaviate), and REST APIs.
- Manage cloud infrastructure on AWS, utilizing Docker, Terraform, and PostgreSQL databases.
- Collaborate with cross-functional teams in an Agile environment to deliver feature sprints.
- Mentor junior engineers and champion clean code, unit testing, and CI/CD pipelines.

Requirements:
- 5+ years of software engineering experience building production web platforms.
- Proficiency in React, TypeScript, Node.js, Python, PyTorch, and SQL databases.
- Hands-on experience with cloud platforms (AWS), containerization (Docker), and microservices.
- Strong problem solving, system design, and communication skills.
- Bachelor's or Master's degree in Computer Science, STEM, or equivalent experience.`,
    weights: {
      skillMatch: 40,
      tfidf: 25,
      experience: 20,
      education: 15
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'jd_ml_specialist',
    title: 'Machine Learning & NLP Specialist',
    department: 'Applied AI Research',
    company: 'Cognitive Science Labs',
    roleCategory: 'AI/ML',
    minExperienceYears: 4,
    minEducation: "Master's Degree",
    requiredSkills: ['Python', 'PyTorch', 'TensorFlow', 'NLP', 'Machine Learning', 'Scikit-Learn', 'Docker', 'Git'],
    preferredSkills: ['FastAPI', 'AWS', 'PostgreSQL', 'Pinecone', 'System Architecture'],
    rawText: `Job Title: Machine Learning & NLP Specialist
Company: Cognitive Science Labs

Overview:
Looking for a passionate ML Engineer specializing in Natural Language Processing (NLP), Transformer architectures, and vector search engines.

Key Responsibilities:
- Design and fine-tune modern NLP models using PyTorch, TensorFlow, and Hugging Face.
- Build production model serving pipelines using Python, FastAPI, Docker, and AWS.
- Implement vector similarity search (Pinecone, ChromaDB) and retrieval-augmented generation (RAG).
- Analyze large text datasets using Pandas, NumPy, and Scikit-Learn.

Requirements:
- 4+ years in Applied ML or AI research.
- Expertise in Python, NLP, PyTorch, TensorFlow, Scikit-Learn, and Docker.
- Master's or PhD in Computer Science, Data Science, or related quantitative field.`,
    weights: {
      skillMatch: 45,
      tfidf: 25,
      experience: 20,
      education: 10
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'jd_frontend_lead',
    title: 'Staff Frontend Architect',
    department: 'Design System & UI Infra',
    company: 'Starlight Media',
    roleCategory: 'Frontend',
    minExperienceYears: 6,
    minEducation: "Bachelor's Degree",
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'HTML/CSS', 'GraphQL', 'REST API', 'Git'],
    preferredSkills: ['Next.js', 'Vue.js', 'System Architecture', 'CI/CD', 'Docker'],
    rawText: `Job Title: Staff Frontend Architect
Company: Starlight Media

Responsibilities:
- Lead the frontend web platform engineering using React, TypeScript, Tailwind CSS, and Next.js.
- Optimize frontend web performance, accessibility, animations, and component design systems.
- Interface with GraphQL APIs and REST services.
- Establish best practices for unit testing, state management, and continuous integration.

Requirements:
- 6+ years of specialized frontend development experience.
- Deep expertise in React, TypeScript, modern CSS frameworks (Tailwind CSS), and web performance.
- Bachelor's degree in Computer Science or software engineering background.`,
    weights: {
      skillMatch: 45,
      tfidf: 20,
      experience: 25,
      education: 10
    },
    createdAt: new Date().toISOString()
  }
];

export const SAMPLE_RESUMES: Resume[] = [
  {
    id: 'res_alex_rivera',
    fileName: 'Alex_Rivera_Senior_FullStack_AI.pdf',
    candidateName: 'Alex Rivera',
    email: 'alex.rivera@techmail.com',
    phone: '+1 (555) 234-5678',
    linkedin: 'linkedin.com/in/alexrivera-tech',
    github: 'github.com/arivera-dev',
    experienceYears: 6,
    education: "Master's Degree in CS / STEM",
    extractedSkills: ['TypeScript', 'React', 'Node.js', 'Python', 'PyTorch', 'AWS', 'PostgreSQL', 'Docker', 'Next.js', 'Tailwind CSS', 'GraphQL', 'Pinecone', 'CI/CD', 'Git', 'Agile / Scrum', 'REST API'],
    actionWordScore: 92,
    source: 'sample',
    parsedAt: new Date().toISOString(),
    rawText: `Alex Rivera
Senior Full-Stack & AI Engineer
Email: alex.rivera@techmail.com | Phone: +1 (555) 234-5678 | San Francisco, CA
LinkedIn: linkedin.com/in/alexrivera-tech | GitHub: github.com/arivera-dev

EXECUTIVE SUMMARY
Passionate Senior Software Engineer with 6 years of experience building high-scale full-stack web applications and AI vector pipelines. Expert in TypeScript, React, Node.js, Python, PyTorch, and cloud infrastructure on AWS.

PROFESSIONAL EXPERIENCE
Senior Full-Stack AI Engineer | Apex Cloud Solutions (2022 - Present)
- Architected and launched an enterprise AI screening platform using React, TypeScript, Node.js, and Python.
- Fine-tuned NLP embedding models in PyTorch and integrated Pinecone vector stores for fast similarity search.
- Scaled PostgreSQL and Redis databases on AWS (ECS, Lambda, S3, CloudFront), handling over 5M API queries monthly.
- Engineered automated CI/CD pipelines with GitHub Actions and Docker containers, reducing deployment time by 45%.

Software Engineer | Horizon Digital (2018 - 2022)
- Built responsive user interfaces using React, Redux, Next.js, and Tailwind CSS.
- Developed scalable REST APIs and GraphQL microservices in Node.js and Python (FastAPI).
- Spearheaded team transition to TypeScript and mentored 4 junior software engineers.

EDUCATION
Master of Science (M.S.) in Computer Science | Stanford University (2018)
Bachelor of Science (B.S.) in Software Engineering | UC Berkeley (2016)

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, Python, SQL, C++, HTML/CSS
Frameworks: React, Next.js, Node.js, FastAPI, PyTorch, Tailwind CSS, GraphQL
Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD, Git, PostgreSQL, Pinecone, Redis`
  },
  {
    id: 'res_sarah_chen',
    fileName: 'Sarah_Chen_ML_Specialist.pdf',
    candidateName: 'Dr. Sarah Chen',
    email: 'sarah.chen@ai-labs.org',
    phone: '+1 (555) 876-5432',
    linkedin: 'linkedin.com/in/drsarahchen',
    github: 'github.com/schen-ml',
    experienceYears: 5,
    education: 'Ph.D. in Computer Science / Engineering',
    extractedSkills: ['Python', 'PyTorch', 'TensorFlow', 'NLP', 'Machine Learning', 'Scikit-Learn', 'Docker', 'Git', 'FastAPI', 'AWS', 'Pinecone', 'System Architecture', 'SQL', 'PostgreSQL'],
    actionWordScore: 88,
    source: 'sample',
    parsedAt: new Date().toISOString(),
    rawText: `Dr. Sarah Chen
Machine Learning & NLP Specialist
Email: sarah.chen@ai-labs.org | Phone: +1 (555) 876-5432
LinkedIn: linkedin.com/in/drsarahchen | GitHub: github.com/schen-ml

SUMMARY
Machine Learning Scientist with 5 years of post-PhD research and production experience in Natural Language Processing (NLP), Deep Learning, PyTorch, TensorFlow, and Large Language Models.

WORK EXPERIENCE
Senior ML Engineer | DeepMind Research Partner Group (2021 - Present)
- Developed and deployed Transformer NLP models using PyTorch, HuggingFace, and TensorFlow.
- Implemented vector similarity search with Pinecone and FAISS for semantic document retrieval.
- Containerized model inference microservices using Docker and FastAPI on AWS EC2/ECS.
- Published 3 peer-reviewed papers on NLP context embeddings and semantic scoring.

Data Scientist | Vector Data Analytics (2019 - 2021)
- Built predictive Machine Learning pipelines in Python using Scikit-Learn, Pandas, and SQL.
- Designed automated feature engineering routines for text classification.

EDUCATION
Ph.D. in Computer Science (AI/NLP Focus) | MIT (2019)
B.S. in Applied Mathematics & CS | Carnegie Mellon University (2015)

SKILLS
Python, PyTorch, TensorFlow, NLP, Machine Learning, Scikit-Learn, Docker, Git, FastAPI, AWS, Pinecone, System Architecture, PostgreSQL`
  },
  {
    id: 'res_david_kim',
    fileName: 'David_Kim_Frontend.pdf',
    candidateName: 'David Kim',
    email: 'david.kim@frontend.io',
    phone: '+1 (555) 345-6789',
    linkedin: 'linkedin.com/in/davidkim-ui',
    github: 'github.com/dkim-ui',
    experienceYears: 7,
    education: "Bachelor's Degree in CS / STEM",
    extractedSkills: ['React', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'HTML/CSS', 'GraphQL', 'REST API', 'Git', 'Next.js', 'Vue.js', 'System Architecture', 'CI/CD'],
    actionWordScore: 85,
    source: 'sample',
    parsedAt: new Date().toISOString(),
    rawText: `David Kim
Staff Frontend Web Architect
Email: david.kim@frontend.io | Phone: +1 (555) 345-6789
LinkedIn: linkedin.com/in/davidkim-ui | GitHub: github.com/dkim-ui

EXPERIENCE
Lead Frontend Engineer | PixelCraft Studios (2020 - Present)
- Spearheaded frontend architecture using React, TypeScript, Next.js, and Tailwind CSS.
- Optimized web page load speeds by 60% using web vitals profiling and server-side rendering.
- Designed comprehensive UI design system and component libraries consumed by 30+ developers.

Senior Frontend Developer | WebFlex Inc (2017 - 2020)
- Built complex client dashboards using React, JavaScript, HTML5/CSS3, and GraphQL APIs.
- Integrated automated end-to-end testing with Cypress and CI/CD workflows on GitHub Actions.

EDUCATION
B.S. in Computer Science | University of Washington (2017)

SKILLS
React, TypeScript, Tailwind CSS, JavaScript, HTML/CSS, GraphQL, REST API, Git, Next.js, Vue.js, System Architecture, CI/CD`
  },
  {
    id: 'res_elena_rostova',
    fileName: 'Elena_Rostova_Backend_Junior.pdf',
    candidateName: 'Elena Rostova',
    email: 'elena.rostova@devmail.com',
    phone: '+1 (555) 456-7890',
    linkedin: 'linkedin.com/in/elenarostova',
    experienceYears: 2,
    education: "Bachelor's Degree in CS / STEM",
    extractedSkills: ['Node.js', 'JavaScript', 'SQL', 'PostgreSQL', 'Git', 'REST API', 'Docker'],
    actionWordScore: 65,
    source: 'sample',
    parsedAt: new Date().toISOString(),
    rawText: `Elena Rostova
Junior Backend Software Developer
Email: elena.rostova@devmail.com | Phone: +1 (555) 456-7890

SUMMARY
Enthusiastic Junior Software Developer with 2 years experience focused on Node.js REST APIs, PostgreSQL databases, and Docker containerization. Seeking opportunities to expand into full-stack and AI engineering.

WORK EXPERIENCE
Junior Software Developer | CodeBase Tech (2022 - Present)
- Maintained REST API endpoints built with Node.js and Express.
- Wrote SQL queries and database migrations for PostgreSQL.
- Used Git for version control and Docker for local dev environments.

EDUCATION
B.S. in Information Technology | San Jose State University (2022)

SKILLS
Node.js, JavaScript, SQL, PostgreSQL, Git, REST API, Docker`
  }
];
