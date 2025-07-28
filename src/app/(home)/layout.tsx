import BackgroundLayers from "@/components/home/BackgroundLayers";
import ScrollScene from "@/components/home/ScrollScene";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative text-neutral-100 overflow-x-hidden">
      <BackgroundLayers />
      <ScrollScene />
      <div className="relative z-10">{children}</div>
    </div>
  );
}