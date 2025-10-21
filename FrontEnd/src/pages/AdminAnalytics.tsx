import { useEffect, useRef, useState } from 'react'
import { adminService } from '@/server/admin'

export default function AdminAnalytics() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [stats, setStats] = useState<{ labels: string[]; values: number[] }>({ labels: [], values: [] })
  const [kpi, setKpi] = useState<{ totalBooks: number; totalUsers: number; totalBorrows: number; satisfaction: number }>({
    totalBooks: 0, totalUsers: 0, totalBorrows: 0, satisfaction: 98
  })

  useEffect(() => {
    adminService.getMonthlyBorrowStats().then(setStats)
    adminService.getKpi().then(setKpi)
  }, [])

  useEffect(() => {
    const Chart = (window as any).Chart
    if (!Chart || !canvasRef.current || stats.labels.length === 0) return
    const inst = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: stats.labels,
        datasets: [{ label: 'Lượt mượn theo tháng', data: stats.values }]
      }
    })
    return () => inst?.destroy?.()
  }, [stats])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Thống kê & Phân tích</h1>
        <p className="text-gray-500">Tổng quan hoạt động mượn trả của thư viện</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-xl shadow-md text-center">
          <div className="text-4xl font-bold text-black">{kpi.totalBooks}</div>
          <p className="text-gray-500 mt-1">Đầu sách</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-md text-center">
          <div className="text-4xl font-bold text-black">{kpi.totalUsers}</div>
          <p className="text-gray-500 mt-1">Người dùng</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-md text-center">
          <div className="text-4xl font-bold text-black">{kpi.totalBorrows}</div>
          <p className="text-gray-500 mt-1">Lượt mượn</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-md text-center">
          <div className="text-4xl font-bold text-black">{kpi.satisfaction}%</div>
          <p className="text-gray-500 mt-1">Hài lòng</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Biểu đồ lượt mượn theo tháng</h2>
        <canvas ref={canvasRef} height={120} />
        {!((window as any).Chart) && (
          <p className="text-sm text-gray-500 mt-4">
            (Mẹo: Thêm Chart.js UMD vào <code>index.html</code> để hiển thị biểu đồ:
            <br />&lt;script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js"&gt;&lt;/script&gt;)
          </p>
        )}
      </div>
    </div>
  )
}
