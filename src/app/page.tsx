export default function Home() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 flex items-center justify-center p-6">
      <div className="max-w-xl text-center space-y-8">
        <div className="text-4xl font-light text-teal-400">◆</div>
        <h1 className="text-3xl font-semibold text-stone-100">
          Practical Reasoning
        </h1>
        <p className="text-stone-400 leading-relaxed text-lg">
          Learn to spot bad arguments, think under pressure, and see through
          the tricks that bypass your careful thinking — from salespeople,
          politicians, headlines, and your own brain.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <a
            href="/login"
            className="px-6 py-2.5 bg-teal-700 hover:bg-teal-600 text-stone-100 font-medium rounded transition-colors"
          >
            Get Started
          </a>
          <a
            href="/courses"
            className="px-6 py-2.5 border border-stone-700 hover:border-stone-500 text-stone-300 font-medium rounded transition-colors"
          >
            Browse Courses
          </a>
        </div>
        <p className="text-xs text-stone-600 pt-8">
          Phase 0 scaffold — foundation build
        </p>
      </div>
    </div>
  );
}
