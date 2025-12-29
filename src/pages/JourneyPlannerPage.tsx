import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { useTrafficStore } from '@/store/traffic-store'
import { 
  MapPin, 
  Navigation, 
  Clock, 
  DollarSign, 
  Leaf, 
  Users, 
  Route,
  Car,
  Train,
  Bus,
  Bike,
  PersonStanding,
  Zap,
  ArrowRight,
  Star,
  Heart,
  Settings,
  Target,
  TrendingUp
} from 'lucide-react'

export default function JourneyPlannerPage() {
  const { toast } = useToast()
  const {
    transportModes,
    multiModalJourneys,
    userPreferences,
    selectedJourney,
    lastMileOptions,
    transitHubs,
    journeyPlanningActive,
    planMultiModalJourney,
    selectJourney,
    updateUserPreferences,
    findLastMileOptions,
    getNearbyTransitHubs,
    optimizeJourneyForPreferences,
    setJourneyPlanningActive
  } = useTrafficStore()

  const [startLocation, setStartLocation] = useState('')
  const [endLocation, setEndLocation] = useState('')
  const [plannedJourneys, setPlannedJourneys] = useState(multiModalJourneys.slice(-3))
  const [showPreferences, setShowPreferences] = useState(false)

  const getTransportIcon = (type: string) => {
    const icons = {
      car: Car,
      metro: Train,
      bus: Bus,
      bike: Bike,
      walk: PersonStanding,
      scooter: Zap,
      rickshaw: Car
    }
    return icons[type as keyof typeof icons] || Car
  }

  const handlePlanJourney = async () => {
    if (!startLocation || !endLocation) {
      toast({
        title: "Missing Information",
        description: "Please enter both start and end locations",
        variant: "destructive"
      })
      return
    }

    try {
      // Mock coordinates based on location names
      const startCoords = { lat: 43.6532, lng: -79.3832 }
      const endCoords = { lat: 43.6629, lng: -79.3957 }
      
      const journeys = await planMultiModalJourney(startCoords, endCoords)
      setPlannedJourneys(journeys)
      
      toast({
        title: "Journey Planning Complete",
        description: `Found ${journeys.length} optimized journey options`,
      })
    } catch (error) {
      toast({
        title: "Planning Failed",
        description: "Unable to plan journey. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleSelectJourney = (journey: any) => {
    selectJourney(journey)
    toast({
      title: "Journey Selected",
      description: `Selected ${journey.segments.length}-segment journey`,
    })
  }

  const handleOptimizeJourney = async (journeyId: string) => {
    try {
      await optimizeJourneyForPreferences(journeyId)
      toast({
        title: "Journey Optimized",
        description: "Journey has been optimized based on your preferences",
      })
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: "Unable to optimize journey. Please try again.",
        variant: "destructive"
      })
    }
  }

  const updatePreference = (key: string, value: any) => {
    updateUserPreferences({ [key]: value })
    toast({
      title: "Preferences Updated",
      description: "Your journey preferences have been saved",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white">
              <Route className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Multi-Modal Journey Planner</h1>
              <p className="text-gray-600 text-lg">Plan integrated journeys with last-mile connectivity</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Journey Planning Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Journey Input */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="w-5 h-5" />
                  Plan Your Journey
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Enter your start and destination points
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="start" className="text-sm font-medium">From</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-green-600" />
                      <Input
                        id="start"
                        placeholder="Enter starting location"
                        value={startLocation}
                        onChange={(e) => setStartLocation(e.target.value)}
                        className="pl-10 border-green-200 focus:border-green-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end" className="text-sm font-medium">To</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-red-600" />
                      <Input
                        id="end"
                        placeholder="Enter destination"
                        value={endLocation}
                        onChange={(e) => setEndLocation(e.target.value)}
                        className="pl-10 border-red-200 focus:border-red-400"
                      />
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={handlePlanJourney}
                  disabled={journeyPlanningActive}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {journeyPlanningActive ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Planning Journey...
                    </>
                  ) : (
                    <>
                      <Route className="w-4 h-4 mr-2" />
                      Plan Multi-Modal Journey
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Journey Options */}
            {plannedJourneys.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Journey Options
                  </CardTitle>
                  <CardDescription>
                    Choose from {plannedJourneys.length} optimized journey options
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {plannedJourneys.map((journey, index) => (
                      <div key={journey.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              Option {index + 1}
                            </Badge>
                            {journey.userPreferencesApplied && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <Star className="w-3 h-3 mr-1" />
                                Personalized
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOptimizeJourney(journey.id)}
                            >
                              <TrendingUp className="w-4 h-4 mr-1" />
                              Optimize
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleSelectJourney(journey)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Select
                            </Button>
                          </div>
                        </div>

                        {/* Journey Segments */}
                        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                          {journey.segments.map((segment, segIndex) => {
                            const IconComponent = getTransportIcon(segment.mode.type)
                            return (
                              <React.Fragment key={segment.id}>
                                <div className="flex flex-col items-center min-w-[80px]">
                                  <div 
                                    className="p-2 rounded-full text-white mb-1"
                                    style={{ backgroundColor: segment.mode.color }}
                                  >
                                    <IconComponent className="w-4 h-4" />
                                  </div>
                                  <span className="text-xs text-center font-medium">
                                    {segment.mode.name}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {Math.round(segment.duration)}min
                                  </span>
                                </div>
                                {segIndex < journey.segments.length - 1 && (
                                  <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                )}
                              </React.Fragment>
                            )
                          })}
                        </div>

                        {/* Journey Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span>{Math.round(journey.totalDuration)} min</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span>${journey.totalCost.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Leaf className="w-4 h-4 text-emerald-600" />
                            <span>{journey.totalCarbonEmission.toFixed(1)}kg CO₂</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-purple-600" />
                            <span>{Math.round(journey.comfortScore)}% comfort</span>
                          </div>
                        </div>

                        {/* Performance Scores */}
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Reliability Score</span>
                            <span className="font-medium">{Math.round(journey.reliabilityScore)}%</span>
                          </div>
                          <Progress value={journey.reliabilityScore} className="h-2" />
                          
                          <div className="flex items-center justify-between text-sm">
                            <span>Sustainability Score</span>
                            <span className="font-medium">{Math.round(journey.sustainabilityScore)}%</span>
                          </div>
                          <Progress value={journey.sustainabilityScore} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* User Preferences */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-600" />
                  Journey Preferences
                </CardTitle>
                <CardDescription>
                  Customize your travel preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="priorities" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="priorities">Priorities</TabsTrigger>
                    <TabsTrigger value="modes">Modes</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="priorities" className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Time Priority</span>
                          <span>{userPreferences.priorityWeights.time}%</span>
                        </div>
                        <Progress value={userPreferences.priorityWeights.time} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Cost Priority</span>
                          <span>{userPreferences.priorityWeights.cost}%</span>
                        </div>
                        <Progress value={userPreferences.priorityWeights.cost} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Comfort Priority</span>
                          <span>{userPreferences.priorityWeights.comfort}%</span>
                        </div>
                        <Progress value={userPreferences.priorityWeights.comfort} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Sustainability Priority</span>
                          <span>{userPreferences.priorityWeights.sustainability}%</span>
                        </div>
                        <Progress value={userPreferences.priorityWeights.sustainability} className="h-2" />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="modes" className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Preferred Transport Modes</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {transportModes.slice(0, 6).map((mode) => {
                            const IconComponent = getTransportIcon(mode.type)
                            const isPreferred = userPreferences.preferredModes.includes(mode.id)
                            return (
                              <Button
                                key={mode.id}
                                variant="outline"
                                size="sm"
                                className={`justify-start ${isPreferred ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}`}
                                onClick={() => {
                                  const newPreferred = isPreferred
                                    ? userPreferences.preferredModes.filter(id => id !== mode.id)
                                    : [...userPreferences.preferredModes, mode.id]
                                  updatePreference('preferredModes', newPreferred)
                                }}
                              >
                                <IconComponent className="w-4 h-4 mr-2" />
                                {mode.name}
                              </Button>
                            )
                          })}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <Label className="text-sm font-medium">Max Walking Distance</Label>
                        <p className="text-sm text-gray-600">{userPreferences.maxWalkingDistance} km</p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Max Transfers</Label>
                        <p className="text-sm text-gray-600">{userPreferences.maxTransfers}</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Last-Mile Options */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-600" />
                  Last-Mile Options
                </CardTitle>
                <CardDescription>
                  Available connectivity solutions
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {lastMileOptions.slice(0, 3).map((option) => (
                    <div key={option.id} className="p-3 border rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div 
                          className="p-2 rounded-full text-white"
                          style={{ backgroundColor: option.color }}
                        >
                          <div className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{option.name}</h4>
                          <p className="text-xs text-gray-600">
                            ${option.costPerMinute.toFixed(2)}/min • {option.maxDistance}km range
                          </p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            option.availability === 'high' 
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : option.availability === 'medium'
                              ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          {option.availability}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        {option.nearbyStations.length} stations nearby
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}