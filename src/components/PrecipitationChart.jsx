import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatChartTime, formatDateTime } from '../utils/dateFormat'
import StatusMessage from './StatusMessage'
import SectionHeader from './SectionHeader'

function PrecipitationChart({ hourly }) {
  if (!hourly || hourly.length === 0) {
    return <StatusMessage type="empty" title="강수확률 그래프 데이터가 없습니다." />
  }

  const data = hourly.slice(0, 24).map((item) => ({
    time: item.time,
    label: formatChartTime(item.time),
    강수확률: item.precipitationProbability,
    강수량: item.precipitation,
  }))

  return (
    <section className="panel chart-panel">
      <SectionHeader
        eyebrow="비 소식"
        title="시간별 강수확률"
        description="막대가 높을수록 비가 올 가능성이 커집니다."
      />
      <div className="chart-frame">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 16, right: 16, left: -12, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" minTickGap={24} />
            <YAxis domain={[0, 100]} unit="%" width={44} />
            <Tooltip
              labelFormatter={(_, payload) =>
                payload?.[0]?.payload?.time
                  ? formatDateTime(payload[0].payload.time)
                  : ''
              }
              formatter={(value, name) =>
                name === '강수량' ? [`${value} mm`, name] : [`${value}%`, name]
              }
            />
            <Bar dataKey="강수확률" fill="#0891b2" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default PrecipitationChart
