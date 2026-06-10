import WorkforceROI from "@/components/calculators/WorkforceROI";

export const metadata = {
  title: "Workforce ROI Calculator — Aaron Cannata",
  description:
    "Live model of care-driven absenteeism and attrition cost, net of the federal §45F credit, with stakeholder-specific executive brief generation."
};

export default function Page() {
  return <WorkforceROI />;
}
