import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group p-6 rounded-xl bg-white border border-blue-200 hover:border-blue-400 transition-all duration-300 hover:transform hover:translate-y-[-4px] hover:shadow-lg">
      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-light-100 flex items-center justify-center mb-4 group-hover:from-blue-200 group-hover:to-light-200 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
