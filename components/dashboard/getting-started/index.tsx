'use client'
import { useRouter } from "next/navigation"
import { Card, CardContent, } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  ArrowRight01Icon, 
  CodeIcon,
  WebhookIcon,
  ZapIcon,
  StarIcon,
  ArrowUpRightIcon,
} from "@hugeicons/core-free-icons"

export default function GettingStartedPage() {
  const router = useRouter()



  const handleGoToOverview = () => {
    router.push('/dashboard/overview')
  }

  const handleGoToSettings = () => {
    router.push('/dashboard/settings')
  }

  const nextSteps = [
    {
      icon: CodeIcon,
      title: "Get Your API Keys",
      description: "Retrieve your API keys from project settings to start integrating",
      action: () => handleGoToSettings(),
      buttonText: "Go to Settings"
    },
    {
      icon: WebhookIcon,
      title: "Set Up Webhooks",
      description: "Configure webhooks to receive payment notifications",
      action: () => handleGoToSettings(),
      buttonText: "Configure Webhooks"
    },
    {
      icon: ZapIcon,
      title: "Test Your Integration",
      description: "Use our test environment to verify everything works",
      action: () => handleGoToOverview(),
      buttonText: "View Project"
    }
  ]

  return (
    <div className="min-h-screen bg-background rounded-full">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="relative z-10 px-8 py-16">
          <div className="max-w-4xl mx-auto text-center">
         
 
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Configure Your First Project
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Your crypto payment infrastructure is ready. Follow these steps to start accepting payments from customers worldwide.
            </p>

            
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="px-8 pb-12">
        <div className="max-w-4xl mx-auto">
      
          
          <div className="space-y-4">
            {nextSteps.map((step, index) => (
              <Card key={index} className="crypto-glass-static border-0 group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-14 h-14 crypto-glass rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                          <HugeiconsIcon icon={step.icon} size={24} className="text-primary" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 crypto-glass rounded-full flex items-center justify-center text-xs font-bold text-foreground">
                          {index + 1}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <Button 
                        onClick={step.action}
                        className="crypto-glass border-0 shadow-md hover:shadow-lg transition-all duration-300"
                        size="lg"
                      >
                        <div className="flex items-center text-foreground">
                          {step.buttonText}
                          <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4 ml-2" />
                        </div>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="px-8 pb-16">
        <div className="max-w-4xl mx-auto">
          <Card className="crypto-glass-static border-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
            
            <CardContent className="p-8 relative z-10">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="p-3 crypto-glass rounded-full">
                    <HugeiconsIcon icon={StarIcon} size={24} className="text-primary" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Need Help Getting Started?
                </h3>
                
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Check out our comprehensive documentation or follow us on X for the latest updates, tips, and community support.
                </p>
              </div>
              
              <div className="flex justify-center gap-6 flex-wrap">
                <Button 
                  onClick={() => window.open('https://docs.Superlamp.dev/core', '_blank')}
                  className="crypto-glass border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                >
                  <div className="flex items-center text-foreground">
                    <HugeiconsIcon icon={CodeIcon} className="w-4 h-4 mr-2" />
                    Documentation
                    <HugeiconsIcon icon={ArrowUpRightIcon} className="w-3 h-3 ml-2" />
                  </div>
                </Button>
                
                <Button 
                  onClick={() => window.open('https://x.com/SuperlampLabs', '_blank')}
                  variant="outline"
                  className="crypto-glass border-0 hover:shadow-lg transition-all duration-300"
                  size="lg"
                >
                  <div className="flex items-center text-foreground">
                    <HugeiconsIcon icon={WebhookIcon} className="w-4 h-4 mr-2" />
                    Follow @SuperlampLabs
                    <HugeiconsIcon icon={ArrowUpRightIcon} className="w-3 h-3 ml-2" />
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
