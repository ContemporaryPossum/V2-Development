/* ==========================================================================
   V2 DEVELOPMENT — Site data
   Every page reads company details, residences and site-progress photos
   from this one file. Edit here and the whole site updates.
   ========================================================================== */

/* Photos sit next to this file and follow one naming pattern:
     harmoni-01.jpg            gallery images of a residence
     harmoni-plan-01.jpg       floor / layout plans
     progress-harmoni-01.jpg   site-progress photographs
   To add a photo, upload it with the next number and raise the count below. */
const photos = (prefix, count) => Array.from({ length: count }, (_, i) => `${prefix}-${String(i + 1).padStart(2, '0')}.jpg`);

window.V2_SITE = {
  name: 'V2 Development',
  legal: 'V2 Development Sdn. Bhd.',
  regNo: '201901015722 (1325050-H)',
  established: 2019,
  tagline: 'Quality life with your precious ones',
  address: [
    'No. 17 & 17-1, Jalan Sungai Rasau E32/E',
    'Taman Perindustrian Berjaya',
    '40460 Shah Alam, Selangor'
  ],
  mapQuery: 'No. 17, Jalan Sungai Rasau E32/E, Taman Perindustrian Berjaya, 40460 Shah Alam, Selangor',
  phone: { label: '03-5131 7168', tel: '+60351317168' },
  marketing: [
    { name: 'Marketing I', label: '012-684 1812', tel: '+60126841812' },
    { name: 'Marketing II', label: '010-268 9812', tel: '+60102689812' }
  ],
  whatsapp: '60126841812',
  email: 'marketing@v2-d.com.my',
  hours: 'Monday – Friday, 9am – 5pm',
  facebook: 'https://www.facebook.com/v2developmentsb/',
  instagram: ''
};

window.V2_AREAS = {
  'shah-alam': { name: 'Shah Alam', img: 'khalid-al-walid-3-01.jpg' },
  'meru': { name: 'Meru, Klang', img: 'meru-permai-01.jpg' },
  'kapar': { name: 'Kapar', img: 'tok-muda-berjaya-01.jpg' },
  'pulau-indah': { name: 'Pulau Indah', img: 'imam-yusof-5-01.jpg' },
  'sepang': { name: 'Sungai Pelek, Sepang', img: 'harmoni-03.jpg' }
};

window.V2_PROJECTS = [
  {
    slug: 'taman-harmoni',
    name: 'Taman Harmoni',
    status: 'current',
    area: 'sepang',
    locality: 'Sungai Pelek, Sepang',
    address: 'Taman Harmoni Indah 1, Sungai Pelek, 43950 Sepang, Selangor',
    type: 'Single & Double-Storey Bungalows and Semi-Detached Homes',
    typeShort: 'Bungalows & Semi-D',
    units: 29,
    land: "40' × 85'",
    builtUp: '1,800 sq.ft.',
    beds: '4 – 5',
    baths: '3 – 5',
    tenure: 'Freehold · Open Title',
    title: 'Individual Title',
    completion: '2028',
    priceFrom: 688000,
    perks: ['Free SPA legal fees', 'Freehold, open title', 'Individual title'],
    intro: 'A private enclave of twenty-nine bungalows and semi-detached residences, set on generous lots in Sungai Pelek.',
    description: 'Taman Harmoni brings together one single-storey bungalow, two double-storey bungalows, eighteen single-storey semi-detached homes and eight double-storey semi-detached homes. Every residence is held on freehold, open title, with an individual title for each home.',
    unitTypes: [
      { name: 'Double-Storey Bungalow', beds: 5, baths: 5, units: 2, price: 1550000 },
      { name: 'Single-Storey Bungalow', beds: 4, baths: 3, units: 1, price: 888000 },
      { name: 'Double-Storey Semi-Detached', beds: 4, baths: 5, units: 8, price: 938000 },
      { name: 'Single-Storey Semi-Detached', beds: 4, baths: 3, units: 18, price: 688000 }
    ],
    cover: 'harmoni-02.jpg',
    hero: 'harmoni-02.jpg',
    gallery: photos('harmoni', 8),
    plans: [
      { src: 'harmoni-plan-01.jpg', label: 'Single-Storey Bungalow' },
      { src: 'harmoni-plan-02.jpg', label: 'Double-Storey Bungalow' },
      { src: 'harmoni-plan-03.jpg', label: 'Single-Storey Semi-D' },
      { src: 'harmoni-plan-04.jpg', label: 'Double-Storey Semi-D' }
    ]
  },
  {
    slug: 'taman-meru-permai',
    name: 'Taman Meru Permai',
    status: 'current',
    area: 'meru',
    locality: 'Jalan Jambu, Meru',
    address: 'Jalan Jambu, Meru, 41050 Klang, Selangor',
    type: 'Bungalow, Semi-Detached & Single-Storey Terrace Homes',
    typeShort: 'Bungalow, Semi-D & Terrace',
    units: 30,
    land: "20' × 82'",
    builtUp: '1,200 sq.ft.',
    beds: '4 – 5',
    baths: '2 – 4',
    tenure: 'Freehold · Malay Reserve',
    title: 'Individual Title',
    completion: '2028',
    priceFrom: 470000,
    perks: ['Free SPA legal fees', 'Free MOT', 'Individual title'],
    intro: 'Thirty homes on Jalan Jambu, wrapped in greenery: a single double-storey bungalow, six semi-detached homes and twenty-three terraces.',
    description: 'A rare mix of house types in one intimate community. The double-storey bungalow anchors the layout, with single-storey semi-detached homes and terraces arranged along tree-lined streets in Meru, Klang.',
    unitTypes: [
      { name: 'Double-Storey Bungalow', beds: 5, baths: 4, units: 1, price: 1700000 },
      { name: 'Single-Storey Semi-Detached', beds: 4, baths: 2, units: 6, price: 680000 },
      { name: 'Single-Storey Terrace', beds: 4, baths: 2, units: 23, price: 470000 }
    ],
    cover: 'meru-permai-05.jpg',
    hero: 'meru-permai-02.jpg',
    gallery: photos('meru-permai', 7),
    plans: photos('meru-permai-plan', 5).map((src, i) => ({ src, label: `Layout plan 0${i + 1}` }))
  },
  {
    slug: 'taman-desa-bukit-permata',
    name: 'Taman Desa Bukit Permata',
    status: 'current',
    area: 'meru',
    locality: 'Jalan Kempas 1, Meru',
    address: 'Jalan Kempas 1, Meru, 41050 Klang, Selangor',
    type: 'Double-Storey Terrace Homes',
    typeShort: 'Double-Storey Terrace',
    units: 30,
    land: "20' × 80'",
    builtUp: '1,860 sq.ft.',
    beds: '4',
    baths: '3',
    tenure: 'Freehold · Malay Reserve',
    title: 'Individual Title',
    completion: '2028',
    priceFrom: 618000,
    perks: ['Free SPA legal fees', 'Free MOT', 'Two car parks per home'],
    intro: 'Thirty double-storey terrace homes with 1,860 sq.ft. of living space across two generous floors.',
    description: 'Set on Jalan Kempas 1 in Meru, each home offers four bedrooms, three bathrooms and parking for two cars, on freehold land with an individual title.',
    unitTypes: [
      { name: 'Intermediate Lot', beds: 4, baths: 3, units: null, price: 618000 },
      { name: 'Corner & End Lots', beds: 4, baths: 3, units: null, price: 681000 }
    ],
    cover: 'desa-bukit-permata-02.jpg',
    hero: 'desa-bukit-permata-01.jpg',
    gallery: photos('desa-bukit-permata', 5),
    plans: [
      { src: 'desa-bukit-permata-plan-01.jpg', label: 'Corner Lot' },
      { src: 'desa-bukit-permata-plan-02.jpg', label: 'Intermediate Lot' },
      { src: 'desa-bukit-permata-plan-03.jpg', label: 'End Lot' }
    ]
  },
  {
    slug: 'taman-dato-harun-5',
    name: 'Taman Dato Harun 5',
    status: 'current',
    area: 'pulau-indah',
    locality: 'Pulau Indah',
    address: 'Jalan Dato Harun, Kampung Sungai Kembong, 42920 Pulau Indah, Selangor',
    type: 'Single-Storey Terrace Homes',
    typeShort: 'Single-Storey Terrace',
    units: 27,
    land: "20' × 68'",
    builtUp: '1,020 sq.ft.',
    beds: '4',
    baths: '2',
    tenure: 'Freehold · Malay Reserve',
    title: 'Individual Title',
    completion: '2028',
    priceFrom: null,
    perks: ['Free SPA legal fees', 'Free MOT', 'Two car parks per home'],
    intro: 'Twenty-seven single-storey terrace homes in Kampung Sungai Kembong, Pulau Indah.',
    description: 'Practical, light-filled family homes of 1,020 sq.ft. on 20\' × 68\' lots, each with four bedrooms, two bathrooms and parking for two cars.',
    unitTypes: [],
    cover: 'dato-harun-5-01.jpg',
    hero: 'dato-harun-5-01.jpg',
    gallery: photos('dato-harun-5', 7),
    plans: [{ src: 'dato-harun-5-plan-01.jpg', label: 'Floor plan' }]
  },
  {
    slug: 'taman-tok-muda-berjaya',
    name: 'Taman Tok Muda Berjaya',
    status: 'current',
    area: 'kapar',
    locality: 'Kampung Tok Muda, Kapar',
    address: 'Jalan Masjid, Kampung Tok Muda, 42200 Kapar, Selangor',
    type: 'Single-Storey Terrace Homes',
    typeShort: 'Single-Storey Terrace',
    units: 46,
    land: "20' × 66'",
    builtUp: '1,020 sq.ft.',
    beds: '4',
    baths: '2',
    tenure: 'Freehold · Malay Reserve',
    title: 'Individual Title',
    completion: '2026',
    priceFrom: null,
    perks: ['Free SPA legal fees', 'Free MOT', 'Two car parks per home'],
    intro: 'Forty-six single-storey terraces on Jalan Masjid, in the heart of Kampung Tok Muda.',
    description: 'Freehold family homes with four bedrooms and two bathrooms, designed in corner, intermediate and end-lot configurations.',
    unitTypes: [],
    cover: 'tok-muda-berjaya-01.jpg',
    hero: 'tok-muda-berjaya-01.jpg',
    gallery: photos('tok-muda-berjaya', 5),
    plans: [
      { src: 'tok-muda-berjaya-plan-01.jpg', label: 'Corner Unit' },
      { src: 'tok-muda-berjaya-plan-02.jpg', label: 'Intermediate Unit' },
      { src: 'tok-muda-berjaya-plan-03.jpg', label: 'End Unit' }
    ]
  },
  {
    slug: 'taman-khalid-al-walid-3',
    name: 'Taman Khalid Al-Walid 3',
    status: 'current',
    area: 'shah-alam',
    locality: 'Jalan Kebun, Shah Alam',
    address: 'Lorong Universiti (Jalan Tanjung Api-Api), Jalan Kebun, 40460 Shah Alam, Selangor',
    type: 'Double-Storey Terrace Homes',
    typeShort: 'Double-Storey Terrace',
    units: 24,
    land: "20' × 60'",
    builtUp: '1,800 sq.ft.',
    beds: '4',
    baths: '3',
    tenure: 'Freehold · Malay Reserve',
    title: 'Individual Title',
    completion: '2024',
    priceFrom: null,
    perks: ['Individual title', 'Two car parks per home'],
    intro: 'Twenty-four double-storey terrace homes off Lorong Universiti, Jalan Kebun, in Shah Alam.',
    description: 'Each home offers 1,800 sq.ft. across two levels, with four bedrooms, three bathrooms and parking for two cars, on freehold land.',
    unitTypes: [],
    cover: 'khalid-al-walid-3-02.jpg',
    hero: 'khalid-al-walid-3-01.jpg',
    gallery: photos('khalid-al-walid-3', 4),
    plans: [
      { src: 'khalid-al-walid-3-plan-01.jpg', label: 'Corner Lot' },
      { src: 'khalid-al-walid-3-plan-02.jpg', label: 'Intermediate Lot' },
      { src: 'khalid-al-walid-3-plan-03.jpg', label: 'End Lot' },
      { src: 'khalid-al-walid-3-plan-04.jpg', label: 'Site plan' }
    ]
  },
  {
    slug: 'taman-imam-yusof-5',
    name: 'Taman Imam Yusof 5',
    status: 'current',
    area: 'pulau-indah',
    locality: 'Pulau Indah',
    address: 'Jalan Imam Yusof, 42920 Pulau Indah, Selangor',
    type: 'Single-Storey Terrace Homes',
    typeShort: 'Single-Storey Terrace',
    units: 91,
    land: '',
    builtUp: '',
    beds: '4',
    baths: '2',
    tenure: 'Freehold · Malay Reserve',
    title: 'Individual Title',
    completion: '2024',
    priceFrom: null,
    perks: ['Free SPA legal fees', 'Free MOT', 'Two car parks per home'],
    intro: 'Ninety-one single-storey terrace homes, the largest community in the V2 collection.',
    description: 'Two terrace designs at Taman Imam Yusof, Pulau Indah, each with four bedrooms, two bathrooms and parking for two cars, on freehold land with an individual title.',
    unitTypes: [],
    cover: 'imam-yusof-5-01.jpg',
    hero: 'imam-yusof-5-01.jpg',
    gallery: photos('imam-yusof-5', 7),
    plans: []
  },
  {
    slug: 'taman-tok-muda-sejahtera',
    name: 'Taman Tok Muda Sejahtera',
    status: 'completed',
    area: 'kapar',
    locality: 'Jalan Tok Muda 1, Kapar',
    address: 'Jalan Tok Muda 1, Tok Muda, 42200 Kapar, Selangor',
    type: 'Single-Storey Terrace Homes',
    typeShort: 'Single-Storey Terrace',
    units: null,
    land: '',
    builtUp: '1,020 sq.ft.',
    beds: '4',
    baths: '2',
    tenure: 'Freehold',
    title: 'Individual Title',
    completion: 'Completed',
    priceFrom: 392000,
    perks: ['Completed', 'Fully sold'],
    intro: 'A completed community of single-storey terrace homes on Jalan Tok Muda 1, Kapar. Fully sold.',
    description: 'Four-bedroom, two-bathroom homes of 1,020 sq.ft., launched from RM 392,000 and now home to the families of Tok Muda.',
    unitTypes: [],
    cover: 'tok-muda-sejahtera-01.jpg',
    hero: 'tok-muda-sejahtera-01.jpg',
    gallery: photos('tok-muda-sejahtera', 1),
    plans: []
  }
];

/* Upcoming launches, from the land bank listed on the current website. */
window.V2_UPCOMING = [
  { name: 'Taman Dato Ahmad Razali 2', lot: 'PT 158664', location: "Jalan Dato' Ahmad Razali, Pulau Indah", type: 'Single-Storey Terrace', units: 27, land: "20' × 73'", note: 'Under construction' },
  { name: 'Shah Alam U15', lot: 'Lot 14835', location: 'Jalan Seri Jaya, U15, Shah Alam', type: 'Single-Storey Terrace', units: 30, land: "20' × 70'", note: 'Upcoming' },
  { name: 'Kapar I', lot: 'Lot 114122', location: 'Jalan Tok Muda 1, Kapar', type: 'Single-Storey Terrace', units: 35, land: "20' × 88'", note: 'Upcoming' },
  { name: 'Kapar II', lot: 'Lot 114120', location: 'Jalan Tok Muda 1, Kapar', type: 'Single-Storey Terrace', units: 70, land: "20' × 66' / 67'", note: 'Upcoming' }
];

/* Construction photographs, newest first, grouped by site. */
window.V2_PROGRESS = [
  { name: 'Taman Dato Ahmad Razali 2', slug: null, location: "Jalan Dato' Ahmad Razali, Pulau Indah", updated: '2026-10-08', photos: photos('progress-dato-ahmad-razali-2', 4) },
  { name: 'Taman Desa Bukit Permata', slug: 'taman-desa-bukit-permata', location: 'Jalan Kempas 1, Meru, Klang', updated: '2026-10-12', photos: photos('progress-desa-bukit-permata', 4) },
  { name: 'Taman Meru Permai', slug: 'taman-meru-permai', location: 'Jalan Jambu, Meru, Klang', updated: '2026-10-08', photos: photos('progress-meru-permai', 10) },
  { name: 'Taman Harmoni', slug: 'taman-harmoni', location: 'Sungai Pelek, Sepang', updated: '2026-10-12', photos: photos('progress-harmoni', 21) },
  { name: 'Taman Dato Harun 5', slug: 'taman-dato-harun-5', location: 'Jalan Dato Harun, Pulau Indah', updated: '2026-10-08', photos: photos('progress-dato-harun-5', 20) },
  { name: 'Taman Khalid Al-Walid 3', slug: 'taman-khalid-al-walid-3', location: 'Jalan Kebun, Shah Alam', updated: '2026-06-22', photos: photos('progress-khalid-al-walid-3', 29) }
];
