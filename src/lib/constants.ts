import { 
  Brain, 
  BookOpen, 
  TestTube2, 
  Globe, 
  Calculator, 
  PenTool 
} from 'lucide-react';

export const SUBJECTS = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    icon: Calculator,
    topics: [
      {
        id: 'algebra',
        name: 'Algebra',
        description: 'Equations, functions, and algebraic structures',
        gradeLevel: ['middle', 'high']
      },
      {
        id: 'geometry',
        name: 'Geometry',
        description: 'Shapes, spaces, and measurements',
        gradeLevel: ['middle', 'high']
      },
      {
        id: 'calculus',
        name: 'Calculus',
        description: 'Derivatives, integrals, and limits',
        gradeLevel: ['high']
      }
    ]
  },
  {
    id: 'science',
    name: 'Science',
    icon: TestTube2,
    topics: [
      {
        id: 'physics',
        name: 'Physics',
        description: 'Forces, energy, and matter',
        gradeLevel: ['middle', 'high']
      },
      {
        id: 'chemistry',
        name: 'Chemistry',
        description: 'Elements, compounds, and reactions',
        gradeLevel: ['middle', 'high']
      },
      {
        id: 'biology',
        name: 'Biology',
        description: 'Living organisms and natural systems',
        gradeLevel: ['elementary', 'middle', 'high']
      }
    ]
  },
  {
    id: 'literature',
    name: 'Literature',
    icon: BookOpen,
    topics: [
      {
        id: 'comprehension',
        name: 'Reading Comprehension',
        description: 'Understanding and analyzing texts',
        gradeLevel: ['elementary', 'middle', 'high']
      },
      {
        id: 'poetry',
        name: 'Poetry Analysis',
        description: 'Poetic devices and interpretation',
        gradeLevel: ['middle', 'high']
      },
      {
        id: 'writing',
        name: 'Creative Writing',
        description: 'Story composition and narrative techniques',
        gradeLevel: ['elementary', 'middle', 'high']
      }
    ]
  }
];

export const GRADE_LEVELS = [
  { id: 'elementary', name: 'Elementary School', grades: '1-5' },
  { id: 'middle', name: 'Middle School', grades: '6-8' },
  { id: 'high', name: 'High School', grades: '9-12' }
];

export const QUESTION_TYPES = [
  {
    id: 'multiple-choice',
    name: 'Multiple Choice',
    description: 'Questions with predefined answer options',
    icon: Brain
  },
  {
    id: 'short-answer',
    name: 'Short Answer',
    description: 'Brief responses requiring specific answers',
    icon: PenTool
  },
  {
    id: 'essay',
    name: 'Essay',
    description: 'Long-form answers with detailed explanations',
    icon: BookOpen
  }
];