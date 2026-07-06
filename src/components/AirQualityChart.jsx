import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatChartTime, formatDateTime } from '../utils/dateFormat'
import SectionHeader from './SectionHeader'
import StatusMessage from './StatusMessage'

function AirQualityChart({ hourly }) {
  if (!hourly || hourly.length === 0) {
    return <StatusMessage type="empty" title="대기질 그래프 데이터가 없습니다." />
  }

  const data = hourly
    .filter((item) => new Date(item.time) >= new Date())
    .slice(0, 24)
    .map((item) => ({
      time: item.time,
      label: formatChartTime(item.time),
      AQI: item.usAqi,
      PM10: item.pm10,
      PM25: item.pm25,
    }))

  return (
    <section className="panel chart-panel">
      <SectionHeader
        eyebrow="시간별 변화"
        title="AQI 변화"
        description="현재 시간 이후 최대 24시간의 대기질 흐름입니다."
      />
      <div className="chart-frame">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 16, right: 16, left: -12, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" minTickGap={24} />
            <YAxis width={44} />
            <Tooltip
              labelFormatter={(_, payload) =>
                payload?.[0]?.payload?.time
                  ? formatDateTime(payload[0].payload.time)
                  : ''
              }
            />
            <Legend />
            <Line type="monotone" dataKey="AQI" stroke="#2563eb" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="PM10" stroke="#0891b2" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="PM25" stroke="#d97706" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default AirQualityChart
