import React, { useState } from 'react'
import { useTrafficStore } from '@/store/traffic-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { toast } from '@/hooks/use-toast'
import { 
  FileText, 
  Download, 
  Calendar, 
  Clock, 
  BarChart3, 
  Plus, 
  Settings, 
  Eye,
  Trash2,
  Edit,
  PlayCircle,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { format } from 'date-fns'

const ReportsPage = () => {
  const {
    reportTemplates,
    generatedReports,
    reportSchedules,
    selectedReport,
    isGeneratingReport,
    generateReport,
    exportReportToPDF,
    exportReportToExcel,
    exportReportToCSV,
    selectReport,
    deleteReport,
    createReportTemplate,
    scheduleReport
  } = useTrafficStore()

  const [showNewReportDialog, setShowNewReportDialog] = useState(false)
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    type: 'traffic_summary' as const
  })
  const [newSchedule, setNewSchedule] = useState({
    templateId: '',
    name: '',
    frequency: 'daily' as const,
    time: '06:00',
    recipients: ''
  })

  const handleGenerateReport = async () => {
    if (!selectedTemplate) {
      toast({
        title: "Template Required",
        description: "Please select a report template",
        variant: "destructive"
      })
      return
    }

    try {
      const report = await generateReport(selectedTemplate)
      toast({
        title: "Report Generated",
        description: `${report.name} has been generated successfully`,
      })
      setShowNewReportDialog(false)
      setSelectedTemplate('')
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate report. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleExportPDF = async (reportId: string) => {
    try {
      const report = generatedReports.find(r => r.id === reportId)
      const reportName = report?.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() || reportId
      
      const blob = await exportReportToPDF(reportId)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `TrafficFlow_${reportName}_${new Date().toISOString().split('T')[0]}.pdf`
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      
      // Clean up the URL after a delay to ensure download starts
      setTimeout(() => {
        URL.revokeObjectURL(url)
      }, 1000)
      
      toast({
        title: "PDF Downloaded",
        description: "Report has been exported to PDF successfully",
      })
    } catch (error) {
      console.error('PDF export error:', error)
      toast({
        title: "Export Failed",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleExportExcel = async (reportId: string) => {
    try {
      const report = generatedReports.find(r => r.id === reportId)
      const reportName = report?.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() || reportId
      
      const blob = await exportReportToExcel(reportId)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `TrafficFlow_${reportName}_${new Date().toISOString().split('T')[0]}.xlsx`
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      
      // Clean up the URL after a delay to ensure download starts
      setTimeout(() => {
        URL.revokeObjectURL(url)
      }, 1000)
      
      toast({
        title: "Excel Downloaded",
        description: "Report has been exported to Excel successfully",
      })
    } catch (error) {
      console.error('Excel export error:', error)
      toast({
        title: "Export Failed",
        description: "Failed to export Excel file. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleExportCSV = async (reportId: string) => {
    try {
      const report = generatedReports.find(r => r.id === reportId)
      const reportName = report?.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() || reportId
      
      const blob = await exportReportToCSV(reportId)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `TrafficFlow_${reportName}_${new Date().toISOString().split('T')[0]}.csv`
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      
      // Clean up the URL after a delay to ensure download starts
      setTimeout(() => {
        URL.revokeObjectURL(url)
      }, 1000)
      
      toast({
        title: "CSV Downloaded",
        description: "Report has been exported to CSV successfully",
      })
    } catch (error) {
      console.error('CSV export error:', error)
      toast({
        title: "Export Failed",
        description: "Failed to export CSV file. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleCreateTemplate = async () => {
    if (!newTemplate.name || !newTemplate.description) {
      toast({
        title: "Template Information Required",
        description: "Please fill in template name and description",
        variant: "destructive"
      })
      return
    }

    try {
      await createReportTemplate({
        ...newTemplate,
        sections: [
          {
            id: 'section-1',
            name: 'Summary',
            type: 'metrics',
            config: {
              title: 'Key Metrics Overview',
              includeMetrics: ['total_vehicles', 'avg_speed', 'congestion_level'],
              includeTimeRange: true
            },
            order: 1,
            enabled: true
          }
        ],
        isDefault: false
      })
      
      toast({
        title: "Template Created",
        description: `Template "${newTemplate.name}" has been created successfully`,
      })
      
      setShowTemplateDialog(false)
      setNewTemplate({ name: '', description: '', type: 'traffic_summary' })
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create template. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleScheduleReport = async () => {
    if (!newSchedule.templateId || !newSchedule.name || !newSchedule.recipients) {
      toast({
        title: "Schedule Information Required",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    try {
      const nextRunDate = new Date()
      if (newSchedule.frequency === 'daily') {
        nextRunDate.setDate(nextRunDate.getDate() + 1)
      } else if (newSchedule.frequency === 'weekly') {
        nextRunDate.setDate(nextRunDate.getDate() + 7)
      } else if (newSchedule.frequency === 'monthly') {
        nextRunDate.setMonth(nextRunDate.getMonth() + 1)
      }

      await scheduleReport({
        ...newSchedule,
        recipients: newSchedule.recipients.split(',').map(email => email.trim()),
        isActive: true,
        nextRunDate
      })
      
      toast({
        title: "Report Scheduled",
        description: `Report "${newSchedule.name}" has been scheduled successfully`,
      })
      
      setShowScheduleDialog(false)
      setNewSchedule({ templateId: '', name: '', frequency: 'daily', time: '06:00', recipients: '' })
    } catch (error) {
      toast({
        title: "Scheduling Failed",
        description: "Failed to schedule report. Please try again.",
        variant: "destructive"
      })
    }
  }

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'traffic_summary': return 'bg-blue-100 text-blue-800'
      case 'emergency_response': return 'bg-red-100 text-red-800'
      case 'route_optimization': return 'bg-green-100 text-green-800'
      case 'simulation_results': return 'bg-purple-100 text-purple-800'
      case 'comprehensive': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'generating': return <PlayCircle className="h-4 w-4 text-blue-500" />
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">Generate comprehensive traffic reports and export data</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={showNewReportDialog} onOpenChange={setShowNewReportDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate New Report</DialogTitle>
                <DialogDescription>
                  Select a template to generate a comprehensive traffic report
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="template">Report Template</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTemplates.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowNewReportDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleGenerateReport} disabled={isGeneratingReport}>
                    {isGeneratingReport ? 'Generating...' : 'Generate Report'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Report Template</DialogTitle>
                <DialogDescription>
                  Create a new template for generating reports
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    placeholder="Enter template name"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                    placeholder="Enter template description"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Report Type</Label>
                  <Select value={newTemplate.type} onValueChange={(value: any) => setNewTemplate({ ...newTemplate, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="traffic_summary">Traffic Summary</SelectItem>
                      <SelectItem value="emergency_response">Emergency Response</SelectItem>
                      <SelectItem value="route_optimization">Route Optimization</SelectItem>
                      <SelectItem value="simulation_results">Simulation Results</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTemplate}>
                    Create Template
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList>
          <TabsTrigger value="reports">Generated Reports</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          {/* Reports List */}
          <div className="grid gap-4">
            {generatedReports.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Generated</h3>
                  <p className="text-gray-500 text-center max-w-sm">
                    Generate your first traffic report by selecting a template and clicking "Generate Report"
                  </p>
                </CardContent>
              </Card>
            ) : (
              generatedReports.map(report => (
                <Card key={report.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {getStatusIcon(report.status)}
                          {report.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-1">
                          <Badge className={getReportTypeColor(report.type)}>
                            {report.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(report.generatedAt, 'MMM d, yyyy HH:mm')}
                          </span>
                          <span>{report.metadata.totalPages} pages</span>
                          <span>{report.metadata.fileSize}MB</span>
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => selectReport(report)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleExportPDF(report.id)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleExportExcel(report.id)}
                        >
                          Excel
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleExportCSV(report.id)}
                        >
                          CSV
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteReport(report.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Total Routes:</span>
                        <span className="ml-2 font-medium">{report.data.summary.totalRoutes}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Avg Traffic:</span>
                        <span className="ml-2 font-medium">{report.data.summary.avgTrafficFlow}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Emergency Responses:</span>
                        <span className="ml-2 font-medium">{report.data.summary.emergencyResponses}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Data Points:</span>
                        <span className="ml-2 font-medium">{report.metadata.dataPoints.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    {report.exportFormats.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex gap-4 text-xs text-gray-500">
                          {report.exportFormats.map(format => (
                            <span key={format.format}>
                              {format.format.toUpperCase()}: {format.downloadCount} downloads
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Report Generation Progress */}
          {isGeneratingReport && (
            <Card>
              <CardContent className="py-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <h4 className="font-medium">Generating Report...</h4>
                    <p className="text-sm text-gray-500">Collecting data and generating comprehensive analysis</p>
                  </div>
                  <div className="w-32">
                    <Progress value={33} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid gap-4">
            {reportTemplates.map(template => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        {template.name}
                        {template.isDefault && <Badge variant="secondary">Default</Badge>}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {template.description}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      {!template.isDefault && (
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex gap-4">
                      <Badge className={getReportTypeColor(template.type)}>
                        {template.type.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className="text-gray-500">{template.sections.length} sections</span>
                      {template.lastUsed && (
                        <span className="text-gray-500">
                          Last used: {format(template.lastUsed, 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Scheduled Reports</h3>
              <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Report
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Schedule Automated Report</DialogTitle>
                    <DialogDescription>
                      Set up automatic report generation and delivery
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="template">Template</Label>
                      <Select value={newSchedule.templateId} onValueChange={(value) => setNewSchedule({ ...newSchedule, templateId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a template" />
                        </SelectTrigger>
                        <SelectContent>
                          {reportTemplates.map(template => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="name">Schedule Name</Label>
                      <Input
                        value={newSchedule.name}
                        onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                        placeholder="Enter schedule name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="frequency">Frequency</Label>
                        <Select value={newSchedule.frequency} onValueChange={(value: any) => setNewSchedule({ ...newSchedule, frequency: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="time">Time</Label>
                        <Input
                          type="time"
                          value={newSchedule.time}
                          onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="recipients">Recipients (comma-separated emails)</Label>
                      <Textarea
                        value={newSchedule.recipients}
                        onChange={(e) => setNewSchedule({ ...newSchedule, recipients: e.target.value })}
                        placeholder="email1@example.com, email2@example.com"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleScheduleReport}>
                        Schedule Report
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {reportSchedules.map(schedule => (
                <Card key={schedule.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          {schedule.name}
                          <Badge variant={schedule.isActive ? "default" : "secondary"}>
                            {schedule.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {schedule.frequency.charAt(0).toUpperCase() + schedule.frequency.slice(1)} at {schedule.time}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Next Run:</span>
                        <span className="ml-2 font-medium">
                          {format(schedule.nextRunDate, 'MMM d, yyyy HH:mm')}
                        </span>
                      </div>
                      {schedule.lastRunDate && (
                        <div>
                          <span className="text-gray-500">Last Run:</span>
                          <span className="ml-2 font-medium">
                            {format(schedule.lastRunDate, 'MMM d, yyyy HH:mm')}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <span className="text-gray-500 text-sm">Recipients: </span>
                      <span className="text-sm">{schedule.recipients.join(', ')}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ReportsPage