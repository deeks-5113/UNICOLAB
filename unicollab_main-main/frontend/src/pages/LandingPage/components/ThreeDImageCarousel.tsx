import { useState, useRef, useCallback, useEffect, MouseEvent, TouchEvent } from 'react';
import { Users, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Project } from '../utils/mockData';

interface ThreeDImageCarouselProps {
    slides: Project[];
    itemCount?: number;
    autoplay?: boolean;
    delay?: number;
    pauseOnHover?: boolean;
    className?: string;
}

export default function ThreeDImageCarousel({
    slides,
    itemCount = 5,
    autoplay = false,
    delay = 3,
    pauseOnHover = true,
    className = '',
}: ThreeDImageCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const autoplayIntervalRef = useRef<number | null>(null);
    const total = slides.length;

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const swipeThreshold = 50;

    const getSlideClasses = (index: number, activeIndex: number, total: number, visibleCount: number) => {
        const diff = index - activeIndex;
        if (diff === 0) return 'now';
        if (diff === 1 || diff === -total + 1) return 'next';
        if (visibleCount === 5 && (diff === 2 || diff === -total + 2)) return 'next2';
        if (diff === -1 || diff === total - 1) return 'prev';
        if (visibleCount === 5 && (diff === -2 || diff === total - 2)) return 'prev2';
        return '';
    };

    const navigate = useCallback((direction: 'next' | 'prev') => {
        setActiveIndex(current => {
            if (direction === 'next') {
                return (current + 1) % total;
            } else {
                return (current - 1 + total) % total;
            }
        });
    }, [total]);

    const startAutoplay = useCallback(() => {
        if (autoplay && total > 1) {
            if (autoplayIntervalRef.current) {
                clearInterval(autoplayIntervalRef.current);
            }
            autoplayIntervalRef.current = window.setInterval(() => {
                navigate('next');
            }, delay * 1000);
        }
    }, [autoplay, delay, navigate, total]);

    const stopAutoplay = useCallback(() => {
        if (autoplayIntervalRef.current) {
            clearInterval(autoplayIntervalRef.current);
            autoplayIntervalRef.current = null;
        }
    }, []);

    useEffect(() => {
        startAutoplay();
        return () => { stopAutoplay(); };
    }, [startAutoplay, stopAutoplay]);

    const handleMouseEnter = () => {
        if (autoplay && pauseOnHover) {
            stopAutoplay();
        }
    };

    const handleExit = (e: MouseEvent) => {
        if (autoplay && pauseOnHover) {
            startAutoplay();
        }
        if (isDragging) {
            handleEnd(e.clientX);
        }
    };

    const handleStart = (clientX: number) => {
        setIsDragging(true);
        setStartX(clientX);
        stopAutoplay();
    };

    const handleEnd = (clientX: number) => {
        if (!isDragging) return;
        const distance = clientX - startX;
        if (Math.abs(distance) > swipeThreshold) {
            if (distance < 0) {
                navigate('next');
            } else {
                navigate('prev');
            }
        }
        setIsDragging(false);
        setStartX(0);
    };

    const onMouseDown = (e: MouseEvent) => handleStart(e.clientX);
    const onMouseUp = (e: MouseEvent) => {
        handleEnd(e.clientX);
        startAutoplay();
    };

    const onTouchStart = (e: TouchEvent) => handleStart(e.touches[0].clientX);
    const onTouchEnd = (e: TouchEvent) => {
        handleEnd(e.changedTouches[0].clientX);
        startAutoplay();
    };

    return (
        <div
            className={`cascade-slider_container ${className} bg-transparent min-w-full md:min-w-[600px] h-[400px] md:h-[500px]`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleExit}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <div className="cascade-slider_slides">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`cascade-slider_item ${getSlideClasses(index, activeIndex, total, itemCount)}`}
                        data-slide-number={index}
                    >
                        <div className="relative group cursor-pointer bg-[var(--bg-card)] rounded-[20px] shadow-2xl overflow-hidden h-full">
                            <div className="relative h-48 w-full overflow-hidden">
                                <img src={slide.image} alt={slide.title}
                                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = `https://placehold.co/350x200/4F46E5/ffffff?text=${slide.title}`;
                                    }}
                                />
                                <div className="absolute top-2 right-2 bg-[var(--white)]/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-[var(--primary)] shadow-sm">
                                    {slide.status || 'Active'}
                                </div>
                            </div>

                            <div className="p-5 flex flex-col gap-2">
                                <h3 className="text-[var(--white)] text-lg font-bold truncate">{slide.title}</h3>
                                <div className="text-[var(--text-muted)] text-xs font-medium uppercase tracking-wider">{slide.department}</div>

                                <div className="mt-2 flex flex-wrap gap-1">
                                    {slide.tags && slide.tags.slice(0, 2).map(tag => (
                                        <span key={tag} className="text-[10px] px-2 py-1 bg-[var(--bg-page)] text-[var(--text-muted)] rounded-md border border-[var(--text-muted)]/20">
                                            {tag}
                                        </span>
                                    ))}
                                    {slide.tags && slide.tags.length > 2 && (
                                        <span className="text-[10px] px-2 py-1 bg-[var(--bg-page)] text-[var(--text-muted)] rounded-md border border-[var(--text-muted)]/20">
                                            +{slide.tags.length - 2}
                                        </span>
                                    )}
                                </div>

                                <div className="mt-3 flex items-center justify-between text-xs text-[var(--text-muted)] border-t border-[var(--text-muted)]/10 pt-3">
                                    <div className="flex items-center gap-1">
                                        <Users size={14} />
                                        {slide.members} members
                                    </div>
                                    <div className="group-hover:text-[var(--primary)] transition-colors flex items-center gap-1">
                                        View Details <ArrowRight size={14} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {total > 1 && (
                <>
                    <span
                        className="cascade-slider_arrow cascade-slider_arrow-left rounded-full bg-[var(--white)]/10 text-[var(--primary)] p-2 hover:bg-[var(--primary)] hover:text-[var(--white)] transition-colors duration-300 backdrop-blur-sm border border-[var(--text-muted)]/20 shadow-lg"
                        onClick={(e) => { e.stopPropagation(); navigate('prev'); }}
                        data-action="prev"
                    >
                        <ChevronLeft size={24} />
                    </span>
                    <span
                        className="cascade-slider_arrow cascade-slider_arrow-right rounded-full bg-[var(--white)]/10 text-[var(--primary)] p-2 hover:bg-[var(--primary)] hover:text-[var(--white)] transition-colors duration-300 backdrop-blur-sm border border-[var(--text-muted)]/20 shadow-lg"
                        onClick={(e) => { e.stopPropagation(); navigate('next'); }}
                        data-action="next"
                    >
                        <ChevronRight size={24} />
                    </span>
                </>
            )}
        </div>
    );
}
