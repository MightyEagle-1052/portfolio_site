import type { Tag } from './site';

/**
 * Centralized project database — the single source of truth for the portfolio gallery.
 *
 * HOW TO ADD / EDIT A PROJECT
 * - Add a new object to PROJECTS below. Only fill fields with verified information.
 * - `tags` is an array: assign any combination of 'AI&CV' | 'CG&3D' | 'AR/VR&XR' | 'GameDev'.
 * - Optional fields (role, overview, features, screenshots, liveDemo, github) are hidden in the UI when empty.
 * - `featuredRank` (1 = first) places a project in the Featured area.
 * - `image` points to the local cover image for each project under `public/project_images`.
 *
 * The project names and category tags are based on the supplied portfolio list.
 * Add verified technologies, roles, features, links, and project-specific screenshots
 * when those materials are available.
 */

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  overview?: string;
  role?: string;
  image: string;
  imageIsConcept?: boolean;
  screenshots?: string[];
  technologies: string[];
  tags: Tag[];
  features?: string[];
  liveDemo?: string;
  github?: string;
  featuredRank?: number;
}

/** Total number of projects in Daniel's complete portfolio. */
export const EXPECTED_PROJECT_COUNT = 43;

const PROJECT_IMAGE_LAST_NUMBER: Record<number, number> = {
  1: 8, 2: 9, 3: 7, 4: 9, 5: 8, 6: 7, 7: 7, 8: 6, 9: 8, 10: 7, 11: 8,
  12: 6, 13: 7, 14: 8, 15: 8, 16: 7, 17: 8, 18: 8, 19: 8, 20: 8, 21: 7,
  22: 6, 23: 6, 24: 8, 25: 8, 26: 8, 27: 8, 28: 8, 29: 8, 30: 7, 31: 7,
  32: 7, 33: 7, 34: 10, 35: 8, 36: 10, 37: 9, 38: 6, 39: 11, 40: 13,
  41: 10, 42: 10, 43: 10, 44: 10,
};

const PROJECTS_WITH_ZERO_IMAGE = new Set([34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44]);

function getProjectScreenshots(image: string): string[] {
  const folderMatch = image.match(/^\/project_images\/(\d+)-([^/]+)\/1\.png$/);
  if (!folderMatch) {
    throw new Error(`Unexpected project cover image path: ${image}`);
  }

  const [, projectNumberText, folderName] = folderMatch;
  const projectNumber = Number(projectNumberText);
  const lastImageNumber = PROJECT_IMAGE_LAST_NUMBER[projectNumber];
  if (lastImageNumber === undefined) {
    throw new Error(`Missing image count for project folder: ${folderName}`);
  }

  return [
    ...(PROJECTS_WITH_ZERO_IMAGE.has(projectNumber) ? [`/project_images/${projectNumber}-${folderName}/1.png`] : []),
    ...Array.from(
      { length: lastImageNumber - 1 },
      (_, index) => `/project_images/${projectNumber}-${folderName}/${index + 2}.png`,
    ),
  ];
}

function project(
  id: string,
  title: string,
  image: string,
  tags: Tag[],
  featuredRank?: number,
  descriptionOverride?: string,
): Project {
  const projectDescription = descriptionOverride
    ?? `${title.includes(' – ') ? title.split(' – ')[1] : `${title} project`}.`;
  return {
    id,
    title,
    description: projectDescription,
    image,
    screenshots: getProjectScreenshots(image),
    imageIsConcept: false,
    technologies: [],
    tags,
    ...(featuredRank === undefined ? {} : { featuredRank }),
  };
}

const PROJECT_OVERVIEWS: Record<string, string> = {
  goaltrack:
    'An AI-powered football analytics platform that detects and tracks players and the ball from match footage. It analyzes player speed, distance, possession, shots, passes, and movement patterns, with team heatmaps, formation analysis, tactical pass networks, synchronized video replay, and performance dashboards.',
  courttrack:
    'An intelligent basketball analytics system that tracks players and the ball while analyzing shooting mechanics, shot trajectories, player positioning, and movement. It provides shot charts, movement heatmaps, pick-and-roll analysis, pass networks, play-by-play events, and tactical performance reports.',
  volleytrack:
    'An AI-driven volleyball analysis platform for tracking players, ball trajectories, serves, spikes, and rallies. It evaluates jump height, attack speed, player rotations, landing zones, and movement patterns through pose estimation, tactical heatmaps, and match performance dashboards.',
  diamondscope:
    'A computer vision platform for analyzing baseball games through player and ball tracking. It examines pitching speed, ball trajectories, batting mechanics, defensive positioning, and fielding performance using pose estimation, spray charts, tactical visualizations, and match reports.',
  'tt-vision-analyzer':
    'An AI-powered table tennis analysis system that detects and tracks players and balls, maps shot trajectories, and classifies playing techniques. It provides stroke analysis, serve evaluation, ball speed and spin estimation, movement heatmaps, shot placement, rally tracking, and performance statistics.',
  'badminton-analysis-system':
    'A badminton analytics platform that tracks players and shuttlecocks throughout matches. It analyzes shot trajectories, stroke classification, player movement, footwork, rally patterns, and shot placement through interactive court heatmaps and performance comparisons.',
  acetrack:
    'An intelligent tennis analytics platform that tracks players and tennis balls while evaluating shot speed, spin, trajectories, and landing positions. Features include serve analysis, pose-based stroke evaluation, court heatmaps, rally breakdowns, player comparisons, and tactical performance dashboards.',
  golfvision:
    'An AI-powered golf training and swing analysis platform combining computer vision, synchronized multi-camera footage, and LiDAR-based 3D sensing. It evaluates body posture, club paths, face angles, hip rotation, and swing tempo through 3D motion visualization, swing comparisons, and coaching analytics.',
  cricketvision:
    'A computer vision platform that analyzes cricket matches by detecting players, balls, wickets, and umpires. It tracks ball speed, swing, bounce locations, and trajectories while providing pitch mapping, batting-shot classification, match statistics, video playback, and performance reports.',
  cuemetric:
    'An AI-powered snooker analysis system that tracks balls and evaluates shot trajectories, cue speed, collision paths, and player positioning. It includes cue alignment analysis, shot prediction, positional strategy planning, shot-by-shot performance tracking, match statistics, and synchronized video review.',
  boxvision:
    'A computer vision platform for analyzing boxing matches and training sessions through person tracking and pose estimation. It evaluates punch activity, hand movements, defensive actions, and boxer positioning, presenting fight statistics, synchronized footage, performance trends, and technique analysis.',
  'radiology-medical-imaging':
    'An AI-assisted medical imaging workspace for reviewing X-ray, CT, MRI, and ultrasound studies. It provides image enhancement, anomaly highlighting, segmentation overlays, anatomical measurements, scan comparisons, DICOM-oriented navigation, 3D reconstruction, and structured radiology reporting.',
  ophthalmology:
    'An AI-powered ophthalmology platform for analyzing retinal images, fundus photographs, OCT scans, and eye structures. It supports retinal abnormality screening, blood vessel segmentation, optic disc measurements, diabetic retinopathy-oriented analysis, 3D corneal visualization, and comparative imaging reports.',
  skincare:
    'An AI-based dermatology imaging platform for analyzing clinical and dermoscopic skin photographs. It detects and segments skin lesions, visualizes classification results, evaluates lesion boundaries, and provides image enhancement, 3D lesion visualization, longitudinal comparisons, and structured reporting.',
  'orthopedics-musculoskeletal-imaging':
    'An AI-assisted orthopedic imaging system for reviewing X-ray, CT, and MRI scans. It identifies potential fractures and bone abnormalities, supports image segmentation and skeletal measurements, and provides annotated scan visualization, 3D bone reconstruction, study comparisons, and orthopedic reporting.',
  'digital-pathology':
    'A computer vision platform for analyzing digital pathology slides and microscopic tissue samples. It supports cell detection, tumor-region identification, tissue classification, segmentation masks, cell counting, microscopy visualization, quantitative analysis, and pathology reporting workflows.',
  heartcare:
    'An intelligent cardiology analytics workspace for reviewing ECG waveforms and cardiac imaging. It provides 12-lead ECG visualization, rhythm and heart-rate measurements, arrhythmia-oriented event detection, echocardiography analysis, cardiac measurements, patient monitoring dashboards, and structured reports.',
  lungcare:
    'An AI-powered pulmonary imaging platform for analyzing chest X-rays and CT scans. It highlights suspected lung abnormalities and nodules, segments lung structures, provides 3D CT reconstruction, lesion measurements, longitudinal comparisons, AI confidence summaries, and radiology reporting tools.',
  neurovision:
    'An integrated neuroimaging platform combining brain MRI/CT visualization with EEG signal analysis. It supports lesion detection, brain structure segmentation, multi-plane scan viewing, 3D brain visualization, EEG waveform monitoring, spectral analysis, artifact filtering, and neurological research dashboards.',
  roadguard:
    'An intelligent traffic monitoring platform combining CCTV, computer vision, and LiDAR data. It detects and tracks vehicles, estimates speed and lane occupancy, identifies traffic incidents, analyzes congestion, and visualizes 3D LiDAR point clouds through geospatial maps, sensor-fusion interfaces, and real-time alerts.',
  marketsurveillance:
    'An AI-powered retail surveillance platform for monitoring store environments through multiple CCTV cameras. It tracks people and shopping carts, analyzes checkout queues and customer dwell time, generates store heatmaps, monitors restricted areas, and provides centralized security dashboards and incident reports.',
  'aeroguard-ai':
    'An intelligent airport security monitoring platform combining terminal CCTV, identity verification, baggage screening, and airfield perimeter surveillance. It supports people and object tracking, unattended baggage detection, suspicious behavior alerts, X-ray threat highlighting, LiDAR visualization, and incident management.',
  'cash-surveillance':
    'A computer vision prototype for detecting banknotes in retail CCTV footage using deep-learning object detection. It includes video annotation, dataset review, YOLO model training, validation dashboards, confidence visualization, false-positive evaluation, model export, and annotated video generation.',
  'drone-sentinel':
    'A multi-drone aerial surveillance platform combining real-time video processing, object detection, GPS tracking, and geospatial monitoring. It tracks people and vehicles, visualizes flight telemetry, manages geofences and restricted areas, and provides satellite maps, thermal views, intrusion alerts, and mission playback.',
  faceguard:
    'An AI-powered identity verification and media authenticity platform that combines facial recognition, liveness detection, facial landmarks, and suspicious-media analysis. It provides deepfake risk scoring, document review, verification queues, evidence-based case management, audit reports, and configurable security workflows.',
  'smart-city-monitor':
    'An urban intelligence platform that analyzes multiple city surveillance cameras to detect people and vehicles, estimate crowd density, and identify unusual events. It provides camera mapping, cross-camera movement tracking, occupancy trends, crowd heatmaps, incident dashboards, real-time alerts, and urban monitoring reports.',
  'careguard-ai':
    'An AI-powered hospital monitoring platform designed to analyze live camera feeds for patient safety. It supports fall detection, patient and staff tracking, occupancy monitoring, restricted-zone surveillance, ward analytics, pharmacy and laboratory alerts, incident review, and safety reporting.',
  'sitesafe-ai':
    'A construction safety monitoring system that analyzes multiple CCTV feeds to detect workers and monitor workplace hazards. It identifies missing helmets and safety vests, detects falls, highlights unsafe equipment proximity and restricted zones, and provides real-time alerts, compliance analytics, incident review, and safety reports.',
  'warehouse-safety-ai':
    'An AI-powered warehouse safety monitoring platform that combines computer vision, deep learning, real-time video analytics, and intelligent hazard detection. It supports worker tracking, PPE compliance monitoring, fall detection, restricted-zone surveillance, forklift proximity analysis, and safety incident reporting to help identify workplace hazards and improve warehouse safety operations.',
  'agriplant-vision':
    'An AI-powered agricultural vision platform for crop monitoring, plant disease detection, and plant phenotyping. It analyzes plant images and aerial imagery to identify visible disease symptoms, evaluate crop conditions, and visualize agricultural field indicators for monitoring and research.',
  'microlab-vision':
    'A computer vision platform for analyzing microscopic images and biomedical samples. It supports cell detection, classification, segmentation, microscopic image enhancement, and quantitative sample analysis through laboratory visualization and image-review interfaces.',
  'wildscope-vision':
    'An AI-powered wildlife monitoring platform that recognizes and analyzes animal species in natural environments. It uses computer vision to identify wildlife in images and video, highlight detected animals, and support biodiversity observation and wildlife research.',
  'marinevision-ai':
    'An AI-powered environmental and marine science platform for analyzing underwater imagery. It performs coral reef classification, biodiversity monitoring, plankton detection, and underwater species recognition to support marine ecosystem observation and environmental research.',
  'forgemotion-studio':
    'A comprehensive 3D production management and visualization platform for animation, cinematic creation, and visual effects workflows. It brings together character libraries, 3D rigging, concept development, cinematic sequencing, VFX simulations, rendering queues, timeline editing, and collaborative review and approval interfaces.',
  carrental:
    'An interactive vehicle rental platform that combines vehicle discovery, 3D product visualization, and immersive showroom experiences. Users can browse vehicles, inspect exterior details, explore AR/VR showroom environments, manage reservations, access virtual driving experiences, and review rental analytics.',
  seatvista:
    'An interactive event discovery and ticket-booking platform featuring 3D venue exploration and visual seat selection. Users can browse events, inspect arena layouts, preview stage visibility from selected seats, compare seating sections, complete bookings, and access digital tickets.',
  'fabuwood-cabinet-visualizer':
    'An interactive kitchen design and cabinet visualization platform that allows users to explore room configurations and customize cabinet designs. It supports kitchen layouts, cabinet styles, materials, colors, finishes, 3D room visualization, and 360-degree virtual showroom walkthroughs.',
  'diy-design-space':
    'An interactive room and kitchen planning application that guides users through room dimensions, layouts, door styles, cabinets, appliances, and finishing selections. It combines 2D floor planning, real-time 3D visualization, product configuration, pricing calculations, and itemized quotation generation.',
  strikepoint:
    'A tactical first-person shooter game experience featuring local gameplay, online competition, customizable combat units, and multiplayer team battles. It includes weapon loadouts, character equipment, combat HUDs, tactical maps, match progression, team statistics, and victory or defeat screens.',
  skystrike:
    'An immersive modern air combat simulation featuring aircraft selection, flight modes, equipment customization, and aerial combat missions. It includes pre-flight preparation, aircraft controls, single-player combat, multiplayer team battles, targeting interfaces, flight statistics, and mission results.',
  fleetstrike:
    'A naval combat simulation experience featuring warship selection, fleet configuration, ship equipment, and mission-based gameplay. It includes single-player naval operations, team combat, tactical navigation interfaces, ship status indicators, combat statistics, and mission victory screens.',
  ironfront:
    'A tactical ground combat game experience focused on squad-based military operations and competitive gameplay. It features single-player missions, team operations, online combat, tactical maps, squad selection, objective-based missions, battlefield navigation, and coordinated combat interfaces.',
  fitnesshelper:
    'An AI-powered fitness and virtual training platform that analyzes exercise movements using computer vision and pose estimation. It evaluates posture, joint alignment, and exercise form while providing workout programs, real-time movement analysis, performance tracking, and AR/VR training modes.',
  'geourban-insight':
    'An AI-powered geospatial intelligence platform that combines satellite imagery, GIS datasets, raster processing, and 3D city visualization. It supports land-cover analysis, building and parcel extraction, urban zoning, transportation planning, terrain analysis, and scenario modeling to help visualize and evaluate smart-city development strategies.',
};

export const PROJECTS: Project[] = [
  project(
    'goaltrack',
    'GoalTrack',
    '/project_images/1-GoalTrack/1.png',
    ['AI&CV'],
    1,
    'An AI-powered football analytics platform that detects and tracks players and the ball from match footage. It analyzes player speed, distance, possession, shots, passes, and movement patterns, with team heatmaps, formation analysis, tactical pass networks, synchronized video replay, and performance dashboards.',
  ),
  project(
    'courttrack',
    'CourtTrack',
    '/project_images/2-CourtTrack/1.png',
    ['AI&CV'],
    undefined,
    'An intelligent basketball analytics system that tracks players and the ball while analyzing shooting mechanics, shot trajectories, player positioning, and movement. It provides shot charts, movement heatmaps, pick-and-roll analysis, pass networks, play-by-play events, and tactical performance reports.',
  ),
  project('volleytrack', 'VolleyTrack', '/project_images/3-VolleyTrack/1.png', ['AI&CV']),
  project('diamondscope', 'DiamondScope', '/project_images/4-DiamondScope/1.png', ['AI&CV']),
  project('tt-vision-analyzer', 'TTVision', '/project_images/5-TTVision/1.png', ['AI&CV']),
  project('badminton-analysis-system', 'ShuttleTrack', '/project_images/6-ShuttleTrack/1.png', ['AI&CV']),
  project('acetrack', 'AceTrack', '/project_images/7-AceTrack/1.png', ['AI&CV']),
  project('golfvision', 'GolfVision', '/project_images/8-GolfVision/1.png', ['AI&CV']),
  project('cricketvision', 'CricketVision', '/project_images/9-CricketVision/1.png', ['AI&CV']),
  project('cuemetric', 'CueMetric', '/project_images/10-CueMetric/1.png', ['AI&CV']),
  project('boxvision', 'BoxVision', '/project_images/11-BoxVision/1.png', ['AI&CV']),
  project('radiology-medical-imaging', 'Radiology AI Imaging', '/project_images/12-Radiology AI Imaging/1.png', ['AI&CV'], 2),
  project('ophthalmology', 'Ophthalmology', '/project_images/13-Ophthalmology/1.png', ['AI&CV']),
  project('skincare', 'SkinCare', '/project_images/14-SkinCare/1.png', ['AI&CV']),
  project('orthopedics-musculoskeletal-imaging', 'AI Orthopedic Imaging', '/project_images/15-AI Orthopedic Imaging/1.png', ['AI&CV']),
  project('digital-pathology', 'Digital Pathology AI', '/project_images/16-Digital Pathology AI/1.png', ['AI&CV']),
  project('heartcare', 'HeartCare', '/project_images/17-HeartCare/1.png', ['AI&CV']),
  project('lungcare', 'LungCare', '/project_images/18-LungCare/1.png', ['AI&CV']),
  project('neurovision', 'NeuroVision', '/project_images/19-NeuroVision/1.png', ['AI&CV']),
  project('roadguard', 'RoadGuard', '/project_images/20-RoadGuard/1.png', ['AI&CV'], 3),
  project('marketsurveillance', 'MarketSurveillance', '/project_images/21-MarketSurveillance/1.png', ['AI&CV']),
  project('aeroguard-ai', 'AeroGuard', '/project_images/22-AeroGuard/1.png', ['AI&CV']),
  project('cash-surveillance', 'CashSurveillance', '/project_images/23-CashSurveillance/1.png', ['AI&CV']),
  project('drone-sentinel', 'DroneSentinel', '/project_images/24-DroneSentinel/1.png', ['AI&CV']),
  project('faceguard', 'FaceGuard', '/project_images/25-FaceGuard/1.png', ['AI&CV']),
  project('smart-city-monitor', 'Smart City Monitor', '/project_images/26-SmartCityMonitor/1.png', ['AI&CV']),
  project('careguard-ai', 'CareGuard', '/project_images/27-CareGuard/1.png', ['AI&CV']),
  project('sitesafe-ai', 'SiteSafe', '/project_images/28-SiteSafe/1.png', ['AI&CV']),
  project('warehouse-safety-ai', 'WarehouseSafety', '/project_images/29-WarehouseSafety/1.png', ['AI&CV']),
  project('agriplant-vision', 'AgriPlantVision', '/project_images/30-AgriPlantVision/1.png', ['AI&CV'], 4),
  project('microlab-vision', 'MicroLab', '/project_images/31-MicroLab/1.png', ['AI&CV']),
  project('wildscope-vision', 'WildScope', '/project_images/32-WildScope/1.png', ['AI&CV']),
  project('marinevision-ai', 'MarineVision', '/project_images/33-MarineVision/1.png', ['AI&CV']),
  project('geourban-insight', 'GeoUrban', '/project_images/34-GeoUrban/1.png', ['AI&CV', 'CG&3D'], 5),
  project('forgemotion-studio', 'ForgeMotion', '/project_images/35-ForgeMotion/1.png', ['CG&3D']),
  project('carrental', 'CarRental', '/project_images/36-CarRental/1.png', ['CG&3D', 'AR/VR&XR'], 6),
  project('fitnesshelper', 'FitnessHelper', '/project_images/37-FitnessHelper/1.png', ['AI&CV', 'AR/VR&XR']),
  project('seatvista', 'SeatVista', '/project_images/38-SeatVista/1.png', ['CG&3D']),
  project('diy-design-space', 'DIY Design Space', '/project_images/39-DIYDesignSpace/1.png', ['CG&3D'], 7),
  project('fabuwood-cabinet-visualizer', 'Fabuwood', '/project_images/40-Fabuwood/1.png', ['CG&3D'], 8),
  project('strikepoint', 'StrikePoint', '/project_images/41-StrikePoint/1.png', ['GameDev', 'AR/VR&XR'], 9),
  project('skystrike', 'SkyStrike', '/project_images/42-SkyStrike/1.png', ['GameDev', 'AR/VR&XR']),
  project('fleetstrike', 'FleetStrike', '/project_images/43-FleetStrike/1.png', ['GameDev', 'AR/VR&XR']),
  project('ironfront', 'IronFront', '/project_images/44-IronFront/1.png', ['GameDev'], ),
].map((project) => {
  const overview = PROJECT_OVERVIEWS[project.id];
  if (overview === undefined) {
    throw new Error(`Missing overview for project: ${project.id}`);
  }
  return { ...project, overview };
});

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featuredRank).sort(
  (a, b) => (a.featuredRank ?? 99) - (b.featuredRank ?? 99)
);

/** Show featured projects first in rank order, then preserve the remaining project order. */
export const ORDERED_PROJECTS = [...PROJECTS].sort(
  (a, b) => (a.featuredRank ?? Number.POSITIVE_INFINITY) - (b.featuredRank ?? Number.POSITIVE_INFINITY)
);

export const countByTag = (tag: Tag) => PROJECTS.filter((p) => p.tags.includes(tag)).length;

/** Combined filter: OR across selected tags + free-text search over title, description, technologies and tags. */
export function filterProjects(list: Project[], selectedTags: Tag[], query: string): Project[] {
  const q = query.trim().toLowerCase();
  return list.filter((p) => {
    const tagMatch = selectedTags.length === 0 || p.tags.some((t) => selectedTags.includes(t));
    if (!tagMatch) return false;
    if (!q) return true;
    const haystack = [p.title, p.subtitle ?? '', p.description, p.overview ?? '', ...p.technologies, ...p.tags]
      .join(' ')
      .toLowerCase();
    return q.split(/\s+/).every((word) => haystack.includes(word));
  });
}
