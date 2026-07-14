import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log("Seeding Database...");

    // 1. Create a dummy hospital
    const hospitalId = crypto.randomUUID();
    const { error: hospitalError } = await supabaseAdmin.from('hospitals').insert({
      id: hospitalId,
      name: "Global City Hospital",
      email: "contact@globalcity.com",
      phone: "+91 9876543210"
    });

    if (hospitalError) {
        console.error("Error creating hospital:", hospitalError);
        return NextResponse.json({ error: "Failed to create hospital", details: hospitalError }, { status: 500 });
    }

    // 2. Create subscription plans
    const planId1 = crypto.randomUUID();
    const planId2 = crypto.randomUUID();
    const planId3 = crypto.randomUUID();

    const plansData = [
      { id: planId1, name: "Basic Plan", price: 5000, target: "Hospital", features: { limit: 100 }, popular: false },
      { id: planId2, name: "Pro Plan", price: 15000, target: "Hospital", features: { limit: 500 }, popular: true },
      { id: planId3, name: "Enterprise Plan", price: 45000, target: "Hospital", features: { limit: 9999 }, popular: false },
    ];

    for (const plan of plansData) {
        // We use upsert or just insert if we don't care about duplicates, 
        // but let's just insert for this demo script. 
        // Actually, let's try to find them first to avoid duplicates.
        const { data: existingPlan } = await supabaseAdmin.from('subscription_plans').select('id').eq('name', plan.name).single();
        if (!existingPlan) {
            await supabaseAdmin.from('subscription_plans').insert(plan);
        }
    }

    // Fetch the plan IDs to use them (in case they already existed)
    const { data: activePlans } = await supabaseAdmin.from('subscription_plans').select('id, name');
    const basicPlan = activePlans?.find(p => p.name === "Basic Plan")?.id || planId1;
    const proPlan = activePlans?.find(p => p.name === "Pro Plan")?.id || planId2;
    const enterprisePlan = activePlans?.find(p => p.name === "Enterprise Plan")?.id || planId3;


    // 3. Create mock subscriptions for the hospital
    const today = new Date();
    
    // Active Subscription
    const endDateActive = new Date();
    endDateActive.setFullYear(today.getFullYear() + 1);

    // Renewal Due Subscription
    const endDateDue = new Date();
    endDateDue.setDate(today.getDate() + 5);

    // Expired Subscription
    const endDateExpired = new Date();
    endDateExpired.setDate(today.getDate() - 10);

    const subscriptions = [
      {
        id: crypto.randomUUID(),
        hospital_id: hospitalId,
        plan_id: enterprisePlan,
        status: "Active",
        start_date: today.toISOString(),
        end_date: endDateActive.toISOString()
      },
      {
        id: crypto.randomUUID(),
        hospital_id: hospitalId,
        plan_id: proPlan,
        status: "Renewal Due",
        start_date: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()).toISOString(),
        end_date: endDateDue.toISOString()
      },
      {
        id: crypto.randomUUID(),
        hospital_id: hospitalId,
        plan_id: basicPlan,
        status: "Expired",
        start_date: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate() - 10).toISOString(),
        end_date: endDateExpired.toISOString()
      }
    ];

    const { error: subsError } = await supabaseAdmin.from('hospital_subscriptions').insert(subscriptions);

    if (subsError) {
        console.error("Error creating subscriptions:", subsError);
        return NextResponse.json({ error: "Failed to create subscriptions", details: subsError }, { status: 500 });
    }

    return NextResponse.json({ message: "Successfully seeded 3 subscriptions for Global City Hospital!" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
