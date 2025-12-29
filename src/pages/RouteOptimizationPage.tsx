import React, { useState, useEffect } from 'react'
import { useTrafficStore } from '@/store/traffic-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Navigation, 
  Zap, 
  Clock, 
  Route, 
  TrendingUp, 
  Brain, 
  MapPin, 
  Fuel,
  Target,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react'

const RouteOptimizationPage: React.FC = () => {
  const {
    routes,
    routeOptimizations,
    trafficPredictions,
    selectedRoute,
    isOptimizing,
    selectRoute,
    optimizeRoute,
    generateAlternativeRoutes,
    predictTrafficCongestion
  } = useTrafficStore()

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'dijkstra' | 'a_star' | 'traffic_aware'>('traffic_aware')
  const [predictionTimeSlot, setPredictionTimeSlot] = useState('15:00-16:00')

  // Auto-select first route if none selected
  useEffect(() => {
    if (!selectedRoute && routes.length > 0) {
      selectRoute(routes[0])
    }
  }, [routes, selectedRoute, selectRoute])

  const handleOptimizeRoute = async () => {
    if (selectedRoute) {
      await optimizeRoute(selectedRoute.id, selectedAlgorithm)
    }
  }

  const handleGenerateAlternatives = async () => {
    if (selectedRoute) {
      await generateAlternativeRoutes(selectedRoute.id)
    }
  }

  const handlePredictTraffic = async () => {
    if (selectedRoute) {
      await predictTrafficCongestion(selectedRoute.id, predictionTimeSlot)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'light': return 'bg-green-500'
      case 'moderate': return 'bg-yellow-500'
      case 'heavy': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getAIScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getRecommendationBadge = (recommendation: string) => {
    const variants = {
      'highly_recommended': 'bg-green-100 text-green-800',
      'recommended': 'bg-blue-100 text-blue-800',
      'acceptable': 'bg-yellow-100 text-yellow-800',
      'not_recommended': 'bg-red-100 text-red-800'
    }
    return variants[recommendation as keyof typeof variants] || 'bg-gray-100 text-gray-800'
  }

  const selectedOptimization = routeOptimizations.find(opt => opt.routeId === selectedRoute?.id)
  const selectedPrediction = trafficPredictions.find(
    pred => pred.routeId === selectedRoute?.id && pred.timeSlot === predictionTimeSlot
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-600/20 border border-blue-500/30">
              <Brain className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">AI Route Optimization</h1>
              <p className="text-blue-200">Advanced traffic analysis and route planning</p>
            </div>
          </div>
          <Button onClick={handleOptimizeRoute} disabled={isOptimizing || !selectedRoute}>
            {isOptimizing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Optimize Route
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Route Selection Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Route className="h-5 w-5" />
                  Route Selection
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Choose a route to optimize
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {routes.map((route) => (
                  <div
                    key={route.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedRoute?.id === route.id
                        ? 'border-blue-500 bg-blue-900/30'
                        : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                    }`}
                    onClick={() => selectRoute(route)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white text-sm">{route.name}</h3>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(route.status)}`} />
                    </div>
                    <div className="space-y-1 text-xs text-slate-300">
                      <div className="flex justify-between">
                        <span>Distance:</span>
                        <span>{route.distance} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Est. Time:</span>
                        <span>{route.estimatedTime} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1">
                          <Brain className="h-3 w-3" />
                          AI Score:
                        </span>
                        <span className={`font-semibold ${getAIScoreColor(route.aiScore)}`}>
                          {route.aiScore}/100
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Algorithm Selection */}
            <Card className="bg-slate-800/50 border-slate-700 mt-4">
              <CardHeader>
                <CardTitle className="text-white text-sm">Optimization Algorithm</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedAlgorithm} onValueChange={(value: any) => setSelectedAlgorithm(value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="traffic_aware">Traffic-Aware AI</SelectItem>
                    <SelectItem value="dijkstra">Dijkstra's Algorithm</SelectItem>
                    <SelectItem value="a_star">A* Algorithm</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {selectedRoute ? (
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="bg-slate-800 border-slate-700">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="alternatives" className="data-[state=active]:bg-blue-600">
                    Alternative Routes
                  </TabsTrigger>
                  <TabsTrigger value="predictions" className="data-[state=active]:bg-blue-600">
                    Traffic Predictions
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  {/* Route Overview */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {selectedRoute.name}
                      </CardTitle>
                      <CardDescription className="text-slate-300">
                        Current route analysis and optimization status
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{selectedRoute.distance}</div>
                          <div className="text-sm text-slate-400">Kilometers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{selectedRoute.estimatedTime}</div>
                          <div className="text-sm text-slate-400">Minutes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{selectedRoute.vehicles}</div>
                          <div className="text-sm text-slate-400">Vehicles</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${getAIScoreColor(selectedRoute.aiScore)}`}>
                            {selectedRoute.aiScore}
                          </div>
                          <div className="text-sm text-slate-400">AI Score</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-slate-300">Congestion Level</span>
                            <span className="text-sm text-white">{selectedRoute.congestionLevel}%</span>
                          </div>
                          <Progress value={selectedRoute.congestionLevel} className="h-2" />
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-slate-300">Predicted Congestion</span>
                            <span className="text-sm text-white">{selectedRoute.predictedCongestion}%</span>
                          </div>
                          <Progress value={selectedRoute.predictedCongestion} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Optimization Results */}
                  {selectedOptimization && (
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Optimization Results
                        </CardTitle>
                        <CardDescription className="text-slate-300">
                          Latest optimization using {selectedOptimization.algorithm} algorithm
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">{selectedOptimization.timeSaved.toFixed(1)}</div>
                            <div className="text-sm text-slate-400">Minutes Saved</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400">{selectedOptimization.fuelSaved.toFixed(1)}</div>
                            <div className="text-sm text-slate-400">Liters Saved</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-400">{selectedOptimization.alternativeCount}</div>
                            <div className="text-sm text-slate-400">Alternatives</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-2xl font-bold ${getAIScoreColor(selectedOptimization.optimizationScore)}`}>
                              {selectedOptimization.optimizationScore}
                            </div>
                            <div className="text-sm text-slate-400">Optimization Score</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="alternatives" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Alternative Routes</h3>
                      <p className="text-sm text-slate-300">AI-generated route alternatives</p>
                    </div>
                    <Button onClick={handleGenerateAlternatives} variant="outline">
                      <Route className="h-4 w-4 mr-2" />
                      Generate Alternatives
                    </Button>
                  </div>

                  {selectedRoute.alternativeRoutes?.map((alt) => (
                    <Card key={alt.id} className="bg-slate-800/50 border-slate-700">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-white">{alt.name}</h4>
                          <Badge className={getRecommendationBadge(alt.aiRecommendation)}>
                            {alt.aiRecommendation.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-300 mb-4">{alt.reason}</p>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <div className={`font-semibold ${alt.timeSaving > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {alt.timeSaving > 0 ? '+' : ''}{alt.timeSaving} min
                            </div>
                            <div className="text-slate-400">Time Difference</div>
                          </div>
                          <div className="text-center">
                            <div className={`font-semibold ${alt.distanceDiff < 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {alt.distanceDiff > 0 ? '+' : ''}{alt.distanceDiff} km
                            </div>
                            <div className="text-slate-400">Distance Difference</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-white">{alt.congestionLevel}%</div>
                            <div className="text-slate-400">Congestion</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )) || (
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardContent className="pt-6 text-center">
                        <p className="text-slate-400">No alternative routes generated yet.</p>
                        <p className="text-sm text-slate-500 mt-1">Click "Generate Alternatives" to see options.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="predictions" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Traffic Predictions</h3>
                      <p className="text-sm text-slate-300">AI-powered congestion forecasting</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={predictionTimeSlot} onValueChange={setPredictionTimeSlot}>
                        <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="14:00-15:00">14:00-15:00</SelectItem>
                          <SelectItem value="15:00-16:00">15:00-16:00</SelectItem>
                          <SelectItem value="16:00-17:00">16:00-17:00</SelectItem>
                          <SelectItem value="17:00-18:00">17:00-18:00</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={handlePredictTraffic} variant="outline">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Predict
                      </Button>
                    </div>
                  </div>

                  {selectedPrediction ? (
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          Prediction for {selectedPrediction.timeSlot}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-6 mb-6">
                          <div>
                            <div className="text-3xl font-bold text-white mb-2">
                              {selectedPrediction.predictedCongestion}%
                            </div>
                            <div className="text-sm text-slate-300 mb-3">Predicted Congestion</div>
                            <Progress value={selectedPrediction.predictedCongestion} className="h-3" />
                          </div>
                          <div>
                            <div className="text-3xl font-bold text-blue-400 mb-2">
                              {(selectedPrediction.confidence * 100).toFixed(0)}%
                            </div>
                            <div className="text-sm text-slate-300 mb-3">Confidence Level</div>
                            <Progress value={selectedPrediction.confidence * 100} className="h-3" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-3">Prediction Factors</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedPrediction.factors.map((factor, index) => (
                              <Badge key={index} variant="secondary" className="bg-slate-700 text-slate-200">
                                {factor}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardContent className="pt-6 text-center">
                        <p className="text-slate-400">No prediction available for this time slot.</p>
                        <p className="text-sm text-slate-500 mt-1">Select a time slot and click "Predict" to see forecast.</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6 text-center">
                  <p className="text-slate-400">Select a route to view optimization options.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RouteOptimizationPage