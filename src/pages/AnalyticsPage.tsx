import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  BarChart3, 
  TrendingUp, 
  Zap, 
  AlertTriangle, 
  PlayCircle, 
  Pause, 
  Download, 
  Trash2,
  Plus,
  ChevronRight,
  Home,
  Activity,
  Target,
  Brain,
  CheckCircle2,
  Clock,
  DollarSign,
  Lightbulb,
  Settings,
  Layers,
  Bus,
  Car,
  Construction,
  X
} from 'lucide-react'
import { useTrafficStore } from '@/store/traffic-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { TrafficSimulation, SimulationParameters, AnalyticsInsight, PredictiveModel } from '@/store/traffic-store'

export default function AnalyticsPage() {
  const { toast } = useToast()
  const [selectedTab, setSelectedTab] = useState<'simulations' | 'insights' | 'models'>('simulations')
  const [showCreateSimulation, setShowCreateSimulation] = useState(false)
  const [showSimulationDetails, setShowSimulationDetails] = useState<string | null>(null)
  const [simulationForm, setSimulationForm] = useState({
    name: '',
    description: '',
    simulationType: 'infrastructure_impact' as const,
    timeHorizon: 24,
    vehicleDensity: 'medium' as const,
    weatherConditions: 'clear' as const,
    incidentProbability: 0.1,
    trafficPatterns: 'normal' as const,
    // Infrastructure variables
    busCount: 50,
    carCount: 1000,
    newRoads: 0,
    newBridges: 0,
    newFlyovers: 0,
    signalOptimization: false,
    emergencyLanes: false,
    smartTrafficLights: false,
    // Cost analysis
    budgetLimit: 100000000, // 100M default
    implementationTimeMonths: 12
  })
  
  const {
    trafficSimulations,
    analyticsInsights,
    predictiveModels,
    selectedSimulation,
    simulationResults,
    activeSimulations,
    totalSimulationsRun,
    isSimulating,
    runSimulation,
    selectSimulation,
    deleteSimulation,
    createSimulation,
    acknowledgeInsight,
    exportSimulationData,
    generateAnalyticsInsights
  } = useTrafficStore()

  useEffect(() => {
    // Generate fresh insights on page load
    const newInsights = generateAnalyticsInsights()
    if (newInsights.length > 0) {
      toast({
        title: "New Insights Generated",
        description: `Found ${newInsights.length} new analytics insights`,
      })
    }
  }, [])

  const handleRunSimulation = async (simulationId: string) => {
    try {
      toast({
        title: "Simulation Started",
        description: "Running traffic simulation with AI analysis...",
      })
      await runSimulation(simulationId)
      toast({
        title: "Simulation Complete",
        description: "Traffic simulation completed successfully with recommendations",
      })
    } catch (error) {
      toast({
        title: "Simulation Failed",
        description: "Failed to complete simulation. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCreateSimulation = async (params: Partial<SimulationParameters>) => {
    const newSimulation = {
      name: simulationForm.name || "Infrastructure Impact Analysis",
      description: simulationForm.description || "Custom infrastructure project simulation",
      simulationType: 'infrastructure_impact' as const,
      duration: 0,
      parameters: {
        timeHorizon: simulationForm.timeHorizon,
        vehicleDensity: simulationForm.vehicleDensity,
        weatherConditions: simulationForm.weatherConditions,
        incidentProbability: simulationForm.incidentProbability,
        trafficPatterns: simulationForm.trafficPatterns,
        infrastructureChanges: params.infrastructureChanges || [],
        emergencyScenarios: params.emergencyScenarios || [],
        // Additional metadata for cost analysis
        budgetLimit: simulationForm.budgetLimit,
        implementationTimeMonths: simulationForm.implementationTimeMonths,
        busCount: simulationForm.busCount,
        carCount: simulationForm.carCount,
        ...params
      }
    }
    
    try {
      await createSimulation(newSimulation)
      setShowCreateSimulation(false)
      
      // Reset form
      setSimulationForm({
        name: '',
        description: '',
        simulationType: 'infrastructure_impact' as const,
        timeHorizon: 24,
        vehicleDensity: 'medium' as const,
        weatherConditions: 'clear' as const,
        incidentProbability: 0.1,
        trafficPatterns: 'normal' as const,
        busCount: 50,
        carCount: 1000,
        newRoads: 0,
        newBridges: 0,
        newFlyovers: 0,
        signalOptimization: false,
        emergencyLanes: false,
        smartTrafficLights: false,
        budgetLimit: 100000000,
        implementationTimeMonths: 12
      })
      
      toast({
        title: "Infrastructure Simulation Created",
        description: `Simulating impact of ${params.infrastructureChanges?.length || 0} infrastructure changes with ${simulationForm.busCount} buses and ${simulationForm.carCount.toLocaleString()} vehicles`,
      })
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create simulation. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleExportData = async (simulationId: string) => {
    try {
      const blob = await exportSimulationData(simulationId)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `simulation-${simulationId}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast({
        title: "Export Successful",
        description: "Simulation data exported successfully",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export simulation data",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status: TrafficSimulation['status']) => {
    switch (status) {
      case 'running': return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors">
                <Home className="h-5 w-5" />
                <span className="font-medium">Home</span>
              </Link>
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-slate-900">Advanced Analytics & Simulation</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-sm">
                <Activity className="h-3 w-3 mr-1" />
                {activeSimulations} Active
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <Target className="h-3 w-3 mr-1" />
                {totalSimulationsRun} Total Runs
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Simulations</p>
                  <p className="text-3xl font-bold text-slate-900">{activeSimulations}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <PlayCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Simulations</p>
                  <p className="text-3xl font-bold text-slate-900">{totalSimulationsRun}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">AI Models</p>
                  <p className="text-3xl font-bold text-slate-900">{predictiveModels.length}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Brain className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Insights</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {analyticsInsights.filter(i => !i.acknowledged).length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'simulations', label: 'Traffic Simulations', icon: BarChart3 },
                { id: 'insights', label: 'Analytics Insights', icon: Lightbulb },
                { id: 'models', label: 'Predictive Models', icon: Brain }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      selectedTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {selectedTab === 'simulations' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-900">Infrastructure Project Simulations</h2>
              <Button onClick={() => setShowCreateSimulation(true)}>
                <Construction className="h-4 w-4 mr-2" />
                New Infrastructure Simulation
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {trafficSimulations.map((simulation) => (
                <Card key={simulation.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center space-x-2">
                          {getStatusIcon(simulation.status)}
                          <span>{simulation.name}</span>
                        </CardTitle>
                        <CardDescription className="mt-1">{simulation.description}</CardDescription>
                      </div>
                      <Badge variant={simulation.status === 'completed' ? 'default' : 'secondary'}>
                        {simulation.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {simulation.status === 'running' && (
                        <div>
                          <div className="flex justify-between text-sm text-slate-600 mb-2">
                            <span>Progress</span>
                            <span>{simulation.progress}%</span>
                          </div>
                          <Progress value={simulation.progress} className="h-2" />
                        </div>
                      )}
                      
                      {simulation.results && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium text-slate-900">Overall Score</p>
                              <p className="text-2xl font-bold text-blue-600">
                                {simulation.results.overallScore.toFixed(0)}%
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">ROI Projection</p>
                              <p className="text-2xl font-bold text-green-600">
                                {simulation.results.infrastructureImpact.roiProjection.toFixed(0)}%
                              </p>
                            </div>
                          </div>
                          
                          {/* Enhanced Infrastructure Impact Metrics */}
                          <div className="pt-2 border-t border-slate-100 space-y-3">
                            <h4 className="text-sm font-medium text-slate-700">Infrastructure Impact Analysis</h4>
                            
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-600">Bus System Efficiency</span>
                                <span className="font-medium text-green-600">
                                  {simulation.results.infrastructureImpact.busSystemEfficiency?.toFixed(0) || 'N/A'}%
                                </span>
                              </div>
                              
                              <div className="flex justify-between">
                                <span className="text-slate-600">Road Network Improvement</span>
                                <span className="font-medium text-blue-600">
                                  {simulation.results.infrastructureImpact.roadNetworkImprovement?.toFixed(0) || 'N/A'}%
                                </span>
                              </div>
                              
                              <div className="flex justify-between">
                                <span className="text-slate-600">Signal Optimization</span>
                                <span className="font-medium text-purple-600">
                                  {simulation.results.infrastructureImpact.signalSystemOptimization?.toFixed(0) || 'N/A'}%
                                </span>
                              </div>
                              
                              <div className="flex justify-between">
                                <span className="text-slate-600">Emergency Response</span>
                                <span className="font-medium text-red-600">
                                  {simulation.results.infrastructureImpact.emergencyResponseImprovement?.toFixed(0) || 'N/A'}%
                                </span>
                              </div>
                              
                              <div className="flex justify-between">
                                <span className="text-slate-600">Air Quality Improvement</span>
                                <span className="font-medium text-green-600">
                                  {simulation.results.infrastructureImpact.airQualityImprovement?.toFixed(0) || 'N/A'}%
                                </span>
                              </div>
                              
                              <div className="flex justify-between">
                                <span className="text-slate-600">Public Transport Adoption</span>
                                <span className="font-medium text-blue-600">
                                  +{simulation.results.infrastructureImpact.publicTransportAdoption?.toFixed(0) || 'N/A'}%
                                </span>
                              </div>
                            </div>
                            
                            <div className="pt-2 border-t border-slate-50">
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Payback Period</span>
                                <span className="font-medium text-slate-900">
                                  {simulation.results.infrastructureImpact.paybackPeriod.toFixed(1)} years
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="text-xs text-slate-500">
                          Created {simulation.createdAt.toLocaleDateString()}
                        </div>
                        <div className="flex items-center space-x-2">
                          {simulation.status === 'queued' && (
                            <Button
                              size="sm"
                              onClick={() => handleRunSimulation(simulation.id)}
                              disabled={isSimulating}
                            >
                              <PlayCircle className="h-3 w-3 mr-1" />
                              Run
                            </Button>
                          )}
                          
                          {simulation.status === 'completed' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowSimulationDetails(simulation.id)}
                              >
                                <BarChart3 className="h-3 w-3 mr-1" />
                                View Results
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleExportData(simulation.id)}
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteSimulation(simulation.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'insights' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-900">Analytics Insights</h2>
            
            <div className="space-y-4">
              {analyticsInsights.map((insight) => (
                <Card key={insight.id} className={`${!insight.acknowledged ? 'border-orange-200 bg-orange-50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge 
                            variant={
                              insight.severity === 'critical' ? 'destructive' :
                              insight.severity === 'high' ? 'default' :
                              'secondary'
                            }
                          >
                            {insight.severity}
                          </Badge>
                          <Badge variant="outline">{insight.type}</Badge>
                        </div>
                        
                        <h3 className="font-semibold text-slate-900 mb-2">{insight.title}</h3>
                        <p className="text-slate-600 mb-4">{insight.description}</p>
                        
                        <div className="text-sm text-slate-500">
                          Detected {insight.detectedAt.toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {insight.actionRequired && (
                          <Badge variant="destructive">Action Required</Badge>
                        )}
                        {!insight.acknowledged && (
                          <Button
                            size="sm"
                            onClick={() => acknowledgeInsight(insight.id)}
                          >
                            Acknowledge
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'models' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-900">Predictive Models</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {predictiveModels.map((model) => (
                <Card key={model.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{model.name}</span>
                      <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
                        {model.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Type: {model.type.replace(/_/g, ' ')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-600">Accuracy</span>
                        <span className="text-lg font-bold text-green-600">{model.accuracy}%</span>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-slate-600">Last Training</span>
                        <p className="text-slate-900">{model.lastTrainingDate.toLocaleDateString()}</p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-slate-600">Recent Predictions</span>
                        <p className="text-slate-900">{model.predictions.length} active</p>
                      </div>
                      
                      {model.predictions.length > 0 && (
                        <div className="pt-4 border-t border-slate-100">
                          <h4 className="font-medium text-slate-900 mb-2">Latest Prediction</h4>
                          <div className="text-sm space-y-1">
                            <p><span className="font-medium">Confidence:</span> {(model.predictions[0].confidence * 100).toFixed(0)}%</p>
                            <p><span className="font-medium">Value:</span> {model.predictions[0].predictedValue}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Infrastructure Simulation Creation Modal */}
      {showCreateSimulation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Construction className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-slate-900">Create Infrastructure Project Simulation</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateSimulation(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-slate-600 mt-2">
                Model the impact of hypothetical infrastructure projects with variable controls
              </p>
            </div>

            <div className="p-6 space-y-8">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-900 flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-blue-600" />
                  Basic Configuration
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sim-name">Simulation Name</Label>
                    <Input
                      id="sim-name"
                      value={simulationForm.name}
                      onChange={(e) => setSimulationForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Metro Line Extension Impact"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time-horizon">Time Horizon (hours)</Label>
                    <Input
                      id="time-horizon"
                      type="number"
                      value={simulationForm.timeHorizon}
                      onChange={(e) => setSimulationForm(prev => ({ ...prev, timeHorizon: parseInt(e.target.value) || 24 }))}
                      min="1"
                      max="168"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    value={simulationForm.description}
                    onChange={(e) => setSimulationForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the infrastructure project and its expected impact..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Vehicle Variables */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-900 flex items-center">
                  <Bus className="h-5 w-5 mr-2 text-green-600" />
                  Transport Variables
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Bus Fleet Size: {simulationForm.busCount} buses</Label>
                      <Slider
                        value={[simulationForm.busCount]}
                        onValueChange={(value) => setSimulationForm(prev => ({ ...prev, busCount: value[0] }))}
                        max={200}
                        min={10}
                        step={5}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>10 buses</span>
                        <span>200 buses</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Private Vehicle Count: {simulationForm.carCount.toLocaleString()} cars</Label>
                      <Slider
                        value={[simulationForm.carCount]}
                        onValueChange={(value) => setSimulationForm(prev => ({ ...prev, carCount: value[0] }))}
                        max={5000}
                        min={100}
                        step={50}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>100 cars</span>
                        <span>5,000 cars</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Vehicle Density Pattern</Label>
                      <Select 
                        value={simulationForm.vehicleDensity} 
                        onValueChange={(value: any) => setSimulationForm(prev => ({ ...prev, vehicleDensity: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Density (Rural)</SelectItem>
                          <SelectItem value="medium">Medium Density (Urban)</SelectItem>
                          <SelectItem value="high">High Density (Metropolitan)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Traffic Patterns</Label>
                      <Select 
                        value={simulationForm.trafficPatterns} 
                        onValueChange={(value: any) => setSimulationForm(prev => ({ ...prev, trafficPatterns: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal Flow</SelectItem>
                          <SelectItem value="rush_hour">Rush Hour Peak</SelectItem>
                          <SelectItem value="weekend">Weekend Light</SelectItem>
                          <SelectItem value="event">Special Event</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Infrastructure Projects */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-900 flex items-center">
                  <Layers className="h-5 w-5 mr-2 text-purple-600" />
                  Infrastructure Projects
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">New Roads: {simulationForm.newRoads}</Label>
                      <Slider
                        value={[simulationForm.newRoads]}
                        onValueChange={(value) => setSimulationForm(prev => ({ ...prev, newRoads: value[0] }))}
                        max={10}
                        min={0}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium">New Bridges: {simulationForm.newBridges}</Label>
                      <Slider
                        value={[simulationForm.newBridges]}
                        onValueChange={(value) => setSimulationForm(prev => ({ ...prev, newBridges: value[0] }))}
                        max={5}
                        min={0}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium">New Flyovers: {simulationForm.newFlyovers}</Label>
                      <Slider
                        value={[simulationForm.newFlyovers]}
                        onValueChange={(value) => setSimulationForm(prev => ({ ...prev, newFlyovers: value[0] }))}
                        max={8}
                        min={0}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Signal Optimization</Label>
                      <Switch
                        checked={simulationForm.signalOptimization}
                        onCheckedChange={(checked) => setSimulationForm(prev => ({ ...prev, signalOptimization: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Emergency Lanes</Label>
                      <Switch
                        checked={simulationForm.emergencyLanes}
                        onCheckedChange={(checked) => setSimulationForm(prev => ({ ...prev, emergencyLanes: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Smart Traffic Lights</Label>
                      <Switch
                        checked={simulationForm.smartTrafficLights}
                        onCheckedChange={(checked) => setSimulationForm(prev => ({ ...prev, smartTrafficLights: checked }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Weather Conditions</Label>
                      <Select 
                        value={simulationForm.weatherConditions} 
                        onValueChange={(value: any) => setSimulationForm(prev => ({ ...prev, weatherConditions: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clear">Clear Weather</SelectItem>
                          <SelectItem value="rain">Rainy Conditions</SelectItem>
                          <SelectItem value="fog">Foggy Weather</SelectItem>
                          <SelectItem value="storm">Storm Conditions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Incident Probability: {(simulationForm.incidentProbability * 100).toFixed(0)}%</Label>
                      <Slider
                        value={[simulationForm.incidentProbability * 100]}
                        onValueChange={(value) => setSimulationForm(prev => ({ ...prev, incidentProbability: value[0] / 100 }))}
                        max={30}
                        min={0}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost Analysis */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-900 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                  Project Economics
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Limit (₹)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={simulationForm.budgetLimit}
                      onChange={(e) => setSimulationForm(prev => ({ ...prev, budgetLimit: parseInt(e.target.value) || 100000000 }))}
                      placeholder="100000000"
                    />
                    <p className="text-xs text-slate-500">₹{simulationForm.budgetLimit.toLocaleString()} ({(simulationForm.budgetLimit / 10000000).toFixed(1)} Crores)</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="implementation-time">Implementation Time (months)</Label>
                    <Input
                      id="implementation-time"
                      type="number"
                      value={simulationForm.implementationTimeMonths}
                      onChange={(e) => setSimulationForm(prev => ({ ...prev, implementationTimeMonths: parseInt(e.target.value) || 12 }))}
                      min="1"
                      max="60"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateSimulation(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleCreateSimulation({
                    timeHorizon: simulationForm.timeHorizon,
                    vehicleDensity: simulationForm.vehicleDensity,
                    weatherConditions: simulationForm.weatherConditions,
                    incidentProbability: simulationForm.incidentProbability,
                    trafficPatterns: simulationForm.trafficPatterns,
                    infrastructureChanges: [
                      ...(simulationForm.newRoads > 0 ? [`${simulationForm.newRoads} new roads`] : []),
                      ...(simulationForm.newBridges > 0 ? [`${simulationForm.newBridges} new bridges`] : []),
                      ...(simulationForm.newFlyovers > 0 ? [`${simulationForm.newFlyovers} new flyovers`] : []),
                      ...(simulationForm.signalOptimization ? ['signal optimization'] : []),
                      ...(simulationForm.emergencyLanes ? ['emergency lanes'] : []),
                      ...(simulationForm.smartTrafficLights ? ['smart traffic lights'] : []),
                      `${simulationForm.busCount} buses`,
                      `${simulationForm.carCount} private vehicles`
                    ],
                    emergencyScenarios: []
                  })}
                  disabled={!simulationForm.name || !simulationForm.description}
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Create & Run Simulation
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Simulation Results Modal */}
      {showSimulationDetails && (() => {
        const simulation = trafficSimulations.find(s => s.id === showSimulationDetails)
        if (!simulation || !simulation.results) return null
        
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">{simulation.name}</h2>
                      <p className="text-slate-600">{simulation.description}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSimulationDetails(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* Key Performance Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {simulation.results.overallScore.toFixed(0)}%
                      </div>
                      <p className="text-sm font-medium text-slate-600">Overall Score</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {simulation.results.infrastructureImpact.roiProjection.toFixed(0)}%
                      </div>
                      <p className="text-sm font-medium text-slate-600">ROI Projection</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {simulation.results.infrastructureImpact.paybackPeriod.toFixed(1)}
                      </div>
                      <p className="text-sm font-medium text-slate-600">Payback Years</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-2">
                        {simulation.results.infrastructureImpact.sustainabilityScore.toFixed(0)}
                      </div>
                      <p className="text-sm font-medium text-slate-600">Sustainability Score</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Traffic Flow Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                      Traffic Flow Impact Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Average Speed Improvement</span>
                          <span className="font-medium">{simulation.results.trafficFlowMetrics.averageSpeed.toFixed(0)} km/h</span>
                        </div>
                        <Progress value={simulation.results.trafficFlowMetrics.averageSpeed} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Congestion Reduction</span>
                          <span className="font-medium text-green-600">-{simulation.results.trafficFlowMetrics.congestionReduction.toFixed(0)}%</span>
                        </div>
                        <Progress value={simulation.results.trafficFlowMetrics.congestionReduction} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Travel Time Reduction</span>
                          <span className="font-medium text-blue-600">-{simulation.results.trafficFlowMetrics.travelTimeReduction.toFixed(0)}%</span>
                        </div>
                        <Progress value={simulation.results.trafficFlowMetrics.travelTimeReduction} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Fuel Savings</span>
                          <span className="font-medium text-green-600">{simulation.results.trafficFlowMetrics.fuelSavings.toFixed(0)}%</span>
                        </div>
                        <Progress value={simulation.results.trafficFlowMetrics.fuelSavings} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Emission Reduction</span>
                          <span className="font-medium text-green-600">-{simulation.results.trafficFlowMetrics.emissionReduction.toFixed(0)}%</span>
                        </div>
                        <Progress value={simulation.results.trafficFlowMetrics.emissionReduction} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Infrastructure Impact */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Construction className="h-5 w-5 mr-2 text-purple-600" />
                      Infrastructure Impact Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Bus System Efficiency</span>
                          <span className="font-medium text-green-600">{simulation.results.infrastructureImpact.busSystemEfficiency?.toFixed(0) || 'N/A'}%</span>
                        </div>
                        <Progress value={simulation.results.infrastructureImpact.busSystemEfficiency || 0} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Vehicle Capacity Utilization</span>
                          <span className="font-medium text-blue-600">{simulation.results.infrastructureImpact.vehicleCapacityUtilization?.toFixed(0) || 'N/A'}%</span>
                        </div>
                        <Progress value={simulation.results.infrastructureImpact.vehicleCapacityUtilization || 0} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Road Network Improvement</span>
                          <span className="font-medium text-purple-600">{simulation.results.infrastructureImpact.roadNetworkImprovement?.toFixed(0) || 'N/A'}%</span>
                        </div>
                        <Progress value={simulation.results.infrastructureImpact.roadNetworkImprovement || 0} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Signal System Optimization</span>
                          <span className="font-medium text-orange-600">{simulation.results.infrastructureImpact.signalSystemOptimization?.toFixed(0) || 'N/A'}%</span>
                        </div>
                        <Progress value={simulation.results.infrastructureImpact.signalSystemOptimization || 0} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Emergency Response Improvement</span>
                          <span className="font-medium text-red-600">{simulation.results.infrastructureImpact.emergencyResponseImprovement?.toFixed(0) || 'N/A'}%</span>
                        </div>
                        <Progress value={simulation.results.infrastructureImpact.emergencyResponseImprovement || 0} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Air Quality Improvement</span>
                          <span className="font-medium text-green-600">{simulation.results.infrastructureImpact.airQualityImprovement?.toFixed(0) || 'N/A'}%</span>
                        </div>
                        <Progress value={simulation.results.infrastructureImpact.airQualityImprovement || 0} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Response Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                      Emergency Response Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600 mb-1">
                          {simulation.results.emergencyResponseMetrics.averageResponseTime.toFixed(1)}m
                        </div>
                        <p className="text-sm text-slate-600">Avg Response Time</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {simulation.results.emergencyResponseMetrics.responseTimeImprovement.toFixed(0)}%
                        </div>
                        <p className="text-sm text-slate-600">Time Improvement</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {simulation.results.emergencyResponseMetrics.successfulCorridors}
                        </div>
                        <p className="text-sm text-slate-600">Successful Corridors</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 mb-1">
                          {simulation.results.emergencyResponseMetrics.signalOverrideEfficiency.toFixed(0)}%
                        </div>
                        <p className="text-sm text-slate-600">Signal Override Efficiency</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                {simulation.results.recommendations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Lightbulb className="h-5 w-5 mr-2 text-orange-600" />
                        AI Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {simulation.results.recommendations.map((rec) => (
                          <div key={rec.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-slate-900">{rec.title}</h4>
                              <div className="flex items-center space-x-2">
                                <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}>
                                  {rec.priority}
                                </Badge>
                                <Badge variant="outline">{rec.type}</Badge>
                              </div>
                            </div>
                            <p className="text-slate-600 text-sm mb-3">{rec.description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-slate-700">Expected Benefit:</span>
                                <p className="text-green-600">{rec.expectedBenefit}</p>
                              </div>
                              <div>
                                <span className="font-medium text-slate-700">Implementation Cost:</span>
                                <p className="text-slate-900">₹{(rec.implementationCost * 10).toFixed(0)}M</p>
                              </div>
                              <div>
                                <span className="font-medium text-slate-700">Timeframe:</span>
                                <p className="text-blue-600">{rec.timeframe.replace('_', ' ')}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
                  <Button
                    variant="outline"
                    onClick={() => handleExportData(simulation.id)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Results
                  </Button>
                  <Button
                    onClick={() => setShowSimulationDetails(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}