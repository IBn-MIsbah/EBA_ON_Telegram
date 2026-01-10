import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Headset } from "lucide-react";

const NotFound: React.FC = () => {
  const date = new Date();

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen w-full flex flex-col relative overflow-hidden">
      {/* Decorative Blur Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#13ec37]/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#13ec37]/5 blur-3xl pointer-events-none"></div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full text-center relative z-10">
          {/* Logo Badge */}
          <div className="inline-flex items-center gap-3 mb-12 bg-white dark:bg-[#152a19] px-5 py-2.5 rounded-full shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="bg-slate-200 dark:bg-slate-700 rounded-full size-6 flex items-center justify-center">
              <div className="size-3 bg-[#13ec37] rounded-full animate-pulse"></div>
            </div>
            <span className="text-slate-900 dark:text-white font-bold tracking-tight text-sm uppercase">
              EBA Store
            </span>
          </div>

          {/* Large Background 404 Text */}
          <h1 className="text-[12rem] sm:text-[16rem] leading-none font-black text-slate-900 dark:text-white tracking-tighter select-none opacity-[0.03] dark:opacity-[0.02] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-2/3 -z-10 w-full pointer-events-none">
            404
          </h1>

          <div className="backdrop-blur-sm">
            <p className="text-[#13ec37] font-black text-lg mb-3 tracking-[0.2em] uppercase">
              404 Error
            </p>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
              Page not found
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl mb-12 leading-relaxed max-w-lg mx-auto font-medium">
              Oops! The page you are looking for has been moved, removed, or
              might never have existed.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                to="/"
                className="w-full sm:w-auto px-8 py-4 bg-[#13ec37] text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-[#11d632] transition-all transform hover:-translate-y-1 shadow-lg shadow-[#13ec37]/20 flex items-center justify-center gap-2 group"
              >
                <ArrowLeft
                  size={18}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                Back to Home
              </Link>
              <Link
                to="/support"
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-black uppercase text-xs tracking-widest rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Headset size={18} />
                Contact Support
              </Link>
            </div>

            {/* Suggestions Section */}
            {/* <div className="border-t border-slate-200 dark:border-slate-800 pt-10">
              <p className="text-[10px] text-slate-500 dark:text-slate-500 font-black mb-8 uppercase tracking-[0.3em]">
                Maybe you were looking for
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SuggestionCard
                  to="/category/clothing"
                  icon={<Shirt size={20} />}
                  label="Clothing"
                />
                <SuggestionCard
                  to="/category/electronics"
                  icon={<Smartphone size={20} />}
                  label="Electronics"
                />
                <SuggestionCard
                  to="/category/home"
                  icon={<Home size={20} />}
                  label="Home"
                />
                <SuggestionCard
                  to="/admin"
                  icon={<LayoutDashboard size={20} />}
                  label="Admin"
                />
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <footer className="py-8 text-center text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
        © {date.getFullYear()} EBA Store. Digital Inventory Systems.
      </footer>
    </div>
  );
};

/* Helper Component for the suggestion grid */
// const SuggestionCard: React.FC<{
//   to: string;
//   icon: React.ReactNode;
//   label: string;
// }> = ({ to, icon, label }) => (
//   <Link
//     to={to}
//     className="flex flex-col items-center gap-3 p-5 rounded-3xl bg-white dark:bg-[#152a19] border border-slate-100 dark:border-slate-800 hover:border-[#13ec37]/50 transition-all group shadow-sm hover:shadow-xl hover:-translate-y-1"
//   >
//     <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:bg-[#13ec37]/20 group-hover:text-[#13ec37] transition-all">
//       {icon}
//     </div>
//     <span className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
//       {label}
//     </span>
//   </Link>
// );

export default NotFound;
