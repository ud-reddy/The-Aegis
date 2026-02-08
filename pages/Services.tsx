
import React from 'react';
import { ExternalLink, Wrench, Users, Library, HelpCircle } from 'lucide-react';
import { SERVICE_GROUPS } from '../constants';

// Added optional key to prop type to fix TS error when used in JSX maps
const ServiceBlock = ({ title, icon: Icon, links }: { title: string; icon: any; links: { label: string; url: string }[]; key?: React.Key }) => (
  <div className="bg-white dark:bg-dark-card p-8 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all h-full">
    <div className="flex items-center space-x-4 mb-8">
      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 text-primary rounded-2xl">
        <Icon size={28} />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h3>
    </div>
    <ul className="space-y-4">
      {links.map((link, idx) => (
        <li key={idx}>
          <a 
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-between text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors group p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
          >
            <span className="font-medium">{link.label}</span>
            <ExternalLink size={18} className="text-gray-300 group-hover:text-primary transition-colors" />
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export const Services = () => {
  const icons = [Wrench, Users, Library, HelpCircle];

  return (
    <div className="animate-fade-in pb-10">
      <div className="mb-8">
         <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Services & Tools</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {SERVICE_GROUPS.map((group, idx) => (
          <ServiceBlock key={idx} title={group.title} icon={icons[idx] || HelpCircle} links={group.links} />
        ))}
      </div>
    </div>
  );
};
