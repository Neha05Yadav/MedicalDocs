"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function VerificationHelpPage() {
  return (
    <Card className="mt-0">
      <CardHeader>
        <CardTitle>Verification Help Center (FAQs)</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Verification me kitna time lagta hai?</AccordionTrigger>
            <AccordionContent className="text-slate-600 leading-relaxed">
              Usually, basic verification takes 24-48 working hours. For Medical Licenses and Hospital Registrations, it may take up to 3-5 days as it involves cross-checking with state medical councils.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Kaun se documents required hain?</AccordionTrigger>
            <AccordionContent className="text-slate-600 leading-relaxed">
              - **Doctors:** Valid Medical License, Degree Certificate, and ID Proof.<br/>
              - **Hospitals/Clinics:** Registration Certificate, Fire Safety NOC, and Admin ID.<br/>
              - **Labs:** NABL Accreditation (if applicable) and Local Authority License.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Verification reject kyu hua?</AccordionTrigger>
            <AccordionContent className="text-slate-600 leading-relaxed">
              Common reasons for rejection include:<br/>
              1. Uploaded document is blurred or illegible.<br/>
              2. Name on the document does not match the registered profile name.<br/>
              3. The document has expired.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
