import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch } from 'firebase/firestore';
import { firebaseConfig } from '../src/firebase/config'; 

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const panels = [
  {
    id: 'panel-1',
    name: 'SpeedySMM',
    balance: 150.75,
    apiUrl: 'https://speedysmm.com/api/v2',
    apiKey: 'key_speedy_123',
  },
  {
    id: 'panel-2',
    name: 'SMMKing',
    balance: 425.5,
    apiUrl: 'https://smmking.net/api/v2',
    apiKey: 'key_king_456',
  },
  {
    id: 'panel-3',
    name: 'InstaBoost',
    balance: 89.2,
    apiUrl: 'https://instaboost.io/api/v2',
    apiKey: 'key_insta_789',
  },
];

const services = [
  // Instagram Followers
  {
    id: 'svc-001',
    smmPanelId: 'panel-1',
    name: 'Instagram Followers [HQ]',
    category: 'Instagram',
    rate: 1.2,
    min: 100,
    max: 10000,
    estimatedDeliveryTime: '1-2 hours',
  },
  {
    id: 'svc-002',
    smmPanelId: 'panel-2',
    name: 'Instagram Followers [HQ]',
    category: 'Instagram',
    rate: 1.1,
    min: 50,
    max: 20000,
    estimatedDeliveryTime: '3-4 hours',
  },
  {
    id: 'svc-003',
    smmPanelId: 'panel-3',
    name: 'Instagram Followers [Real]',
    category: 'Instagram',
    rate: 2.5,
    min: 100,
    max: 5000,
    estimatedDeliveryTime: '24 hours',
  },
  // Instagram Likes
  {
    id: 'svc-004',
    smmPanelId: 'panel-1',
    name: 'Instagram Likes',
    category: 'Instagram',
    rate: 0.5,
    min: 50,
    max: 5000,
    estimatedDeliveryTime: '30 minutes',
  },
  {
    id: 'svc-005',
    smmPanelId: 'panel-2',
    name: 'Instagram Likes',
    category: 'Instagram',
    rate: 0.45,
    min: 20,
    max: 10000,
    estimatedDeliveryTime: '15 minutes',
  },
  // TikTok Views
  {
    id: 'svc-006',
    smmPanelId: 'panel-2',
    name: 'TikTok Views',
    category: 'TikTok',
    rate: 0.01,
    min: 1000,
    max: 1000000,
    estimatedDeliveryTime: '5 minutes',
  },
  {
    id: 'svc-007',
    smmPanelId: 'panel-1',
    name: 'TikTok Views',
    category: 'TikTok',
    rate: 0.015,
    min: 500,
    max: 500000,
    estimatedDeliveryTime: '10 minutes',
  },
  // YouTube Subscribers
  {
    id: 'svc-008',
    smmPanelId: 'panel-3',
    name: 'YouTube Subscribers',
    category: 'YouTube',
    rate: 15.0,
    min: 10,
    max: 1000,
    estimatedDeliveryTime: '1-3 days',
  },
];


async function seedDatabase() {
  console.log('Seeding database...');
  const batch = writeBatch(db);

  // Seed panels
  const panelsCollection = collection(db, 'smm_panels');
  panels.forEach(panel => {
    const docRef = panelsCollection.doc(panel.id);
    batch.set(docRef, panel);
  });
  console.log('Panels queued for seeding.');

  // Seed services
  services.forEach(service => {
    const servicesCollection = collection(db, `smm_panels/${service.smmPanelId}/services`);
    const docRef = servicesCollection.doc(service.id);
    batch.set(docRef, service);
  });
  console.log('Services queued for seeding.');


  try {
    await batch.commit();
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database: ', error);
  } finally {
    process.exit();
  }
}

seedDatabase();
