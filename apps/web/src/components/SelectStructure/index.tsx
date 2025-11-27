import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type ValueProps = {
    id: string | number;
    label: string;
}

type SelectStructureProps = {
    select: ValueProps[];
    placeholder: string;
    onEndReached?: () => void;
    onChange?: (v: string) => void; 
} & React.ComponentPropsWithoutRef<typeof Select>;

export function SelectStructure({ select, placeholder, onEndReached, onChange, ...props }: SelectStructureProps) {
    
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;

        const isBottom =
            target.scrollTop + target.clientHeight >= target.scrollHeight - 20;

        if (isBottom && onEndReached) {
            onEndReached();
        }
    };
    
    return (
        <Select onValueChange={onChange} {...props}>
            <SelectTrigger className="w-[180px] bg-[#1A1A1A] border-gray-700 focus:ring-indigo-500">
            <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent 
                onScroll={handleScroll}
                className="bg-[#1A1A1A] border-gray-700 text-white">
            {select.map((s) => {
                return (
                    <SelectItem key={s.id} value={s.label}>
                        {s.label}
                    </SelectItem>
                );
            })}
            </SelectContent>
        </Select>
    )
}