import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  MapPin, 
  Navigation, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  BarChart3,
  Car,
  Truck,
  Bus,
  Bike,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Brain,
  Ambulance,
  Route,
  FileText
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTrafficStore } from '@/store/traffic-store'

const vehicleTypeIcons = {
  'Cars': Car,
  'Trucks': Truck,
  'Buses': Bus,
  'Bikes': Bike
}

function DashboardPage() {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())
  const { 
    routes, 
    emergencyVehicles, 
    vehicleCounts, 
    metrics, 
    isLoading, 
    lastUpdated,
    refreshData 
  } = useTrafficStore()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'heavy': return 'destructive'
      case 'moderate': return 'default'
      case 'light': return 'secondary'
      default: return 'default'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'heavy': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'moderate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'light': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      default: return ''
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-500" />
      case 'down': return <TrendingDown className="w-4 h-4 text-green-500" />
      case 'stable': return <Minus className="w-4 h-4 text-muted-foreground" />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Navigation className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold">TrafficFlow Pro</h1>
              </div>
              <Badge variant="outline" className="ml-4">
                Live Dashboard
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 inline mr-1" />
                  {currentTime.toLocaleTimeString()}
                </div>
                {lastUpdated && (
                  <div className="text-xs text-muted-foreground">
                    Updated: {lastUpdated.toLocaleTimeString()}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => navigate('/optimization')}
                  className="gap-2"
                >
                  <Brain className="w-4 h-4" />
                  AI Optimizer
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => navigate('/emergency')}
                  className="gap-2"
                >
                  <Ambulance className="w-4 h-4" />
                  Emergency
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => navigate('/journey-planner')}
                  className="gap-2"
                >
                  <Route className="w-4 h-4" />
                  Journey Planner
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => navigate('/analytics')}
                  className="gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => navigate('/reports')}
                  className="gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Reports
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={refreshData}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button size="sm">
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
              <MapPin className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalRoutes}</div>
              <p className="text-xs text-muted-foreground">+3% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
              <Car className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalVehicles.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">-2% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Speed</CardTitle>
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.avgSpeed} km/h</div>
              <p className="text-xs text-green-600">+5% improvement</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Emergency Active</CardTitle>
              <AlertTriangle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{metrics.emergencyActive}</div>
              <p className="text-xs text-muted-foreground">
                {emergencyVehicles.filter(v => v.priority === 'critical').length} critical, {emergencyVehicles.filter(v => v.priority === 'high' || v.priority === 'medium').length} other
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="routes">Route Status</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Traffic Map Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>Live Traffic Map</CardTitle>
                  <CardDescription>
                    Real-time traffic visualization with congestion heatmap
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Interactive map will be available in Phase 2
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Distribution</CardTitle>
                  <CardDescription>
                    Current vehicle types on monitored routes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {vehicleCounts.map((vehicle) => {
                    const IconComponent = vehicleTypeIcons[vehicle.type as keyof typeof vehicleTypeIcons]
                    return (
                      <div key={vehicle.type} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <IconComponent className="w-5 h-5 text-primary" />
                          <span className="font-medium">{vehicle.type}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-sm text-muted-foreground w-16 text-right">
                            {vehicle.count.toLocaleString()}
                          </div>
                          <div className="w-20">
                            <Progress value={vehicle.percentage} className="h-2" />
                          </div>
                          <div className="text-sm font-medium w-8 text-right">
                            {vehicle.percentage}%
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="routes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Route Status Monitor</CardTitle>
                <CardDescription>
                  Real-time congestion levels and traffic flow analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {routes.map((route) => (
                    <div key={route.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <h3 className="font-medium">{route.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{route.vehicles} vehicles</span>
                            <span>•</span>
                            <span>{route.avgSpeed} km/h avg</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getStatusBadgeColor(route.status)}>
                              {route.status.toUpperCase()}
                            </Badge>
                            {getTrendIcon(route.trend)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {route.congestionLevel}% congested
                          </div>
                        </div>
                        <div className="w-24">
                          <Progress 
                            value={route.congestionLevel} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emergency" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Vehicle Tracking</CardTitle>
                <CardDescription>
                  Active emergency vehicles with priority corridor management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emergencyVehicles.map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${
                          vehicle.priority === 'critical' ? 'bg-red-500' :
                          vehicle.priority === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                        }`} />
                        <div>
                          <h3 className="font-medium capitalize">{vehicle.type} Unit</h3>
                          <p className="text-sm text-muted-foreground">{vehicle.route}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{vehicle.eta}</div>
                        <Badge variant={vehicle.priority === 'critical' ? 'destructive' : 'default'}>
                          {vehicle.priority.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                {emergencyVehicles.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p className="text-muted-foreground">No active emergency vehicles</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Flow Trends</CardTitle>
                  <CardDescription>
                    Historical and predictive traffic analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Advanced analytics will be available in Phase 5
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>
                    System efficiency and optimization indicators
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Signal Efficiency</span>
                    <span className="text-sm text-green-600">{metrics.signalEfficiency}%</span>
                  </div>
                  <Progress value={metrics.signalEfficiency} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Route Optimization</span>
                    <span className="text-sm text-blue-600">{metrics.routeOptimization}%</span>
                  </div>
                  <Progress value={metrics.routeOptimization} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Emergency Response</span>
                    <span className="text-sm text-green-600">{metrics.emergencyResponse}%</span>
                  </div>
                  <Progress value={metrics.emergencyResponse} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Prediction Accuracy</span>
                    <span className="text-sm text-orange-600">{metrics.predictionAccuracy}%</span>
                  </div>
                  <Progress value={metrics.predictionAccuracy} className="h-2" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reports</CardTitle>
                  <CardDescription>
                    Latest generated traffic and system reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Daily Traffic Summary</p>
                        <p className="text-sm text-muted-foreground">Generated 1 hour ago</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => navigate('/reports')}>
                        View
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Emergency Response Analysis</p>
                        <p className="text-sm text-muted-foreground">Generated 2 days ago</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => navigate('/reports')}>
                        View
                      </Button>
                    </div>
                    <div className="text-center mt-4">
                      <Button onClick={() => navigate('/reports')} className="gap-2">
                        <FileText className="w-4 h-4" />
                        View All Reports
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Export</CardTitle>
                  <CardDescription>
                    Generate and export reports in various formats
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={() => navigate('/reports')} 
                    className="w-full justify-start gap-2"
                    variant="outline"
                  >
                    <FileText className="w-4 h-4" />
                    Generate Traffic Summary Report
                  </Button>
                  <Button 
                    onClick={() => navigate('/reports')} 
                    className="w-full justify-start gap-2"
                    variant="outline"
                  >
                    <FileText className="w-4 h-4" />
                    Export Emergency Response Data
                  </Button>
                  <Button 
                    onClick={() => navigate('/reports')} 
                    className="w-full justify-start gap-2"
                    variant="outline"
                  >
                    <FileText className="w-4 h-4" />
                    Create Simulation Results Report
                  </Button>
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground text-center">
                      Access full report management in Reports section
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default DashboardPage