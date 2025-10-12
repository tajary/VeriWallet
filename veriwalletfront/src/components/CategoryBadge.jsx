export default function CategoryBadge({ category, type = 'credential' }) {
    const categoryClass = type === 'credential' 
      ? `category-${category.toLowerCase()}`
      : `category-${category.toLowerCase()}`;
    
    return (
      <span className={`inline-block px-3 py-1 text-xs font-medium text-white rounded-full ${categoryClass} shadow-lg`}>
        {category}
      </span>
    );
  }