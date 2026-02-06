export function Footer() {
    return (
        <footer className="bg-slate-100 py-8 mt-auto border-t">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-bold mb-4">Biz haqimizda</h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li>Topshirish punktlari</li>
                            <li>Vakansiyalar</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Foydalanuvchilarga</h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li>Biz bilan bog'lanish</li>
                            <li>Savol-Javob</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Tadbirkorlarga</h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li>Uzum da soting</li>
                            <li>Sotuvchi kabinetiga kirish</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Ilovani yuklab olish</h3>
                        <p className="text-sm text-slate-600 mb-4">Haridingizni yanada qulay qiling</p>
                        {/* App Store / Google Play links placeholders */}
                        <div className="flex gap-2">
                            <div className="w-32 h-10 bg-black rounded-md"></div>
                            <div className="w-32 h-10 bg-slate-400 rounded-md"></div>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
                    &copy; {new Date().getFullYear()} Uzum Market Clone. Barcha huquqlar himoyalangan.
                </div>
            </div>
        </footer>
    );
}
