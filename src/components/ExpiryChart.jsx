import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { parseISO, differenceInDays } from 'date-fns'

export const ExpiryTimeline = ({ products }) => {
  const processData = () => {
    const now = new Date()
    return products.reduce((acc, product) => {
      const daysLeft = differenceInDays(parseISO(product.expDate), now)
      const category = 
        daysLeft < 0 ? 'Expired' :
        daysLeft <= 7 ? 'This Week' :
        daysLeft <= 30 ? 'This Month' : 'Future'
      
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {})
  }

  const chartData = Object.entries(processData()).map(([name, count]) => ({
    name,
    count,
    fill: 
      name === 'Expired' ? '#ef4444' :
      name === 'This Week' ? '#f59e0b' :
      name === 'This Month' ? '#3b82f6' : '#10b981'
  }))

  return (
    <div className="h-64 bg-slate-800 p-4 rounded-lg">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis 
            dataKey="name" 
            stroke="#64748b"
            tick={{ fill: '#94a3b8' }}
          />
          <YAxis 
            stroke="#64748b"
            tick={{ fill: '#94a3b8' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px'
            }}
          />
          <Bar 
            dataKey="count" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}