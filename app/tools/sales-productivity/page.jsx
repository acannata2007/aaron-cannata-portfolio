import SalesProductivity from "@/components/calculators/SalesProductivity";

export const metadata = {
  title: "Sales Productivity Model — Aaron Cannata",
  description:
    "Live model of the revenue cost of rep turnover, vacancy, and ramp time, with CRO, CFO, and RevOps executive briefs."
};

export default function Page() {
  return <SalesProductivity />;
}
