import * as LucideIcons from 'lucide-react';

export const getLucideIcon = (iconName) => {
    const IconComponent = LucideIcons[iconName];
    return IconComponent || LucideIcons.Package; 
};