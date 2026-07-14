import { Controller, Get, Post, Put, Delete, Param } from '@nestjs/common';
import { ManagementService } from '../management.service';

@Controller('management/sales')
export class SalesController {
  constructor(private readonly managementService: ManagementService) {}

  @Get('overview')
  async getOverview() {
    return {
      kpiData: [
        { title: "Total Revenue", value: "₹ 12,45,000", change: "+18.5%", isPositive: true },
        { title: "Active Subscriptions", value: "245", change: "+12.4%", isPositive: true },
        { title: "Subscription Renewals", value: "68", change: "+15.3%", isPositive: true },
        { title: "Expired Subscriptions", value: "16", change: "-5.2%", isPositive: false },
        { title: "New Registrations", value: "35", change: "+20.1%", isPositive: true },
      ],
      revenueData: [
        { name: '20 May', value: 50000 },
        { name: '27 May', value: 90000 },
        { name: '3 Jun', value: 85000 },
        { name: '10 Jun', value: 130000 },
        { name: '17 Jun', value: 120000 },
        { name: '20 Jun', value: 160000 },
      ],
      subscriptionData: [
        { name: 'Hospital Plans', value: 42, color: '#3b82f6' }, 
        { name: 'Doctor Plans', value: 156, color: '#10b981' },  
        { name: 'Lab Plans', value: 27, color: '#f59e0b' },      
      ],
      recentPayments: [
        { id: "INV-1001", customer: "City Hospital", amount: "₹ 15,000", date: "20 Jun 2026", status: "Paid" },
        { id: "INV-1002", customer: "Dr. Rahul Sharma", amount: "₹ 2,500", date: "19 Jun 2026", status: "Paid" },
        { id: "INV-1003", customer: "Life Care Lab", amount: "₹ 5,000", date: "19 Jun 2026", status: "Pending" },
      ],
      recentActivity: [
        { title: "City Hospital purchased Premium Plan", time: "20 Jun 2026, 11:30 AM", type: "hospital" },
        { title: "Dr. Rahul Sharma renewed subscription", time: "20 Jun 2026, 10:15 AM", type: "user" },
        { title: "Life Care Lab subscription expired", time: "20 Jun 2026, 09:45 AM", type: "lab" },
      ]
    };
  }

  @Get('subscriptions')
  async getSubscriptions() {
    return [
      { id: '1', hospitalName: 'City Hospital', planName: 'Premium', status: 'Active', startDate: '2026-01-01', endDate: '2026-12-31' },
      { id: '2', hospitalName: 'Life Care Lab', planName: 'Basic', status: 'Expired', startDate: '2025-01-01', endDate: '2025-12-31' }
    ];
  }

  @Get('revenue')
  async getRevenue() {
    return {
      kpi: {
        totalRevenue: "₹ 1,24,50,000",
        totalRevenueChange: "+18.5%",
        monthlyRevenue: "₹ 45,00,000",
        monthlyRevenueChange: "+12.4%",
        annualRevenue: "₹ 5,40,00,000",
        annualRevenueChange: "+15.3%",
        renewalRevenue: "₹ 8,50,000",
        renewalRevenueChange: "-5.2%"
      },
      revenueData: [
        { month: 'Jan', revenue: 2000000, target: 2200000 },
        { month: 'Feb', revenue: 2500000, target: 2300000 },
        { month: 'Mar', revenue: 3200000, target: 3000000 },
        { month: 'Apr', revenue: 3800000, target: 3500000 },
        { month: 'May', revenue: 4100000, target: 4000000 },
        { month: 'Jun', revenue: 4500000, target: 4200000 }
      ],
      sourceData: [
        { name: 'Hospital Plans', revenue: '₹ 85L', percent: 68.2, color: 'bg-indigo-500' },
        { name: 'Clinic Plans', revenue: '₹ 25L', percent: 20.1, color: 'bg-emerald-500' },
        { name: 'Lab Plans', revenue: '₹ 14.5L', percent: 11.7, color: 'bg-amber-500' }
      ]
    };
  }

  @Get('payments')
  async getPayments() {
    return [
      { id: "INV-1001", customer: "City Hospital", amount: "₹ 15,000", date: "20 Jun 2026", status: "Paid" },
      { id: "INV-1002", customer: "Dr. Rahul Sharma", amount: "₹ 2,500", date: "19 Jun 2026", status: "Paid" }
    ];
  }

  @Get('reports')
  async getReports() {
    return [];
  }

  @Get('notifications')
  async getNotifications() {
    return [];
  }
}
