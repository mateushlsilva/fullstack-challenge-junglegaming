import { Input } from '@/components/ui/input';


export function Search() {

  return (
    <div className="relative w-72">
        <Input 
        placeholder="Buscar por título ou ID..." 
        className="pl-10 bg-[#1A1A1A] border-gray-700 placeholder:text-gray-400 focus-visible:ring-indigo-500"
        />
        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    </div>
             
  );
}