import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface TrafficRoute {
  id: number
  name: string
  status: 'light' | 'moderate' | 'heavy'
  avgSpeed: number
  congestionLevel: number
  vehicles: number
  trend: 'up' | 'down' | 'stable'
  lastUpdated: Date
  // AI Route Optimization fields
  coordinates: { start: { lat: number; lng: number }, end: { lat: number; lng: number } }
  distance: number // in km
  estimatedTime: number // in minutes
  alternativeRoutes?: AlternativeRoute[]
  aiScore: number // 0-100, AI optimization score
  predictedCongestion: number // predicted congestion in next hour
}

export interface EmergencyVehicle {
  id: number
  type: 'ambulance' | 'fire' | 'police'
  route: string
  eta: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  coordinates?: { lat: number; lng: number }
  status: 'active' | 'completed' | 'cancelled'
  // Priority corridor fields
  registrationNumber: string
  callSign: string
  destination: string
  corridorId?: string
  signalOverrides: number
  responseTime: number // in minutes
  registeredAt: Date
}

export interface PriorityCorridor {
  id: string
  name: string
  segments: CorridorSegment[]
  emergencyVehicleId: number
  status: 'active' | 'clearing' | 'inactive'
  activatedAt: Date
  estimatedClearTime: Date
  signalsControlled: number
  averageDelay: number // in seconds
}

export interface CorridorSegment {
  id: string
  intersectionId: string
  signalId: string
  currentPhase: 'green' | 'yellow' | 'red'
  timeRemaining: number // in seconds
  isOverridden: boolean
  originalTiming: number
  emergencyTiming: number
  vehiclePosition: 'approaching' | 'in_intersection' | 'passed'
}

export interface TrafficSignal {
  id: string
  intersectionName: string
  coordinates: { lat: number; lng: number }
  currentPhase: 'green' | 'yellow' | 'red'
  timeRemaining: number
  isEmergencyOverride: boolean
  normalCycleTime: number
  emergencyCycleTime: number
  lastOverride: Date | null
  overrideCount: number
}

export interface AlternativeRoute {
  id: number
  name: string
  timeSaving: number // in minutes
  distanceDiff: number // difference in km (+/-)
  congestionLevel: number
  aiRecommendation: 'highly_recommended' | 'recommended' | 'acceptable' | 'not_recommended'
  reason: string
}

export interface RouteOptimization {
  routeId: number
  algorithm: 'dijkstra' | 'a_star' | 'traffic_aware'
  optimizationScore: number
  timeSaved: number
  fuelSaved: number
  alternativeCount: number
  lastOptimized: Date
}

export interface TrafficPrediction {
  routeId: number
  timeSlot: string // e.g., "14:00-15:00"
  predictedCongestion: number
  confidence: number // 0-1
  factors: string[] // ["weather", "events", "historical"]
}

export interface VehicleCount {
  type: string
  count: number
  icon: string
  percentage: number
}

export interface TrafficMetrics {
  totalRoutes: number
  totalVehicles: number
  avgSpeed: number
  emergencyActive: number
  signalEfficiency: number
  routeOptimization: number
  emergencyResponse: number
  predictionAccuracy: number
}

// Multi-Modal Transportation Planning interfaces
export interface TransportMode {
  id: string
  name: string
  type: 'car' | 'bike' | 'metro' | 'bus' | 'walk' | 'scooter' | 'rickshaw'
  icon: string
  color: string
  avgSpeed: number // km/h
  costPerKm: number
  carbonFootprint: number // grams CO2 per km
  accessibility: 'high' | 'medium' | 'low'
  reliability: number // 0-100
  comfort: number // 0-100
  availability: 'always' | 'scheduled' | 'on_demand'
}

export interface JourneySegment {
  id: string
  mode: TransportMode
  startPoint: { name: string; lat: number; lng: number }
  endPoint: { name: string; lat: number; lng: number }
  distance: number // km
  duration: number // minutes
  cost: number
  carbonEmission: number
  walkingDistance?: number // for first/last mile
  waitTime?: number // for scheduled transport
  transferTime?: number // for connections
}

export interface MultiModalJourney {
  id: string
  startLocation: { name: string; lat: number; lng: number }
  endLocation: { name: string; lat: number; lng: number }
  segments: JourneySegment[]
  totalDistance: number
  totalDuration: number
  totalCost: number
  totalCarbonEmission: number
  totalWalkingDistance: number
  transferCount: number
  comfortScore: number // 0-100
  reliabilityScore: number // 0-100
  sustainabilityScore: number // 0-100
  createdAt: Date
  userPreferencesApplied: boolean
}

export interface UserPreferences {
  preferredModes: string[] // transport mode IDs
  maxWalkingDistance: number // km
  maxTransfers: number
  priorityWeights: {
    time: number // 0-100
    cost: number // 0-100
    comfort: number // 0-100
    sustainability: number // 0-100
  }
  accessibilityNeeds: string[]
  budgetConstraint?: number // max cost per journey
  avoidModes?: string[] // transport mode IDs to avoid
}

export interface LastMileOption {
  id: string
  name: string
  type: 'bike_share' | 'scooter_share' | 'auto_rickshaw' | 'shuttle' | 'walking'
  nearbyStations: { name: string; distance: number; available: number }[]
  costPerMinute: number
  maxDistance: number // km
  availability: 'high' | 'medium' | 'low'
  icon: string
  color: string
}

export interface TransitHub {
  id: string
  name: string
  type: 'metro_station' | 'bus_stop' | 'integrated_hub' | 'parking'
  coordinates: { lat: number; lng: number }
  connectedModes: string[] // transport mode IDs
  lastMileOptions: LastMileOption[]
  facilities: string[] // ['parking', 'restroom', 'food', 'wifi']
  accessibility: boolean
  peakHourCrowding: 'low' | 'medium' | 'high'
  averageWaitTime: number // minutes
}

// Advanced Analytics & Simulation interfaces
export interface TrafficSimulation {
  id: string
  name: string
  description: string
  simulationType: 'infrastructure_impact' | 'traffic_flow' | 'emergency_response' | 'multimodal_integration'
  status: 'running' | 'completed' | 'failed' | 'queued'
  parameters: SimulationParameters
  results: SimulationResults | null
  createdAt: Date
  completedAt: Date | null
  duration: number // simulation time in minutes
  progress: number // 0-100
}

export interface SimulationParameters {
  timeHorizon: number // simulation duration in hours
  vehicleDensity: 'low' | 'medium' | 'high' | 'peak'
  weatherConditions: 'clear' | 'rain' | 'snow' | 'fog' | 'storm'
  incidentProbability: number // 0-1
  infrastructureChanges: string[] // simplified for UI - converted to InfrastructureChange internally
  emergencyScenarios: EmergencyScenario[]
  trafficPatterns: 'normal' | 'holiday' | 'event' | 'construction' | 'rush_hour' | 'weekend'
  // Enhanced infrastructure variables
  busCount?: number
  carCount?: number
  budgetLimit?: number // in rupees
  implementationTimeMonths?: number
  newRoads?: number
  newBridges?: number
  newFlyovers?: number
  signalOptimization?: boolean
  emergencyLanes?: boolean
  smartTrafficLights?: boolean
}

export interface InfrastructureChange {
  id: string
  type: 'new_road' | 'road_closure' | 'lane_expansion' | 'signal_optimization' | 'bridge' | 'tunnel'
  location: { name: string; lat: number; lng: number }
  description: string
  cost: number // in millions
  constructionTime: number // in months
  expectedImpact: 'positive' | 'negative' | 'neutral'
  affectedRoutes: number[]
}

export interface EmergencyScenario {
  id: string
  type: 'accident' | 'medical' | 'fire' | 'natural_disaster'
  severity: 'minor' | 'major' | 'critical'
  location: { name: string; lat: number; lng: number }
  duration: number // in minutes
  affectedArea: number // radius in km
  emergencyVehiclesNeeded: number
}

export interface SimulationResults {
  overallScore: number // 0-100
  trafficFlowMetrics: {
    averageSpeed: number
    congestionReduction: number // percentage
    travelTimeReduction: number // percentage
    fuelSavings: number // percentage
    emissionReduction: number // percentage
  }
  emergencyResponseMetrics: {
    averageResponseTime: number
    responseTimeImprovement: number // percentage
    successfulCorridors: number
    signalOverrideEfficiency: number
  }
  infrastructureImpact: {
    costBenefitRatio: number
    roiProjection: number // percentage
    paybackPeriod: number // in years
    sustainabilityScore: number // 0-100
    // Enhanced infrastructure metrics
    busSystemEfficiency: number // 0-100
    vehicleCapacityUtilization: number // percentage
    roadNetworkImprovement: number // percentage
    signalSystemOptimization: number // percentage
    emergencyResponseImprovement: number // percentage
    airQualityImprovement: number // percentage
    noiseReduction: number // percentage
    constructionImpact: number // negative impact during construction (0-100)
    publicTransportAdoption: number // percentage increase
  }
  recommendations: Recommendation[]
  visualizationData: VisualizationData
}

export interface Recommendation {
  id: string
  type: 'infrastructure' | 'policy' | 'technology' | 'operational'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  expectedBenefit: string
  implementationCost: number
  timeframe: 'immediate' | 'short_term' | 'medium_term' | 'long_term'
  impactAreas: string[]
}

export interface VisualizationData {
  timeSeriesData: TimeSeriesPoint[]
  heatmapData: HeatmapPoint[]
  routeFlowData: RouteFlowPoint[]
  costBenefitChart: CostBenefitPoint[]
}

export interface TimeSeriesPoint {
  timestamp: Date
  metric: string
  value: number
  category: string
}

export interface HeatmapPoint {
  lat: number
  lng: number
  intensity: number
  category: string
}

export interface RouteFlowPoint {
  routeId: number
  flow: number
  capacity: number
  utilizationRate: number
  timestamp: Date
}

export interface CostBenefitPoint {
  year: number
  cost: number
  benefit: number
  cumulativeBenefit: number
  roi: number
}

export interface PredictiveModel {
  id: string
  name: string
  type: 'traffic_demand' | 'congestion_forecast' | 'incident_prediction' | 'emission_forecast'
  accuracy: number // 0-100
  lastTrainingDate: Date
  predictions: ModelPrediction[]
  status: 'active' | 'training' | 'deprecated'
}

export interface ModelPrediction {
  id: string
  timeframe: string // e.g., "next_hour", "next_day", "next_week"
  confidence: number // 0-1
  predictedValue: number
  actualValue?: number
  variance: number
  factors: PredictionFactor[]
  generatedAt: Date
}

export interface PredictionFactor {
  name: string
  influence: number // -100 to 100
  description: string
}

export interface AnalyticsInsight {
  id: string
  type: 'trend' | 'anomaly' | 'opportunity' | 'risk'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  data: any
  actionRequired: boolean
  relatedRecommendations: string[]
  detectedAt: Date
  acknowledged: boolean
}

export interface ReportTemplate {
  id: string
  name: string
  description: string
  type: 'traffic_summary' | 'emergency_response' | 'route_optimization' | 'simulation_results' | 'comprehensive'
  sections: ReportSection[]
  isDefault: boolean
  createdAt: Date
  lastUsed?: Date
}

export interface ReportSection {
  id: string
  name: string
  type: 'charts' | 'tables' | 'metrics' | 'text' | 'simulation_results'
  config: ReportSectionConfig
  order: number
  enabled: boolean
}

export interface ReportSectionConfig {
  title: string
  description?: string
  includeCharts?: string[]
  includeMetrics?: string[]
  includeTimeRange?: boolean
  customContent?: string
  chartTypes?: string[]
  dataFilters?: Record<string, any>
}

export interface GeneratedReport {
  id: string
  templateId: string
  name: string
  type: 'traffic_summary' | 'emergency_response' | 'route_optimization' | 'simulation_results' | 'comprehensive'
  generatedAt: Date
  timeRange: {
    start: Date
    end: Date
  }
  data: ReportData
  metadata: ReportMetadata
  status: 'generating' | 'completed' | 'failed'
  exportFormats: ReportExportFormat[]
}

export interface ReportData {
  summary: ReportSummary
  sections: ReportSectionData[]
  charts: ChartData[]
  tables: TableData[]
  insights: AnalyticsInsight[]
  recommendations: Recommendation[]
}

export interface ReportSummary {
  totalRoutes: number
  avgTrafficFlow: number
  emergencyResponses: number
  simulationsRun: number
  keyMetrics: Record<string, number>
  periodicComparison: Record<string, number>
}

export interface ReportSectionData {
  sectionId: string
  title: string
  content: any
  charts: ChartData[]
  tables: TableData[]
  insights: string[]
}

export interface ChartData {
  id: string
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'heatmap'
  title: string
  data: any[]
  config: any
}

export interface TableData {
  id: string
  title: string
  headers: string[]
  rows: any[][]
  summary?: Record<string, any>
}

export interface ReportMetadata {
  generatedBy: string
  version: string
  totalPages: number
  dataPoints: number
  processingTime: number
  fileSize?: number
}

export interface ReportExportFormat {
  format: 'pdf' | 'excel' | 'csv' | 'json'
  available: boolean
  url?: string
  downloadCount: number
  lastDownloaded?: Date
}

export interface ReportSchedule {
  id: string
  templateId: string
  name: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  dayOfWeek?: number
  dayOfMonth?: number
  time: string
  recipients: string[]
  isActive: boolean
  nextRunDate: Date
  lastRunDate?: Date
  createdAt: Date
}

interface TrafficState {
  // Data
  routes: TrafficRoute[]
  emergencyVehicles: EmergencyVehicle[]
  vehicleCounts: VehicleCount[]
  metrics: TrafficMetrics
  
  // AI Route Optimization Data
  routeOptimizations: RouteOptimization[]
  trafficPredictions: TrafficPrediction[]
  selectedRoute: TrafficRoute | null
  
  // Emergency Priority System Data
  priorityCorridors: PriorityCorridor[]
  trafficSignals: TrafficSignal[]
  activeEmergencyResponses: number
  totalSignalOverrides: number
  averageResponseTime: number
  
  // Multi-Modal Transportation Data
  transportModes: TransportMode[]
  multiModalJourneys: MultiModalJourney[]
  userPreferences: UserPreferences
  lastMileOptions: LastMileOption[]
  transitHubs: TransitHub[]
  selectedJourney: MultiModalJourney | null
  journeyPlanningActive: boolean
  
  // Advanced Analytics & Simulation Data
  trafficSimulations: TrafficSimulation[]
  predictiveModels: PredictiveModel[]
  analyticsInsights: AnalyticsInsight[]
  selectedSimulation: TrafficSimulation | null
  simulationResults: SimulationResults | null
  activeSimulations: number
  totalSimulationsRun: number
  
  // Report Generation Data
  reportTemplates: ReportTemplate[]
  generatedReports: GeneratedReport[]
  reportSchedules: ReportSchedule[]
  selectedReport: GeneratedReport | null
  isGeneratingReport: boolean
  
  // Loading states
  isLoading: boolean
  isOptimizing: boolean
  isSimulating: boolean
  lastUpdated: Date | null
  
  // Actions
  updateRoutes: (routes: TrafficRoute[]) => void
  updateRoute: (id: number, updates: Partial<TrafficRoute>) => void
  addEmergencyVehicle: (vehicle: Omit<EmergencyVehicle, 'id'>) => void
  updateEmergencyVehicle: (id: number, updates: Partial<EmergencyVehicle>) => void
  removeEmergencyVehicle: (id: number) => void
  updateMetrics: (metrics: Partial<TrafficMetrics>) => void
  setLoading: (loading: boolean) => void
  refreshData: () => void
  
  // AI Route Optimization Actions
  optimizeRoute: (routeId: number, algorithm?: 'dijkstra' | 'a_star' | 'traffic_aware') => Promise<void>
  generateAlternativeRoutes: (routeId: number) => Promise<AlternativeRoute[]>
  predictTrafficCongestion: (routeId: number, timeSlot: string) => Promise<TrafficPrediction>
  selectRoute: (route: TrafficRoute | null) => void
  setOptimizing: (optimizing: boolean) => void
  
  // Emergency Priority System Actions
  registerEmergencyVehicle: (vehicle: Omit<EmergencyVehicle, 'id' | 'registeredAt'>) => Promise<void>
  activatePriorityCorridor: (emergencyVehicleId: number, routeSegments: string[]) => Promise<PriorityCorridor>
  updateCorridorStatus: (corridorId: string, status: PriorityCorridor['status']) => void
  overrideTrafficSignal: (signalId: string, duration: number) => Promise<void>
  clearPriorityCorridor: (corridorId: string) => Promise<void>
  getEmergencyResponse: (vehicleId: number) => EmergencyVehicle | null
  updateSignalTiming: (signalId: string, phase: 'green' | 'yellow' | 'red', duration: number) => void
  
  // Multi-Modal Journey Planning Actions
  planMultiModalJourney: (start: { lat: number; lng: number }, end: { lat: number; lng: number }) => Promise<MultiModalJourney[]>
  selectJourney: (journey: MultiModalJourney | null) => void
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void
  findLastMileOptions: (location: { lat: number; lng: number }) => LastMileOption[]
  getNearbyTransitHubs: (location: { lat: number; lng: number }, radius: number) => TransitHub[]
  optimizeJourneyForPreferences: (journeyId: string) => Promise<MultiModalJourney>
  setJourneyPlanningActive: (active: boolean) => void
  saveJourneyHistory: (journey: MultiModalJourney) => void
  
  // Advanced Analytics & Simulation Actions
  createSimulation: (params: Omit<TrafficSimulation, 'id' | 'status' | 'progress' | 'results' | 'createdAt' | 'completedAt'>) => Promise<TrafficSimulation>
  runSimulation: (simulationId: string) => Promise<SimulationResults>
  selectSimulation: (simulation: TrafficSimulation | null) => void
  deleteSimulation: (simulationId: string) => void
  updateSimulationProgress: (simulationId: string, progress: number) => void
  generateRecommendations: (simulationResults: SimulationResults) => Recommendation[]
  getPredictiveModel: (type: PredictiveModel['type']) => PredictiveModel | null
  updateModelPredictions: (modelId: string, predictions: ModelPrediction[]) => void
  generateAnalyticsInsights: () => AnalyticsInsight[]
  acknowledgeInsight: (insightId: string) => void
  exportSimulationData: (simulationId: string) => Promise<Blob>
  setSimulating: (simulating: boolean) => void
  
  // Report Generation Actions
  createReportTemplate: (template: Omit<ReportTemplate, 'id' | 'createdAt'>) => Promise<ReportTemplate>
  updateReportTemplate: (templateId: string, updates: Partial<ReportTemplate>) => void
  deleteReportTemplate: (templateId: string) => void
  generateReport: (templateId: string, timeRange?: { start: Date; end: Date }) => Promise<GeneratedReport>
  exportReportToPDF: (reportId: string) => Promise<Blob>
  exportReportToExcel: (reportId: string) => Promise<Blob>
  exportReportToCSV: (reportId: string) => Promise<Blob>
  selectReport: (report: GeneratedReport | null) => void
  deleteReport: (reportId: string) => void
  scheduleReport: (schedule: Omit<ReportSchedule, 'id' | 'createdAt'>) => Promise<ReportSchedule>
  updateReportSchedule: (scheduleId: string, updates: Partial<ReportSchedule>) => void
  deleteReportSchedule: (scheduleId: string) => void
  setGeneratingReport: (generating: boolean) => void
}

// Mock data generators
const generateMockRoutes = (): TrafficRoute[] => [
  {
    id: 1,
    name: 'Main Street Corridor',
    status: 'heavy',
    avgSpeed: 15,
    congestionLevel: 85,
    vehicles: 342,
    trend: 'up',
    lastUpdated: new Date(),
    coordinates: { 
      start: { lat: 43.6532, lng: -79.3832 }, 
      end: { lat: 43.6612, lng: -79.3776 } 
    },
    distance: 2.4,
    estimatedTime: 18,
    aiScore: 34,
    predictedCongestion: 78
  },
  {
    id: 2,
    name: 'Highway 401 East',
    status: 'moderate',
    avgSpeed: 45,
    congestionLevel: 60,
    vehicles: 567,
    trend: 'down',
    lastUpdated: new Date(),
    coordinates: { 
      start: { lat: 43.6426, lng: -79.3871 }, 
      end: { lat: 43.6501, lng: -79.3470 } 
    },
    distance: 8.7,
    estimatedTime: 12,
    aiScore: 72,
    predictedCongestion: 45
  },
  {
    id: 3,
    name: 'Downtown Core',
    status: 'light',
    avgSpeed: 35,
    congestionLevel: 25,
    vehicles: 123,
    trend: 'stable',
    lastUpdated: new Date(),
    coordinates: { 
      start: { lat: 43.6481, lng: -79.3762 }, 
      end: { lat: 43.6534, lng: -79.3839 } 
    },
    distance: 1.8,
    estimatedTime: 6,
    aiScore: 91,
    predictedCongestion: 28
  },
  {
    id: 4,
    name: 'University Ave',
    status: 'heavy',
    avgSpeed: 12,
    congestionLevel: 90,
    vehicles: 445,
    trend: 'up',
    lastUpdated: new Date(),
    coordinates: { 
      start: { lat: 43.6629, lng: -79.3957 }, 
      end: { lat: 43.6476, lng: -79.3900 } 
    },
    distance: 3.2,
    estimatedTime: 22,
    aiScore: 28,
    predictedCongestion: 85
  }
]

const generateMockEmergencyVehicles = (): EmergencyVehicle[] => [
  {
    id: 1,
    type: 'ambulance',
    route: 'General Hospital → Downtown',
    eta: '4 min',
    priority: 'high',
    status: 'active',
    registrationNumber: 'AMB-2047',
    callSign: 'Rescue-07',
    destination: 'Downtown Emergency Center',
    corridorId: 'corridor-001',
    signalOverrides: 8,
    responseTime: 3.2,
    registeredAt: new Date(Date.now() - 4 * 60 * 1000),
    coordinates: { lat: 43.6547, lng: -79.3623 }
  },
  {
    id: 2,
    type: 'fire',
    route: 'Station 12 → Industrial District',
    eta: '7 min',
    priority: 'critical',
    status: 'active',
    registrationNumber: 'FIRE-1204',
    callSign: 'Engine-12',
    destination: 'Industrial Complex Building 7',
    corridorId: 'corridor-002',
    signalOverrides: 12,
    responseTime: 5.8,
    registeredAt: new Date(Date.now() - 7 * 60 * 1000),
    coordinates: { lat: 43.6482, lng: -79.3401 }
  },
  {
    id: 3,
    type: 'police',
    route: 'HQ → University Campus',
    eta: '12 min',
    priority: 'medium',
    status: 'active',
    registrationNumber: 'POL-5589',
    callSign: 'Unit-42',
    destination: 'University Campus Main Gate',
    signalOverrides: 3,
    responseTime: 8.5,
    registeredAt: new Date(Date.now() - 12 * 60 * 1000),
    coordinates: { lat: 43.6629, lng: -79.3957 }
  }
]

const generateMockVehicleCounts = (): VehicleCount[] => [
  { type: 'Cars', count: 8534, icon: 'Car', percentage: 68 },
  { type: 'Trucks', count: 1247, icon: 'Truck', percentage: 10 },
  { type: 'Buses', count: 892, icon: 'Bus', percentage: 7 },
  { type: 'Bikes', count: 1867, icon: 'Bike', percentage: 15 }
]

const generateMockMetrics = (): TrafficMetrics => ({
  totalRoutes: 147,
  totalVehicles: 12540,
  avgSpeed: 32,
  emergencyActive: 3,
  signalEfficiency: 94.2,
  routeOptimization: 87.5,
  emergencyResponse: 98.7,
  predictionAccuracy: 84.7
})

const generateMockPriorityCorridors = (): PriorityCorridor[] => [
  {
    id: 'corridor-001',
    name: 'Main Street Emergency Corridor',
    emergencyVehicleId: 1,
    status: 'active',
    activatedAt: new Date(Date.now() - 4 * 60 * 1000),
    estimatedClearTime: new Date(Date.now() + 3 * 60 * 1000),
    signalsControlled: 8,
    averageDelay: 15.2,
    segments: [
      {
        id: 'seg-001',
        intersectionId: 'int-main-01',
        signalId: 'sig-001',
        currentPhase: 'green',
        timeRemaining: 45,
        isOverridden: true,
        originalTiming: 60,
        emergencyTiming: 90,
        vehiclePosition: 'approaching'
      },
      {
        id: 'seg-002',
        intersectionId: 'int-main-02',
        signalId: 'sig-002',
        currentPhase: 'red',
        timeRemaining: 30,
        isOverridden: false,
        originalTiming: 30,
        emergencyTiming: 15,
        vehiclePosition: 'approaching'
      }
    ]
  },
  {
    id: 'corridor-002',
    name: 'Industrial District Priority Route',
    emergencyVehicleId: 2,
    status: 'active',
    activatedAt: new Date(Date.now() - 7 * 60 * 1000),
    estimatedClearTime: new Date(Date.now() + 2 * 60 * 1000),
    signalsControlled: 12,
    averageDelay: 8.7,
    segments: [
      {
        id: 'seg-003',
        intersectionId: 'int-ind-01',
        signalId: 'sig-003',
        currentPhase: 'green',
        timeRemaining: 60,
        isOverridden: true,
        originalTiming: 45,
        emergencyTiming: 75,
        vehiclePosition: 'in_intersection'
      }
    ]
  }
]

const generateMockTrafficSignals = (): TrafficSignal[] => [
  {
    id: 'sig-001',
    intersectionName: 'Main St & 1st Ave',
    coordinates: { lat: 43.6532, lng: -79.3832 },
    currentPhase: 'green',
    timeRemaining: 45,
    isEmergencyOverride: true,
    normalCycleTime: 120,
    emergencyCycleTime: 180,
    lastOverride: new Date(Date.now() - 2 * 60 * 1000),
    overrideCount: 3
  },
  {
    id: 'sig-002',
    intersectionName: 'Main St & 2nd Ave',
    coordinates: { lat: 43.6542, lng: -79.3822 },
    currentPhase: 'red',
    timeRemaining: 30,
    isEmergencyOverride: false,
    normalCycleTime: 90,
    emergencyCycleTime: 120,
    lastOverride: new Date(Date.now() - 15 * 60 * 1000),
    overrideCount: 1
  },
  {
    id: 'sig-003',
    intersectionName: 'Industrial Blvd & Factory St',
    coordinates: { lat: 43.6482, lng: -79.3401 },
    currentPhase: 'green',
    timeRemaining: 60,
    isEmergencyOverride: true,
    normalCycleTime: 100,
    emergencyCycleTime: 150,
    lastOverride: new Date(Date.now() - 1 * 60 * 1000),
    overrideCount: 5
  },
  {
    id: 'sig-004',
    intersectionName: 'University Ave & College St',
    coordinates: { lat: 43.6629, lng: -79.3957 },
    currentPhase: 'yellow',
    timeRemaining: 5,
    isEmergencyOverride: false,
    normalCycleTime: 110,
    emergencyCycleTime: 110,
    lastOverride: null,
    overrideCount: 0
  }
]

const generateMockRouteOptimizations = (): RouteOptimization[] => [
  {
    routeId: 1,
    algorithm: 'traffic_aware',
    optimizationScore: 78,
    timeSaved: 8.5,
    fuelSaved: 1.2,
    alternativeCount: 3,
    lastOptimized: new Date()
  },
  {
    routeId: 2,
    algorithm: 'dijkstra',
    optimizationScore: 85,
    timeSaved: 4.2,
    fuelSaved: 0.8,
    alternativeCount: 2,
    lastOptimized: new Date()
  }
]

const generateMockTrafficPredictions = (): TrafficPrediction[] => [
  {
    routeId: 1,
    timeSlot: "15:00-16:00",
    predictedCongestion: 78,
    confidence: 0.89,
    factors: ["historical", "events", "weather"]
  },
  {
    routeId: 2,
    timeSlot: "15:00-16:00",
    predictedCongestion: 45,
    confidence: 0.92,
    factors: ["historical", "traffic_patterns"]
  }
]

// Dijkstra's Algorithm Implementation
const dijkstraOptimization = (routeId: number): Promise<{ timeSaved: number; aiScore: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate Dijkstra's algorithm optimization
      const timeSaved = Math.random() * 15 + 5; // 5-20 minutes saved
      const aiScore = Math.min(100, Math.random() * 30 + 60); // 60-90 score
      resolve({ timeSaved, aiScore });
    }, 1500);
  });
}

// Traffic-aware A* Algorithm Implementation
const trafficAwareOptimization = (routeId: number): Promise<{ timeSaved: number; aiScore: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate advanced traffic-aware optimization
      const timeSaved = Math.random() * 25 + 10; // 10-35 minutes saved
      const aiScore = Math.min(100, Math.random() * 25 + 70); // 70-95 score
      resolve({ timeSaved, aiScore });
    }, 2000);
  });
}

// Multi-Modal Transportation Mock Data Generators
const generateMockTransportModes = (): TransportMode[] => [
  {
    id: 'car',
    name: 'Private Car',
    type: 'car',
    icon: 'Car',
    color: '#3b82f6',
    avgSpeed: 35,
    costPerKm: 0.50,
    carbonFootprint: 180,
    accessibility: 'high',
    reliability: 85,
    comfort: 90,
    availability: 'always'
  },
  {
    id: 'metro',
    name: 'Metro/Subway',
    type: 'metro',
    icon: 'Train',
    color: '#10b981',
    avgSpeed: 45,
    costPerKm: 0.15,
    carbonFootprint: 45,
    accessibility: 'medium',
    reliability: 95,
    comfort: 75,
    availability: 'scheduled'
  },
  {
    id: 'bus',
    name: 'City Bus',
    type: 'bus',
    icon: 'Bus',
    color: '#f59e0b',
    avgSpeed: 25,
    costPerKm: 0.10,
    carbonFootprint: 60,
    accessibility: 'high',
    reliability: 78,
    comfort: 60,
    availability: 'scheduled'
  },
  {
    id: 'bike',
    name: 'Bicycle',
    type: 'bike',
    icon: 'Bike',
    color: '#84cc16',
    avgSpeed: 18,
    costPerKm: 0.02,
    carbonFootprint: 0,
    accessibility: 'medium',
    reliability: 90,
    comfort: 50,
    availability: 'always'
  },
  {
    id: 'walk',
    name: 'Walking',
    type: 'walk',
    icon: 'PersonStanding',
    color: '#8b5cf6',
    avgSpeed: 5,
    costPerKm: 0,
    carbonFootprint: 0,
    accessibility: 'high',
    reliability: 100,
    comfort: 40,
    availability: 'always'
  },
  {
    id: 'scooter',
    name: 'E-Scooter',
    type: 'scooter',
    icon: 'Zap',
    color: '#ec4899',
    avgSpeed: 20,
    costPerKm: 0.25,
    carbonFootprint: 15,
    accessibility: 'medium',
    reliability: 82,
    comfort: 65,
    availability: 'on_demand'
  },
  {
    id: 'rickshaw',
    name: 'Auto Rickshaw',
    type: 'rickshaw',
    icon: 'Car',
    color: '#f97316',
    avgSpeed: 28,
    costPerKm: 0.35,
    carbonFootprint: 95,
    accessibility: 'high',
    reliability: 75,
    comfort: 55,
    availability: 'on_demand'
  }
]

const generateMockLastMileOptions = (): LastMileOption[] => [
  {
    id: 'bike_share',
    name: 'Bike Share',
    type: 'bike_share',
    nearbyStations: [
      { name: 'Central Station Hub', distance: 0.2, available: 15 },
      { name: 'University Plaza', distance: 0.4, available: 8 },
      { name: 'City Park North', distance: 0.6, available: 12 }
    ],
    costPerMinute: 0.15,
    maxDistance: 5,
    availability: 'high',
    icon: 'Bike',
    color: '#84cc16'
  },
  {
    id: 'scooter_share',
    name: 'E-Scooter Share',
    type: 'scooter_share',
    nearbyStations: [
      { name: 'Metro Exit A', distance: 0.1, available: 6 },
      { name: 'Shopping District', distance: 0.3, available: 4 },
      { name: 'Business Tower', distance: 0.5, available: 9 }
    ],
    costPerMinute: 0.25,
    maxDistance: 8,
    availability: 'medium',
    icon: 'Zap',
    color: '#ec4899'
  },
  {
    id: 'auto_rickshaw',
    name: 'Auto Rickshaw',
    type: 'auto_rickshaw',
    nearbyStations: [
      { name: 'Main Terminal', distance: 0.15, available: 3 },
      { name: 'Market Square', distance: 0.35, available: 5 }
    ],
    costPerMinute: 0.40,
    maxDistance: 12,
    availability: 'high',
    icon: 'Car',
    color: '#f97316'
  },
  {
    id: 'shuttle',
    name: 'Shuttle Service',
    type: 'shuttle',
    nearbyStations: [
      { name: 'Transit Hub A', distance: 0.1, available: 2 },
      { name: 'Corporate Campus', distance: 0.8, available: 1 }
    ],
    costPerMinute: 0.20,
    maxDistance: 15,
    availability: 'low',
    icon: 'Bus',
    color: '#6366f1'
  }
]

const generateMockTransitHubs = (): TransitHub[] => [
  {
    id: 'hub-001',
    name: 'Central Transit Hub',
    type: 'integrated_hub',
    coordinates: { lat: 43.6532, lng: -79.3832 },
    connectedModes: ['metro', 'bus', 'bike', 'rickshaw'],
    lastMileOptions: generateMockLastMileOptions(),
    facilities: ['parking', 'restroom', 'food', 'wifi', 'accessibility'],
    accessibility: true,
    peakHourCrowding: 'high',
    averageWaitTime: 8
  },
  {
    id: 'hub-002',
    name: 'University Metro Station',
    type: 'metro_station',
    coordinates: { lat: 43.6629, lng: -79.3957 },
    connectedModes: ['metro', 'bus', 'bike'],
    lastMileOptions: generateMockLastMileOptions().slice(0, 2),
    facilities: ['restroom', 'wifi', 'accessibility'],
    accessibility: true,
    peakHourCrowding: 'medium',
    averageWaitTime: 5
  },
  {
    id: 'hub-003',
    name: 'Industrial District Terminal',
    type: 'bus_stop',
    coordinates: { lat: 43.6482, lng: -79.3401 },
    connectedModes: ['bus', 'rickshaw'],
    lastMileOptions: generateMockLastMileOptions().slice(2),
    facilities: ['restroom'],
    accessibility: false,
    peakHourCrowding: 'low',
    averageWaitTime: 12
  }
]

const generateMockUserPreferences = (): UserPreferences => ({
  preferredModes: ['metro', 'bus', 'bike'],
  maxWalkingDistance: 1.0,
  maxTransfers: 2,
  priorityWeights: {
    time: 40,
    cost: 25,
    comfort: 20,
    sustainability: 15
  },
  accessibilityNeeds: ['wheelchair_accessible', 'audio_announcements'],
  budgetConstraint: 5.00,
  avoidModes: ['rickshaw']
})

// Mock data generators for Advanced Analytics & Simulation
const generateMockSimulations = (): TrafficSimulation[] => [
  {
    id: 'sim-001',
    name: 'Highway 401 Lane Expansion Impact',
    description: 'Analyzing the impact of adding two lanes to Highway 401 between Yonge and DVP',
    simulationType: 'infrastructure_impact',
    status: 'completed',
    parameters: {
      timeHorizon: 24,
      vehicleDensity: 'high',
      weatherConditions: 'clear',
      incidentProbability: 0.15,
      infrastructureChanges: [
        'lane_expansion: Add 2 additional lanes in each direction on Highway 401'
      ],
      emergencyScenarios: [],
      trafficPatterns: 'normal'
    },
    results: {
      overallScore: 78,
      trafficFlowMetrics: {
        averageSpeed: 65,
        congestionReduction: 35,
        travelTimeReduction: 28,
        fuelSavings: 18,
        emissionReduction: 22
      },
      emergencyResponseMetrics: {
        averageResponseTime: 8.5,
        responseTimeImprovement: 15,
        successfulCorridors: 45,
        signalOverrideEfficiency: 87
      },
      infrastructureImpact: {
        costBenefitRatio: 2.3,
        roiProjection: 130,
        paybackPeriod: 8.5,
        sustainabilityScore: 72,
        busSystemEfficiency: 85,
        vehicleCapacityUtilization: 78,
        roadNetworkImprovement: 65,
        signalSystemOptimization: 72,
        emergencyResponseImprovement: 45,
        airQualityImprovement: 28,
        noiseReduction: 15,
        constructionImpact: 35,
        publicTransportAdoption: 22
      },
      recommendations: [
        {
          id: 'rec-001',
          type: 'infrastructure',
          priority: 'high',
          title: 'Implement Smart Traffic Signals',
          description: 'Deploy AI-powered traffic signals to optimize flow during construction',
          expectedBenefit: '15% additional congestion reduction',
          implementationCost: 8.5,
          timeframe: 'short_term',
          impactAreas: ['traffic_flow', 'emergency_response']
        }
      ],
      visualizationData: {
        timeSeriesData: [],
        heatmapData: [],
        routeFlowData: [],
        costBenefitChart: []
      }
    },
    createdAt: new Date('2024-01-15'),
    completedAt: new Date('2024-01-16'),
    duration: 45,
    progress: 100
  },
  {
    id: 'sim-002',
    name: 'Multi-Modal Integration Study',
    description: 'Evaluating the impact of integrated transit hubs on overall traffic flow',
    simulationType: 'multimodal_integration',
    status: 'running',
    parameters: {
      timeHorizon: 48,
      vehicleDensity: 'medium',
      weatherConditions: 'clear',
      incidentProbability: 0.10,
      infrastructureChanges: [],
      emergencyScenarios: [],
      trafficPatterns: 'normal'
    },
    results: null,
    createdAt: new Date(),
    completedAt: null,
    duration: 0,
    progress: 65
  }
]

const generateMockPredictiveModels = (): PredictiveModel[] => [
  {
    id: 'model-001',
    name: 'Rush Hour Congestion Predictor',
    type: 'congestion_forecast',
    accuracy: 87,
    lastTrainingDate: new Date('2024-01-10'),
    predictions: [
      {
        id: 'pred-001',
        timeframe: 'next_hour',
        confidence: 0.89,
        predictedValue: 75,
        variance: 8.5,
        factors: [
          { name: 'Historical Pattern', influence: 45, description: 'Based on 6-month traffic data' },
          { name: 'Weather Conditions', influence: 25, description: 'Clear weather expected' },
          { name: 'Event Schedule', influence: 20, description: 'No major events scheduled' },
          { name: 'Construction Activity', influence: 10, description: 'Minor lane restrictions' }
        ],
        generatedAt: new Date()
      }
    ],
    status: 'active'
  },
  {
    id: 'model-002',
    name: 'Emergency Response Optimizer',
    type: 'incident_prediction',
    accuracy: 92,
    lastTrainingDate: new Date('2024-01-08'),
    predictions: [
      {
        id: 'pred-002',
        timeframe: 'next_day',
        confidence: 0.93,
        predictedValue: 3,
        variance: 1.2,
        factors: [
          { name: 'Traffic Volume', influence: 35, description: 'High volume increases incident probability' },
          { name: 'Weather Forecast', influence: 30, description: 'Rain expected in afternoon' },
          { name: 'Day of Week', influence: 20, description: 'Friday has higher incident rates' },
          { name: 'Road Conditions', influence: 15, description: 'Construction zones present' }
        ],
        generatedAt: new Date()
      }
    ],
    status: 'active'
  }
]

const generateMockAnalyticsInsights = (): AnalyticsInsight[] => [
  {
    id: 'insight-001',
    type: 'opportunity',
    severity: 'high',
    title: 'Signal Timing Optimization Opportunity',
    description: 'Main Street Corridor could benefit from 23% reduction in wait times through optimized signal timing',
    data: { affectedRoutes: [1], potentialTimeSaving: 5.2, implementationCost: 15000 },
    actionRequired: true,
    relatedRecommendations: ['rec-001'],
    detectedAt: new Date(),
    acknowledged: false
  },
  {
    id: 'insight-002',
    type: 'trend',
    severity: 'medium',
    title: 'Increasing Multi-Modal Usage',
    description: 'Metro + bike combinations increased by 34% over the past month, indicating successful integration',
    data: { growthRate: 0.34, popularCombinations: ['metro+bike', 'bus+scooter'] },
    actionRequired: false,
    relatedRecommendations: [],
    detectedAt: new Date(Date.now() - 86400000),
    acknowledged: true
  },
  {
    id: 'insight-003',
    type: 'anomaly',
    severity: 'critical',
    title: 'Unusual Emergency Response Times',
    description: 'Response times in downtown core increased by 40% in the last 48 hours',
    data: { averageIncrease: 0.40, affectedArea: 'downtown_core', possibleCauses: ['construction', 'signal_malfunction'] },
    actionRequired: true,
    relatedRecommendations: ['rec-002'],
    detectedAt: new Date(Date.now() - 7200000),
    acknowledged: false
  }
]

const generateMockReportTemplates = (): ReportTemplate[] => [
  {
    id: 'template-1',
    name: 'Daily Traffic Summary',
    description: 'Comprehensive daily overview of traffic conditions, incidents, and key metrics',
    type: 'traffic_summary',
    sections: [
      {
        id: 'section-1',
        name: 'Executive Summary',
        type: 'metrics',
        config: {
          title: 'Key Performance Indicators',
          includeMetrics: ['total_vehicles', 'avg_speed', 'congestion_level', 'incidents'],
          includeTimeRange: true
        },
        order: 1,
        enabled: true
      },
      {
        id: 'section-2',
        name: 'Traffic Flow Analysis',
        type: 'charts',
        config: {
          title: 'Traffic Flow Trends',
          includeCharts: ['hourly_traffic', 'route_utilization', 'speed_analysis'],
          chartTypes: ['line', 'bar', 'area']
        },
        order: 2,
        enabled: true
      },
      {
        id: 'section-3',
        name: 'Route Performance',
        type: 'tables',
        config: {
          title: 'Route Performance Metrics',
          includeMetrics: ['route_speeds', 'congestion_levels', 'vehicle_counts']
        },
        order: 3,
        enabled: true
      }
    ],
    isDefault: true,
    createdAt: new Date(Date.now() - 86400000 * 30), // 30 days ago
    lastUsed: new Date(Date.now() - 86400000) // 1 day ago
  },
  {
    id: 'template-2',
    name: 'Emergency Response Analysis',
    description: 'Detailed analysis of emergency vehicle responses and priority corridor effectiveness',
    type: 'emergency_response',
    sections: [
      {
        id: 'section-1',
        name: 'Response Times',
        type: 'metrics',
        config: {
          title: 'Emergency Response Metrics',
          includeMetrics: ['avg_response_time', 'total_responses', 'priority_activations'],
          includeTimeRange: true
        },
        order: 1,
        enabled: true
      },
      {
        id: 'section-2',
        name: 'Corridor Performance',
        type: 'charts',
        config: {
          title: 'Priority Corridor Analysis',
          includeCharts: ['response_times', 'corridor_usage', 'signal_overrides'],
          chartTypes: ['line', 'bar']
        },
        order: 2,
        enabled: true
      }
    ],
    isDefault: false,
    createdAt: new Date(Date.now() - 86400000 * 15), // 15 days ago
  },
  {
    id: 'template-3',
    name: 'Simulation Results Report',
    description: 'Comprehensive analysis of traffic simulation results and infrastructure impact',
    type: 'simulation_results',
    sections: [
      {
        id: 'section-1',
        name: 'Simulation Overview',
        type: 'simulation_results',
        config: {
          title: 'Simulation Parameters and Results',
          includeMetrics: ['scenario_comparison', 'impact_analysis', 'cost_benefit']
        },
        order: 1,
        enabled: true
      }
    ],
    isDefault: false,
    createdAt: new Date(Date.now() - 86400000 * 7), // 7 days ago
  }
];

const generateMockGeneratedReports = (): GeneratedReport[] => [
  {
    id: 'report-1',
    templateId: 'template-1',
    name: 'Daily Traffic Summary - December 6, 2025',
    type: 'traffic_summary',
    generatedAt: new Date(Date.now() - 3600000), // 1 hour ago
    timeRange: {
      start: new Date(Date.now() - 86400000), // 24 hours ago
      end: new Date()
    },
    data: {
      summary: {
        totalRoutes: 15,
        avgTrafficFlow: 312,
        emergencyResponses: 8,
        simulationsRun: 3,
        keyMetrics: {
          peak_congestion: 78,
          avg_speed: 35,
          total_vehicles: 15420,
          incidents: 12
        },
        periodicComparison: {
          traffic_change: 12.5,
          speed_change: -8.2,
          incidents_change: -15.3
        }
      },
      sections: [],
      charts: [],
      tables: [],
      insights: [],
      recommendations: []
    },
    metadata: {
      generatedBy: 'TrafficFlow Pro System',
      version: '1.0.0',
      totalPages: 8,
      dataPoints: 2840,
      processingTime: 3.2,
      fileSize: 1.8
    },
    status: 'completed',
    exportFormats: [
      {
        format: 'pdf',
        available: true,
        downloadCount: 3,
        lastDownloaded: new Date(Date.now() - 1800000)
      },
      {
        format: 'excel',
        available: true,
        downloadCount: 1
      }
    ]
  },
  {
    id: 'report-2',
    templateId: 'template-2',
    name: 'Emergency Response Analysis - Week 49',
    type: 'emergency_response',
    generatedAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
    timeRange: {
      start: new Date(Date.now() - 86400000 * 7), // 7 days ago
      end: new Date(Date.now() - 86400000) // 1 day ago
    },
    data: {
      summary: {
        totalRoutes: 0,
        avgTrafficFlow: 0,
        emergencyResponses: 45,
        simulationsRun: 0,
        keyMetrics: {
          avg_response_time: 4.8,
          corridors_activated: 23,
          signal_overrides: 156,
          success_rate: 94.2
        },
        periodicComparison: {
          response_time_change: -12.8,
          corridors_change: 18.5
        }
      },
      sections: [],
      charts: [],
      tables: [],
      insights: [],
      recommendations: []
    },
    metadata: {
      generatedBy: 'TrafficFlow Pro System',
      version: '1.0.0',
      totalPages: 6,
      dataPoints: 1250,
      processingTime: 2.1,
      fileSize: 1.2
    },
    status: 'completed',
    exportFormats: [
      {
        format: 'pdf',
        available: true,
        downloadCount: 2
      }
    ]
  }
];

const generateMockReportSchedules = (): ReportSchedule[] => [
  {
    id: 'schedule-1',
    templateId: 'template-1',
    name: 'Daily Traffic Summary - Auto Generated',
    frequency: 'daily',
    time: '06:00',
    recipients: ['traffic.manager@city.gov', 'operations@trafficflow.pro'],
    isActive: true,
    nextRunDate: new Date(Date.now() + 86400000), // Tomorrow at 6 AM
    lastRunDate: new Date(Date.now() - 3600000), // 1 hour ago
    createdAt: new Date(Date.now() - 86400000 * 30) // 30 days ago
  },
  {
    id: 'schedule-2',
    templateId: 'template-2',
    name: 'Weekly Emergency Response Report',
    frequency: 'weekly',
    dayOfWeek: 1, // Monday
    time: '08:00',
    recipients: ['emergency.coordinator@city.gov'],
    isActive: true,
    nextRunDate: new Date(Date.now() + 86400000 * 2), // Next Monday
    lastRunDate: new Date(Date.now() - 86400000 * 5), // Last Monday
    createdAt: new Date(Date.now() - 86400000 * 60) // 60 days ago
  }
];

export const useTrafficStore = create<TrafficState>()(
  persist(
    (set, get) => ({
      // Initial state
      routes: generateMockRoutes(),
      emergencyVehicles: generateMockEmergencyVehicles(),
      vehicleCounts: generateMockVehicleCounts(),
      metrics: generateMockMetrics(),
      routeOptimizations: generateMockRouteOptimizations(),
      trafficPredictions: generateMockTrafficPredictions(),
      selectedRoute: null,
      
      // Emergency Priority System Data
      priorityCorridors: generateMockPriorityCorridors(),
      trafficSignals: generateMockTrafficSignals(),
      activeEmergencyResponses: 3,
      totalSignalOverrides: 23,
      averageResponseTime: 5.8,
      
      // Multi-Modal Transportation Data
      transportModes: generateMockTransportModes(),
      multiModalJourneys: [],
      userPreferences: generateMockUserPreferences(),
      lastMileOptions: generateMockLastMileOptions(),
      transitHubs: generateMockTransitHubs(),
      selectedJourney: null,
      journeyPlanningActive: false,
      
      // Advanced Analytics & Simulation Data
      trafficSimulations: generateMockSimulations(),
      predictiveModels: generateMockPredictiveModels(),
      analyticsInsights: generateMockAnalyticsInsights(),
      selectedSimulation: null,
      simulationResults: null,
      activeSimulations: 1,
      totalSimulationsRun: 7,
      
      // Report Generation Data
      reportTemplates: generateMockReportTemplates(),
      generatedReports: generateMockGeneratedReports(),
      reportSchedules: generateMockReportSchedules(),
      selectedReport: null,
      isGeneratingReport: false,
      
      isLoading: false,
      isOptimizing: false,
      isSimulating: false,
      lastUpdated: new Date(),
      
      // Actions
      updateRoutes: (routes) => set({ routes, lastUpdated: new Date() }),
      
      updateRoute: (id, updates) => set((state) => ({
        routes: state.routes.map(route =>
          route.id === id 
            ? { ...route, ...updates, lastUpdated: new Date() }
            : route
        ),
        lastUpdated: new Date()
      })),
      
      addEmergencyVehicle: (vehicle) => set((state) => ({
        emergencyVehicles: [
          ...state.emergencyVehicles,
          { ...vehicle, id: Date.now() }
        ],
        lastUpdated: new Date()
      })),
      
      updateEmergencyVehicle: (id, updates) => set((state) => ({
        emergencyVehicles: state.emergencyVehicles.map(vehicle =>
          vehicle.id === id ? { ...vehicle, ...updates } : vehicle
        ),
        lastUpdated: new Date()
      })),
      
      removeEmergencyVehicle: (id) => set((state) => ({
        emergencyVehicles: state.emergencyVehicles.filter(vehicle => vehicle.id !== id),
        lastUpdated: new Date()
      })),
      
      updateMetrics: (metrics) => set((state) => ({
        metrics: { ...state.metrics, ...metrics },
        lastUpdated: new Date()
      })),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      refreshData: () => {
        set({ isLoading: true })
        
        // Simulate API call delay
        setTimeout(() => {
          set({
            routes: generateMockRoutes(),
            emergencyVehicles: generateMockEmergencyVehicles(),
            vehicleCounts: generateMockVehicleCounts(),
            metrics: generateMockMetrics(),
            routeOptimizations: generateMockRouteOptimizations(),
            trafficPredictions: generateMockTrafficPredictions(),
            isLoading: false,
            lastUpdated: new Date()
          })
        }, 1000)
      },
      
      // AI Route Optimization Actions
      optimizeRoute: async (routeId: number, algorithm = 'traffic_aware') => {
        set({ isOptimizing: true })
        
        try {
          let result;
          if (algorithm === 'dijkstra') {
            result = await dijkstraOptimization(routeId);
          } else {
            result = await trafficAwareOptimization(routeId);
          }
          
          // Update the route with optimization results
          set((state) => ({
            routes: state.routes.map(route =>
              route.id === routeId 
                ? { 
                    ...route, 
                    aiScore: result.aiScore,
                    estimatedTime: Math.max(1, route.estimatedTime - result.timeSaved),
                    lastUpdated: new Date()
                  }
                : route
            ),
            routeOptimizations: [
              ...state.routeOptimizations.filter(opt => opt.routeId !== routeId),
              {
                routeId,
                algorithm,
                optimizationScore: result.aiScore,
                timeSaved: result.timeSaved,
                fuelSaved: result.timeSaved * 0.1, // Estimate fuel savings
                alternativeCount: Math.floor(Math.random() * 4) + 1,
                lastOptimized: new Date()
              }
            ],
            metrics: {
              ...state.metrics,
              routeOptimization: Math.min(100, state.metrics.routeOptimization + 2),
              predictionAccuracy: Math.min(100, state.metrics.predictionAccuracy + 1)
            },
            isOptimizing: false,
            lastUpdated: new Date()
          }))
        } catch (error) {
          set({ isOptimizing: false })
        }
      },
      
      generateAlternativeRoutes: async (routeId: number): Promise<AlternativeRoute[]> => {
        const alternatives: AlternativeRoute[] = [
          {
            id: 1,
            name: 'Via Express Lane',
            timeSaving: 8,
            distanceDiff: -0.5,
            congestionLevel: 35,
            aiRecommendation: 'highly_recommended',
            reason: 'Fastest route with minimal traffic'
          },
          {
            id: 2,
            name: 'Scenic Route',
            timeSaving: -5,
            distanceDiff: 1.2,
            congestionLevel: 15,
            aiRecommendation: 'acceptable',
            reason: 'Longer but more pleasant drive'
          },
          {
            id: 3,
            name: 'Back Streets',
            timeSaving: 3,
            distanceDiff: -0.2,
            congestionLevel: 45,
            aiRecommendation: 'recommended',
            reason: 'Good alternative during peak hours'
          }
        ];
        
        // Update the route with alternative routes
        set((state) => ({
          routes: state.routes.map(route =>
            route.id === routeId 
              ? { ...route, alternativeRoutes: alternatives }
              : route
          )
        }))
        
        return alternatives;
      },
      
      predictTrafficCongestion: async (routeId: number, timeSlot: string): Promise<TrafficPrediction> => {
        const prediction: TrafficPrediction = {
          routeId,
          timeSlot,
          predictedCongestion: Math.floor(Math.random() * 80) + 20,
          confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
          factors: ['historical', 'weather', 'events'].slice(0, Math.floor(Math.random() * 3) + 1)
        };
        
        set((state) => ({
          trafficPredictions: [
            ...state.trafficPredictions.filter(p => !(p.routeId === routeId && p.timeSlot === timeSlot)),
            prediction
          ]
        }))
        
        return prediction;
      },
      
      selectRoute: (route: TrafficRoute | null) => set({ selectedRoute: route }),
      setOptimizing: (optimizing: boolean) => set({ isOptimizing: optimizing }),
      
      // Emergency Priority System Actions
      registerEmergencyVehicle: async (vehicle: Omit<EmergencyVehicle, 'id' | 'registeredAt'>): Promise<void> => {
        const newVehicle: EmergencyVehicle = {
          ...vehicle,
          id: Date.now(),
          registeredAt: new Date()
        };
        
        set((state) => ({
          emergencyVehicles: [...state.emergencyVehicles, newVehicle],
          activeEmergencyResponses: state.activeEmergencyResponses + 1,
          lastUpdated: new Date()
        }));
      },
      
      activatePriorityCorridor: async (emergencyVehicleId: number, routeSegments: string[]): Promise<PriorityCorridor> => {
        const corridorId = `corridor-${Date.now()}`;
        const now = new Date();
        const estimatedClearTime = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes from now
        
        const newCorridor: PriorityCorridor = {
          id: corridorId,
          name: `Emergency Corridor ${corridorId.slice(-3)}`,
          emergencyVehicleId,
          status: 'active',
          activatedAt: now,
          estimatedClearTime,
          signalsControlled: routeSegments.length,
          averageDelay: Math.random() * 20 + 5,
          segments: routeSegments.map((segmentId, index) => ({
            id: `seg-${corridorId}-${index}`,
            intersectionId: `int-${segmentId}`,
            signalId: `sig-${segmentId}`,
            currentPhase: Math.random() > 0.5 ? 'green' : 'red' as 'green' | 'red',
            timeRemaining: Math.floor(Math.random() * 60) + 15,
            isOverridden: Math.random() > 0.3,
            originalTiming: 60,
            emergencyTiming: 90,
            vehiclePosition: index === 0 ? 'approaching' : 'approaching' as 'approaching'
          }))
        };
        
        set((state) => ({
          priorityCorridors: [...state.priorityCorridors, newCorridor],
          totalSignalOverrides: state.totalSignalOverrides + routeSegments.length,
          lastUpdated: new Date()
        }));
        
        return newCorridor;
      },
      
      updateCorridorStatus: (corridorId: string, status: PriorityCorridor['status']) => {
        set((state) => ({
          priorityCorridors: state.priorityCorridors.map(corridor =>
            corridor.id === corridorId ? { ...corridor, status } : corridor
          ),
          lastUpdated: new Date()
        }));
      },
      
      overrideTrafficSignal: async (signalId: string, duration: number): Promise<void> => {
        set((state) => ({
          trafficSignals: state.trafficSignals.map(signal =>
            signal.id === signalId 
              ? {
                  ...signal,
                  isEmergencyOverride: true,
                  currentPhase: 'green',
                  timeRemaining: duration,
                  lastOverride: new Date(),
                  overrideCount: signal.overrideCount + 1
                }
              : signal
          ),
          totalSignalOverrides: state.totalSignalOverrides + 1,
          lastUpdated: new Date()
        }));
        
        // Simulate signal returning to normal after duration
        setTimeout(() => {
          set((state) => ({
            trafficSignals: state.trafficSignals.map(signal =>
              signal.id === signalId 
                ? { ...signal, isEmergencyOverride: false }
                : signal
            )
          }));
        }, duration * 1000);
      },
      
      clearPriorityCorridor: async (corridorId: string): Promise<void> => {
        set((state) => ({
          priorityCorridors: state.priorityCorridors.filter(corridor => corridor.id !== corridorId),
          lastUpdated: new Date()
        }));
      },
      
      getEmergencyResponse: (vehicleId: number): EmergencyVehicle | null => {
        const state = get();
        return state.emergencyVehicles.find(vehicle => vehicle.id === vehicleId) || null;
      },
      
      updateSignalTiming: (signalId: string, phase: 'green' | 'yellow' | 'red', duration: number) => {
        set((state) => ({
          trafficSignals: state.trafficSignals.map(signal =>
            signal.id === signalId 
              ? { ...signal, currentPhase: phase, timeRemaining: duration }
              : signal
          ),
          lastUpdated: new Date()
        }));
      },
      
      // Multi-Modal Journey Planning Actions
      planMultiModalJourney: async (start: { lat: number; lng: number }, end: { lat: number; lng: number }): Promise<MultiModalJourney[]> => {
        set({ journeyPlanningActive: true });
        
        return new Promise((resolve) => {
          setTimeout(() => {
            const state = get();
            const journeys: MultiModalJourney[] = [];
            
            // Generate 3 different journey options
            for (let i = 0; i < 3; i++) {
              const modes = state.transportModes.slice(0, Math.floor(Math.random() * 3) + 2);
              const segments: JourneySegment[] = modes.map((mode, index) => ({
                id: `seg-${i}-${index}`,
                mode,
                startPoint: index === 0 
                  ? { name: 'Starting Point', lat: start.lat, lng: start.lng }
                  : { name: `Transfer ${index}`, lat: start.lat + (Math.random() - 0.5) * 0.01, lng: start.lng + (Math.random() - 0.5) * 0.01 },
                endPoint: index === modes.length - 1
                  ? { name: 'Destination', lat: end.lat, lng: end.lng }
                  : { name: `Transfer ${index + 1}`, lat: end.lat + (Math.random() - 0.5) * 0.01, lng: end.lng + (Math.random() - 0.5) * 0.01 },
                distance: Math.random() * 10 + 2,
                duration: Math.random() * 30 + 10,
                cost: Math.random() * 5 + 1,
                carbonEmission: mode.carbonFootprint * (Math.random() * 10 + 2) / 1000,
                walkingDistance: Math.random() * 0.5,
                waitTime: mode.availability === 'scheduled' ? Math.random() * 10 + 2 : 0,
                transferTime: index > 0 ? Math.random() * 5 + 2 : 0
              }));
              
              const totalDistance = segments.reduce((sum, seg) => sum + seg.distance, 0);
              const totalDuration = segments.reduce((sum, seg) => sum + seg.duration + (seg.waitTime || 0) + (seg.transferTime || 0), 0);
              const totalCost = segments.reduce((sum, seg) => sum + seg.cost, 0);
              const totalCarbonEmission = segments.reduce((sum, seg) => sum + seg.carbonEmission, 0);
              const totalWalkingDistance = segments.reduce((sum, seg) => sum + (seg.walkingDistance || 0), 0);
              
              journeys.push({
                id: `journey-${i + 1}`,
                startLocation: { name: 'Starting Point', lat: start.lat, lng: start.lng },
                endLocation: { name: 'Destination', lat: end.lat, lng: end.lng },
                segments,
                totalDistance,
                totalDuration,
                totalCost,
                totalCarbonEmission,
                totalWalkingDistance,
                transferCount: segments.length - 1,
                comfortScore: segments.reduce((sum, seg) => sum + seg.mode.comfort, 0) / segments.length,
                reliabilityScore: segments.reduce((sum, seg) => sum + seg.mode.reliability, 0) / segments.length,
                sustainabilityScore: Math.max(0, 100 - totalCarbonEmission * 100),
                createdAt: new Date(),
                userPreferencesApplied: true
              });
            }
            
            set((state) => ({
              multiModalJourneys: [...state.multiModalJourneys, ...journeys],
              journeyPlanningActive: false,
              lastUpdated: new Date()
            }));
            
            resolve(journeys);
          }, 2000);
        });
      },
      
      selectJourney: (journey: MultiModalJourney | null) => {
        set({ selectedJourney: journey, lastUpdated: new Date() });
      },
      
      updateUserPreferences: (preferences: Partial<UserPreferences>) => {
        set((state) => ({
          userPreferences: { ...state.userPreferences, ...preferences },
          lastUpdated: new Date()
        }));
      },
      
      findLastMileOptions: (location: { lat: number; lng: number }): LastMileOption[] => {
        const state = get();
        // Simulate finding nearby last-mile options based on location
        return state.lastMileOptions.filter(() => Math.random() > 0.3); // Random availability
      },
      
      getNearbyTransitHubs: (location: { lat: number; lng: number }, radius: number): TransitHub[] => {
        const state = get();
        // Simulate finding nearby transit hubs within radius
        return state.transitHubs.filter(hub => {
          const distance = Math.sqrt(
            Math.pow(hub.coordinates.lat - location.lat, 2) + 
            Math.pow(hub.coordinates.lng - location.lng, 2)
          );
          return distance <= radius / 111000; // Rough conversion to degrees
        });
      },
      
      optimizeJourneyForPreferences: async (journeyId: string): Promise<MultiModalJourney> => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const state = get();
            const journey = state.multiModalJourneys.find(j => j.id === journeyId);
            
            if (journey) {
              // Apply user preferences to optimize journey
              const preferences = state.userPreferences;
              const optimizedJourney: MultiModalJourney = {
                ...journey,
                comfortScore: Math.min(100, journey.comfortScore + preferences.priorityWeights.comfort / 10),
                reliabilityScore: Math.min(100, journey.reliabilityScore + 5),
                sustainabilityScore: Math.min(100, journey.sustainabilityScore + preferences.priorityWeights.sustainability / 10),
                userPreferencesApplied: true
              };
              
              set((state) => ({
                multiModalJourneys: state.multiModalJourneys.map(j => 
                  j.id === journeyId ? optimizedJourney : j
                ),
                selectedJourney: state.selectedJourney?.id === journeyId ? optimizedJourney : state.selectedJourney,
                lastUpdated: new Date()
              }));
              
              resolve(optimizedJourney);
            } else {
              resolve(journey!);
            }
          }, 1500);
        });
      },
      
      setJourneyPlanningActive: (active: boolean) => {
        set({ journeyPlanningActive: active });
      },
      
      saveJourneyHistory: (journey: MultiModalJourney) => {
        set((state) => ({
          multiModalJourneys: [...state.multiModalJourneys.filter(j => j.id !== journey.id), journey],
          lastUpdated: new Date()
        }));
      },
      
      // Advanced Analytics & Simulation Actions
      createSimulation: async (params: Omit<TrafficSimulation, 'id' | 'status' | 'progress' | 'results' | 'createdAt' | 'completedAt'>): Promise<TrafficSimulation> => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const newSimulation: TrafficSimulation = {
              ...params,
              id: `sim-${Date.now()}`,
              status: 'queued',
              progress: 0,
              results: null,
              createdAt: new Date(),
              completedAt: null
            };
            
            set((state) => ({
              trafficSimulations: [...state.trafficSimulations, newSimulation],
              lastUpdated: new Date()
            }));
            
            resolve(newSimulation);
          }, 500);
        });
      },
      
      runSimulation: async (simulationId: string): Promise<SimulationResults> => {
        return new Promise((resolve) => {
          // Start simulation
          set((state) => ({
            trafficSimulations: state.trafficSimulations.map(sim =>
              sim.id === simulationId ? { ...sim, status: 'running' as const, progress: 0 } : sim
            ),
            activeSimulations: state.activeSimulations + 1,
            isSimulating: true
          }));
          
          // Simulate progress updates
          const progressInterval = setInterval(() => {
            const state = get();
            const simulation = state.trafficSimulations.find(s => s.id === simulationId);
            if (simulation && simulation.progress < 90) {
              set((state) => ({
                trafficSimulations: state.trafficSimulations.map(sim =>
                  sim.id === simulationId ? { ...sim, progress: Math.min(90, sim.progress + Math.random() * 20) } : sim
                )
              }));
            }
          }, 1000);
          
          // Complete simulation after 5 seconds
          setTimeout(() => {
            clearInterval(progressInterval);
            
            const mockResults: SimulationResults = {
              overallScore: 75 + Math.random() * 20,
              trafficFlowMetrics: {
                averageSpeed: 45 + Math.random() * 20,
                congestionReduction: Math.random() * 40,
                travelTimeReduction: Math.random() * 35,
                fuelSavings: Math.random() * 25,
                emissionReduction: Math.random() * 30
              },
              emergencyResponseMetrics: {
                averageResponseTime: 6 + Math.random() * 4,
                responseTimeImprovement: Math.random() * 25,
                successfulCorridors: Math.floor(30 + Math.random() * 20),
                signalOverrideEfficiency: 75 + Math.random() * 20
              },
              infrastructureImpact: {
                costBenefitRatio: 1.5 + Math.random() * 2,
                roiProjection: 100 + Math.random() * 100,
                paybackPeriod: 5 + Math.random() * 10,
                sustainabilityScore: 60 + Math.random() * 30,
                // Enhanced infrastructure metrics
                busSystemEfficiency: 70 + Math.random() * 25,
                vehicleCapacityUtilization: 60 + Math.random() * 30,
                roadNetworkImprovement: 50 + Math.random() * 40,
                signalSystemOptimization: 65 + Math.random() * 30,
                emergencyResponseImprovement: 40 + Math.random() * 35,
                airQualityImprovement: 15 + Math.random() * 25,
                noiseReduction: 10 + Math.random() * 20,
                constructionImpact: 20 + Math.random() * 30, // negative impact during construction
                publicTransportAdoption: 15 + Math.random() * 25
              },
              recommendations: [
                {
                  id: `rec-${Date.now()}`,
                  type: 'infrastructure',
                  priority: 'high',
                  title: 'Optimize Signal Timing',
                  description: 'Implement adaptive signal control system',
                  expectedBenefit: 'Reduce congestion by 15-20%',
                  implementationCost: 2.5,
                  timeframe: 'short_term',
                  impactAreas: ['traffic_flow', 'emergency_response']
                }
              ],
              visualizationData: {
                timeSeriesData: [],
                heatmapData: [],
                routeFlowData: [],
                costBenefitChart: []
              }
            };
            
            set((state) => ({
              trafficSimulations: state.trafficSimulations.map(sim =>
                sim.id === simulationId 
                  ? { 
                      ...sim, 
                      status: 'completed' as const, 
                      progress: 100, 
                      results: mockResults,
                      completedAt: new Date()
                    } 
                  : sim
              ),
              simulationResults: mockResults,
              activeSimulations: Math.max(0, state.activeSimulations - 1),
              totalSimulationsRun: state.totalSimulationsRun + 1,
              isSimulating: state.activeSimulations <= 1 ? false : true,
              lastUpdated: new Date()
            }));
            
            resolve(mockResults);
          }, 5000);
        });
      },
      
      selectSimulation: (simulation: TrafficSimulation | null) => {
        set({ 
          selectedSimulation: simulation,
          simulationResults: simulation?.results || null
        });
      },
      
      deleteSimulation: (simulationId: string) => {
        set((state) => ({
          trafficSimulations: state.trafficSimulations.filter(sim => sim.id !== simulationId),
          selectedSimulation: state.selectedSimulation?.id === simulationId ? null : state.selectedSimulation,
          lastUpdated: new Date()
        }));
      },
      
      updateSimulationProgress: (simulationId: string, progress: number) => {
        set((state) => ({
          trafficSimulations: state.trafficSimulations.map(sim =>
            sim.id === simulationId ? { ...sim, progress } : sim
          )
        }));
      },
      
      generateRecommendations: (simulationResults: SimulationResults): Recommendation[] => {
        // Generate context-aware recommendations based on simulation results
        const recommendations: Recommendation[] = [];
        
        if (simulationResults.trafficFlowMetrics.congestionReduction < 20) {
          recommendations.push({
            id: `rec-${Date.now()}-1`,
            type: 'infrastructure',
            priority: 'high',
            title: 'Additional Traffic Management Needed',
            description: 'Consider implementing dynamic routing or additional infrastructure',
            expectedBenefit: 'Potential 25% congestion reduction',
            implementationCost: 5.2,
            timeframe: 'medium_term',
            impactAreas: ['traffic_flow']
          });
        }
        
        if (simulationResults.emergencyResponseMetrics.responseTimeImprovement < 15) {
          recommendations.push({
            id: `rec-${Date.now()}-2`,
            type: 'technology',
            priority: 'medium',
            title: 'Enhanced Emergency Corridor System',
            description: 'Upgrade to predictive emergency routing with AI',
            expectedBenefit: 'Reduce emergency response times by 30%',
            implementationCost: 3.8,
            timeframe: 'short_term',
            impactAreas: ['emergency_response']
          });
        }
        
        return recommendations;
      },
      
      getPredictiveModel: (type: PredictiveModel['type']): PredictiveModel | null => {
        const state = get();
        return state.predictiveModels.find(model => model.type === type) || null;
      },
      
      updateModelPredictions: (modelId: string, predictions: ModelPrediction[]) => {
        set((state) => ({
          predictiveModels: state.predictiveModels.map(model =>
            model.id === modelId ? { ...model, predictions } : model
          ),
          lastUpdated: new Date()
        }));
      },
      
      generateAnalyticsInsights: (): AnalyticsInsight[] => {
        const state = get();
        const insights: AnalyticsInsight[] = [];
        
        // Analyze traffic patterns for insights
        const heavyTrafficRoutes = state.routes.filter(route => route.status === 'heavy').length;
        if (heavyTrafficRoutes > 2) {
          insights.push({
            id: `insight-${Date.now()}`,
            type: 'risk',
            severity: 'high',
            title: 'Multiple High-Congestion Routes Detected',
            description: `${heavyTrafficRoutes} routes showing heavy congestion simultaneously`,
            data: { affectedRoutes: heavyTrafficRoutes },
            actionRequired: true,
            relatedRecommendations: [],
            detectedAt: new Date(),
            acknowledged: false
          });
        }
        
        return insights;
      },
      
      acknowledgeInsight: (insightId: string) => {
        set((state) => ({
          analyticsInsights: state.analyticsInsights.map(insight =>
            insight.id === insightId ? { ...insight, acknowledged: true } : insight
          )
        }));
      },
      
      exportSimulationData: async (simulationId: string): Promise<Blob> => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const state = get();
            const simulation = state.trafficSimulations.find(s => s.id === simulationId);
            const data = JSON.stringify(simulation, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            resolve(blob);
          }, 1000);
        });
      },
      
      setSimulating: (simulating: boolean) => {
        set({ isSimulating: simulating });
      },
      
      // Report Generation Actions
      createReportTemplate: async (template: Omit<ReportTemplate, 'id' | 'createdAt'>) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const newTemplate: ReportTemplate = {
              ...template,
              id: `template-${Date.now()}`,
              createdAt: new Date()
            };
            
            set((state) => ({
              reportTemplates: [...state.reportTemplates, newTemplate]
            }));
            
            resolve(newTemplate);
          }, 500);
        });
      },
      
      updateReportTemplate: (templateId: string, updates: Partial<ReportTemplate>) => {
        set((state) => ({
          reportTemplates: state.reportTemplates.map(template =>
            template.id === templateId 
              ? { ...template, ...updates, lastUsed: new Date() }
              : template
          )
        }));
      },
      
      deleteReportTemplate: (templateId: string) => {
        set((state) => ({
          reportTemplates: state.reportTemplates.filter(template => template.id !== templateId)
        }));
      },
      
      generateReport: async (templateId: string, timeRange?: { start: Date; end: Date }) => {
        return new Promise((resolve) => {
          set({ isGeneratingReport: true });
          
          setTimeout(() => {
            const template = get().reportTemplates.find(t => t.id === templateId);
            if (!template) throw new Error('Template not found');
            
            const reportTimeRange = timeRange || {
              start: new Date(Date.now() - 86400000), // 24 hours ago
              end: new Date()
            };
            
            // Generate mock report data based on current state
            const state = get();
            const reportData: ReportData = {
              summary: {
                totalRoutes: state.routes.length,
                avgTrafficFlow: Math.round(state.routes.reduce((sum, r) => sum + r.vehicles, 0) / state.routes.length),
                emergencyResponses: state.emergencyVehicles.filter(v => v.status === 'active').length,
                simulationsRun: state.totalSimulationsRun,
                keyMetrics: {
                  peak_congestion: Math.max(...state.routes.map(r => r.congestionLevel)),
                  avg_speed: Math.round(state.routes.reduce((sum, r) => sum + r.avgSpeed, 0) / state.routes.length),
                  total_vehicles: state.routes.reduce((sum, r) => sum + r.vehicles, 0),
                  incidents: Math.floor(Math.random() * 20)
                },
                periodicComparison: {
                  traffic_change: (Math.random() - 0.5) * 30,
                  speed_change: (Math.random() - 0.5) * 20,
                  incidents_change: (Math.random() - 0.5) * 40
                }
              },
              sections: template.sections.map(section => ({
                sectionId: section.id,
                title: section.config.title,
                content: {},
                charts: [],
                tables: [],
                insights: []
              })),
              charts: [
                {
                  id: 'chart-1',
                  type: 'line' as const,
                  title: 'Hourly Traffic Flow',
                  data: Array.from({ length: 24 }, (_, i) => ({
                    hour: i,
                    vehicles: 200 + Math.random() * 400,
                    speed: 25 + Math.random() * 30
                  })),
                  config: {}
                }
              ],
              tables: [
                {
                  id: 'table-1',
                  title: 'Route Performance Summary',
                  headers: ['Route', 'Avg Speed', 'Congestion', 'Vehicles'],
                  rows: state.routes.map(route => [
                    route.name,
                    `${route.avgSpeed} km/h`,
                    `${route.congestionLevel}%`,
                    route.vehicles.toString()
                  ])
                }
              ],
              insights: state.analyticsInsights.slice(0, 5),
              recommendations: []
            };
            
            const newReport: GeneratedReport = {
              id: `report-${Date.now()}`,
              templateId: templateId,
              name: `${template.name} - ${new Date().toLocaleDateString()}`,
              type: template.type,
              generatedAt: new Date(),
              timeRange: reportTimeRange,
              data: reportData,
              metadata: {
                generatedBy: 'TrafficFlow Pro System',
                version: '1.0.0',
                totalPages: Math.ceil(template.sections.length * 2),
                dataPoints: state.routes.length * 24, // Mock calculation
                processingTime: Math.random() * 5 + 1,
                fileSize: Math.random() * 3 + 0.5
              },
              status: 'completed',
              exportFormats: [
                {
                  format: 'pdf',
                  available: true,
                  downloadCount: 0
                },
                {
                  format: 'excel',
                  available: true,
                  downloadCount: 0
                },
                {
                  format: 'csv',
                  available: true,
                  downloadCount: 0
                }
              ]
            };
            
            set((state) => ({
              generatedReports: [newReport, ...state.generatedReports],
              reportTemplates: state.reportTemplates.map(t =>
                t.id === templateId ? { ...t, lastUsed: new Date() } : t
              ),
              isGeneratingReport: false
            }));
            
            resolve(newReport);
          }, 3000); // Simulate report generation time
        });
      },
      
      exportReportToPDF: async (reportId: string) => {
        return new Promise<Blob>((resolve, reject) => {
          setTimeout(async () => {
            try {
              const report = get().generatedReports.find(r => r.id === reportId);
              if (!report) throw new Error('Report not found');
              
              // Dynamic import for jsPDF to avoid issues
              const { default: jsPDF } = await import('jspdf');
              
              const doc = new jsPDF();
              const pageWidth = doc.internal.pageSize.getWidth();
              const margin = 20;
              const contentWidth = pageWidth - (margin * 2);
              let yPosition = margin;
              
              // Title
              doc.setFontSize(20);
              doc.setFont(undefined, 'bold');
              doc.text(report.name, margin, yPosition);
              yPosition += 15;
              
              // Generated date
              doc.setFontSize(12);
              doc.setFont(undefined, 'normal');
              doc.text(`Generated: ${report.generatedAt.toLocaleString()}`, margin, yPosition);
              yPosition += 20;
              
              // Summary section
              doc.setFontSize(16);
              doc.setFont(undefined, 'bold');
              doc.text('Executive Summary', margin, yPosition);
              yPosition += 10;
              
              doc.setFontSize(11);
              doc.setFont(undefined, 'normal');
              
              // Key metrics
              Object.entries(report.data.summary.keyMetrics).forEach(([key, value]) => {
                const text = `${key.replace(/_/g, ' ').toUpperCase()}: ${value}`;
                doc.text(text, margin, yPosition);
                yPosition += 6;
              });
              
              yPosition += 10;
              
              // Report data tables
              if (report.data.tables && report.data.tables.length > 0) {
                report.data.tables.forEach((table, tableIndex) => {
                  // Check if we need a new page
                  if (yPosition > 250) {
                    doc.addPage();
                    yPosition = margin;
                  }
                  
                  // Table title
                  doc.setFontSize(14);
                  doc.setFont(undefined, 'bold');
                  doc.text(table.title, margin, yPosition);
                  yPosition += 10;
                  
                  // Table headers
                  doc.setFontSize(10);
                  doc.setFont(undefined, 'bold');
                  let xPosition = margin;
                  const colWidth = contentWidth / table.headers.length;
                  
                  table.headers.forEach((header) => {
                    doc.text(header, xPosition, yPosition);
                    xPosition += colWidth;
                  });
                  yPosition += 8;
                  
                  // Table rows
                  doc.setFont(undefined, 'normal');
                  table.rows.slice(0, 10).forEach((row) => { // Limit to first 10 rows
                    if (yPosition > 270) {
                      doc.addPage();
                      yPosition = margin;
                    }
                    
                    xPosition = margin;
                    row.forEach((cell) => {
                      doc.text(String(cell).substring(0, 20), xPosition, yPosition); // Truncate long text
                      xPosition += colWidth;
                    });
                    yPosition += 6;
                  });
                  
                  yPosition += 10;
                });
              }
              
              // Footer
              const pageCount = doc.internal.pages.length - 1;
              for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, doc.internal.pageSize.getHeight() - 10);
                doc.text('TrafficFlow Pro - Generated Report', margin, doc.internal.pageSize.getHeight() - 10);
              }
              
              const pdfBlob = doc.output('blob');
              
              set((state) => ({
                generatedReports: state.generatedReports.map(report =>
                  report.id === reportId
                    ? {
                        ...report,
                        exportFormats: report.exportFormats.map(format =>
                          format.format === 'pdf'
                            ? { ...format, downloadCount: format.downloadCount + 1, lastDownloaded: new Date() }
                            : format
                        )
                      }
                    : report
                )
              }));
              
              resolve(pdfBlob);
            } catch (error) {
              reject(error);
            }
          }, 2000);
        });
      },
      
      exportReportToExcel: async (reportId: string) => {
        return new Promise<Blob>((resolve, reject) => {
          setTimeout(async () => {
            try {
              const report = get().generatedReports.find(r => r.id === reportId);
              if (!report) throw new Error('Report not found');
              
              // Dynamic import for xlsx to avoid issues
              const XLSX = await import('xlsx');
              
              // Create a new workbook
              const workbook = XLSX.utils.book_new();
              
              // Summary sheet
              const summaryData = [
                ['TrafficFlow Pro Report'],
                ['Report Name', report.name],
                ['Generated', report.generatedAt.toLocaleString()],
                ['Type', report.type.replace('_', ' ').toUpperCase()],
                ['Total Pages', report.metadata.totalPages],
                ['File Size (MB)', report.metadata.fileSize],
                ['Data Points', report.metadata.dataPoints],
                [''],
                ['KEY METRICS'],
                ...Object.entries(report.data.summary.keyMetrics).map(([key, value]) => [
                  key.replace(/_/g, ' ').toUpperCase(),
                  value
                ])
              ];
              
              const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
              
              // Style the header
              summarySheet['!cols'] = [{ width: 25 }, { width: 20 }];
              
              XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
              
              // Add data tables as separate sheets
              if (report.data.tables && report.data.tables.length > 0) {
                report.data.tables.forEach((table, index) => {
                  const tableData = [
                    table.headers,
                    ...table.rows
                  ];
                  
                  const tableSheet = XLSX.utils.aoa_to_sheet(tableData);
                  
                  // Auto-size columns
                  const colWidths = table.headers.map(() => ({ width: 15 }));
                  tableSheet['!cols'] = colWidths;
                  
                  const sheetName = table.title.replace(/[^\w\s]/gi, '').substring(0, 31); // Excel sheet name limits
                  XLSX.utils.book_append_sheet(workbook, tableSheet, sheetName || `Table ${index + 1}`);
                });
              }
              
              // Charts data sheet (if any)
              if (report.data.charts && report.data.charts.length > 0) {
                const chartsData = [
                  ['CHARTS DATA'],
                  ['Chart Name', 'Type', 'Data Points'],
                  ...report.data.charts.map(chart => [
                    chart.title,
                    chart.type,
                    chart.data.length
                  ])
                ];
                
                const chartsSheet = XLSX.utils.aoa_to_sheet(chartsData);
                chartsSheet['!cols'] = [{ width: 20 }, { width: 15 }, { width: 15 }];
                XLSX.utils.book_append_sheet(workbook, chartsSheet, 'Charts');
              }
              
              // Write the workbook to buffer
              const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
              const excelBlob = new Blob([excelBuffer], { 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
              });
              
              set((state) => ({
                generatedReports: state.generatedReports.map(report =>
                  report.id === reportId
                    ? {
                        ...report,
                        exportFormats: report.exportFormats.map(format =>
                          format.format === 'excel'
                            ? { ...format, downloadCount: format.downloadCount + 1, lastDownloaded: new Date() }
                            : format
                        )
                      }
                    : report
                )
              }));
              
              resolve(excelBlob);
            } catch (error) {
              reject(error);
            }
          }, 1500);
        });
      },
      
      exportReportToCSV: async (reportId: string) => {
        return new Promise<Blob>((resolve) => {
          setTimeout(() => {
            const report = get().generatedReports.find(r => r.id === reportId);
            if (!report) throw new Error('Report not found');
            
            // Generate CSV content from report data
            let csvContent = 'Report: ' + report.name + '\n';
            csvContent += 'Generated: ' + report.generatedAt.toLocaleString() + '\n\n';
            
            // Add summary data
            csvContent += 'Summary\n';
            Object.entries(report.data.summary.keyMetrics).forEach(([key, value]) => {
              csvContent += `${key},${value}\n`;
            });
            
            // Add tables
            report.data.tables.forEach(table => {
              csvContent += '\n' + table.title + '\n';
              csvContent += table.headers.join(',') + '\n';
              table.rows.forEach(row => {
                csvContent += row.join(',') + '\n';
              });
            });
            
            const csvBlob = new Blob([csvContent], { type: 'text/csv' });
            
            set((state) => ({
              generatedReports: state.generatedReports.map(r =>
                r.id === reportId
                  ? {
                      ...r,
                      exportFormats: r.exportFormats.map(format =>
                        format.format === 'csv'
                          ? { ...format, downloadCount: format.downloadCount + 1, lastDownloaded: new Date() }
                          : format
                      )
                    }
                  : r
              )
            }));
            
            resolve(csvBlob);
          }, 1000);
        });
      },
      
      selectReport: (report: GeneratedReport | null) => {
        set({ selectedReport: report });
      },
      
      deleteReport: (reportId: string) => {
        set((state) => ({
          generatedReports: state.generatedReports.filter(report => report.id !== reportId),
          selectedReport: state.selectedReport?.id === reportId ? null : state.selectedReport
        }));
      },
      
      scheduleReport: async (schedule: Omit<ReportSchedule, 'id' | 'createdAt'>) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const newSchedule: ReportSchedule = {
              ...schedule,
              id: `schedule-${Date.now()}`,
              createdAt: new Date()
            };
            
            set((state) => ({
              reportSchedules: [...state.reportSchedules, newSchedule]
            }));
            
            resolve(newSchedule);
          }, 500);
        });
      },
      
      updateReportSchedule: (scheduleId: string, updates: Partial<ReportSchedule>) => {
        set((state) => ({
          reportSchedules: state.reportSchedules.map(schedule =>
            schedule.id === scheduleId ? { ...schedule, ...updates } : schedule
          )
        }));
      },
      
      deleteReportSchedule: (scheduleId: string) => {
        set((state) => ({
          reportSchedules: state.reportSchedules.filter(schedule => schedule.id !== scheduleId)
        }));
      },
      
      setGeneratingReport: (generating: boolean) => {
        set({ isGeneratingReport: generating });
      }
    }),
    {
      name: 'traffic-store',
      // Only persist non-sensitive configuration data, not real-time traffic data
      partialize: (state) => ({
        // Persist user preferences, journey history, and simulation data but not live data
        metrics: state.metrics,
        userPreferences: state.userPreferences,
        multiModalJourneys: state.multiModalJourneys.slice(-10), // Keep only last 10 journeys
        trafficSimulations: state.trafficSimulations.slice(-20), // Keep last 20 simulations
        totalSimulationsRun: state.totalSimulationsRun,
        analyticsInsights: state.analyticsInsights.filter(insight => insight.acknowledged === false), // Keep unacknowledged insights
        reportTemplates: state.reportTemplates,
        generatedReports: state.generatedReports.slice(-50), // Keep last 50 reports
        reportSchedules: state.reportSchedules
      })
    }
  )
)