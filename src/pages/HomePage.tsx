import { Navigation, MapPin, BarChart3, Shield, ArrowRight, CheckCircle, Brain, Ambulance, Route, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from 'react-router-dom'

const features = [
  {
    icon: MapPin,
    title: 'AI-Powered Traffic Sensing',
    description: 'Computer vision cameras measure vehicle dimensions and optimize route suggestions using real-time congestion data.'
  },
  {
    icon: Navigation,
    title: 'Dynamic Route Optimization',
    description: 'Multi-stop shortest path algorithms with Dijkstra implementation for optimal journey planning across all vehicle types.'
  },
  {
    icon: Shield,
    title: 'Emergency Vehicle Priority',
    description: 'Automated green corridors for registered emergency vehicles with secure database and dynamic signal control.'
  },
  {
    icon: BarChart3,
    title: 'Predictive Analytics',
    description: 'Data-driven infrastructure simulation to model impact of proposed projects and optimize urban planning.'
  }
]

const stats = [
  { label: 'Traffic Reduction', value: '35%', description: 'Average congestion decrease' },
  { label: 'Response Time', value: '2.3min', description: 'Emergency vehicle improvement' },
  { label: 'Fuel Savings', value: '28%', description: 'Optimized routing efficiency' },
  { label: 'Coverage', value: '147', description: 'Active monitored routes' }
]

function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Navigation className="w-12 h-12 text-primary" />
              <h1 className="text-5xl font-bold">TrafficFlow Pro</h1>
            </div>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Advanced AI-powered traffic management system that reduces congestion, 
              optimizes emergency response, and enables data-driven urban planning decisions.
            </p>
            
            <div className="flex items-center justify-center gap-4 mb-12">
              <Button size="lg" onClick={() => navigate('/dashboard')} className="gap-2">
                Open Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/optimization')} className="gap-2">
                AI Route Optimizer
                <Brain className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/journey-planner')} className="gap-2">
                Journey Planner
                <Route className="w-4 h-4" />
              </Button>
              <Badge variant="secondary" className="px-4 py-2">
                Phase 4 Active
              </Badge>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-sm font-medium mb-1">{stat.label}</div>
                    <div className="text-xs text-muted-foreground">{stat.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Traffic Solutions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Integrated AI technologies working together to create smarter, more efficient transportation networks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <feature.icon className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Implementation Phases */}
      <div className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Development Roadmap</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Systematic implementation approach delivering value at each stage.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <CardTitle className="text-lg">Phase 1: Core Traffic Management Dashboard</CardTitle>
                    <Badge>Active</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Live traffic monitoring, route visualization, emergency vehicle tracking, and basic analytics foundation.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <CardTitle className="text-lg">Phase 2: AI-Powered Route Optimization</CardTitle>
                    <Badge className="bg-green-100 text-green-700">Completed</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Dijkstra's algorithm implementation, dynamic route suggestions, traffic prediction, and alternative route systems.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <CardTitle className="text-lg">Phase 3: Emergency Vehicle Priority System</CardTitle>
                    <Badge className="bg-green-100 text-green-700">Completed</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Emergency vehicle database, priority corridor management, automated signal control, and response tracking.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <CardTitle className="text-lg">Phase 4: Multi-Modal Journey Planning</CardTitle>
                    <Badge className="bg-green-100 text-green-700">Completed</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Transport mode integration, user preference learning, last-mile connectivity, and MaaS platform integration.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/50 bg-primary/5">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    <CardTitle className="text-lg">Phase 5: Advanced Analytics & Simulation</CardTitle>
                    <Badge>Active</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Traffic simulation modeling, infrastructure impact analysis, predictive management, and data-driven planning tools.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Access System Components</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Navigate to different modules of the TrafficFlow Pro system
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 max-w-7xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/dashboard')}>
              <CardHeader className="text-center">
                <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Traffic Dashboard</CardTitle>
                <CardDescription>Real-time monitoring</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant="outline" className="w-full gap-2">
                  Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/optimization')}>
              <CardHeader className="text-center">
                <Brain className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Route Optimization</CardTitle>
                <CardDescription>AI-powered solutions</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant="outline" className="w-full gap-2">
                  Optimize
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/emergency')}>
              <CardHeader className="text-center">
                <Ambulance className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <CardTitle>Emergency Control</CardTitle>
                <CardDescription>Priority corridors</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant="outline" className="w-full gap-2">
                  Emergency
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/journey-planner')}>
              <CardHeader className="text-center">
                <Route className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Journey Planner</CardTitle>
                <CardDescription>Multi-modal transport</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant="outline" className="w-full gap-2">
                  Plan Journey
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/analytics')}>
              <CardHeader className="text-center">
                <BarChart3 className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <CardTitle>Analytics & Simulation</CardTitle>
                <CardDescription>Advanced modeling</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant="outline" className="w-full gap-2">
                  Analytics
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/reports')}>
              <CardHeader className="text-center">
                <FileText className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Reports & Export</CardTitle>
                <CardDescription>PDF & Excel reports</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant="outline" className="w-full gap-2">
                  Reports
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Traffic Management?</h2>
          <p className="text-lg mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Experience the future of intelligent transportation systems with real-time monitoring and AI-driven optimization.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            Launch Dashboard
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HomePage 