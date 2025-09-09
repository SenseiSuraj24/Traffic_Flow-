import React, { useState } from 'react'
import { useTrafficStore } from '@/store/traffic-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Ambulance, 
  Truck, 
  Shield, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Plus,
  Navigation,
  Timer,
  Activity,
  Signal,
  MapPin,
  PhoneCall
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function EmergencyManagementPage() {
  const {
    emergencyVehicles,
    priorityCorridors,
    trafficSignals,
    activeEmergencyResponses,
    totalSignalOverrides,
    averageResponseTime,
    registerEmergencyVehicle,
    activatePriorityCorridor,
    updateCorridorStatus,
    overrideTrafficSignal,
    clearPriorityCorridor
  } = useTrafficStore()

  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false)
  const [isCorridorDialogOpen, setIsCorridorDialogOpen] = useState(false)
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null)

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'ambulance': return <Ambulance className="h-5 w-5" />
      case 'fire': return <Truck className="h-5 w-5" />
      case 'police': return <Shield className="h-5 w-5" />
      default: return <Activity className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-500'
      case 'clearing': return 'bg-yellow-500'
      case 'inactive': return 'bg-gray-500'
      case 'completed': return 'bg-green-500'
      case 'cancelled': return 'bg-gray-400'
      default: return 'bg-gray-500'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-600 text-white'
      case 'high': return 'bg-orange-500 text-white'
      case 'medium': return 'bg-yellow-500 text-black'
      case 'low': return 'bg-blue-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const handleRegisterVehicle = async (formData: FormData) => {
    const vehicleData = {
      type: formData.get('type') as 'ambulance' | 'fire' | 'police',
      route: formData.get('route') as string,
      eta: formData.get('eta') as string,
      priority: formData.get('priority') as 'low' | 'medium' | 'high' | 'critical',
      status: 'active' as const,
      registrationNumber: formData.get('registrationNumber') as string,
      callSign: formData.get('callSign') as string,
      destination: formData.get('destination') as string,
      signalOverrides: 0,
      responseTime: 0,
      coordinates: { lat: 43.6532 + Math.random() * 0.02, lng: -79.3832 + Math.random() * 0.02 }
    }

    await registerEmergencyVehicle(vehicleData)
    setIsRegisterDialogOpen(false)
  }

  const handleActivateCorridor = async (vehicleId: number) => {
    const routeSegments = ['001', '002', '003', '004'] // Mock segment IDs
    await activatePriorityCorridor(vehicleId, routeSegments)
    setIsCorridorDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Emergency Priority Management</h1>
            <p className="text-slate-600">Automated corridor control and emergency vehicle coordination</p>
          </div>
          <div className="flex gap-3">
            <Link to="/dashboard">
              <Button variant="outline" className="gap-2">
                <Activity className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-red-600 hover:bg-red-700">
                  <Plus className="h-4 w-4" />
                  Register Emergency Vehicle
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Register Emergency Vehicle</DialogTitle>
                  <DialogDescription>
                    Add a new emergency vehicle to the priority system
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  handleRegisterVehicle(formData)
                }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Vehicle Type</Label>
                      <Select name="type" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ambulance">Ambulance</SelectItem>
                          <SelectItem value="fire">Fire Truck</SelectItem>
                          <SelectItem value="police">Police Vehicle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority Level</Label>
                      <Select name="priority" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="registrationNumber">Registration Number</Label>
                    <Input name="registrationNumber" placeholder="e.g., AMB-2047" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="callSign">Call Sign</Label>
                    <Input name="callSign" placeholder="e.g., Rescue-07" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="route">Route</Label>
                    <Input name="route" placeholder="e.g., Hospital → Downtown" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="destination">Destination</Label>
                    <Input name="destination" placeholder="e.g., Downtown Emergency Center" required />
                  </div>
                  
                  <div>
                    <Label htmlFor="eta">ETA</Label>
                    <Input name="eta" placeholder="e.g., 8 min" required />
                  </div>
                  
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                    Register Vehicle
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <PhoneCall className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-red-600">Active Responses</p>
                  <p className="text-2xl font-bold text-red-700">{activeEmergencyResponses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Signal className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-600">Signal Overrides</p>
                  <p className="text-2xl font-bold text-orange-700">{totalSignalOverrides}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Timer className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Avg Response Time</p>
                  <p className="text-2xl font-bold text-blue-700">{averageResponseTime} min</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Active Emergency Vehicles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Active Emergency Vehicles
              </CardTitle>
              <CardDescription>
                Currently responding emergency vehicles with priority access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emergencyVehicles.filter(vehicle => vehicle.status === 'active').map((vehicle) => (
                  <div key={vehicle.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getVehicleIcon(vehicle.type)}
                        <div>
                          <h3 className="font-semibold">{vehicle.callSign}</h3>
                          <p className="text-sm text-muted-foreground">{vehicle.registrationNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(vehicle.priority)}>
                          {vehicle.priority}
                        </Badge>
                        <Badge variant="secondary" className={getStatusColor(vehicle.status)}>
                          {vehicle.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Navigation className="h-4 w-4 text-muted-foreground" />
                        <span>{vehicle.route}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{vehicle.destination}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>ETA: {vehicle.eta}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Signal Overrides: </span>
                        <span className="font-medium">{vehicle.signalOverrides}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Response Time: </span>
                        <span className="font-medium">{vehicle.responseTime} min</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex gap-2">
                      <Dialog open={isCorridorDialogOpen} onOpenChange={setIsCorridorDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedVehicleId(vehicle.id)}
                            disabled={priorityCorridors.some(c => c.emergencyVehicleId === vehicle.id)}
                          >
                            {priorityCorridors.some(c => c.emergencyVehicleId === vehicle.id) 
                              ? 'Corridor Active' 
                              : 'Activate Corridor'
                            }
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Activate Priority Corridor</DialogTitle>
                            <DialogDescription>
                              Create an automated priority corridor for {vehicle.callSign}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p>This will automatically:</p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              <li>Override traffic signals along the route</li>
                              <li>Create green corridors for priority access</li>
                              <li>Monitor vehicle progress in real-time</li>
                              <li>Clear the corridor when vehicle passes</li>
                            </ul>
                            <Button 
                              onClick={() => selectedVehicleId && handleActivateCorridor(selectedVehicleId)}
                              className="w-full bg-red-600 hover:bg-red-700"
                            >
                              Activate Priority Corridor
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => overrideTrafficSignal('sig-001', 60)}
                      >
                        Override Next Signal
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Priority Corridors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Signal className="h-5 w-5" />
                Active Priority Corridors
              </CardTitle>
              <CardDescription>
                Automated signal control corridors for emergency vehicles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {priorityCorridors.filter(corridor => corridor.status === 'active').map((corridor) => (
                  <div key={corridor.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{corridor.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Vehicle ID: {corridor.emergencyVehicleId}
                        </p>
                      </div>
                      <Badge className={getStatusColor(corridor.status)}>
                        {corridor.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm mb-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Signals Controlled:</span>
                        <span className="font-medium">{corridor.signalsControlled}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Average Delay:</span>
                        <span className="font-medium">{corridor.averageDelay}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ETA Clear:</span>
                        <span className="font-medium">
                          {corridor.estimatedClearTime.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Corridor Progress</span>
                        <span>
                          {corridor.segments.filter(s => s.vehiclePosition === 'passed').length}/
                          {corridor.segments.length} segments
                        </span>
                      </div>
                      <Progress 
                        value={(corridor.segments.filter(s => s.vehiclePosition === 'passed').length / corridor.segments.length) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="mt-3 flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateCorridorStatus(corridor.id, 'clearing')}
                        disabled={corridor.status !== 'active'}
                      >
                        Begin Clearing
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => clearPriorityCorridor(corridor.id)}
                      >
                        Clear Corridor
                      </Button>
                    </div>
                  </div>
                ))}
                
                {priorityCorridors.filter(corridor => corridor.status === 'active').length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Signal className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No active priority corridors</p>
                    <p className="text-sm">Register an emergency vehicle to activate corridors</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Traffic Signals Status */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Traffic Signal Status
            </CardTitle>
            <CardDescription>
              Real-time status of traffic signals with emergency overrides
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {trafficSignals.map((signal) => (
                <div key={signal.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-sm">{signal.intersectionName}</h3>
                    {signal.isEmergencyOverride && (
                      <Badge variant="destructive" className="text-xs">
                        Override
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-3 h-3 rounded-full ${
                      signal.currentPhase === 'green' ? 'bg-green-500' :
                      signal.currentPhase === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span className="text-sm font-medium capitalize">
                      {signal.currentPhase}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {signal.timeRemaining}s
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Overrides:</span>
                      <span>{signal.overrideCount}</span>
                    </div>
                    {signal.lastOverride && (
                      <div className="flex justify-between">
                        <span>Last:</span>
                        <span>{signal.lastOverride.toLocaleTimeString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full mt-3"
                    onClick={() => overrideTrafficSignal(signal.id, 90)}
                    disabled={signal.isEmergencyOverride}
                  >
                    {signal.isEmergencyOverride ? 'Override Active' : 'Override Signal'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}