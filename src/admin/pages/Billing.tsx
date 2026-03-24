import { CheckCircle2 } from "lucide-react";

const BillingPage = () => (
  <div className="space-y-6">
    <p className="text-muted-foreground">إعدادات الفوترة وخطط الاشتراك</p>
    <div className="grid sm:grid-cols-3 gap-4">
      {[
        { name: 'مجاني', price: '٠', features: ['5 دروس', '3 اختبارات', 'بطاقات محدودة'], active: true },
        { name: 'متقدم', price: '٤٩', features: ['دروس غير محدودة', 'اختبارات غير محدودة', 'تحليلات متقدمة'], active: false },
        { name: 'مؤسسات', price: '١٩٩', features: ['كل المميزات', 'دعم مخصص', 'API مفتوح'], active: false },
      ].map(plan => (
        <div key={plan.name} className={`bg-card rounded-2xl border p-6 ${plan.active ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}>
          <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
          <p className="text-3xl font-black mb-4">{plan.price}<span className="text-sm font-normal text-muted-foreground"> ر.س/شهر</span></p>
          <ul className="space-y-2">
            {plan.features.map(f => (
              <li key={f} className="text-sm text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" /> {f}
              </li>
            ))}
          </ul>
          {plan.active && <p className="text-xs text-primary font-medium mt-4">الخطة الحالية</p>}
        </div>
      ))}
    </div>
  </div>
);

export default BillingPage;
