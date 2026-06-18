export default function SkeletonCard() {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e5e5',
      borderRadius: '6px',
      overflow: 'hidden',
    }}>
      <div style={{
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        height: '160px',
        animation: 'shimmer 1.5s infinite',
      }} />
      <div style={{ padding: '12px' }}>
        <div style={{
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          height: '12px',
          width: '60px',
          borderRadius: '3px',
          marginBottom: '8px',
          animation: 'shimmer 1.5s infinite',
        }} />
        <div style={{
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          height: '18px',
          width: '120px',
          borderRadius: '3px',
          marginBottom: '12px',
          animation: 'shimmer 1.5s infinite',
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            height: '24px',
            width: '50px',
            borderRadius: '3px',
            animation: 'shimmer 1.5s infinite',
          }} />
          <div style={{
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            height: '30px',
            width: '80px',
            borderRadius: '3px',
            animation: 'shimmer 1.5s infinite',
          }} />
        </div>
      </div>
    </div>
  )
}