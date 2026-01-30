"use client"

import React, { useState } from "react"
import { SaleTemplate, WebhookFailureTemplate, NoWebhookEndpointsTemplate } from "@/lib/email-templates"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HugeiconsIcon } from "@hugeicons/react"
import { ShoppingBag03Icon, Alert02Icon, InformationCircleIcon } from "@hugeicons/core-free-icons"
import { ModeToggle } from "@/components/ui/theme-toggle"

type TemplateType = "sale" | "webhook-failure" | "no-webhook"

const templates = {
  sale: {
    title: "Sale Notification",
    description: "Sent to merchants when a customer completes a successful payment transaction",
    icon: ShoppingBag03Icon,
    color: "green"
  },
  "webhook-failure": {
    title: "Webhook Delivery Failed",
    description: "Notifies when webhook delivery fails after multiple retry attempts",
    icon: Alert02Icon,
    color: "red"
  },
  "no-webhook": {
    title: "No Webhook Endpoints",
    description: "Alerts when an event occurs but no webhook endpoints are set up to receive it",
    icon: InformationCircleIcon,
    color: "yellow"
  }
} as const

export default function MailsShowcase() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("sale")
  const currentTemplate = templates[selectedTemplate]
  
  const common = {
    projectName: "Superlamp Demo Project",
  }

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <Select value={selectedTemplate} onValueChange={(value) => setSelectedTemplate(value as TemplateType)}>
                    <SelectTrigger className="crypto-button h-9 px-3">
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent className="crypto-base">
                      <SelectItem value="sale" className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          <HugeiconsIcon icon={ShoppingBag03Icon} className="w-4 h-4 text-green-500" />
                          <span>Sale Notification</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="webhook-failure" className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          <HugeiconsIcon icon={Alert02Icon} className="w-4 h-4 text-red-500" />
                          <span>Webhook Failure</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="no-webhook" className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          <HugeiconsIcon icon={InformationCircleIcon} className="w-4 h-4 text-yellow-500" />
                          <span>No Endpoints</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              <p className="text-sm text-muted-foreground mt-2">
                {currentTemplate.description}
              </p>
            </div>
          </div>
          <ModeToggle />
        </div>
      </div>

      {/* Template Preview */}
      <div className="crypto-base border-0 rounded-2xl p-8">
        <div className="crypto-glass-static rounded-xl p-6 overflow-auto">
          {selectedTemplate === "sale" && (
            <SaleTemplate
              projectName={common.projectName}
              customerEmail="customer@example.com"
              customerWalletAddress="7b5mVqk5N8gA1WQk2v8XkBv9s4FQ2Zr9nV1a2b3c4d5e6f7g8h9i"
              amount={123.45}
              currency="USDC"
              transactionSignature="5rZq1y2x3w4v5u6t7s8r9q0p1o2n3m4l5k6j7h8g9f0e1d2c3b4a"
              products={[
                { name: "Pro Plan", price: 99.99, quantity: 1 },
                { name: "Extra Seats", price: 23.46, quantity: 2 },
              ]}
              network="mainnet-beta"
              confirmedAt={new Date().toISOString()}
            />
          )}
          
          {selectedTemplate === "webhook-failure" && (
            <WebhookFailureTemplate
              projectName={common.projectName}
              webhookUrl="https://example.com/webhooks/Superlamp"
              errorMessage="Timeout after 10s while awaiting response from endpoint"
              eventType="payment.succeeded"
              eventId="evt_01J7C0ABCDE12345"
              failedAt={new Date().toISOString()}
              retryAttempts={3}
              txHash="C3qZJ6r9...n1P2Q3R4"
            />
          )}
          
          {selectedTemplate === "no-webhook" && (
            <NoWebhookEndpointsTemplate
              projectName={common.projectName}
              eventType="payment.created"
              eventId="evt_01J7C0FGHIJ67890"
              occurredAt={new Date().toISOString()}
              txHash="9aBcDeF...XyZ12345"
            />
          )}
        </div>
      </div>
    </div>
  )
}


