import Background3D from './Background3D'
import HeaderBar from './HeaderBar'
import EsfyqTitle from './EsfyqTitle'
import Quote from './Quote'

export default function LandingPage() {
  return (
    <div className="relative w-full h-screen overflow-hidden text-white">
      {/* Background */}
      <Background3D />

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <HeaderBar />

        {/* Main Section */}
        <main className="flex flex-col justify-center h-full px-6 sm:px-12 lg:px-20">
          <EsfyqTitle />
          <div className="mt-10">
            <Quote />
          </div>
        </main>
      </div>
    </div>
  )
}
