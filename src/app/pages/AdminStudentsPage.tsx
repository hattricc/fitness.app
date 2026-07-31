// src/app/pages/AdminStudentsPage.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import {
  getStudentsFromEdge,
  updateStudentSubscription,
  Student,
  UpdateSubscriptionAction,
} from '@/lib/adminStudents';
import { cn } from '@/lib/utils';

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  active: { label: 'Activo', className: 'bg-emerald-500/10 text-emerald-600' },
  expiring_soon: { label: 'Por vencer', className: 'bg-amber-500/10 text-amber-600' },
  expired: { label: 'Vencido', className: 'bg-destructive/10 text-destructive' },
};

const PLAN_OPTIONS = [
  { code: 'plan-basico', label: 'Plan Básico' },
  { code: 'plan-avanzado', label: 'Plan Avanzado' },
  { code: 'plan-vitalicio', label: 'Plan Vitalicio' },
];

const StatusBadge = ({ computedStatus }: { computedStatus?: string }) => {
  const info = computedStatus ? STATUS_LABEL[computedStatus] : null;

  return (
    <span
      className={cn(
        'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
        info ? info.className : 'bg-muted text-muted-foreground'
      )}
    >
      {info ? info.label : 'Sin suscripción'}
    </span>
  );
};

const Spinner = ({ className }: { className?: string }) => (
  <svg className={cn('h-4 w-4 animate-spin', className)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' });

const buildWhatsAppUrl = (phone: string, text: string) =>
  `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;

const useStudentActions = (
  student: Student,
  onAction: (action: UpdateSubscriptionAction, productCode?: string) => Promise<void>
) => {
  const currentCode = student.subscription?.planCode;
  const initialPlan = PLAN_OPTIONS.some((opt) => opt.code === currentCode)
    ? (currentCode as string)
    : PLAN_OPTIONS[0].code;

  const [selectedPlan, setSelectedPlan] = useState(initialPlan);
  const [pendingAction, setPendingAction] = useState<UpdateSubscriptionAction | null>(null);

  const isBusy = pendingAction !== null;
  const isActive = student.subscription?.status === 'active';
  const computedStatus = student.subscription?.computedStatus;
  const showReminder = computedStatus === 'expiring_soon' || computedStatus === 'expired';
  const phone = student.phone?.trim();

  const run = async (action: UpdateSubscriptionAction, productCode?: string) => {
    if (isBusy) return;
    setPendingAction(action);
    try {
      await onAction(action, productCode);
    } finally {
      setPendingAction(null);
    }
  };

  return { selectedPlan, setSelectedPlan, pendingAction, isBusy, isActive, computedStatus, showReminder, phone, run };
};

type ActionsProps = ReturnType<typeof useStudentActions> & { student: Student };

const ActivateButton = ({ isActive, isBusy, pendingAction, run }: ActionsProps) => (
  <button
    type="button"
    disabled={isBusy}
    onClick={() => run(isActive ? 'deactivate' : 'activate')}
    className="inline-flex items-center gap-1 rounded-md border border-input px-2 py-1 text-xs font-medium hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
  >
    {pendingAction === 'activate' || pendingAction === 'deactivate' ? <Spinner /> : null}
    {isActive ? 'Desactivar' : 'Activar'}
  </button>
);

const ChangePlanControl = ({ selectedPlan, setSelectedPlan, isBusy, pendingAction, run }: ActionsProps) => (
  <>
    <select
      value={selectedPlan}
      onChange={(e) => setSelectedPlan(e.target.value)}
      disabled={isBusy}
      className="rounded-md border border-input bg-background px-2 py-1 text-xs disabled:opacity-50"
    >
      {PLAN_OPTIONS.map((opt) => (
        <option key={opt.code} value={opt.code}>
          {opt.label}
        </option>
      ))}
    </select>
    <button
      type="button"
      disabled={isBusy}
      onClick={() => run('change_plan', selectedPlan)}
      className="inline-flex items-center gap-1 rounded-md border border-input px-2 py-1 text-xs font-medium hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
    >
      {pendingAction === 'change_plan' ? <Spinner /> : null}
      Cambiar plan
    </button>
  </>
);

const WhatsAppButtons = ({ student, phone, showReminder }: ActionsProps) => (
  <>
    <a
      href={phone ? buildWhatsAppUrl(phone, `Hola ${student.full_name || ''}, te escribo desde F4F.`) : undefined}
      target="_blank"
      rel="noopener noreferrer"
      aria-disabled={!phone}
      onClick={(e) => {
        if (!phone) e.preventDefault();
      }}
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium',
        phone
          ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
          : 'cursor-not-allowed bg-muted text-muted-foreground'
      )}
    >
      Enviar mensaje
    </a>

    {showReminder && phone && student.subscription?.end_date && (
      <a
        href={buildWhatsAppUrl(
          phone,
          `Hola ${student.full_name || ''}, tu suscripción vence el ${formatDate(student.subscription.end_date)}. ¿Renovamos?`
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-600 hover:bg-amber-500/20"
      >
        Recordar vencimiento
      </a>
    )}
  </>
);

type RowProps = {
  student: Student;
  onAction: (action: UpdateSubscriptionAction, productCode?: string) => Promise<void>;
};

// Mobile: card apilada.
const StudentCard = ({ student, onAction }: RowProps) => {
  const actions = useStudentActions(student, onAction);
  const { phone, computedStatus } = actions;

  return (
    <div className="rounded-lg border border-border bg-card p-3 text-card-foreground">
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium">{student.full_name || '—'}</span>
        <StatusBadge computedStatus={computedStatus} />
      </div>

      <div className="mt-1 flex flex-col gap-0.5 text-sm text-muted-foreground">
        <span>{student.email || 'Sin correo'}</span>
        <span>{phone || 'Sin teléfono'}</span>
        <span>{student.subscription?.plan || 'Sin plan'}</span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <ActivateButton {...actions} student={student} />
        <ChangePlanControl {...actions} student={student} />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <WhatsAppButtons {...actions} student={student} />
      </div>
    </div>
  );
};

// Desktop/web: fila de tabla clásica.
const StudentTableRow = ({ student, onAction }: RowProps) => {
  const actions = useStudentActions(student, onAction);
  const { phone, computedStatus } = actions;

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-3 py-2 font-medium">{student.full_name || '—'}</td>
      <td className="px-3 py-2 text-muted-foreground">{student.email || 'Sin correo'}</td>
      <td className="px-3 py-2 text-muted-foreground">{phone || 'Sin teléfono'}</td>
      <td className="px-3 py-2 text-muted-foreground">{student.subscription?.plan || 'Sin plan'}</td>
      <td className="px-3 py-2">
        <StatusBadge computedStatus={computedStatus} />
      </td>
      <td className="px-3 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <ActivateButton {...actions} student={student} />
          <ChangePlanControl {...actions} student={student} />
        </div>
      </td>
      <td className="px-3 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <WhatsAppButtons {...actions} student={student} />
        </div>
      </td>
    </tr>
  );
};

const AdminStudentsPage = () => {
  const { supabaseSession } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    if (!supabaseSession) return;

    setError(null);

    try {
      const data = await getStudentsFromEdge(supabaseSession);
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar estudiantes');
    }
  };

  useEffect(() => {
    if (!supabaseSession) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      await fetchStudents();
      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabaseSession]);

  const handleAction = async (
    studentId: string,
    action: UpdateSubscriptionAction,
    productCode?: string
  ) => {
    if (!supabaseSession) return;

    try {
      await updateStudentSubscription(supabaseSession, {
        user_id: studentId,
        action,
        product_code: productCode,
      });
      await fetchStudents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar suscripción');
    }
  };

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4">
      <h1 className="mb-3 text-xl font-bold text-foreground sm:text-2xl">Estudiantes</h1>

      {error && (
        <div className="mb-3 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner className="h-6 w-6 text-muted-foreground" />
        </div>
      ) : students.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No hay estudiantes registrados.
        </p>
      ) : (
        <>
          {/* Mobile: cards apiladas */}
          <div className="flex flex-col gap-2 md:hidden">
            {students.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onAction={(action, productCode) => handleAction(student.id, action, productCode)}
              />
            ))}
          </div>

          {/* Desktop/web: tabla */}
          <div className="hidden overflow-x-auto rounded-lg border border-border bg-card text-card-foreground md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Nombre</th>
                  <th className="px-3 py-2 font-medium">Correo</th>
                  <th className="px-3 py-2 font-medium">Teléfono</th>
                  <th className="px-3 py-2 font-medium">Plan</th>
                  <th className="px-3 py-2 font-medium">Estado</th>
                  <th className="px-3 py-2 font-medium">Suscripción</th>
                  <th className="px-3 py-2 font-medium">WhatsApp</th>
                </tr>
              </thead>
              <tbody className="px-3">
                {students.map((student) => (
                  <StudentTableRow
                    key={student.id}
                    student={student}
                    onAction={(action, productCode) => handleAction(student.id, action, productCode)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminStudentsPage;
