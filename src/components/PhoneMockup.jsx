import { Briefcase, User, Bookmark, FileText, LayoutGrid, ArrowRight } from 'lucide-react';

export function PhoneMockup() {
    return (
        <div className="relative mx-auto" style={{ width: '300px', height: '615px' }}>
            {/* iPhone 15 Frame */}
            <div className="absolute inset-0 bg-[#1d1d1f] border-[10px] border-[#1d1d1f] shadow-2xl" style={{ borderRadius: '55px' }}>
                {/* Dynamic Island (iPhone 15 notch) */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-8 bg-[#000000] rounded-full z-20" />

                {/* Screen - Light Mode */}
                <div className="absolute inset-3 bg-white overflow-hidden" style={{ borderRadius: '47px' }}>
                    {/* Status Bar */}
                    <div className="h-12 bg-white border-b-2 border-black flex items-center justify-between px-4 pt-8">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-black border-2 border-black flex items-center justify-center shadow-xs">
                                <span className="text-white font-bold text-[10px]">O</span>
                            </div>
                            <span className="font-bold text-sm text-black">OpenRole</span>
                        </div>
                        <div className="w-7 h-7 bg-gray-100 border-2 border-black flex items-center justify-center shadow-xs">
                            <User className="w-4 h-4 text-black" />
                        </div>
                    </div>

                    {/* Sidebar Navigation */}
                    <div className="bg-white border-2 border-black mx-3 mt-3 p-2 shadow-sm">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 px-3 py-2.5 bg-black text-white border-2 border-black shadow-xs">
                                <LayoutGrid className="w-4 h-4" />
                                <span className="text-xs font-bold">Overview</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 transition-colors">
                                <User className="w-4 h-4 text-black" />
                                <span className="text-xs text-black">Profile</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 transition-colors">
                                <Bookmark className="w-4 h-4 text-black" />
                                <span className="text-xs text-black">Saved</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 transition-colors">
                                <FileText className="w-4 h-4 text-black" />
                                <span className="text-xs text-black">Applications</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="p-4 space-y-3">
                        {/* Welcome Section */}
                        <div>
                            <h2 className="text-base font-bold mb-1 text-black">Welcome back, Omale Michael!</h2>
                            <p className="text-xs text-gray-600">Track your internship journey</p>
                        </div>

                        {/* Stats Cards */}
                        <div className="space-y-2.5">
                            {/* Saved Internships */}
                            <div className="bg-white border-2 border-black p-4 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <Bookmark className="w-5 h-5 text-black" />
                                    <span className="text-2xl font-bold text-black">0</span>
                                </div>
                                <p className="text-xs text-gray-600">Saved Internships</p>
                            </div>

                            {/* Applications Sent */}
                            <div className="bg-white border-2 border-black p-4 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <FileText className="w-5 h-5 text-black" />
                                    <span className="text-2xl font-bold text-black">1</span>
                                </div>
                                <p className="text-xs text-gray-600">Applications Sent</p>
                            </div>

                            {/* Browse CTA */}
                            <div className="bg-white border-2 border-black p-4 shadow-sm">
                                <Briefcase className="w-6 h-6 mb-3 text-black" />
                                <button className="w-full bg-white border-2 border-black py-2.5 text-xs font-bold hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-md transition-all flex items-center justify-center gap-1.5 text-black shadow-xs">
                                    Browse Internships
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Home Indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-black/40 rounded-full" />
                </div>
            </div>
        </div>
    );
}