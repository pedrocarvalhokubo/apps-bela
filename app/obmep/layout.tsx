import "./obmep.css";
export const metadata = { title: "OBMEP Mirim | Estudos da Bela" };
export default function ObmepLayout({ children }: { children: React.ReactNode }) {
  return <div className="obmep-app">{children}</div>;
}
