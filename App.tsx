import React, { useState, useEffect, useCallback } from 'react';
import { PageConfig, PageType } from './types';
import { 
    CalligraphyPage, 
    RelicPage, 
    LanternPage, 
    MusicPage, 
    PoetryPage 
} from './components/InteractivePages';

// --- Assets & Constants ---
const InkMountain: React.FC<{ className?: string, delay?: string }> = ({ className, delay }) => (
  <div className={`absolute bottom-0 w-full opacity-0 animate-[fadeIn_2s_ease-out_forwards] ${className}`} style={{ animationDelay: delay }}>
    <svg viewBox="0 0 1440 320" className="w-full h-auto text-stone-800 opacity-80" preserveAspectRatio="none">
      <path fill="currentColor" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
    </svg>
  </div>
);

const InkSplatter: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
    <div 
        className="absolute rounded-full bg-stone-900 filter blur-xl opacity-10 pointer-events-none mix-blend-multiply"
        style={{ ...style }}
    />
);

// --- Page Data Configuration ---
const PAGES: PageConfig[] = [
    { id: 1, type: PageType.COVER, title: "锦绣中华", subtitle: "沉浸式文化交互之旅" },
    { id: 2, type: PageType.INTRO, title: "道法自然", content: "人法地，地法天，天法道，道法自然。" },
    { id: 3, type: PageType.HISTORY, title: "历史长河", content: "上下五千年，文明薪火相传。" },
    { id: 4, type: PageType.ART_STATIC, title: "碑林遗韵", content: "金石可镂，文脉永存。拓印之间，跨越千年对话。" },
    { id: 5, type: PageType.ART_INTERACTIVE_CALLIGRAPHY, title: "互动：拓印" },
    { id: 6, type: PageType.CRAFT_STATIC, title: "匠心独运", content: "如切如磋，如琢如磨。" },
    { id: 7, type: PageType.CRAFT_INTERACTIVE_REPAIR, title: "互动：制瓷" },
    { id: 8, type: PageType.FESTIVAL_STATIC, title: "火树银花", content: "东风夜放花千树。更吹落、星如雨。" },
    { id: 9, type: PageType.FESTIVAL_INTERACTIVE_LANTERN, title: "互动：花火" },
    { id: 10, type: PageType.CUSTOM_STATIC, title: "礼仪之邦", content: "不学礼，无以立。" },
    { id: 11, type: PageType.MUSIC_STATIC, title: "八音克谐", content: "乐者，天地之和也。" },
    { id: 12, type: PageType.MUSIC_INTERACTIVE, title: "互动：古韵" },
    { id: 13, type: PageType.POETRY_INTERACTIVE_AI, title: "互动：灵签" },
    { id: 14, type: PageType.MODERN_INHERITANCE, title: "薪火相传", content: "传统与现代的交响。" },
    { id: 15, type: PageType.CONCLUSION, title: "再启征程", subtitle: "点击重温经典" }
];

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const touchStartY = React.useRef(0);

    const handleScroll = useCallback((direction: 'up' | 'down') => {
        if (isAnimating) return;
        if (direction === 'down' && currentPage < PAGES.length - 1) {
            setIsAnimating(true);
            setCurrentPage(p => p + 1);
        } else if (direction === 'up' && currentPage > 0) {
            setIsAnimating(true);
            setCurrentPage(p => p - 1);
        }
    }, [currentPage, isAnimating]);

    useEffect(() => {
        if (isAnimating) {
            const timer = setTimeout(() => setIsAnimating(false), 800);
            return () => clearTimeout(timer);
        }
    }, [isAnimating]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') handleScroll('down');
            if (e.key === 'ArrowUp') handleScroll('up');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleScroll]);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
             if (Math.abs(e.deltaY) > 50) handleScroll(e.deltaY > 0 ? 'down' : 'up');
        };
        window.addEventListener('wheel', handleWheel);
        return () => window.removeEventListener('wheel', handleWheel);
    }, [handleScroll]);

    const handleTouchStart = (e: React.TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
    const handleTouchEnd = (e: React.TouchEvent) => {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY.current - touchEndY;
        if (Math.abs(diff) > 50) handleScroll(diff > 0 ? 'down' : 'up');
    };

    const handleRestart = useCallback(() => {
        setCurrentPage(0);
    }, []);

    return (
        <div 
            className="h-screen w-full bg-[#f7f5f0] overflow-hidden relative touch-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div 
                className="w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{ transform: `translateY(-${currentPage * 100}%)` }}
            >
                {PAGES.map((page, index) => (
                    <div key={page.id} className="w-full h-full relative overflow-hidden">
                        <PageContent 
                            page={page} 
                            isActive={index === currentPage} 
                            onRestart={handleRestart}
                        />
                    </div>
                ))}
            </div>

            {/* Aesthetic Indicators */}
            <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4 z-50">
                {PAGES.map((_, idx) => (
                    <div 
                        key={idx}
                        className={`w-1 transition-all duration-500 rounded-full border border-stone-800 ${idx === currentPage ? 'h-8 bg-red-900 border-red-900' : 'h-2 bg-transparent opacity-30'}`}
                    />
                ))}
            </div>

            {/* Hint */}
            {currentPage < PAGES.length - 1 && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-50 opacity-50 flex flex-col items-center">
                    <span className="text-[10px] text-stone-500 writing-vertical mb-2 tracking-widest">上滑继续</span>
                    <div className="w-[1px] h-8 bg-stone-400"></div>
                </div>
            )}
        </div>
    );
};

const PageContent: React.FC<{ page: PageConfig; isActive: boolean; onRestart: () => void }> = ({ page, isActive, onRestart }) => {
    // Shared Layout Components
    const Background = () => (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
             {/* Dynamic Ink Backgrounds - Procedural Generation */}
             {page.type === PageType.COVER && (
                <>
                    <InkSplatter style={{ width: '80vw', height: '80vw', top: '-20%', left: '-20%', opacity: 0.05 }} />
                    <InkSplatter style={{ width: '60vw', height: '60vw', bottom: '-10%', right: '-10%', opacity: 0.08 }} />
                    <InkMountain className="text-stone-300 transform scale-y-150 origin-bottom" delay="0ms" />
                    <InkMountain className="text-stone-800 transform scale-y-100 opacity-60 mix-blend-multiply" delay="200ms" />
                    <div className="absolute top-[15%] right-[10%] w-24 h-24 rounded-full bg-red-800 opacity-80 mix-blend-multiply blur-sm animate-[pulse_5s_ease-in-out_infinite]"></div>
                </>
             )}
             
             {/* General Static Backgrounds */}
             {[PageType.INTRO, PageType.HISTORY, PageType.ART_STATIC, PageType.CRAFT_STATIC, PageType.CUSTOM_STATIC, PageType.MUSIC_STATIC, PageType.MODERN_INHERITANCE].includes(page.type) && (
                 <>
                    <div className={`absolute top-0 right-0 w-full h-full bg-gradient-to-b from-transparent to-[#e8e4dc] opacity-50`}></div>
                    <InkSplatter style={{ width: '50vw', height: '50vw', top: '10%', right: '10%', opacity: 0.05 }} />
                    <div className="absolute left-10 top-0 h-full w-[1px] bg-stone-300 opacity-30"></div>
                 </>
             )}
        </div>
    );

    const ContentCard = () => (
        <div className={`relative z-10 flex flex-col items-center justify-center h-full w-full p-8 transition-all duration-1000 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="border-y-2 border-stone-800/10 py-12 px-6 max-w-lg w-full relative">
                 {/* Corner decorations */}
                 <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-stone-800"></div>
                 <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-stone-800"></div>
                 
                 <h1 className="text-5xl md:text-7xl font-calligraphy text-stone-900 mb-8 text-center leading-normal drop-shadow-sm">
                    {page.title}
                 </h1>
                 
                 {page.content && (
                     <div className="flex justify-center">
                        <p className="text-xl md:text-2xl text-stone-600 font-serif leading-loose tracking-widest writing-vertical h-64 md:h-80 text-left mx-auto border-r border-stone-300 pr-4">
                            {page.content}
                        </p>
                     </div>
                 )}
                 
                 {/* Seal */}
                 <div className="absolute bottom-4 left-4 w-12 h-12 border-2 border-red-900 rounded-sm p-1 opacity-60 rotate-[-5deg]">
                    <div className="w-full h-full bg-red-900 flex items-center justify-center text-[#f7f5f0] text-[10px] font-bold leading-none writing-vertical">
                        国风
                    </div>
                 </div>
            </div>
        </div>
    );

    // Render logic
    switch (page.type) {
        case PageType.COVER:
            return (
                <div className="h-full w-full flex flex-col justify-center items-center relative z-10">
                    <Background />
                    <div className={`flex flex-col items-center z-10 transition-all duration-1000 delay-300 ${isActive ? 'opacity-100 blur-0' : 'opacity-0 blur-md'}`}>
                        <div className="mb-8 w-2 h-24 bg-gradient-to-b from-stone-800 to-transparent opacity-20"></div>
                        <h1 className="text-7xl md:text-9xl font-calligraphy text-stone-900 mb-4 tracking-tight drop-shadow-md">
                            {page.title}
                        </h1>
                        <p className="text-lg md:text-xl text-stone-500 font-serif tracking-[0.5em] uppercase border-t border-stone-300 pt-4 mt-2">
                            {page.subtitle}
                        </p>
                    </div>
                </div>
            );

        case PageType.ART_INTERACTIVE_CALLIGRAPHY:
            return <CalligraphyPage isActive={isActive} />;

        case PageType.CRAFT_INTERACTIVE_REPAIR:
            return <RelicPage />;

        case PageType.FESTIVAL_INTERACTIVE_LANTERN:
            return <LanternPage isActive={isActive} />;

        case PageType.MUSIC_INTERACTIVE:
            return <MusicPage />;

        case PageType.POETRY_INTERACTIVE_AI:
            return <PoetryPage />;

        case PageType.CONCLUSION:
             return (
                <div className="h-full w-full flex flex-col justify-center items-center relative bg-[#f7f5f0]">
                    <InkSplatter style={{ width: '100vw', height: '100vw', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.05 }} />
                    <div className={`transition-all duration-1000 ${isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                        <h1 className="text-5xl font-calligraphy text-stone-900 mb-12">{page.title}</h1>
                        <button 
                            onClick={onRestart} // Changed from window.location.reload()
                            className="group relative px-8 py-3 bg-transparent overflow-hidden rounded-full border border-stone-800 text-stone-800 transition-colors hover:text-[#f7f5f0]"
                        >
                            <div className="absolute inset-0 w-full h-full bg-stone-800 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                            <span className="relative font-serif tracking-widest z-10">{page.subtitle}</span>
                        </button>
                    </div>
                </div>
            );

        default:
            return (
                <div className="h-full w-full relative">
                    <Background />
                    <ContentCard />
                </div>
            );
    }
};

export default App;