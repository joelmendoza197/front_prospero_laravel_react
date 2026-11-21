// src/components/ui/StatCard.jsx
export const StatCard = ({ title, amount, trend, type = 'neutral' }) => {
    const colors = {
        income: 'text-green-600 bg-green-50',
        expense: 'text-red-600 bg-red-50',
        neutral: 'text-gray-800 bg-white'
    };

    return (
        <div className="p-6 rounded-2xl shadow-sm border border-gray-200 bg-white flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-500">{title}</span>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#1a1614]">${amount}</span>
                {trend && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors[type]}`}>
                        {trend}
                    </span>
                )}
            </div>
        </div>
    );
};