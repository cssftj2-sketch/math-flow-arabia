const PlatformConfig = () => (
  <div className="space-y-6">
    <p className="text-muted-foreground">إعدادات المنصة العامة</p>
    <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
      <div>
        <label className="block text-sm font-medium mb-2">اسم المنصة</label>
        <input defaultValue="رياضيات+" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">وصف المنصة</label>
        <textarea defaultValue="منصة تعليم الرياضيات التفاعلية بالذكاء الاصطناعي" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground" rows={3} />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">السماح بالتسجيل المفتوح</p>
          <p className="text-xs text-muted-foreground">يمكن للطلاب التسجيل بدون دعوة</p>
        </div>
        <div className="w-12 h-7 bg-success rounded-full relative cursor-pointer">
          <div className="w-5 h-5 bg-white rounded-full absolute top-1 left-1 shadow" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">تأكيد البريد الإلكتروني</p>
          <p className="text-xs text-muted-foreground">مطلوب تأكيد البريد قبل الدخول</p>
        </div>
        <div className="w-12 h-7 bg-muted rounded-full relative cursor-pointer">
          <div className="w-5 h-5 bg-white rounded-full absolute top-1 right-1 shadow" />
        </div>
      </div>
      <button className="bg-gradient-hero text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium">حفظ الإعدادات</button>
    </div>
  </div>
);

export default PlatformConfig;
