export const profile = {
  name: 'Ravjot Singh',
  firstName: 'Ravjot',
  initials: 'rs',
  role: 'AI & Full-Stack Engineer',
  subtitle: 'Computer Science Engineering Graduate',
  location: 'Punjab, India',
  timezone: 'IST · UTC+5:30',
  timezoneName: 'Asia/Kolkata',
  email: 'ravjotsg03@gmail.com',
  phone: '+91 76961-22414',
  availability: 'Available for full-time roles & projects',
  heroLine: 'Building intelligent systems that are fast, robust &',
  heroAccent: 'agentic.',
  heroIntro:
    "I'm Ravjot — a Computer Science Engineering graduate skilled in Python, FastAPI, Django, and modern AI. Experienced in Agentic AI, Machine Learning, full-stack development, and computer vision.",
  aboutLead:
    'Great software bridges intelligent algorithms with reliable engineering and intuitive human experiences.',
  aboutBody: [
    'I specialize in Python, FastAPI, Django, and PostgreSQL on the backend, complemented by responsive interfaces in React and Tailwind CSS. My practical work centers on applied and agentic AI — leveraging LangChain, LangGraph, Model Context Protocol (MCP), and vector databases to create systems that act with purpose.',
    'From training video-processing pipelines with OpenCV and zero-shot vision models to crafting production e-commerce platforms with Gemini AI chatbots, I love solving real-world challenges from low-level data flows to polished user experiences.',
  ],
  socials: [
    { label: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/in/ravjot-singh-24608b34b' },
    { label: 'GitHub', icon: 'github', href: 'https://github.com/ravjotsingh-ml' },
    { label: 'Email', icon: 'mail', href: 'mailto:ravjotsg03@gmail.com' },
  ],
}

export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

export const stats = [
  { value: '7.91', label: 'B.Tech CGPA' },
  { value: '3+', label: 'Flagship Projects' },
  { value: '6mo+', label: 'Industrial Training' },
  { value: '10+', label: 'Core AI & Web Tools' },
]

export const pillars = [
  {
    icon: 'zap',
    title: 'Agentic & applied AI',
    text: 'Building autonomous workflows with LangChain, LangGraph, and Swiggy MCP, plus zero-shot visual detection and LLM-based reasoning.',
  },
  {
    icon: 'layers',
    title: 'Robust backend & APIs',
    text: 'Production-ready REST APIs and workflows built with Python, FastAPI, Django, and PostgreSQL with pgvector and ChromaDB.',
  },
  {
    icon: 'code',
    title: 'Full-stack integration',
    text: 'End-to-end applications connecting performant React & Tailwind frontends to scalable databases and intelligent AI backends.',
  },
]

export const skillGroups = [
  {
    index: '01',
    icon: 'sparkles',
    title: 'Agentic AI, ML & Computer Vision',
    blurb: 'Autonomous agents, multimodal intelligence, and vision pipelines.',
    items: [
      'LangChain',
      'LangGraph',
      'LLMs',
      'Swiggy MCP',
      'Gemini AI',
      'Hugging Face',
      'OpenCV',
      'Tesseract OCR',
      'Machine Learning',
    ],
  },
  {
    index: '02',
    icon: 'code',
    title: 'Backend & Databases',
    blurb: 'High-throughput APIs, schemas, and vector stores.',
    items: [
      'Python',
      'FastAPI',
      'Django',
      'Django REST Framework',
      'REST APIs',
      'PostgreSQL',
      'pgvector',
      'ChromaDB',
      'SQLite3',
    ],
  },
  {
    index: '03',
    icon: 'layers',
    title: 'Frontend & Developer Tools',
    blurb: 'Modern web UIs, data tools, and testing utilities.',
    items: [
      'React',
      'Tailwind CSS',
      'JavaScript',
      'HTML & CSS',
      'Git & GitHub',
      'VS Code',
      'pgAdmin',
      'Playwright',
      'SerpAPI',
      'Streamlit',
      'NumPy & Pandas',
    ],
  },
]

export const marqueeSkills = [
  'Python',
  'FastAPI',
  'Agentic AI',
  'LangChain',
  'LangGraph',
  'PostgreSQL',
  'pgvector',
  'OpenCV',
  'React',
  'Django',
  'Gemini AI',
  'ChromaDB',
]

export const exploring = [
  'Swiggy MCP',
  'Autonomous Agents',
  'Vector Search & RAG',
  'Multimodal LLMs',
]

export const projects = [
  {
    id: 'scholarsync',
    title: 'Scholar Sync',
    category: 'Full-Stack',
    year: '2026',
    tagline: 'Academic platform for marks, assignments & records.',
    description:
      'A full-stack academic platform for students to access marks, assignments, and announcements with role-based access control.',
    overview:
      'Scholar Sync is a centralized academic management system engineered to streamline student and faculty communication. It provides secure, instant access to academic records, assignment workflows, and departmental notices.',
    challenge:
      'Academic institutions often struggle with fragmented portals for student marks, assignment submissions, and faculty announcements, leading to sync issues and poor student experience.',
    solution:
      'Architected a modern full-stack web application with role-based access control (RBAC), high-throughput FastAPI REST endpoints, and a responsive React frontend backed by structured PostgreSQL relational schemas.',
    role: 'Full-Stack Developer',
    timeline: 'Academic Capstone',
    metrics: [
      { value: 'FastAPI', label: 'REST backend' },
      { value: 'PostgreSQL', label: 'Relational database' },
      { value: '100% RBAC', label: 'Role-based access' },
    ],
    tags: ['Python', 'FastAPI', 'PostgreSQL', 'React', 'Tailwind CSS', 'JavaScript'],
    accent: '#6fe3c1',
    visual: 'system',
  },
  {
    id: 'cracked-screen',
    title: 'Cracked Screen Detection',
    category: 'Computer Vision',
    year: '2026',
    tagline: 'Intelligent video inspection & screen condition analysis.',
    description:
      'Mobile inspection system processing videos to select representative frames and detect screen cracks using zero-shot vision and LLMs.',
    overview:
      'An automated quality-inspection system that ingests smartphone condition videos, extracts clear representative keyframes, and evaluates device displays for cracks and physical defects.',
    challenge:
      'Raw inspection videos contain hundreds of blurry, redundant, and misoriented frames, overwhelming manual reviewers and degrading automated classification models.',
    solution:
      'Engineered an OpenCV processing pipeline featuring Laplacian blur filtering, orientation detection, and phone side identification. Integrated Hugging Face zero-shot models and LLM-based visual analysis to accurately detect and log screen damage.',
    role: 'Computer Vision & AI Engineer',
    timeline: '8 weeks',
    metrics: [
      { value: 'OpenCV', label: 'Blur filter & keyframe selection' },
      { value: 'Zero-shot', label: 'Hugging Face vision models' },
      { value: 'LLM Vision', label: 'Automated crack identification' },
    ],
    tags: ['Python', 'FastAPI', 'React', 'OpenCV', 'Tesseract OCR', 'Hugging Face'],
    accent: '#7c9cff',
    visual: 'ai',
  },
  {
    id: 'beantheory',
    title: 'BeanTheory Coffee E-Commerce',
    category: 'E-Commerce',
    year: '2026',
    tagline: 'Specialty coffee storefront with Gemini AI chatbot.',
    description:
      'An e-commerce website with authentication, product management, shopping cart, payment integration, and a Gemini AI assistant.',
    overview:
      'BeanTheory is an artisanal coffee e-commerce web platform offering a full retail workflow: catalog navigation, cart management, checkout, automated PDF invoices, and an AI-powered conversational shopping assistant.',
    challenge:
      'Coffee shoppers require quick guidance on bean origins, roasts, and brewing methods, while store owners need seamless ordering, automated invoicing, and admin visibility.',
    solution:
      'Developed a comprehensive Django application backed by PostgreSQL. Embedded an interactive Google Gemini AI chatbot for real-time recommendations, combined with automated PDF invoice generation and email confirmations upon order completion.',
    role: 'Full-Stack Python Developer',
    timeline: 'Industrial Training Project',
    metrics: [
      { value: 'Gemini AI', label: 'Integrated chatbot assistant' },
      { value: 'Django + SQL', label: 'Robust transactional backend' },
      { value: 'Automated', label: 'PDF invoices & emails' },
    ],
    tags: ['Python', 'Django', 'PostgreSQL', 'Gemini AI', 'HTML & CSS', 'Bootstrap'],
    accent: '#ffb178',
    visual: 'finance',
  },
]

export const experience = [
  {
    role: 'Trainee — Machine Learning | Agentic AI',
    company: 'Seasia Group of Companies',
    period: 'Jun 2026 — Present',
    location: 'Mohali, Punjab · Hybrid',
    summary:
      'Building agentic AI food recommendation systems and automated computer vision inspection pipelines.',
    achievements: [
      'Developing an Agentic AI food recommendation system using Swiggy MCP, LangChain, and LangGraph to identify suitable food combinations based on user prompts.',
      'Working with ChromaDB and PostgreSQL with pgvector for vector storage and retrieval to support context-aware food matching.',
      'Developing a cracked phone detection system using Python, FastAPI, OpenCV, and Tesseract OCR to process inspection videos and select clear, representative frames.',
      'Integrating Hugging Face zero-shot models and LLM-based visual analysis to assess phone condition and detect screen cracks.',
    ],
    tags: ['Agentic AI', 'LangChain', 'LangGraph', 'Swiggy MCP', 'ChromaDB', 'pgvector', 'OpenCV', 'FastAPI'],
  },
  {
    role: 'Industrial Trainee — Data Science, Python, Machine Learning & AI',
    company: 'CS Soft Solutions (India) Pvt. Ltd.',
    period: 'Dec 2025 — May 2026',
    location: 'Mohali, Punjab',
    summary:
      'Completed a 6-month intensive industrial training in Python, Data Science, Machine Learning, and AI application development.',
    achievements: [
      'Completed six months of industrial training in Python, Data Science, Machine Learning, and Artificial Intelligence.',
      'Developed BeanTheory, a coffee e-commerce application using Django and PostgreSQL, with authentication and product management.',
      'Integrated a Gemini AI chatbot, automated PDF invoices, and email delivery.',
    ],
    tags: ['Python', 'Django', 'PostgreSQL', 'Machine Learning', 'Gemini AI', 'Data Science'],
  },
]

export const education = [
  {
    degree: 'B.Tech. in Computer Science and Engineering',
    school: 'Guru Nanak Dev University, Jalandhar, Punjab',
    period: '2022 — 2026',
    note: 'CGPA: 7.91 · Focused on Software Engineering, Machine Learning, and Full-Stack Development.',
  },
  {
    degree: 'Class XII (Non-Medical)',
    school: 'Kamla Nehru Public School, Phagwara, Punjab',
    period: '2021 — 2022',
    note: 'Score: 75.2%',
  },
  {
    degree: 'Class X',
    school: 'Kamla Nehru Public School, Phagwara, Punjab',
    period: '2019 — 2020',
    note: 'Score: 82.4%',
  },
]

export const awards = [
  {
    title: 'First Prize — Web Mania',
    detail: 'Inter-College Competition · March 2025',
  },
  {
    title: 'Third Prize — Technical Competition',
    detail: 'Inter-College TechFest · 2025',
  },
  {
    title: 'Third Prize — Inter-College Event',
    detail: 'Technical Symposium · 2025',
  },
  {
    title: 'Participant & Finalist',
    detail: 'Technical Innovation Competition · December 2025',
  },
]

export const projectFilters = ['All', 'Full-Stack', 'Computer Vision', 'E-Commerce']
