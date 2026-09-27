// Preloaded sample family hierarchies for quick exploration and testing

export const defaultFamily = {
  id: 'root-1',
  name: 'Arthur Pendelton',
  title: 'Family Patriarch',
  relationship: 'Grandfather',
  gender: 'male',
  birthDate: '1948-03-12',
  deathDate: '',
  isDeceased: false,
  location: 'Oxford, United Kingdom',
  occupation: 'Retired Professor of History',
  bio: 'Passionate about family heritage, vintage gardening, and classical literature.',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  spouse: {
    name: 'Eleanor Vance Pendelton',
    title: 'Family Matriarch',
    birthDate: '1952-07-21',
    bio: 'Renowned botanist and avid painter.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    gender: 'female'
  },
  collapsed: false,
  children: [
    {
      id: 'child-1',
      name: 'Dr. Robert Pendelton',
      title: 'First Born Son',
      relationship: 'Father / Son',
      gender: 'male',
      birthDate: '1975-06-18',
      deathDate: '',
      isDeceased: false,
      location: 'London, UK',
      occupation: 'Cardiothoracic Surgeon',
      bio: 'Loves marathon running and playing classical cello on weekends.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      spouse: {
        name: 'Dr. Sarah Jenkins',
        title: 'Spouse',
        birthDate: '1978-11-04',
        bio: 'Pediatric specialist and published author.',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
        gender: 'female'
      },
      collapsed: false,
      children: [
        {
          id: 'gchild-1',
          name: 'Lucas Pendelton',
          title: 'Grandson',
          relationship: 'Son',
          gender: 'male',
          birthDate: '2004-09-14',
          deathDate: '',
          isDeceased: false,
          location: 'Cambridge, UK',
          occupation: 'AI Engineering Student',
          bio: 'Building autonomous robotics and loves rock climbing.',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
          children: []
        },
        {
          id: 'gchild-2',
          name: 'Maya Pendelton',
          title: 'Granddaughter',
          relationship: 'Daughter',
          gender: 'female',
          birthDate: '2008-02-28',
          deathDate: '',
          isDeceased: false,
          location: 'London, UK',
          occupation: 'High School Student / Musician',
          bio: 'Violinist in youth orchestra and wildlife photography enthusiast.',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
          children: []
        }
      ]
    },
    {
      id: 'child-2',
      name: 'Victoria Pendelton-Ross',
      title: 'Second Born Daughter',
      relationship: 'Daughter / Mother',
      gender: 'female',
      birthDate: '1979-09-03',
      deathDate: '',
      isDeceased: false,
      location: 'Edinburgh, Scotland',
      occupation: 'Architect & Urban Designer',
      bio: 'Designs sustainable eco-homes and loves equestrian sports.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      spouse: {
        name: 'Hamish Ross',
        title: 'Spouse',
        birthDate: '1976-04-15',
        bio: 'Renewable energy consultant and landscape photographer.',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
        gender: 'male'
      },
      collapsed: false,
      children: [
        {
          id: 'gchild-3',
          name: 'Oliver Ross',
          title: 'Grandson',
          relationship: 'Son',
          gender: 'male',
          birthDate: '2011-12-05',
          deathDate: '',
          isDeceased: false,
          location: 'Edinburgh, Scotland',
          occupation: 'Middle Schooler',
          bio: 'Lego robotics enthusiast and junior chess champion.',
          avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
          children: []
        }
      ]
    },
    {
      id: 'child-3',
      name: 'Julian Pendelton',
      title: 'Youngest Son',
      relationship: 'Son / Uncle',
      gender: 'male',
      birthDate: '1984-12-19',
      deathDate: '',
      isDeceased: false,
      location: 'San Francisco, CA',
      occupation: 'Tech Entrepreneur & Founder',
      bio: 'Angel investor, scuba diver, and space exploration advocate.',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
      children: []
    }
  ]
};

export const sampleTemplates = [
  {
    id: 'default',
    title: 'Modern 3-Generation Family',
    description: 'A comprehensive multi-generational hierarchy featuring grandparents, parents, spouses, and grandchildren.',
    badge: 'Popular',
    icon: 'Users',
    tree: defaultFamily
  },
  {
    id: 'royal',
    title: 'Dynasty / Heritage Lineage',
    description: 'A historic multi-branch royal ancestry tree structure.',
    badge: 'Historic',
    icon: 'Crown',
    tree: {
      id: 'dynasty-1',
      name: 'King George V',
      title: 'Monarch of the Realm',
      relationship: 'Patriarch',
      gender: 'male',
      birthDate: '1865-06-03',
      deathDate: '1936-01-20',
      isDeceased: true,
      location: 'London, England',
      occupation: 'Sovereign',
      bio: 'Reigned during the pivotal transition era.',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
      spouse: {
        name: 'Queen Mary',
        title: 'Queen Consort',
        birthDate: '1867-05-26',
        deathDate: '1953-03-24',
        bio: 'Staunch royal duty and patron of decorative arts.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
        gender: 'female'
      },
      children: [
        {
          id: 'dynasty-2',
          name: 'King George VI',
          title: 'King & Emperor',
          relationship: 'Son',
          gender: 'male',
          birthDate: '1895-12-14',
          deathDate: '1952-02-06',
          isDeceased: true,
          location: 'Buckingham Palace',
          occupation: 'King of Great Britain',
          bio: 'Led the nation with unwavering courage through World War II.',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
          children: [
            {
              id: 'dynasty-3',
              name: 'Queen Elizabeth II',
              title: 'Queen of the United Kingdom',
              relationship: 'Granddaughter',
              gender: 'female',
              birthDate: '1926-04-21',
              deathDate: '2022-09-08',
              isDeceased: true,
              location: 'Windsor Castle',
              occupation: 'Reigning Monarch (70 Years)',
              bio: 'Longest-reigning monarch in British history.',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
              children: []
            }
          ]
        }
      ]
    }
  },
  {
    id: 'blank',
    title: 'Blank Starting Tree',
    description: 'Start fresh with a single root member (Father / Patriarch / Mother) and build your custom tree.',
    badge: 'Clean Slate',
    icon: 'PlusCircle',
    tree: {
      id: 'root-new',
      name: 'Family Founder',
      title: 'Head of Family',
      relationship: 'Root',
      gender: 'male',
      birthDate: '1960-01-01',
      deathDate: '',
      isDeceased: false,
      location: 'City, Country',
      occupation: 'Profession',
      bio: 'Start adding photos, dates, spouse, and children to expand your hierarchy.',
      avatar: '',
      children: []
    }
  }
];
