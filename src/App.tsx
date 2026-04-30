/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ReactNode, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { Sun, Moon, Calendar, Clock, MapPin, Utensils, Heart, Languages, X, Volume2, VolumeX } from 'lucide-react';

// --- Types & Constants ---

type Language = 'mr' | 'en';

const TRANSLATIONS = {
  mr: {
    invocation: "|| श्री गणेशाय नम: ||",
    family: "पाटील परिवार",
    years: "वर्षे",
    yearsTooltip: "25 वर्षे",
    jubileeRibbon: "रौप्य महोत्सवी वर्ष",
    jubileeTitle: "रौप्य महोत्सव",
    invitationSubtitle: "निमंत्रण",
    quote: "\"पती पत्नी मधील एकमेकांवर असणारे प्रेम, एकमेकावर असणारा विश्वास आणि आयुष्यात एकमेकांना दिलेली साथ... म्हणजे त्यांच्या लग्नाचा वाढदिवस, जो की आज आम्ही हा सुखी वैवाहिक जीवनाचा आनंदोत्सव साजरा करत आहोत..\"",
    name1: "सौ.प्रतिमा",
    name2: "श्री.हेमंत",
    invitationText: "श्री.हेमंत व सौ.प्रतिमा यांच्या 25 व्या लग्नाचा वाढदिवस आम्ही साजरा करत आहोत. या आमच्या आनंदात सहभागी होण्यासाठी आम्ही आपणास निमंत्रित करीत आहोत. आमच्या आनंदात सहभागी होवुन आपण आमचा आनंद द्विगुणित करावा हीच नम्र विनंती...",
    labelDate: "दिनांक",
    labelTime: "कार्यक्रमाची वेळ",
    labelFood: "जेवणाची वेळ",
    labelVenue: "स्थळ",
    valDate: "१३/०५/२०२६, बुधवार",
    valTime: "संध्याकाळी ६:०० वा.",
    valFood: "संध्याकाळी ७:०० वा. ते आपल्या आगमनापर्यंत",
    valVenue: "३०/२, मिलनद्वीप, शास्त्री नगर, जळगाव",
    footerMessage: "\"आपली उपस्थिती हीच आमच्यासाठी सर्वात मोठी भेट आहे.\"",
    footerBlessings: "आपल्या शुभ आशीर्वादाच्या सदैव अपेक्षेत !",
    warmInvitation: "सप्रेम निमंत्रक:",
    inviters: "विजय पाटील आणि आयुष पाटील",
  },
  en: {
    invocation: "|| Shree Ganeshay Namah ||",
    family: "Patil Family",
    years: "YEARS",
    yearsTooltip: "25 Years",
    jubileeRibbon: "Silver Jubilee Year",
    jubileeTitle: "Silver Jubilee",
    invitationSubtitle: "Invitation",
    quote: "\"The love between a husband and wife, the trust in each other, and the support given throughout life... that is their wedding anniversary, which we are celebrating today as a joy of happy married life..\"",
    name1: "Mrs.Pratima",
    name2: "Mr.Hemant",
    invitationText: "We are celebrating the 25th wedding anniversary of Mr. Hemant and Mrs. Pratima. We cordially invite you to join us in this celebration. We humbly request you to double our joy by your presence...",
    labelDate: "Date",
    labelTime: "Event Time",
    labelFood: "Dinner Time",
    labelVenue: "Venue",
    valDate: "13/05/2026, Wednesday",
    valTime: "6:00 PM Onwards",
    valFood: "7:00 PM until your arrival",
    valVenue: "30/2, Milandweep, Shastri Nagar, Jalgaon",
    footerMessage: "\"Your presence is the greatest gift for us.\"",
    footerBlessings: "Looking forward to your blessings always!",
    warmInvitation: "Warmly Invited By:",
    inviters: "Vijay Patil   &   Aayush Patil",
  }
};

interface HeartData {
  id: number;
  left: string;
  size: string;
  color: string;
  opacity: number;
  duration: string;
  delay: string;
  blur: string;
}

interface OrbData {
  id: number;
  size: string;
  color: string;
  top: string;
  left: string;
  duration: string;
  delay: string;
  x: string;
  y: string;
}

interface StarData {
  id: number;
  left: string;
  top: string;
  delay: string;
  duration: string;
  color: string;
}

const HEART_COLORS = [
  '#C9A84C', // antique gold
  '#E8C96A', // champagne gold
  '#D4547A', // deep rose
  '#E8789A', // blush pink
  '#A0335A', // burgundy rose
  '#C0C0C0', // silver
  '#E8D5A3', // cream gold
  '#7B2D8B', // royal plum
  '#FF6B9D', // romantic pink
  '#B8860B', // dark goldenrod
];

const ORB_CONFIG = [
  { size: '320px', color: 'rgba(160,51,90,0.18)',  top: '10%',  left: '5%'  },
  { size: '280px', color: 'rgba(123,45,139,0.14)', top: '60%',  left: '75%' },
  { size: '240px', color: 'rgba(201,168,76,0.12)', top: '80%',  left: '20%' },
  { size: '200px', color: 'rgba(212,84,122,0.16)', top: '25%',  left: '80%' },
  { size: '180px', color: 'rgba(184,134,11,0.10)', top: '45%',  left: '45%' },
  { size: '260px', color: 'rgba(255,107,157,0.12)',top: '5%',   left: '50%' },
];

// --- Components ---

const BackgroundLayers = ({ theme }: { theme: 'light' | 'dark' }) => {
  const [hearts, setHearts] = useState<HeartData[]>([]);
  const [stars, setStars] = useState<StarData[]>([]);
  const [orbs, setOrbs] = useState<OrbData[]>([]);

  useEffect(() => {
    // Generate Hearts
    const newHearts = Array.from({ length: 20 }).map((_, i) => {
      const topPos = Math.random() * 100;
      const isDepthLayer = topPos < 30;
      return {
        id: i,
        left: `${Math.random() * 100}%`,
        size: isDepthLayer ? `${8 + Math.random() * 8}px` : `${10 + Math.random() * 22}px`,
        color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
        opacity: isDepthLayer ? 0.1 + Math.random() * 0.15 : 0.15 + Math.random() * 0.4,
        duration: `${7 + Math.random() * 11}s`,
        delay: `${-Math.random() * 12}s`, // Negative delay for staggered start
        blur: Math.random() > 0.7 ? `${Math.random() * 1.5}px` : '0px',
      };
    });
    setHearts(newHearts);

    // Generate Orbs
    const newOrbs = ORB_CONFIG.map((conf, i) => ({
      id: i,
      ...conf,
      duration: `${10 + Math.random() * 8}s`,
      delay: `${Math.random() * -10}s`,
      x: `${(Math.random() - 0.5) * 60}px`,
      y: `${(Math.random() - 0.5) * 80}px`,
    }));
    setOrbs(newOrbs);

    // Generate Stars (Dark Mode Only)
    if (theme === 'dark') {
      const newStars = Array.from({ length: 60 }).map((_, i) => {
        const isColored = Math.random() > 0.85;
        return {
          id: i,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          delay: `${Math.random() * 4}s`,
          duration: `${2 + Math.random() * 2}s`,
          color: isColored ? (Math.random() > 0.5 ? '#C9A84C' : '#D4547A') : '#ffffff',
        };
      });
      setStars(newStars);
    } else {
      setStars([]);
    }
  }, [theme]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden">
      {/* Background orbs */}
      {orbs.map((o) => (
        <div
          key={o.id}
          className="orb"
          style={{
            width: o.size,
            height: o.size,
            backgroundColor: o.color,
            top: o.top,
            left: o.left,
            animationDuration: o.duration,
            animationDelay: o.delay,
            '--orb-x': o.x,
            '--orb-y': o.y,
          } as any}
        />
      ))}

      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            left: s.left,
            top: s.top,
            backgroundColor: s.color,
            animationDelay: s.delay,
            animationDuration: s.duration,
            opacity: 0.4 + Math.random() * 0.4,
          }}
        />
      ))}

      {hearts.map((h) => (
        <div
          key={h.id}
          className="falling-heart"
          style={{
            left: h.left,
            '--size': h.size,
            '--color': h.color,
            '--opacity': h.opacity,
            '--duration': h.duration,
            '--delay': h.delay,
            filter: h.blur !== '0px' ? `blur(${h.blur})` : undefined,
          } as any}
        />
      ))}
      
      {/* Corner Accents */}
      <div className="floral-corner top-0 left-0">
        <div className="flower-circle w-20 h-20 top-0 left-0" />
        <div className="flower-circle w-14 h-14 top-10 left-10 opacity-60" />
      </div>
      <div className="floral-corner top-0 right-0">
        <div className="flower-circle w-24 h-24 top-[-20px] right-[-20px]" />
      </div>
      <div className="floral-corner bottom-0 left-0 scale-x-[-1]">
        <div className="flower-circle w-24 h-24 bottom-[-20px] left-[-20px]" />
      </div>
      <div className="floral-corner bottom-0 right-0 scale-[-1]">
        <div className="flower-circle w-24 h-24 bottom-[-20px] right-[-20px]" />
      </div>
    </div>
  );
};

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const isMobile = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (isMobile) return;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }

      // Heart trails
      if (Math.random() > 0.85) {
        const heart = document.createElement('div');
        heart.innerHTML = '♥';
        heart.className = 'heart-particle';
        heart.style.left = `${e.clientX}px`;
        heart.style.top = `${e.clientY}px`;
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 800);
      }
    };

    const animate = () => {
      const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;
      ringPos.current.x = lerp(ringPos.current.x, mousePos.current.x, 0.12);
      ringPos.current.y = lerp(ringPos.current.y, mousePos.current.y, 0.12);

      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <>
      <div id="cursor-dot" ref={dotRef} className="hidden hover-pointer:block" />
      <div id="cursor-ring" ref={ringRef} className="hidden hover-pointer:block" />
    </>
  );
};

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  return (
    <motion.div 
      style={{ width }} 
      className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-gold via-silver to-dusty-rose z-[100]" 
    />
  );
};

const Badge25 = ({ lang }: { lang: Language }) => {
  const [isFilled, setIsFilled] = useState(false);
  const [isRibbonVisible, setIsRibbonVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const textPathRef = useRef<SVGTextElement>(null);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const timerFill = setTimeout(() => setIsFilled(true), 2500);
    const timerRibbon = setTimeout(() => setIsRibbonVisible(true), 3300);

    if (textPathRef.current) {
      const length = textPathRef.current.getComputedTextLength();
      textPathRef.current.style.strokeDasharray = `${length}`;
      textPathRef.current.style.strokeDashoffset = `${length}`;
      
      // Force reflow
      textPathRef.current.getBoundingClientRect();
      
      textPathRef.current.style.transition = 'stroke-dashoffset 2.5s ease-in-out';
      textPathRef.current.style.strokeDashoffset = '0';
    }

    return () => {
      clearTimeout(timerFill);
      clearTimeout(timerRibbon);
    };
  }, []);

  const sparkles = Array.from({ length: 8 }).map((_, i) => ({
    delay: `${i * 0.22}s`,
    angle: i * 45,
  }));

  return (
    <div 
      className="relative flex flex-col items-center mb-24 interactive"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Tooltip */}
      <AnimatePresence mode="wait">
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`absolute -top-16 px-6 py-2 bg-gold/5 glass rounded-2xl text-[var(--text-secondary)] ${lang === 'mr' ? 'font-marathi-display text-4xl' : 'font-cursive text-5xl'} whitespace-nowrap z-50 border border-gold/10 shadow-2xl`}
          >
            {t.yearsTooltip}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ scale: isHovered ? 1.12 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, mass: 1 }}
        className="relative w-[clamp(260px,40vw,380px)] aspect-square flex items-center justify-center"
      >
        {/* Ring 1 (outermost) */}
        <div className="absolute inset-0 border-[1.5px] border-gold/50 rounded-full" />
        
        {/* Ring 2 */}
        <div className="absolute inset-[10px] border-[0.5px] border-silver/30 rounded-full" />
        
        {/* Ring 3 (animated) */}
        <div 
          className="absolute inset-[18px] border-[1.5px] border-transparent border-t-gold border-r-gold rounded-full"
          style={{ 
            animation: `spinRing ${isHovered ? '2s' : '8s'} linear infinite`
          }}
        />
        
        {/* Ring 4 (innermost) */}
        <div className="absolute inset-[28px] border-[1px] border-gold/25 rounded-full" />

        {/* Inner Fill Background */}
        <div className="absolute inset-[29px] rounded-full" style={{ background: 'var(--badge-bg)' }} />

        {/* Wedding Rings (UPSIDE) */}
        <div className="absolute top-1/4 flex justify-center z-20 pointer-events-none">
          <div className="w-8 h-8 rounded-full border-4 border-gold shadow-lg animate-[ringGlow_2s_ease-in-out_infinite_alternate]" />
          <div className="w-8 h-8 rounded-full border-4 border-silver shadow-lg -ml-[14px] animate-[ringGlow_2s_ease-in-out_infinite_alternate_0.5s]" />
        </div>

        {/* 25 SVG Numeral */}
        <svg 
          viewBox="0 0 200 200" 
          className="w-4/5 h-4/5 z-10 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
        >
          <defs>
            <linearGradient id="silverGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e8e8e8" />
              <stop offset="50%" stopColor="#a0a0a0" />
              <stop offset="100%" stopColor="#d4d4d4" />
            </linearGradient>
          </defs>
          <text
            ref={textPathRef}
            x="50%"
            y="56%"
            textAnchor="middle"
            dominantBaseline="middle"
            className={`font-serif italic font-bold text-[clamp(5rem,12vw,8rem)] select-none transition-all duration-800 ${isFilled ? 'fill-[url(#silverGradient)] text-silver' : 'fill-none stroke-silver stroke-[2px]'}`}
          >
            25
          </text>
          <text
            x="50%"
            y="82%"
            textAnchor="middle"
            className={`${lang === 'mr' ? 'font-marathi-display text-[22px]' : 'font-serif text-[16px]'} font-bold tracking-[0.35em] fill-gold/90`}
          >
            {t.years}
          </text>
        </svg>

        {/* Sparkle Stars */}
        {sparkles.map((s, i) => (
          <div 
            key={i}
            className="absolute w-3 h-3 bg-gold sparkle-star animate-[starPulse_1.8s_infinite]"
            style={{ 
              animationDelay: s.delay,
              top: '50%',
              left: '50%',
              transform: `rotate(${s.angle}deg) translateY(-145px)`
            }}
          />
        ))}
      </motion.div>

      {/* Ribbon Banner */}
      <motion.div
        animate={{ opacity: isRibbonVisible ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        className="mt-[-20px] px-12 py-3 relative z-30 flex items-center justify-center min-w-[280px] rounded-full overflow-hidden"
        style={{ 
          background: 'linear-gradient(90deg, transparent, #5c1a2a 15%, #5c1a2a 85%, transparent)' 
        }}
      >
        <span className={`${lang === 'mr' ? 'font-marathi-display' : 'font-serif font-bold'} text-base tracking-[0.1em] text-[var(--text-primary)]`}>
          {t.jubileeRibbon}
        </span>
      </motion.div>
    </div>
  );
};

const Section = ({ children, className = "", parallax = 0.4, id }: { children: ReactNode; className?: string; parallax?: number; id?: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, parallax * 200]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, threshold: 0.2 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`py-12 px-6 max-w-[720px] mx-auto text-center relative z-10 ${className}`}
    >
      <motion.div style={{ y: springY }}>
        {children}
      </motion.div>
    </motion.section>
  );
};

const Divider = () => (
  <div className="flex items-center justify-center gap-4 my-8 opacity-40">
    <div className="h-[1px] w-20 bg-gold" />
    <Heart className="w-5 h-5 text-[var(--text-accent)] fill-[var(--text-accent)] animate-[heartbeat_0.9s_infinite]" />
    <div className="h-[1px] w-20 bg-gold" />
  </div>
);

// --- Main App ---

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lang, setLang] = useState<Language>('mr');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const t = TRANSLATIONS[lang];

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const targetDate = new Date('2026-05-13T18:00:00').getTime();
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;
      
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'dark';
    const savedLang = localStorage.getItem('lang') as Language || 'mr';
    setTheme(savedTheme);
    setLang(savedLang);
    document.body.classList.add(savedTheme === 'dark' ? 'dark-mode' : 'light-mode');
    document.body.classList.remove(savedTheme === 'dark' ? 'light-mode' : 'dark-mode');

    // Touch ripple handler
    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const ripple = document.createElement('div');
      ripple.className = 'ripple';
      ripple.style.left = `${touch.clientX}px`;
      ripple.style.top = `${touch.clientY}px`;
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    };

    window.addEventListener('touchstart', onTouchStart);
    return () => window.removeEventListener('touchstart', onTouchStart);
  }, []);

  // Couple Background Image Scroll & Theme Logic
  useEffect(() => {
    const coupleImg = document.getElementById('couple-bg-img') as HTMLImageElement;
    if (!coupleImg) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const progress = scrollY / docHeight;
      const isLight = document.body.classList.contains('light-mode');
      
      const maxOpacity = isLight ? 0.25 : 0.35;
      let targetOpacity = 0.15;

      if (progress < 0.08) {
        targetOpacity = 0;
      } else if (progress < 0.25) {
        targetOpacity = ((progress - 0.08) / 0.17) * maxOpacity;
      } else if (progress < 0.75) {
        targetOpacity = maxOpacity;
      } else if (progress < 0.92) {
        targetOpacity = maxOpacity * (1 - ((progress - 0.75) / 0.17));
      } else {
        targetOpacity = 0;
      }

      coupleImg.style.opacity = targetOpacity.toString();
    };

    const updateFilter = () => {
      const isDark = document.body.classList.contains('dark-mode');
      if (isDark) {
        coupleImg.style.filter = 'sepia(0.3) saturate(0.6) brightness(0.45)';
        coupleImg.style.mixBlendMode = 'luminosity';
      } else {
        coupleImg.style.filter = 'sepia(0.2) saturate(0.5) brightness(0.75)';
        coupleImg.style.mixBlendMode = 'multiply';
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateFilter(); // Initial state
    
    // Watch for theme changes via a simple polling or event if possible, 
    // but we can also just rely on toggleTheme calling a function.
    // For now, let's just run it whenever theme state changes by adding theme to dependency.
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.classList.add(newTheme === 'dark' ? 'dark-mode' : 'light-mode');
    document.body.classList.remove(newTheme === 'dark' ? 'light-mode' : 'dark-mode');
  };

  const toggleLang = () => {
    const newLang = lang === 'mr' ? 'en' : 'mr';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  const nameStyles = `text-[clamp(2.8rem,7vw,5rem)] ${lang === 'mr' ? 'font-marathi-display' : 'font-serif'} font-bold name-gradient relative inline-block animate-[floatName_2.5s_ease-in-out_infinite_alternate] transition-transform duration-400 hover:scale-[1.08] cursor-none interactive`;

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <img 
        id="couple-bg-img"
        src="./couple.png"
        alt="Couple"
        crossOrigin="anonymous"
        className="fixed inset-0 w-full h-full object-cover pointer-events-none z-0"
        style={{ opacity: 0.15, mixBlendMode: 'multiply' }}
        onLoad={(e) => {
          (e.target as HTMLImageElement).style.opacity = '0.15';
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      <BackgroundLayers theme={theme} />
      <CustomCursor />
      <ScrollProgress />
      
      <button
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-[rgba(255,255,255,0.08)] glass hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg border border-[rgba(245,236,215,0.3)] text-[var(--text-primary)] interactive"
      >
        {theme === 'light' ? <Moon className="text-maroon w-6 h-6" /> : <Sun className="text-[var(--text-secondary)] w-6 h-6" />}
      </button>

      <button
        onClick={toggleLang}
        aria-label="Toggle language"
        className="fixed top-20 right-4 z-50 px-4 py-2 rounded-full bg-[rgba(255,255,255,0.08)] glass hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg border border-[rgba(245,236,215,0.3)] text-[var(--text-primary)] font-bold text-xs tracking-wider flex items-center gap-2 interactive"
      >
        <Languages className="w-4 h-4 text-gold" />
        {lang === 'mr' ? 'ENGLISH' : 'मराठी'}
      </button>

      <button
        onClick={toggleMusic}
        aria-label="Toggle music"
        className="fixed top-36 right-4 z-50 p-3 rounded-full bg-[rgba(255,255,255,0.08)] glass hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg border border-[rgba(245,236,215,0.3)] text-[var(--text-primary)] interactive"
      >
        {isPlaying ? <Volume2 className="w-5 h-5 text-gold" /> : <VolumeX className="w-5 h-5 text-[var(--text-secondary)]" />}
      </button>

      <audio
        ref={audioRef}
        src="https://raw.githubusercontent.com/vcetaayush27/anniversary/10ccfb6fd521c783d86bdbbad4342df004b1cc5f/backgroundmusic.mp3"
        loop
        onEnded={() => setIsPlaying(false)}
      />

      {/* Hero Section */}
      <div className="relative pt-24 pb-12">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center mb-8"
        >
          <span className={`${lang === 'mr' ? 'font-marathi-display' : 'font-serif font-bold uppercase'} text-[var(--text-secondary)] text-xl tracking-[0.01em] block mb-4 shimmer-text`}>
            {t.invocation}
          </span>
          <div className={`inline-block px-6 py-2 border border-[rgba(201,168,76,0.4)] rounded-full text-sm tracking-[0.01em] text-[var(--text-primary)] font-bold uppercase bg-[rgba(201,168,76,0.15)] glass ${lang === 'mr' ? 'font-marathi-display' : 'font-serif'}`}>
            {t.family}
          </div>
        </motion.div>

        <Badge25 lang={lang} />

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6"
        >
          <h1 className={`text-5xl md:text-7xl ${lang === 'mr' ? 'font-marathi-display' : 'font-playfair'} font-bold text-[var(--text-primary)] mb-2 drop-shadow-sm`}>
            {t.jubileeTitle}
          </h1>
          <p className="text-2xl md:text-3xl font-serif italic text-[var(--text-secondary)] tracking-widest">{t.invitationSubtitle}</p>
        </motion.div>
      </div>

      {/* Quote Section */}
      <Section className="px-8">
        <Divider />
        <p className={`text-xl md:text-2xl ${lang === 'mr' ? 'font-marathi-display' : 'font-serif'} italic leading-relaxed text-[var(--text-body)]`}>
          {t.quote}
        </p>
        <Divider />
      </Section>

      {/* Countdown Timer */}
      <Section className="py-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-[30px] p-6 md:p-8 relative overflow-hidden"
        >
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gold/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10">
            <div className={`text-center mb-6 ${lang === 'mr' ? 'font-marathi-display' : 'font-serif'}`}>
              <span className={`text-xs tracking-[0.3em] uppercase text-[var(--text-secondary)] font-bold`}>
                {lang === 'mr' ? 'लग्नाचा वाढदिवस' : 'Silver Jubilee'}
              </span>
              <h3 className={`text-lg md:text-xl mt-1 text-[var(--text-primary)] font-bold shimmer-text`}>
                13 मे 2026 | 13 May 2026
              </h3>
            </div>
            
            <div className="flex justify-center gap-3 md:gap-5">
              {[
                { value: timeLeft.days, label: lang === 'mr' ? 'दिवस' : 'Days', key: 'days' },
                { value: timeLeft.hours, label: lang === 'mr' ? 'तास' : 'Hours', key: 'hours' },
                { value: timeLeft.minutes, label: lang === 'mr' ? 'मिनिटे' : 'Min', key: 'minutes' },
                { value: timeLeft.seconds, label: lang === 'mr' ? 'सेकंद' : 'Sec', key: 'seconds' },
              ].map((item, i) => (
                <motion.div 
                  key={item.key}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative">
                    <div className={`text-4xl md:text-5xl font-bold name-gradient ${lang === 'mr' ? 'font-marathi-display' : 'font-playfair'}`}>
                      {String(item.value).padStart(2, '0')}
                    </div>
                  </div>
                  <div className={`mt-2 text-[10px] md:text-xs tracking-[0.15em] uppercase text-[var(--text-muted)] ${lang === 'mr' ? 'font-marathi-display' : 'font-serif'}`}>
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </Section>

      {/* Names Section */}
      <Section id="names-section" className="py-16 md:py-24 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 relative z-[2]">
          <div className="relative">
            <span className={nameStyles}>
              {t.name1}
            </span>
            <div className="absolute -bottom-2 left-0 w-full h-[3px] bg-gold origin-left animate-[expandUnderline_1.2s_ease-out_forwards]" />
          </div>

          <Heart className="w-12 h-12 flex-shrink-0 text-[var(--text-accent)] fill-[var(--text-accent)] animate-[heartbeat_0.9s_infinite] drop-shadow-[0_0_12px_rgba(255,155,181,0.4)] interactive" />

          <div className="relative">
            <span className={nameStyles} style={{ animationDelay: '1.25s' }}>
              {t.name2}
            </span>
            <div className="absolute -bottom-2 left-0 w-full h-[3px] bg-gold origin-left animate-[expandUnderline_1.2s_ease-out_forwards]" />
          </div>
        </div>
      </Section>

      {/* Invitation Text */}
      <Section>
        <p className={`text-xl md:text-2xl ${lang === 'mr' ? 'font-marathi-display' : 'font-serif'} leading-[2] text-[var(--text-body)] px-4`}>
          {t.invitationText}
        </p>
      </Section>

      {/* Event Details Card */}
      <Section className="py-16">
        <div className="glass rounded-[40px] p-10 md:p-14 grid grid-cols-1 md:grid-cols-2 gap-12 text-left border border-white/20 relative overflow-hidden group hover:shadow-2xl transition-shadow duration-500">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gold/5 rounded-full blur-[120px] pointer-events-none group-hover:bg-gold/10 transition-colors" />
          
          <div className="space-y-8 relative z-10">
            <div className="flex items-start gap-5">
              <div className="p-4 rounded-2xl bg-gold/10 text-gold shadow-sm border border-gold/20">
                <Calendar className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs font-serif uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-1">{t.labelDate}</p>
                <p className={`text-xl ${lang === 'mr' ? 'font-marathi-display' : 'font-serif'} font-bold text-[var(--text-primary)]`}>{t.valDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="p-4 rounded-2xl bg-gold/10 text-gold shadow-sm border border-gold/20">
                <Clock className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs font-serif uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-1">{t.labelTime}</p>
                <p className={`text-xl ${lang === 'mr' ? 'font-marathi-display' : 'font-serif'} font-bold text-[var(--text-primary)]`}>{t.valTime}</p>
              </div>
            </div>
          </div>

          <div className="space-y-8 relative z-10">
            <div className="flex items-start gap-5">
              <div className="p-4 rounded-2xl bg-gold/10 text-gold shadow-sm border border-gold/20">
                <Utensils className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs font-serif uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-1">{t.labelFood}</p>
                <p className={`text-xl ${lang === 'mr' ? 'font-marathi-display' : 'font-serif'} font-bold text-[var(--text-primary)]`}>{t.valFood}</p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="p-4 rounded-2xl bg-gold/10 text-gold shadow-sm border border-gold/20">
                <MapPin className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs font-serif uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-1">{t.labelVenue}</p>
                <p className={`text-xl ${lang === 'mr' ? 'font-marathi-display' : 'font-serif'} font-bold text-[var(--text-primary)] leading-relaxed`}>
                  {t.valVenue}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="py-24 md:py-32 text-center px-8 relative overflow-hidden z-10">
        <div className="max-w-2xl mx-auto space-y-8 relative z-10">
          <Divider />
          <h2 className={`text-3xl md:text-4xl ${lang === 'mr' ? 'font-marathi-display' : 'font-playfair'} font-bold shimmer-text px-4 leading-relaxed text-[var(--text-primary)]`}>
            {t.footerMessage}
          </h2>
          <p className={`text-2xl ${lang === 'mr' ? 'font-marathi-display' : 'font-serif'} text-[var(--text-secondary)] font-bold italic tracking-wide`}>
            {t.footerBlessings}
          </p>

          <div className="pt-20 pb-8">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="glass rounded-[20px] p-4 md:p-6 mb-6 inline-block"
            >
              <div className={`text-[10px] md:text-xs tracking-[0.2em] font-serif uppercase text-[var(--text-muted)] mb-3 text-center ${lang === 'mr' ? 'font-marathi-display tracking-normal' : ''}`}>
                {lang === 'mr' ? 'उत्सव लागे' : 'Celebration Soon'}
              </div>
              <div className="flex justify-center gap-3 md:gap-6">
                {[
                  { value: timeLeft.days, label: lang === 'mr' ? 'दिवस' : 'Days' },
                  { value: timeLeft.hours, label: lang === 'mr' ? 'तास' : 'Hrs' },
                  { value: timeLeft.minutes, label: lang === 'mr' ? 'मिनिटे' : 'Min' },
                  { value: timeLeft.seconds, label: lang === 'mr' ? 'सेकंद' : 'Sec' },
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ scale: 0.8 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <div className={`text-3xl md:text-4xl font-bold name-gradient ${lang === 'mr' ? 'font-marathi-display' : 'font-playfair'}`}>
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div className={`text-[9px] md:text-[10px] text-[var(--text-muted)] uppercase tracking-wider mt-1`}>{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <div className={`text-sm tracking-[0.7em] font-serif uppercase text-[var(--text-muted)] mb-6 ${lang === 'mr' ? 'font-marathi-display tracking-normal' : ''}`}>
              {t.warmInvitation}
            </div>
            <div className={`text-5xl ${lang === 'mr' ? 'font-marathi-display' : 'font-cursive text-6xl'} text-[var(--text-primary)] name-gradient inline-block`}>
              {t.inviters}
            </div>
          </div>

          <motion.button
            onClick={() => setShowInviteModal(true)}
            className={`mt-8 px-8 py-3 rounded-full bg-gold/20 hover:bg-gold/30 border border-gold/40 text-[var(--text-primary)] font-bold text-lg tracking-wide glass interactive ${lang === 'mr' ? 'font-marathi-display' : 'font-serif'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {lang === 'mr' ? 'निमंत्रण - इथे क्लिक करा' : 'Invitation - Click Here'}
          </motion.button>

          <div className="pt-12 opacity-30 flex justify-center gap-12">
             <div className="floral-accent scale-110" />
             <div className="floral-accent scale-110 rotate-180" />
          </div>
        </div>

        {/* Decorative subtle border corners */}
        <div className="absolute top-0 left-0 w-48 h-48 border-t-2 border-l-2 border-gold/10 rounded-tl-[100px] m-12 hidden md:block" />
        <div className="absolute bottom-0 right-0 w-48 h-48 border-b-2 border-r-2 border-gold/10 rounded-br-[100px] m-12 hidden md:block" />
      </footer>

      {/* Extra spacing */}
      <div className="h-24" />

      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowInviteModal(false)}
                className="absolute -top-2 -right-2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-lg border border-gold/30 text-maroon hover:scale-110 active:scale-95 transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src="https://raw.githubusercontent.com/vcetaayush27/Invitation/81fa4468d8be190181fb1b8e80c982cf4aab6826/invite.png"
                alt="Invitation"
                className="w-full h-auto rounded-2xl shadow-2xl border-2 border-gold/20"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
