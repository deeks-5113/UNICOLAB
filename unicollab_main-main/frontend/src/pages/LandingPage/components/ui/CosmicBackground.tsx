import { useRef, useEffect } from 'react';

export default function CosmicBackground() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !canvas.parentElement) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let stars: { x: number; y: number; radius: number; alpha: number; speed: number }[] = [];

        const init = () => {
            canvas.width = canvas.parentElement!.offsetWidth;
            canvas.height = canvas.parentElement!.offsetHeight;

            const numStars = Math.floor((canvas.width * canvas.height) / 4000);
            stars = [];

            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5,
                    alpha: Math.random(),
                    speed: Math.random() * 0.5 + 0.1
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            stars.forEach(star => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(15, 23, 42, ${star.alpha})`; // Dark stars for light mode
                ctx.fill();

                // Update position
                star.y -= star.speed;

                // Reset if off screen
                if (star.y < 0) {
                    star.y = canvas.height;
                    star.x = Math.random() * canvas.width;
                }
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        init();
        draw();

        const handleResize = () => {
            init();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden" style={{
            backgroundColor: 'transparent',
            backgroundImage: `
            radial-gradient(circle at top right, rgba(121, 68, 154, 0.13), transparent),
            radial-gradient(circle at 20% 80%, rgba(41, 196, 255, 0.13), transparent)
        `
        }}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
            />
        </div>
    );
}
