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
import StatusMessage from './StatusMessage'
import SectionHeader from './SectionHeader'

function TemperatureChart({ hourly }) {
  if (!hourly || hourly.length === 0) {
    return <StatusMessage type="empty" title="기온 그래프 데이터가 없습니다." />
  }

  const data = hourly.slice(0, 24).map((item) => ({
    time: item.time,
    label: formatChartTime(item.time),
    기온: item.temperature,
    체감온도: item.apparentTemperature,
  }))

  return (
    <section className="panel chart-panel">
      <SectionHeader
        eyebrow="기온 변화"
        title="시간별 기온 그래프"
        description="실제 기온과 체감온도의 차이를 함께 볼 수 있습니다."
      />
      <div className="chart-frame">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 16, right: 16, left: -12, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" minTickGap={24} />
            <YAxis unit="℃" width={44} />
            <Tooltip
              labelFormatter={(_, payload) =>
                payload?.[0]?.payload?.time
                  ? formatDateTime(payload[0].payload.time)
                  : ''
              }
            />
            <Legend />
            <Line type="monotone" dataKey="기온" stroke="#2563eb" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="체감온도" stroke="#0891b2" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default TemperatureChart
