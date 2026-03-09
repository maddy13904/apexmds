interface Props {
  title: string
  value: string | number
  icon: React.ReactNode
  gradient: string
  subtitle?: string
}

export default function AnalyticsStatCard({
  title,
  value,
  icon,
  gradient,
  subtitle
}: Props) {

  return (

    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 text-white shadow-xl`}>

      <div className="flex items-center gap-2 mb-6">

        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
          {icon}
        </div>

        <span className="font-medium text-white/80">
          {title}
        </span>

      </div>

      <h3 className="text-3xl font-bold">
        {value}
      </h3>

      {subtitle && (
        <p className="text-sm text-white/70 mt-1">
          {subtitle}
        </p>
      )}

    </div>

  )
}