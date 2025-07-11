export default function Hero() {
 return(
<div>
     <section className="relative h-screen w-full overflow-hidden">

      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
        src="/hero-video.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
    <div className="absolute inset-0 bg-black/40 z-0"></div>

      <div className="relative z-10 flex items-center justify-center h-full text-center px-4">
        <div className="text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 ">Welcome to <span className="text-violet-600"> Amansi Tech</span></h1>
          <p className="text-lg md:text-xl mb-6">Empowering innovation through training and services.</p>
          <button className="bg-violet-600 hover:bg-violet-700 px-6 py-3 rounded text-white font-semibold">
            Get Started
          </button>
        </div>
      </div>
      </section>
</div>
 )
}